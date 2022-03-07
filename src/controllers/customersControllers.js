import connection from "../db.js";

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    
    try {
        const cpfInUse = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (cpfInUse.rows.length > 0) { return res.status(409).send("cpf aready in use") }

        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ($1, $2, $3, $4)`
            , [name, phone, cpf, birthday]);

        return res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function readCustomers(req, res) {
    const numberRegex = /^[0-9]*$/;

    let cpfQuery = '';
    if (req.query.cpf) {
        if (!numberRegex.test(req.query.cpf)) { return res.status(400).send("cpf query must be a string of numbers")}
        cpfQuery = `WHERE cpf LIKE '${req.query.cpf}%'`;
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
        const getCustomersColumns = await connection.query(`SELECT * FROM customers;`);
        const customersColumns = Object.getOwnPropertyNames(getCustomersColumns.rows[0]);
        if (!customersColumns.includes(req.query.order)) {return res.status(400).send(`column ${req.query.order} do not exist on customers`) }
        orderQuery = `ORDER BY "${req.query.order}"`;

        if (req.query.desc === "true") {
            orderQuery = `ORDER BY "${req.query.order}" DESC`;
        }
    }

    try {
        const customersList = await connection.query(`
            SELECT * FROM customers ${cpfQuery} ${offsetQuery} ${limitQuery} ${orderQuery};
        `);
        return res.send(customersList.rows);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getCustomer(req, res) {
    const { id } = req.params;
  
    try {
      const customer = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);
      if (customer.rowCount === 0) {
        return res.status(404).send("customer id not found");
      }
  
      res.send(customer.rows[0]);
    } catch (error) {
      res.status(500).send(error);
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf: customerNewCpf, birthday } = req.body;
    const { id } = req.params;

    try {
        const { rows } = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        const { cpf: customerOldCpf } = rows[0];
        
        const cpfInUse = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [customerNewCpf]);
        if (cpfInUse.rows.length > 0 && customerNewCpf !== customerOldCpf) { return res.status(409).send("cpf aready in use") }
        
        await connection.query(`
        UPDATE customers
            SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=$5
        `, [name, phone, customerNewCpf, birthday, id])
  
      res.status(200).send("customer data updated");
    } catch (error) {
      res.status(500).send(error);
    }
  }