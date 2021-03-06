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
    const numberRegex = /^[0-9]*$/;
    const queryArray = [];

    if (req.query.customerId) {
        if (!numberRegex.test(req.query.customerId)) { return res.status(400).send("customerId query must be a number")}
        queryArray.push(`"customerId"=${req.query.customerId}`);
    }

    if (req.query.gameId) {
        if (!numberRegex.test(req.query.gameId)) { return res.status(400).send("gameId query must be a number")}
        queryArray.push(`"gameId"=${req.query.gameId}`);
    }

    let offsetQuery = '';
    if (req.query.offset) {
        if (!numberRegex.test(req.query.offset)) { return res.status(400).send("offset query must be a number")}
        offsetQuery = `OFFSET ${req.query.offset}`;
    }

    let limitQuery = '';
    if (req.query.limit) {
        if (!numberRegex.test(req.query.limit)) { return res.status(400).send("limit query must be a number")}
        limitQuery = `LIMIT ${req.query.limit}`;
    }

    let orderQuery = '';
    if (req.query.order) {
        const getRentalsColumns = await connection.query(`SELECT * FROM rentals;`);
        const rentalsColumns = Object.getOwnPropertyNames(getRentalsColumns.rows[0]);
        if (!rentalsColumns.includes(req.query.order)) {return res.status(400).send(`column ${req.query.order} do not exist on rentals`) }
        orderQuery = `ORDER BY "${req.query.order}"`;

        if (req.query.desc === "true") {
            orderQuery = `ORDER BY "${req.query.order}" DESC`;
        }
    }

    if (req.query.status) {
        const statusRegex = /^(open|closed)$/;
        if (!statusRegex.test(req.query.status)) {return res.status(400).send(`status query must be open or closed`) }
        if (req.query.status === "open" ) {
            queryArray.push(`"returnDate" IS NULL`);
        } else {
            queryArray.push(`"returnDate" IS NOT NULL`);
        }
    }

    if (req.query.startDate) {
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!dateRegex.test(req.query.startDate)) { return res.status(400).send("startDate must be a date in this format YYYY-MM-DD")}
        queryArray.push(`"startDate" >= "${dayjs(req.query.startDate)}"`);
    }

    try {
        const rentalsList = await connection.query(`
            SELECT * FROM rentals
                ${queryArray.length > 1 ? 'WHERE' : ''} ${queryArray.join(' AND ')}
                ${offsetQuery} ${limitQuery} ${orderQuery};
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

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (rental.rowCount === 0) { return res.status(404).send("rental id not found"); }
        if (rental.rows[0].returnDate) { return res.status(400).send("rental is already ended, not allowed to delete"); }

        await connection.query(`
            DELETE FROM rentals WHERE id=$1`, [id]);

        return res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error);
    }
}