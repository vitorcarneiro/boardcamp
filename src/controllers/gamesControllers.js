import connection from "../db.js";

export async function readGames(req, res) {
    const gameNameQueryRegex = /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/;
    const numberRegex = /^[0-9]*$/;

    let gameNameQuery = '';
    if (req.query.name) {
        if (gameNameQueryRegex.test(req.query.name.toUpperCase())) { return res.status(400).send("name query must be a string, do not try a SQL injection")}
        gameNameQuery = `WHERE name iLIKE '${req.query.name}%'`;
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
        const getGamesColumns = await connection.query(`SELECT * FROM games;`);
        const gamesColumns = Object.getOwnPropertyNames(getGamesColumns.rows[0]);
        if (!gamesColumns.includes(req.query.order)) {return res.status(400).send(`column ${req.query.order} do not exist on games`) }
        orderQuery = `ORDER BY "${req.query.order}"`;

        if (req.query.desc === "true") {
            orderQuery = `ORDER BY "${req.query.order}" DESC`;
        }
    }

    try {
        const gamesList = await connection.query(`
            SELECT * FROM games ${gameNameQuery} ${offsetQuery} ${limitQuery} ${orderQuery};
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