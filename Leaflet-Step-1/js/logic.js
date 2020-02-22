
//API URL
let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//Perform API request for earthquake data
d3.json(earthquake_url, function(data) {
    earthquake_popup(data.features);
    console.log(data.features);
});

//Function to create popup data
function earthquake_popup(e_data) {

    function each_feature(feature,layer) {
        layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><hr><p>Magnitude: " +
        feature.properties.mag + "</p><hr><p>Time: " + new Date(feature.properties.time) + "</p>");
        console.log(feature.properties.mag);
    }

    //Creates layer with the appended earthquake data
    let earth_geo = L.geoJSON(e_data, {
        onEachFeature: each_feature
    });

    //Renders map with data
    render_map(earth_geo);
}

//Function to create the map

function render_map(earth) {

    let light_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    let sat_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    let base = {
        "Light Map": light_map,
        "Streets Map": sat_map
    };

    let overlay_map = {
        Earthquakes: earth
    }

    //set map
    let earth_map = L.map("map", {
        center: [37.9643, -91.8318],
        zoom: 5,
        layers: [light_map, earth]
    });

    L.control.layers(base, overlay_map, {
        collapsed: false
    }).addTo(earth_map);
}
