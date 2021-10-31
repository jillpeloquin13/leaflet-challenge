var map = L.map('map').setView([40, -120], 4);

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(map);





var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function(data) {

  geoLayer = L.geoJson(data, {

    style: function(feature) {
      var depth = feature.geometry.coordinates[2];
      console.log(depth)
      if (depth > 90) {
        return {
          color: "red"
        }; 
      }
      else if (depth <= 90 && depth > 70)  {
        return {
          color: "orange"
        };
      } else if (depth <= 70 && depth > 50) {
        return {
          color: "pink"
        };
    } else if (depth <= 50 && depth > 30) {
        return {
          color: "yellow"
        };
    } else if (depth <= 30 && depth > 10) {
        return {
          color: "green"
        };
    } else if (depth <= 10) {
        return {
            color: "blue"
        };
      } else {
        return {
          color: "white"
        }
      }
    },

    onEachFeature: function(feature, layer) {

      var popupText = "<b>Magnitude:</b> " + feature.properties.mag +
        "<br><b>Location:</b> " + feature.properties.place +
        "<br><b>Depth:</b> " + feature.geometry.coordinates[2];

      layer.bindPopup(popupText, {
        closeButton: true,
        offset: L.point(0, -20)
      });
      layer.on('click', function() {
        layer.openPopup();
      });
    },

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng,  {
        radius: Math.round(feature.properties.mag) * 2.5, opacity: 1,
      });
    },
  }).addTo(map);
});


function getColor(d) {
    return d === '+90' ? 'red' :
           d === '70 to 90' ? 'orange' :
           d === '70 to 50' ? 'pink' :
           d === '50 to 30'? 'yellow' :
           d === '30 to 10' ? 'green' :
           d === '10 to -10' ? 'blue' :
           'white';
}


var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Depth of Earthquake</strong>'],
    categories =["+90","70 to 90", "70 to 50", "50 to 30", "30 to 10", "10 to -10"];

    for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(map);

    