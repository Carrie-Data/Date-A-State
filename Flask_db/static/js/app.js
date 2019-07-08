document.addEventListener("DOMContentLoaded", function (e) {

    d3.json('/aster_plot', function (agg_aster_data) {
        var state_dropdown = d3.select('.state.form-control');

        agg_aster_data.map((obj, i) => {
            var state = obj.state;
            var states = state_dropdown.append("option");
            states.attr("value", state).text(state);
        });

        console.log(agg_aster_data);

        d3.select('button').on('click', function () {

            var stateInput = d3.select('.state.form-control').property('value')
            console.log(stateInput);

            var incomeInput = d3.select('.income.form-control').property('value');
            console.log(incomeInput);

            var popInput = d3.select('.population.form-control').property('value');
            console.log(popInput);

            var width = 550,
                height = 550,
                radius = Math.min(width, height) / 2,
                innerRadius = 0.3 * radius;

            var pie = d3.pie()
                .sort(null)
                .value(function (d) {
                    return d.width
                });

            // var tip = d3.tip()
            //     .attr('class', 'd3-tip')
            //     .offset([0, 0])
            //     .html(function (d) {
            //         return d.data.label + ": <span style='color:red'>" + d.data.score + "</span>"
            //     });

            var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(function (d) {
                    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius;
                });

            var outlineArc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);

            var svg = d3.select(".aster.container")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            // .call(tip);

            d3.csv('/static/aster_data.csv', function (err, data) {

                console.log(data);

                var stateInfo = agg_aster_data.filter(d => d.state === stateInput)[0];

                var incomeScale = d3.scaleLinear()
                    .domain([(15000 / stateInfo.income), (80000 / stateInfo.income)])
                    .range([0, 100]);
                var incomeMatch = incomeScale(incomeInput/stateInfo.income)

                var popScale = d3.scaleLinear()
                    .domain([(500000 / stateInfo.population), (10000000 / stateInfo.population)])
                    .range([0, 100]);
                var popMatch = popScale(incomeInput / stateInfo.population)

                data[1].score = incomeMatch;
                data[2].score = popMatch;
                console.log(incomeMatch);
                console.log(popMatch);

                // State size
                data = data.slice(0, 2);
                data.forEach(function (d) {
                    d.id = d.id;
                    d.color = d.color;
                    d.weight = 1;
                    d.score = +d.score;
                    d.width = +d.weight;
                    d.label = d.label;
                });

                var path = svg.selectAll(".solidArc")
                    .data(pie(data))
                    .enter()
                    .append("path")
                    .attr("fill", function (d) { return d.data.color; })
                    .attr("class", "solidArc")
                    .attr("stroke", "gray")
                    .attr("d", arc)
                // .on('mouseover', tip.show)
                // .on('mouseout', tip.hide);

                var outerPath = svg.selectAll(".outlineArc")
                    .data(pie(data))
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke", "gray")
                    .attr("class", "outlineArc")
                    .attr("d", outlineArc);


                // calculate the weighted mean score
                var score = (incomeMatch + popMatch) / 2;

                svg.append("svg:text")
                    .attr("class", "aster-score")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle") // text-align: right
                    .text(Math.round(score));

                //End event listener
            });

            //End d3.csv
        });

        //End d3.json
    });


    /* Your D3.js here */
    //Dropdown List
    //Choropleth Dropdown
    var choropleth_select_options = ['income', 'mortgage', 'population', 'female_pop', 'male_pop', 'single', 'seperated', 'divorced', 'land', 'water']

    var choroplethDropdown = d3.select('select.choropleth');

    choropleth_select_options.forEach((option) => {
        var choropleth_options = choroplethDropdown.append("option");
        choropleth_options.attr("value", option).text(option);
    });

    //Cluster Dropdown
    var cluster_select_options = ['People Stats', 'Marital Status Stats', 'Income/Rent/Own Stats']

    var clusterDropdown = d3.select('.cluster.form-control');

    cluster_select_options.forEach((option) => {
        var cluster_options = clusterDropdown.append("option");
        cluster_options.attr("value", option).text(option);
    });


    function choropleth() {

        //GeoJson data of state polygons
        d3.json('/static/gz_2010_us_040_00_500k.json', function (err, geojson_data) {
            console.log(geojson_data)

            // CSV of Census Data
            d3.json("/choropleth", function (err, agg_life_data_df) {

                // HOW TO JOIN census_data geosjon_data
                // "JOINING"
                var geojson_merge_csv = {

                    features: geojson_data.features.map(feature => {

                        csv_datum = agg_life_data_df.filter(csv_datum => {
                            return csv_datum.state === feature.properties.NAME;
                        })[0];

                        feature.properties = {
                            "GEO_ID": feature.properties.GEO_ID,
                            "STATE": feature.properties.STATE,
                            "NAME": feature.properties.NAME,
                            "LSAD": feature.properties.LSAD,
                            "CENSUSAREA": feature.properties.CENSUSAREA,
                            'income': parseInt(csv_datum.income),
                            'mortgage': parseInt(csv_datum.mortgage),
                            'population': parseInt(csv_datum.population),
                            'female_pop': parseFloat(csv_datum.female_pop_percentage).toFixed(2),
                            'male_pop': parseFloat(csv_datum.male_pop_percentage).toFixed(2),
                            'single': parseFloat(csv_datum.single).toFixed(2),
                            'married': parseFloat(csv_datum.married).toFixed(2),
                            'seperated': parseFloat(csv_datum.seperated).toFixed(2),
                            'divorced': parseFloat(csv_datum.divorced).toFixed(2),
                            'land': parseFloat(csv_datum.land_percentage).toFixed(2),
                            'water': parseFloat(csv_datum.water_percentage).toFixed(2),
                        };
                        return feature;
                    })
                };
                console.log(geojson_merge_csv)

                // var map = L.map(...)
                // Creating map object
                var map = L.map("choropleth_map", {
                    center: [38, -95],
                    zoom: 4
                });

                // var map = L.tileLayer(...).addto(map);
                var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                    maxZoom: 18,
                    id: "mapbox.light",
                    accessToken: API_KEY
                }).addTo(map);

                var factors_map = L.choropleth(geojson_merge_csv, {
                    valueProperty: 'income',
                    scale: ['white', 'red'], // chroma.js scale - include as many as you like
                    steps: 5,
                    mode: 'q',
                    style: {
                        color: chroma('white').brighten(), // border color
                        weight: 2,
                        fillOpacity: 0.8
                    },
                    // Binding a pop-up to each layer
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(`${feature.properties.NAME}  ${'income'}:<br> ${feature.properties.income}`)
                    }
                }).addTo(map);

                // Set up the legend
                var legend = L.control({ position: 'bottomright' })

                legend.onAdd = function () {
                    factors_map.options.limits;
                    factors_map.options.colors;

                    var min = factors_map.options.limits[0];
                    var max = factors_map.options.limits[factors_map.options.limits.length - 1]

                    var legendInfo = `<h3>income</h3>
                        <div>
                            <div class="min">${min}</div>
                            <div class="max">${max}</div>
                        </div>
                        `;

                    var colorlist = factors_map.options.colors.map(color => {
                        return `<li style = "background-color: ${color}"></li>`;
                    });

                    var div = L.DomUtil.create('div', 'info legend');

                    div.innerHTML = `
                            ${legendInfo}
                            <ul>
                            ${colorlist.join('')}
                            </ul>`
                    // return: DOM Element, that it will put into the LEaflet
                    return div;
                }
                legend.addTo(map)


                choroplethDropdown.on("change", function () {

                    console.log(factors_map);


                    // Prevent the page from refreshing
                    d3.event.preventDefault();

                    //Remove Previous layers
                    map.removeLayer(factors_map);
                    legend.remove();

                    // Get the value property of the input element
                    var inputValue = choroplethDropdown.property('value');
                    console.log(inputValue);

                    // DRAW MAP(s):
                    factors_map = L.choropleth(geojson_merge_csv, {
                        valueProperty: inputValue,
                        scale: ['white', 'red'], // chroma.js scale - include as many as you like
                        steps: 5,
                        mode: 'q',
                        style: {
                            color: chroma('white').brighten(), // border color
                            weight: 2,
                            fillOpacity: 0.8
                        },
                        // Binding a pop-up to each layer
                        onEachFeature: function (feature, layer) {
                            layer.bindPopup(`${feature.properties.NAME}  ${inputValue}:<br> ${feature.properties[inputValue]}`)
                        }
                    }).addTo(map);

                    // Set up the legend
                    legend = L.control({ position: 'bottomright' })

                    legend.onAdd = function () {
                        factors_map.options.limits;
                        factors_map.options.colors;

                        var min = factors_map.options.limits[0];
                        var max = factors_map.options.limits[factors_map.options.limits.length - 1]

                        var legendInfo = `<h3>${inputValue}</h3>
                        <div>
                            <div class="min">${min}</div>
                            <div class="max">${max}</div>
                        </div>
                        `;

                        var colorlist = factors_map.options.colors.map(color => {
                            return `<li style = "background-color: ${color}"></li>`;
                        });

                        var div = L.DomUtil.create('div', 'info legend');

                        div.innerHTML = `
                            ${legendInfo}
                            <ul>
                            ${colorlist.join('')}
                            </ul>`
                        // return: DOM Element, that it will put into the LEaflet
                        return div;
                    }
                    legend.addTo(map)
                });

                //end d3.json
            });
        });
    }

    function cluster() {

        var markers = L.markerClusterGroup();
        // Grab data with d3
        //d3.csv('../Resources/Life_data_full_cleaned_dataset.csv', function (err, census_data) {
        d3.json("/cluster", function (err, life_data_cleaned_df) {
            //Create Dropdown



            // Creating map object
            var myMap = L.map("cluster_map", {
                center: [37, -95],
                zoom: 4
            });

            //myMap.removeLayer(factors_map);

            // Adding tile layer to the map
            L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                maxZoom: 18,
                id: "mapbox.streets",
                accessToken: API_KEY
            }).addTo(myMap);

            life_data_cleaned_df.forEach(place => {
                markers.addLayer(L.marker(
                    [place.lat, place.lng]
                ).bindPopup(`${place.city}, ${place.state}  
            People Stats<br> 
            Popualtion : ${place.pop}<br>
            % Male Pop : ${+(place.male_pop) / +(place.pop)}<br>
            % Female Pop : ${(+(place.female_pop) / +(place.pop)).toFixed(2)}<br>
            Male Avg Age : ${parseFloat(place.male_age_mean).toFixed(2)}<br>
            Female Avg Age : ${parseFloat(place.female_age_mean).toFixed(2)}<br>`));
            });

            clusterDropdown.on("change", function (event) {

                // Prevent the page from refreshing
                d3.event.preventDefault();

                //Remove Previous layers
                myMap.removeLayer(markers);

                markers = L.markerClusterGroup();

                // Get the value property of the input element
                var inputValue = clusterDropdown.property('value');
                console.log(inputValue);

                life_data_cleaned_df.forEach(place => {

                    if (inputValue === 'People Stats') {
                        markers.addLayer(L.marker(
                            [place.lat, place.lng]
                        ).bindPopup(`${place.city}, ${place.state}  
                    ${inputValue}:<br> 
                    People Stats<br>
                    Popualtion : ${place.pop}<br>
                    % Male Pop : ${+(place.male_pop) / +(place.pop)}<br>
                    % Female Pop : ${(+(place.female_pop) / +(place.pop)).toFixed(2)}<br>
                    Male Avg Age : ${parseFloat(place.male_age_mean).toFixed(2)}<br>
                    Female Avg Age : ${parseFloat(place.female_age_mean).toFixed(2)}<br>`));
                    }
                    else if (inputValue === 'Marital Status Stats') {
                        markers.addLayer(L.marker(
                            [place.lat, place.lng]
                        ).bindPopup(`${place.city}, ${place.state}  
                    ${inputValue}:<br> 
                    Single : ${parseFloat(place.single).toFixed(2)}<br>
                    Married : ${parseFloat(place.married).toFixed(2)}<br>
                    Divorced : ${parseFloat(place.divorced).toFixed(2)}<br>`));
                    }
                    else {
                        markers.addLayer(L.marker(
                            [place.lat, place.lng]
                        ).bindPopup(`${place.city}, ${place.state}  
                    ${inputValue}:<br> 
                    Avg Income: ${parseFloat(place.hi_mean).toFixed(2)}<br>
                    Avg Mortgage: ${parseFloat(place.hc_mean).toFixed(2)}<br>
                    Avg Rent: ${parseFloat(place.rent_mean).toFixed(2)}<br>
                    Avg Home Equity: ${parseFloat(place.home_equity).toFixed(2)}<br>
                    Avg Debt: ${parseFloat(place.debt).toFixed(2)}<br>`));
                    };

                    // End of forEach
                });
                markers.addTo(myMap);

                //End On change
            });

            markers.addTo(myMap);

            // End of d3.json
        });
    }

    //Call functions
    choropleth();
    cluster();

    //End of DOM event listener
});
