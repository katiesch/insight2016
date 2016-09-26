

var mymap = L.map('mapid').setView([32.8157, -117.0411], 10);

L.tileLayer('https://api.mapbox.com/styles/v1/katiesch/cithpugkf002c2jplgp9r4phm/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2F0aWVzY2giLCJhIjoiY2l0aHBjaXZ1MDJmNDJzbnZzdTNvNHNyNCJ9.aW1smbPjspISZmPnvMTFTw', {
        maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'katiesch.Light',
        accessToken: 'pk.eyJ1Ijoia2F0aWVzY2giLCJhIjoiY2l0aHBjaXZ1MDJmNDJzbnZzdTNvNHNyNCJ9.aW1smbPjspISZmPnvMTFTw'
	}).addTo(mymap);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b>Tract ' + props.TRACTCE + '</b><br />' + '<b>' + props.NAMELSAD + '</b><br />'
        + 'Graffiti Percent Reported: ' + Math.round(100. * props.GRAFFITI_P) + '% <br />'
        + 'Graffiti Percent Predicted: ' + Math.round(100. * props.PREDICTED_) + '% <br />'

        : 'Hover over a blockgroup');
};

info.addTo(mymap);

// set the color scales by hand 
var getColor_MEDIAN_HOU = chroma.scale('YlGnBu').domain([45055, 89658]);
var getColor_ALAND = chroma.scale('YlGnBu').domain([229819, 749794]);
var getColor_PREDICTED_ = chroma.scale('YlGnBu').domain([0.07, 0.37]);
var getColor_LIMITED_EN = chroma.scale('YlGnBu').domain([0.01, 0.11]);
var getColor_LATIN_PER = chroma.scale('YlGnBu').domain([0.09, 0.36]);
var getColor_CRIME_PER_ = chroma.scale('YlGnBu').domain([0.005,0.023]);
var getColor_MEDIAN_AGE = chroma.scale('YlGnBu').domain([30, 42]);
var getColor_WHITE_PER = chroma.scale('YlGnBu').domain([0.22, 0.73]);
var getColor_TOTAL_POP = chroma.scale('YlGnBu').domain([980,2035]);
var getColor_AP_COUNT = chroma.scale('YlGnBu').domain([0,7]);
var getColor_TREE_DENSI = chroma.scale('Greens').domain([0.000243, 0.000601]);
var getColor_REP_PER_CA = chroma.scale('YlGnBu').domain([0.005, 0.018]);
var getColor_GRAFFITI_P = chroma.scale('YlGnBu').domain([0.0, 0.5]);
// var getColor_ = chroma.scale('RdYlBu').domain([]);


var myVar = document.getElementById('field-select').value;
 
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
			weight: 1,
			color: 'white',
			dashArray: '',
			fillOpacity: 0.7
			});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

 
var geojson;
 
<!--geoJson = L.geoJson(bgData, {style:stylin}).addTo(mymap);-->
                <!--geoJson = L.geoJson(statesData, {style:style}).addTo(mymap);-->

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update(); 
}
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

 function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

/*function stylin(feature) {
    return {
        fillColor: getColor_MEDIAN_HOU(feature.properties.MEDIAN_HOU),
        weight: 0.5,
        opacity: 1,
        color: 'black',
        dashArray: '0',
        fillOpacity: 0.2
    };
}*/

// Initialize map colors 
geojson = L.geoJson(bgData, {
          style: function(feature) {
              return {
                  fillColor: getColor_MEDIAN_HOU(feature.properties.MEDIAN_HOU),
                  weight: 0.5,
                  opacity: 1,
                  color: 'black',
                  dashArray: '0',
                  fillOpacity: 0.2
              }
          },
          onEachFeature: onEachFeature
}).addTo(mymap);

var legend = L.control({position: 'bottomright'});


