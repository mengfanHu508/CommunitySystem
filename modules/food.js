const mongoose = require("./db.js")

const FoodSchema = {
    foodname: String,
    saleprice: Number,
    cooking_time: String,
    access: String,
    materials: String,
    rarity: String,
    photo: String,
}

const Food = mongoose.model("Food", FoodSchema, "foods")

module.exports = Food
