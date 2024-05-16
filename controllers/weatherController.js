import axios from "axios";
import successResponse from "../helpers/response/successResponse.js";
import errorResponse from "../helpers/response/errorResponse.js";
import FavouriteCities from "../models/favouriteCities.model.js";
import newGetDataFromToken from "../helpers/cognito/newGetDataFromToken.js";

// get current weather    /api/weather/current
const getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.headers;
    // console.log(`currentWeather: `,city)
    const APIKEY = process.env.WEATHER_API_KEY;
    // console.log(APIKEY)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;

    const response = await axios.get(url);
    const currentWeather = response.data;

    successResponse(res, 200, currentWeather, "weather fetched successfully");
  } catch (error) {
    console.log("Error fetching city weather");
    console.log(`error: ${error}`);

    errorResponse(res, 400, "Error in fetching current weather", error.message);
  }
};

// get five days weather    /api/weather/fivedays
const getFiveDaysWeather = async (req, res) => {
  try {
    const { city } = req.headers;
    // console.log(city)
    const APIKEY = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&cnt=5`;

    const response = await axios.get(url);
    const currentWeather = response.data;

    successResponse(res, 200, currentWeather, "weather fetched successfully");
  } catch (error) {
    console.log("Error fetching city weather");

    errorResponse(res, 400, "Error in fetching", error.message);
  }
};

// add to favourites of the user
// POST     /api/weather/addtofavourites
const addToFavourites = async (req, res) => {
  try {
    const { uuid, city } = req.headers

    if (!uuid) {
      throw new Error("user needs to be authenticated for adding to favourites");
    }

    const newItem = new FavouriteCities({
      userId: uuid,
      favourite: city,
    });

    const isCityInFavourites = FavouriteCities.find({$and: [{userId: uuid}, {favourite: city}]})
    if(isCityInFavourites.length) {
      throw new Error("City already added to favourites")
    }

    await newItem.save();

    successResponse(res, 200, null, "city successfully added to favourites");
  } catch (error) {
    console.log(error.message);
    errorResponse(res, 400, "Error in adding to favourites", error.message);
  }
};

// remove from favourites of the user
// DELETE     /api/weather/addtofavourites
const removeFromFavourites = async (req, res) => {
  try {
    const {uuid, city} = req.headers

    if (!uuid) {
      throw new Error("user needs to be authenticated for removing from favourites");
    }
    

    await FavouriteCities.deleteOne({ $and: [{ userId: uuid },{ favourite: city }] })


    successResponse(res, 200, null, "city successfully removed from favourites");
  } catch (error) {
    console.log(error.message);
    errorResponse(res, 400, "Error in adding to favourites", error.message);
  }
};

// get a user's favourite city + weather of the fav cities
// GET    /api/weather/getfavouritecities/
const getFavouriteCities = async (req, res) => {
  try {
    const {uuid} = req.headers

    if (!uuid) {
      throw new Error("user needs to be authenticated for adding to favourites");
    }

    const favourites = await FavouriteCities.find({userId: uuid})

    successResponse(
      res,
      200,
      favourites,
      "fav cities weather fetched successfully"
    );
  } catch (error) {
    console.log("Error in fetching weather of fav cities");
    console.log(error);
    errorResponse(res, 400, "Error in fetching fav cities weather", error);
  }
};

const getFavouriteCitiesWithWeather = async (req, res) => {
  try {
    const {uuid} = req.headers

    if (!uuid) {
      throw new Error("user needs to be authenticated for adding to favourites");
    }

    const favourites = await FavouriteCities.find({userId: uuid}).lean()
    // console.log(favourites)

    
    // get weather of the favourite cities
    let favouritesWithWeather = [];
    for(let record of favourites) {
      const APIKEY = process.env.WEATHER_API_KEY;
      // console.log(APIKEY)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${record.favourite}&appid=${APIKEY}`;

      const response = await axios.get(url);
      const currentTemperature = response.data.main.temp;
      favouritesWithWeather.push({...record, temp: currentTemperature})
      // console.log(currentTemperature)
    }

    console.log(favouritesWithWeather)


    successResponse(
      res,
      200,
      favouritesWithWeather,
      "fav cities weather fetched successfully"
    );
  } catch (error) {
    console.log("Error in fetching weather of fav cities");
    console.log(error);
    errorResponse(res, 400, "Error in fetching fav cities weather", error);
  }
};

export {
  getCurrentWeather,
  getFiveDaysWeather,
  addToFavourites,
  getFavouriteCities,
  getFavouriteCitiesWithWeather,
  removeFromFavourites
};
