// Post method that accepts a JSON object of the following format:
//
// POST /directions
// request {
//     start: "trafalgar square"
//     end: "buckingham palace"
// }
// response {
//     ...directions response from Mapbox
// }
//
// Basic usage implemented so far:
//      - Only uses driving directions
//      - Only takes the first result from the searched words


const express = require('express');
// npm i node-fetch@2
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { URL, URLSearchParams } = require('url');

const port = 3000;
// Is this ok to be just kept in plain text in the js file?
const token = 'pk.eyJ1IjoiZWQ2Mjc5IiwiYSI6ImNreXZtOGxqNjA4YTQyd28wcXY1NHR2c3YifQ.k7weORyzPXQkMIkoFH9AWg';

const app = express();

// so we can access request body
app.use(bodyParser.json())

app.post('/directions',  (req,res)=>handle(req,res));

// handle is an async function so we can await the fetched results from mapbox.
const handle = async (req, res) => {
    const coords = await stringToCoords(req.body);
    const directions = await coordsToDirections(coords);
    res.send(directions);
    console.log('successfully handled request')
}

// helper for fetching results as we do this 3 times
const fetcher = async (url) => {
    const res = await fetch(url);
    return await res.json();
}

// Strings to coords async method
const stringToCoords = async (inputStrings) => {
    // format the urls of start and end points
    let fullUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    start = new URL(`${fullUrl}${inputStrings.start}.json`);
    end = new URL(`${fullUrl}${inputStrings.end}.json`);

    start.search = new URLSearchParams({access_token: token}).toString();
    end.search = new URLSearchParams({access_token: token}).toString();

    startCoords = await fetcher(start);
    endCoords = await fetcher(end);

    return {
        startCoords: startCoords.features[0].geometry.coordinates,
        endCoords: endCoords.features[0].geometry.coordinates
    }
}

// Coords to directions async method
const coordsToDirections = async (coords) => {
    let fullUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
    console.log(`start coords : ${coords.startCoords.toString()}`)
    console.log(`end coords   : ${coords.endCoords.toString()}`)
    route = new URL(`${fullUrl}${coords.startCoords.toString()};${coords.endCoords.toString()}.json`);
    route.search = new URLSearchParams({access_token: token}).toString();

    return await fetcher(route);
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
