var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 13
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(url).then(function(response) {
  
    console.log(response);
  
    var earthquakes = [];
  
    for (var i = 0; i < response.length; i++) {
      var location = response[i].geometry;
  
      if (location) {
        earthquakes.push([location.coordinates[1], location.coordinates[0]]);
      }
    }
  
    var heat = L.circle(earthquakes, {
    }).addTo(myMap);
  
  });