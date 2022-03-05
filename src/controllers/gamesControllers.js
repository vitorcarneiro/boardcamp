import connection from "../db.js";

export async function readGames(req, res) {
    try {
        const gamesList = await connection.query(`
            SELECT * FROM games;
        `);
        return res.send(gamesList.rows);

    } catch (error) {
        res.sendStatus(500);
    }
}

export async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay} = req.body;
    
    try {
        const gameExists = await connection.query(`SELECT * FROM games WHERE name=$1`, [name]);
        if (gameExists.rows.length > 0) { return res.sendStatus(400) }

        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
                VALUES ($1, $2, $3, $4, $5)`
            , [name, image, stockTotal, categoryId, pricePerDay]);

        return res.sendStatus(201);

    } catch (error) {
        return res.sendStatus(500);
    }
}
