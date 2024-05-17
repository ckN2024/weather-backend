import express from "express"
import { 
    getCurrentWeather, 
    getFiveDaysWeather, 
    addToFavourites, 
    getFavouriteCities,
    getFavouriteCitiesWithWeather,
    removeFromFavourites,
    fetchAllUsersWithFavavourites 
} from "../controllers/weatherController.js"
import authenticateUser from "../middlewares/authMiddleware.js"

const router = express.Router()


router.route('/current').get(getCurrentWeather)
router.route('/fiveDays').get(getFiveDaysWeather)
router.route('/addtofavourites').post(authenticateUser, addToFavourites)
router.route('/getfavouritecities').get(authenticateUser, getFavouriteCities)
router.route('/getfavouritecitieswithweather').get(authenticateUser, getFavouriteCitiesWithWeather)
router.route('/removefromfavourites').delete(authenticateUser, removeFromFavourites)
router.route('/fetchAllUsersWithFavavourites').get(fetchAllUsersWithFavavourites)


export default router