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