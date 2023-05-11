const { fetchInstructions } = require("../models/instruction.models")

exports.getInstruction = (req, res, next) =>{
    return fetchInstructions().then((instruction) => {
        res.status(200).send({Instruction: instruction})
    })
    .catch(next)
}