import connection from "../db.js";

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    
    try {
        const customerExists = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (customerExists.rows.length > 0) { return res.sendStatus(409) }

        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ($1, $2, $3, $4)`
            , [name, phone, cpf, birthday]);

        return res.sendStatus(201);

    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function readCustomers(req, res) {
    const cpfQueryRegex = /^[0-9]*$/;

    let cpfQuery = '';
    if (req.query.cpf) {
        if (!cpfQueryRegex.test(req.query.cpf)) { return res.status(400).send("cpf query must a string of numbers")}
        cpfQuery = `WHERE cpf LIKE '${req.query.cpf}%'`;
    }

    try {
        const customersList = await connection.query(`
            SELECT * FROM customers ${cpfQuery}
        `);
        return res.send(customersList.rows);

    } catch (error) {
        res.sendStatus(500);
    }
}