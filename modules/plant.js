const mongoose = require("./db.js")

const PlantSchema = {
    plantname: String,
    rarity: String,
    cost: Number,
    saleprice: Number,
    growtime: String,
    access: String,
    photo: String,
}

const Plant = mongoose.model("Plant", PlantSchema, "plants")

module.exports = Plant
