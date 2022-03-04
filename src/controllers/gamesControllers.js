import connection from "../db.js";

export async function getGames(req, res) {

    try {
        const gamesList = await connection.query(`
            SELECT *
                FROM games;
        `);
        return res.send(gamesList.rows);

    } catch (error) {
        res.sendStatus(500);
    }
}