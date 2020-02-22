
//API URL
let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//Perform API request for earthquake data
d3.json(earthquake_url, function(data) {
    earthquake_popup(data.features);
    console.log(data.features);
});

//Function to create popup data
function earthquake_popup(e_data) {
    console.log(e_data[0]);

    function magnitude_size(magnitude) {
        return magnitude * 50000;
    }

    function each_feature(feature,layer) {
        // console.log(feature);
        // console.log(layer.feature.properties);
        layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><hr><p>Magnitude: " +
        feature.properties.mag + "</p><hr><p>Time: " + new Date(feature.properties.time) + "</p>");
        // console.log(feature.properties.mag);
    }
    
    
    // Creates layer with the appended earthquake data
    let earth_geo = L.geoJSON(e_data, {
        pointToLayer: function(feature,latlng) {
            return L.circle(latlng,{
                    fillOpacity: 0.60,
                    color: "white",
                    fillColor: "cyan",
                    radius: magnitude_size(feature.properties.mag)
                });
        },
        onEachFeature: each_feature
    });

    //Renders map with data
    render_map(earth_geo);
}

//Function to create the map

function render_map(earth) {

    let dark_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    let sat_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });


    let boundaries = [
        [85.051129, -200], // East coordinates
        [-85.051129,190] // Northeast coordinates
        ];

    let base = {
        "Dark Map": dark_map,
        "Streets Map": sat_map
    };

    let overlay_map = {
        Earthquakes: earth
    }

    //set map
    let earth_map = L.map("map", {
        center: [40, -91.8318],
        zoom: 5,
        layers: [dark_map, earth],
        maxBounds: boundaries
    });

    L.control.layers(base, overlay_map, {
        collapsed: true
    }).addTo(earth_map);


    function legend_function(earth_data) {
    //create legend for map
    let info_legend = L.control({
        position: "bottomright"
    });

    info_legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        return div;
    };

    info_legend.addTo(earth_map);
    }
}
