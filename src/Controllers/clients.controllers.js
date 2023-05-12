import { db } from "../Database/database.connection.js"

export async function getClients(req, res) {
    try {
      const clients = await db.query("SELECT * FROM customers");
      res.send(clients.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

export async function insertClient(req,res){
    const {name, phone, cpf, birthday}= req.body
    const existing= await db.query(`SELECT * FROM customers WHERE cpf= $1;`, [cpf]);

    if(existing){
        return res.sendStatus(409)
    }
    
    
    try {
        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES
        (${name}, ${phone}, ${cpf}, ${birthday});
    `)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getClientById(req, res) {
    const { id } = req.params;
    try{const client= await db.query(`SELECT * FROM customers WHERE cpf= $1;`, [id]);
    if(!client){
        return res.sendStatus(404)
    }
    else{
         return res.send(client.rows[0]);
    }}catch (err) {
        return res.status(500).send(err.message);
      }
  }


  export async function updateClient(req,res){
    const {id}= req.params
    const {name, phone, cpf, birthday}= req.body
    const existing= await db.query(`SELECT * FROM customers WHERE cpf= $1;`, [cpf]);

    if(existing){
        return res.sendStatus(409)
    }
    
    
    try {
        await db.query(`UPDATE customers SET name=${name}, phone=${phone}, cpf=${cpf}, birthday=${birthday} WHERE id = $1;
    `, [id])
        return res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
  }