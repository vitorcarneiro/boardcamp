import connection from "../db.js";
import dayjs from "dayjs";

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    const returnDate = null;
    const delayFee = null;
    
    try {
        const customerIdExist = await connection.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (customerIdExist.rows.length === 0) { return res.status(400).send("customer id do not exist") }
        
        const gameIdExist = await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        if (gameIdExist.rows.length === 0) { return res.status(400).send("game id do not exist") }

        const gameRentalsQty = await connection.query(`
            SELECT * FROM rentals
                WHERE "gameId"=$1 AND "returnDate" IS NULL`, [gameId]);
        if (gameRentalsQty.rows.length >= gameIdExist.rows[0].stockTotal) { return res.status(400).send(`there are no (${gameIdExist.rows[0].name}) available right now`) }

        const originalPrice = gameIdExist.rows[0].pricePerDay * daysRented;

        await connection.query(`
            INSERT INTO rentals 
                ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        return res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function readRentals(req, res) {
    const idRegex = /^[0-9]*$/;

    let customerIdQuery = '';
    if (req.query.customerId) {
        if (!idRegex.test(req.query.customerId)) { return res.status(400).send("customerId query must be a number")}
        customerIdQuery = `"customerId"=${req.query.customerId}`;
    }

    let gameIdQuery = '';
    if (req.query.gameId) {
        if (!idRegex.test(req.query.gameId)) { return res.status(400).send("gameId query must be a number")}
        gameIdQuery = `"gameId"=${req.query.gameId}`;
    }

    let clauseSql = '';
    if (req.query.customerId || req.query.gameId) {
        clauseSql = `WHERE`;
    }

    let logicalOperator = '';
    if (req.query.customerId && req.query.gameId) {
        logicalOperator = `AND`;
    }

    try {
        const rentalsList = await connection.query(`
            SELECT * FROM rentals ${clauseSql} ${customerIdQuery} ${logicalOperator} ${gameIdQuery}
        `);
        return res.send(rentalsList.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function endRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format('YYYY-MM-DD');
    let delayFee = 0;

    try {
        const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (rental.rowCount === 0) { return res.status(404).send("rental id not found"); }
        if (rental.rows[0].returnDate) { return res.status(400).send("rental is already ended"); }

        const daysWithFee = dayjs(rental.rows[0].rentDate).add(rental.rows[0].daysRented, 'day').diff(returnDate, 'day') * -1;
        if (daysWithFee > 0) {
            delayFee = daysWithFee * (rental.rows[0].originalPrice / rental.rows[0].daysRented);
        }

        await connection.query(`
            UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [returnDate, delayFee, id]);

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error);
    }
}