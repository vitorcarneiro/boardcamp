import connection from "../db.js";

export async function readCategories(req, res) {
    const numberRegex = /^[0-9]*$/;

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
        const getCategoriesColumns = await connection.query(`SELECT * FROM categories;`);
        const categoriesColumns = Object.getOwnPropertyNames(getCategoriesColumns.rows[0]);
        if (!categoriesColumns.includes(req.query.order)) {return res.status(400).send(`column ${req.query.order} do not exist on categories`) }
        orderQuery = `ORDER BY "${req.query.order}"`;

        if (req.query.desc === "true") {
            orderQuery = `ORDER BY "${req.query.order}" DESC`;
        }
    }

    try {
        const categoriesList = await connection.query(`
            SELECT * FROM categories ${offsetQuery} ${limitQuery} ${orderQuery};
        `);
        return res.send(categoriesList.rows);

    } catch (error) {
        res.sendStatus(500);
    }
}

export async function createCategory(req, res) {
    const { name } = req.body;
    
    try {
        const categoryExists = await connection.query(`SELECT * FROM categories WHERE name=$1`, [name]);
        if (categoryExists.rows.length > 0) { return res.status(409).send('category name already in use') }

        await connection.query(`
            INSERT INTO categories (name) VALUES ($1)`, [name]);

        return res.sendStatus(201);

    } catch (error) {
        return res.sendStatus(500);
    }
}