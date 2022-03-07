import connection from "../db.js";

export async function readGames(req, res) {
    const gameNameQueryRegex = /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/;

    let gameNameQuery = '';
    if (req.query.name) {
        if (gameNameQueryRegex.test(req.query.name.toUpperCase())) { return res.status(400).send("name query must be a string, do not try a SQL injection")}
        gameNameQuery = `WHERE name iLIKE '${req.query.name}%'`;
    }

    try {
        const gamesList = await connection.query(`
            SELECT * FROM games ${gameNameQuery}
        `);
        return res.send(gamesList.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay} = req.body;
    
    try {
        const gameExists = await connection.query(`SELECT * FROM games WHERE name=$1`, [name]);
        if (gameExists.rows.length > 0) { return res.sendStatus(409) }

        const categoryIdExist = await connection.query(`SELECT * FROM categories WHERE id=$1`, [categoryId]);
        if (categoryIdExist.rows.length === 0) { return res.status(400).send("category does not exist") }

        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
                VALUES ($1, $2, $3, $4, $5)`
            , [name, image, parseInt(stockTotal), categoryId, parseInt(pricePerDay)]);

        return res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}