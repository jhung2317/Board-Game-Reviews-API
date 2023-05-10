const {selectCategories} = require('../models/categories.models')

exports.getCategories = (req, res, next) => {
    return selectCategories().then((category) => {
        res.status(200).send({category})
    })
    .catch(next)
}