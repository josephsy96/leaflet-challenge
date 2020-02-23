
//API URL
let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
//plates geo json
let plates_geo_json = "Leaflet-Step-2/PB2002_plates.geojson";

//Perform API request for earthquake data
d3.json(earthquake_url, function(data) {
    earthquake_popup(data.features);
    console.log(data.features);
});


//Function to create popup data
function earthquake_popup(e_data) {
    console.log(e_data[0]);

    //sets the circle size, corresponding to the earthquakes magnitude
    function magnitude_size(magnitude) {
        return magnitude * 45000;
    }

    //function to set the color corresponding to the earthquake magnitude
    function color_size(mag_data) {
        let color = "";

        if (mag_data >= 5) {
            color = "#A6145D";
        }
        else if (mag_data < 5 && mag_data >= 4) {
            color = "#A614A6";
        }
        else if (mag_data < 4 && mag_data >= 3) {
            color = "#5D14A6";
        }
        else if (mag_data < 3 && mag_data >= 2) {
            color = "#5D14A6";
        }
        else if (mag_data < 2 && mag_data >= 1) {
            color = "#1414A6";
        }
        else {
            color = "#14A6A6";
        }
        return color;
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
                    fillColor: color_size(feature.properties.mag),
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

    // let plates = d3.json(plates_geo_json, function(data) {
    //     L.geoJson(data);
    // });

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
        "Earthquakes": earth,
        "Fault Lines": plates
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


    // // function legend_function(earth_legends) {
    // //create legend for map
    // let info_legend = L.control({
    //     position: "bottomright"
    // });

    // info_legend.onAdd = function() {
    //     let div = L.DomUtil.create("div", "legend");
    //     div.innerHTML
    //     return div;
    // };

    // info_legend.addTo(earth_map);
    
}
