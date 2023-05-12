import dayjs from "dayjs";
import { db } from "../Database/database.connection.js"


export async function getRentals(req,res){
    const rentals= await db.query(`SELECT * FROM rentals`)

    let response=[]
    for( let i=0; i < rentals.rowCount; i++){
        response.push({
            id: rentals.rows[i].id,
            customerId: rentals.rows[i].customerId,
            gameId: rentals.rows[i].gameId,
            rentDate: rentals.rows[i].rentDate,
            daysRented: rentals.rows[i].daysRented,
            returnDate: rentals.rows[i].returnDate, 
            originalPrice: rentals.rows[i].originalPrice,
            delayFee: rentals.rows[i].delayFee,
            customer: {
               id: 1,
               name: 'João Alfredo'
            },
            game: {
              id: 1,
              name: 'Banco Imobiliário'
            }
        })
    }

}

export async function insertRental(req,res){
    const {customerId, gameId, daysRented}= req.body
   
    const existingC= await db.query(`SELECT * FROM customers WHERE id= $1;`, [customerId]);
    const existingG= await db.query(`SELECT * FROM games WHERE id= $1;`, [gameId])
    const rentals= await db.query(`SELECT * FROM rentals WHERE "returnDate" is NULL `)

    const ongoingRentals= Number(rentals.rowCount)

    let now= dayjs().format("YYYYY-MM-DD")

    const originalPrice= daysRented * existingG.rows[0].pricePerDay
    const returnDate = null;
    const delayFee = null;

    if(!existingC || !existingG|| ongoingRentals > existingG.rows[0].stockTotal){
        return res.sendStatus(400)
    }
    
    
    try {
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES
        (${customerId}, ${gameId}, ${now}, ${returnDate}, ${originalPrice},${delayFee});
    `)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}