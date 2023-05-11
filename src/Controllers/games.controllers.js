import { db } from "../Database/database.connection.js"

export async function getGames(req, res) {
    try {
      const games = await db.query("SELECT * FROM games");
      res.send(games.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

export async function insertGame(req,res){
    const {name, image, stockTotal, pricePerDay}= req.body
    const existing= await db.query(`SELECT * FROM games WHERE name= ${name};`);

    if(existing){
        return res.sendStatus(409)
    }
    
    
    try {
        await db.query(`INSERT INTO games (name, image, stockTotal , pricePerDay) VALUES
        (${name}, ${image}, ${stockTotal}, ${pricePerDay});
    `)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
