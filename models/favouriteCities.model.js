import mongoose from "mongoose"

const FavouriteCitiesSchema = new mongoose.Schema({
    // user id
    _id: String,
    favourites: [String]
})

const FavouriteCities = new mongoose.model("FavouriteCities", FavouriteCitiesSchema)

export default FavouriteCities