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
    try {
        const customersList = await connection.query(`
            SELECT * FROM customers;
        `);
        return res.send(customersList.rows);

    } catch (error) {
        res.sendStatus(500);
    }
}