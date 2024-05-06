import express from "express"
import { getCurrentWeather, getFiveDaysWeather, addToFavourites, getFavouriteCities } from "../controllers/weatherController.js"

const router = express.Router()


router.route('/current').get(getCurrentWeather)
router.route('/fiveDays').get(getFiveDaysWeather)
router.route('/addtofavourites/:id').post(addToFavourites)
router.route('/getfavouritecities/:id').get(getFavouriteCities)


export default router