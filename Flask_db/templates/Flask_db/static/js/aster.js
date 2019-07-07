function aster() {
    d3.json('/aster_plot', function (data) {
        var dropdown = d3.select('.state.custom-select');

        data.state.forEach((state) => {
            var states = dropdown.append("option");
            states.attr("value", state).text(state);

        });
    });


    var myFunction = d3.select('#submit').on('click', function () {
        console.log(myFunction)

        d3.json('/aster_plot', function (data) {
            var dropdown = d3.select('.state.custom-select');

            data.state.forEach((state) => {
                var states = dropdown.append("option");
                states.attr("value", state).text(state);

                //target.addEventListener("click", listener[, useCapture]);
                //d3.selection.on(click[, listener[, capture]])
            });
        })
        var width = 750,
            height = 750,
            radius = Math.min(width, height) / 2,
            innerRadius = 0.3 * radius;

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) { return d.width; });

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function (d) {
                return d.data.label + ": <span style='color:red'>" + d.data.score + "</span>";
            });

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
                return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius;
            });

        var outlineArc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.call(tip);

        // City size
        d3.select("#button1").on('click', function (value) {
            console.log('hello  ', value);
        })

        data = data.slice(0, 5);
        data.forEach(function (d) {
            d.id = d.id;
            d.order = +d.order;
            d.color = d.color;
            d.weight = 1;
            d.score = +d.score;
            d.width = +d.weight;
            d.label = d.label;
        });

        template = {
            color: "#C32F4B",
            id: "State",
            label: "vhghgv",
            order: 0,
            score: 5,
            weight: 0,
            width: 0

            // color: "#C23F4B"
            // id: "State"
            // label: "bkb"
            // order: 1.3
            // score: 24
            // weight: 1
            // width: 1
        };


        var path = svg.selectAll(".solidArc")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", function (d) { return d.data.color; })
            .attr("class", "solidArc")
            .attr("stroke", "gray")
            .attr("d", arc)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var outerPath = svg.selectAll(".outlineArc")
            .data(pie(data))
            .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("class", "outlineArc")
            .attr("d", outlineArc);


        // // calculate the weighted mean score
        // var score =
        //   data.reduce(function (a, b) {
        //     //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
        //     return a + (b.score * b.weight);
        //   }, 0) /
        //   data.reduce(function (a, b) {
        //     return a + b.weight;
        //   }, 0);

        svg.append("svg:text")
            .attr("class", "aster-score")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle") // text-align: right
            .text(Math.round(score));

    });
}

aster();