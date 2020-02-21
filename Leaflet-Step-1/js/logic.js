let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//Perform API request for earthquake data
d3.json(earthquake_url, function(data) {
    earthquake_popup(data.features);
});

//Function to create popup data
function earthquake_popup(e_data) {

    function each_feature(feature,layer) {
        layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><hr><p>Magnitude: " +
        feature.properties.mag + "</p><br><p>Time: " + new Date(feature.properties.time) + "</p>");
    }

    //Creates layer with the appended earthquake data
    let earth_geo = L.geoJSON(e_data, {
        each_feature: each_feature
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

    let base = {
        "Light Map": light_map
    };

    
}
