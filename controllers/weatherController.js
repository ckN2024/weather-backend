import axios from "axios"
import successResponse from "../helpers/response/successResponse.js"
import errorResponse from "../helpers/response/errorResponse.js"
import FavouriteCities from "../models/favouriteCities.model.js"


// get current weather
const getCurrentWeather = async (req, res) => {
    try {
        const {city} = req.headers
        // console.log(`currentWeather: `,city)
        const APIKEY = process.env.WEATHER_API_KEY
        // console.log(APIKEY)
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`
    
        const response = await axios.get(url);
        const currentWeather = response.data;

        successResponse(res, 200, currentWeather, "weather fetched successfully")
    } catch (error) {
       console.log("Error fetching city weather")
       console.log(`error: ${error}`)
       
       errorResponse(res, 400, "Error in fetching current weather", error.message)
    }
}

// get five days weather
const getFiveDaysWeather = async (req, res) => {
    try {
        const {city} = req.headers
        // console.log(city)
        const APIKEY = process.env.WEATHER_API_KEY
        
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&cnt=5`
    
        const response = await axios.get(url);
        const currentWeather = response.data;
         
        successResponse(res, 200, currentWeather, "weather fetched successfully")
    } catch (error) {
       console.log("Error fetching city weather")
       
       errorResponse(res, 400, "Error in fetching", error.message)
    }
}


// add to favourites of the user
// POST     /api/weather/addtofavourites/:id
const addToFavourites = async (req, res) => {
    try {
        // find the user
        const {id} = req.params
        if(!id) {
            throw new Error("user id is required for adding to favourites")
        }
        const {city} = req.headers

        // find the user in db
        const user = await FavouriteCities.findById(id);

        // if the user exists then push to its favourites
        if(user) {
            // check if the city already exists in the array
            if(user.favourites.includes(city)) {
                throw new Error("City already added in favourites");
            }
            // keep the favourites to max 5
            if (user.favouritePlaces.length >= 5) {
                throw new Error("Favourite places cannot be more than 5");
            }

            user.favourites.push(city);
            await user.save();
        } else {
            // else create a new document
            const newData = new FavouriteCities({
                _id: id,
                favourites: [city]
            })

            await newData.save()
        }

        successResponse(res, 200, null, "city successfully added to favourites")
    } catch (error) {
        console.log(error.message)
        errorResponse(res, 400, "Error in adding to favourites", error.message)
    }
}

// get a user's favourite city + weather of the fav cities
// GET    /api/weather/getfavouritecities/:id  
const getFavouriteCities = async (req, res) => {
    try {
        // find the user
        const {id} = req.params
        if(!id) {
            throw new Error("user id is required for adding to favourites")
        }

        const user = await FavouriteCities.findById(id);

        if(!user) {
            throw new Error("Requested user not found in db")
        }
        
        // get the weather of all fav cities
        let responseData = [];
        const APIKEY=process.env.WEATHER_API_KEY
        
        for (let city of user.favourites) {
            // fetch the weather data of the city and push to responseData
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`
            const response = await axios.get(url);
            const currentWeather = response.data
            responseData.push({
                city,
                temp: currentWeather.main.temp
            })
        }

        successResponse(res, 200, responseData, "fav cities weather fetched successfully")

    } catch (error) {
        console.log("Error in fetching weather of fav cities")
        console.log(error)
        errorResponse(res, 400, "Error in fetching fav cities weather", error)
    }
}

export {getCurrentWeather, getFiveDaysWeather, addToFavourites, getFavouriteCities}