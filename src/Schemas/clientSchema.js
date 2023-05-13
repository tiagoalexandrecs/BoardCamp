import JoiBase from "joi"
import JoiDate from "@joi/date"

const joi= JoiBase.extend(JoiDate)

const clientSchema= joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().min(11).max(11).pattern(/^[0-9]+$/).required(),
    birthday: joi.date().iso().format("YYYY-MM-DD").required()
})

export default clientSchema;