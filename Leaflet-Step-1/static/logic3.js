// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 30,
  id: "light-v10",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  ONE: new L.LayerGroup(),
  TWO: new L.LayerGroup(),
  THREE: new L.LayerGroup(),
  FOUR: new L.LayerGroup(),
  FIVE: new L.LayerGroup(),
  SIX: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.ONE,
    layers.TWO,
    layers.THREE,
    layers.FOUR,
    layers.FIVE,
    layers.SIX,
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "-10-10": layers.ONE,
  "10-30": layers.TWO,
  "30-50": layers.THREE,
  "60-70": layers.FOUR,
  "70-90": layers.FIVE,
  "90+": layers.SIX
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
    ONE: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "yellow",
    shape: "circle"
  }),
  TWO: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  THREE: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "circle"
  }),
  FOUR: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
  FIVE: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
   }),
 SIX: L.ExtraMarkers.icon({
  icon: "ion-android-bicycle",
  iconColor: "white",
  markerColor: "green",
  shape: "circle"   
  })
};

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create an object to keep of the number of markers in each layer
    var stationCount = {
      ONE: 0,
      TWO: 0,
      THREE: 0,
      FOUR: 0,
      FIVE: 0, 
      SIX: 0
    };

    // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
    var earthquakescode;

    
    for (var i = 0; i < earthquakes.length; i++) {

     
      var earthquakedepth = feature.geometry.coordinates[3]
      var earthquakedepth = Object.assign({}, earthquakedepth[i]);

    
      if (earthquakedepth < 10) {
        earthquakescode = "ONE";
      }
    
      else if (earthquakedepth > 10 && earthquakedepth < 30) {
        earthquakescode  = "TWO";
      }
     
      else if (earthquakedepth > 30 && earthquakedepth < 50) {
        earthquakescode  = "THREE";
      }
   
      else if (earthquakedepth > 50 && earthquakedepth < 70) {
        earthquakescode  = "FOUR";
      }

      else if (earthquakedepth > 70 && earthquakedepth < 90) {
        earthquakescode  = "FIVE";
      }
      // Otherwise the station is normal
      else {
        earthquakescode  = "SIX";
      }

      // Update the station count
      stationCount[earthquakescode ]++;
      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([features.geometry.coordinates[0], features.geometry.coordinates[1]], {
        icon: icons[earthquakescode]
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[stationStatusCode]);
    
    }

}; 