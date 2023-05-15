import dayjs from "dayjs";
import { db } from "../Database/database.connection.js"



export async function getRentals(req,res){
    const rentals= await db.query(`SELECT rentals.*, customers.id,customers.name AS "custName", games.id, games.name AS "gamName"
    FROM rentals
    JOIN customers ON rentals."customerId"=customers.id
    JOIN games ON rentals."gameId"=games.id`)

    let lista=[]
    console.log(rentals)
    for( let i=0; i < rentals.rowCount; i++){
        lista.push({
            id: rentals.rows[i].id,
            customerId: rentals.rows[i].customerId,
            gameId: rentals.rows[i].gameId,
            rentDate: rentals.rows[i].rentDate,
            daysRented: rentals.rows[i].daysRented,
            returnDate: rentals.rows[i].returnDate, 
            originalPrice: rentals.rows[i].originalPrice,
            delayFee: rentals.rows[i].delayFee,
            customer: {
               id: rentals.rows[i].customerId,
               name: rentals.rows[i].custName
            },
            game: {
              id: rentals.rows[i].gameId,
              name: rentals.rows[i].gamName
            }
        })
    }
    return res.status(200).send(lista)

}

export async function insertRental(req,res){
    const {customerId, gameId, daysRented}= req.body
   
    const existingC= await db.query(`SELECT * FROM customers WHERE id= $1;`, [customerId]);
    const existingG= await db.query(`SELECT * FROM games WHERE id= $1;`, [gameId])
    const rentals= await db.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId])

    const ongoingRentals= Number(rentals.rows.length)

    let now= dayjs().toISOString().slice(0, 10)

    console.log(existingG.rows[0]) 

    const originalPrice= daysRented * Number(existingG.rows[0].pricePerDay)
    const returnDate = null;
    const delayFee = null;

    if(existingC.rows.length===0 || existingG.rows.length===0|| ongoingRentals >= existingG.rows[0].stockTotal){
        return res.sendStatus(400)
    }
    
    
    try {
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES
        ($1, $2, $3, $4, $5,$6, $7);
    `, [customerId, gameId, now, daysRented,returnDate,originalPrice, delayFee ])
        res.sendStatus(201)
    } catch (err) {
        res.status(505).send(err.message)
    }
}

export async function deleteRental(req,res){
    const {id}= req.body
    const existing= await db.query(`SELECT * FROM rentals WHERE id= $1}`,[id])

    if(!existing){
        return res.sendStatus(404)
    }
    else{
        if (existing.returnDate === null){
            return res.sendStatus(400)
        }
        try{
            await db.query(`DELETE FROM rentals WHERE id=$1`, [id])
            return res.sendStatus(200)
        } catch(err){
            console.log(err.message)
        }
    }
}

export async function finalizeRental(req,res){
    const {id}= req.params
    const rental= await db.query(`SELECT * FROM rentals WHERE id= $1;`,[id]);
    if(rental.rows.length ===0){
        return res.sendStatus(404)
    }
    else if(rental.rows[0].returnDate !== null){
        return res.sendStatus(400)
    }
    else{
        const timestamp= dayjs(rental.rows[0].rentDate).toDate().getTime()
        const now= dayjs()
        const returndate= now.toISOString().slice(0, 10)
        const rentedDays= rental.rows[0].daysRented * 86400000 
        const rentedTime= now - timestamp
        if ( rentedTime <= rentedDays){
            try{
                await db.query(`UPDATE rentals SET "returnDate"=$2 WHERE id = $1;
                `, [id, returndate])
                return res.sendStatus(200)

            }catch(err){
                console.log(err.message)
            }
        }
        else{
            const lateTime= rentedTime- rentedDays
            const lateDays= Math.floor(lateTime/86400000)
            const fee= rental.rows[0].originalPrice * lateDays
            try{
                await db.query(`UPDATE rentals SET "returnDate"=$2, "delayFee"=$3 WHERE id = $1;
                `, [id, returndate, fee])
                return res.sendStatus(200)
            }catch(err){
                console.log(err.message)
            }
        }
    }
}