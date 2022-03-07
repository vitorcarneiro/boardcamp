import connection from "../db.js";

export async function readCategories(req, res) {
    try {
        const categoriesList = await connection.query(`
            SELECT * FROM categories;
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