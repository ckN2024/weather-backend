import mongoose from "mongoose"

const FavouriteCitiesSchema = new mongoose.Schema({
    // user id
    userId: String,
    favourite: String
},{timestamps: true})

const FavouriteCities = new mongoose.model("FavouriteCities", FavouriteCitiesSchema)

export default FavouriteCities