// Switches between different drop down menu options
function switcher(value) {
    // Remove original colors and legend
    geojson.clearLayers();
    legend.remove();

    if (value == 'ALAND') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(230000, 750000,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_ALAND(grades[i] + 1) + '"></i> ' +
             Math.round(grades[i]) + (Math.round(grades[i + 1]) ? '&ndash;' + Math.round(grades[i + 1]) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);

        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_ALAND(feature.properties.ALAND),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);

    } else if (value == 'MEDIAN_HOU') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(45000, 90000,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_MEDIAN_HOU(grades[i] + 1) + '"></i> ' +
             '$' + Math.round(grades[i]) + (Math.round(grades[i + 1]) ? '&ndash;' + '$' + Math.round(grades[i + 1]) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_MEDIAN_HOU(feature.properties.MEDIAN_HOU),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'PREDICTED_') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.05, 0.40,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_PREDICTED_(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(2)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(2)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_PREDICTED_(feature.properties.PREDICTED_),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'LIMITED_EN') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.0, 0.12,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_LIMITED_EN(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(2)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(2)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_LIMITED_EN(feature.properties.LIMITED_EN),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'LATIN_PER') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.05, 0.40,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_LATIN_PER(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(2)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(2)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_LATIN_PER(feature.properties.LATIN_PER),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'CRIME_PER_') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.00, 0.023,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_CRIME_PER_(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(3)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(3)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_CRIME_PER_(feature.properties.CRIME_PER_),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'MEDIAN_AGE') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(30, 42 ,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_MEDIAN_AGE(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(2)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(2)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_MEDIAN_AGE(feature.properties.MEDIAN_AGE),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'WHITE_PER') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.20, 0.75,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_WHITE_PER(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(2)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(2)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_WHITE_PER(feature.properties.WHITE_PER),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'TOTAL_POP') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(950, 2100,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_TOTAL_POP(grades[i] + 1) + '"></i> ' +
             Math.round(grades[i]) + ((grades[i + 1]) ? '&ndash;' + Math.round(grades[i + 1]) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_TOTAL_POP(feature.properties.TOTAL_POP),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'AP_COUNT') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0,7,7),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_AP_COUNT(grades[i] + 1) + '"></i> ' +
             Math.round(grades[i]) + ((grades[i + 1]) ? '&ndash;' + Math.round(grades[i + 1]) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_AP_COUNT(feature.properties.AP_COUNT),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'TREE_DENSI') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.0001,0.00060,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_TREE_DENSI(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(5)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1]).toFixed(5) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_TREE_DENSI(feature.properties.TREE_DENSI),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.3
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'REP_PER_CA') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.0, 0.02,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_REP_PER_CA(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(3)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(3)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);
        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_REP_PER_CA(feature.properties.REP_PER_CA),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.2
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);
    } else if (value == 'GRAFFITI_P') {
        legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = linspace(0.0, 0.50,8),
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
             '<i style="background:' + getColor_GRAFFITI_P(grades[i] + 1) + '"></i> ' +
             (grades[i].toFixed(2)) + ((grades[i + 1]) ? '&ndash;' + (grades[i + 1].toFixed(2)) + '<br>' : '+');
        }
        return div;
        };

        legend.addTo(mymap);

        geojson = L.geoJson(bgData, {
            style: function(feature) { return {
                fillColor: getColor_GRAFFITI_P(feature.properties.GRAFFITI_P),
                weight: 0.5,
                opacity: 1,
                color: 'black',
                dashArray: '0',
                fillOpacity: 0.2
            }},
            onEachFeature: onEachFeature
        }).addTo(mymap);


    }  
}

// console.log(bgData);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {
     var div = L.DomUtil.create('div', 'info legend'),
     grades = linspace(45000, 90000,8)
     labels = [];

     // loop through our density intervals and generate a label with a colored square for each interval
     for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor_MEDIAN_HOU(grades[i] + 1) + '"></i> ' +
             '$' + Math.round(grades[i]) + (Math.round(grades[i + 1]) ? '&ndash;' + '$' + Math.round(grades[i + 1]) + '<br>' : '+');
     }
     return div;
};

legend.addTo(mymap);


$('#field-select').on('change', function() {
    switcher(this.value);
});

