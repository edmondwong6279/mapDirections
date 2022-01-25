### Map Directions

Using [Mapbox's API](https://docs.mapbox.com/api/overview/) create an API with an endpoint that accepts two location strings, then returns directions between those two locations

```
POST /directions
request {
    start: "trafalgar square"
    end: "buckingham palace"
}
response {
    ...directions response from Mapbox
}
```

> Create free Mapbox account to obtain an API key needed to use their API

Use the [Geocoding API](https://docs.mapbox.com/api/search/geocoding/) to turn a string into coordinates, and the [Directions API](https://docs.mapbox.com/api/navigation/directions/) to get directions between two sets of coordinates.
