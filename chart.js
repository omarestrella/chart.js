//
// This is a wrapper for Rickshaw that exposes some of its features in a
// more simple and easy to use fashion. It contains some patterns that
// are reusable across projects and should just drop in.
//

// # Chart
// Constructs a chart object at a div container with initial
// data and options
//
//     container: the id of the div to hold the chart
//     data: an array of objects containing x, y points
//     width: the width of the chart
//     height: the height of the chart
function Chart(container, data, width, height, simplify_data) {
    // Bind values to the chart object
    this.container = container;

    // Bind the jQuery object to a variable to access it faster
    this.$container = $('#' + container);

    // Use the Rickshaw color palette
    var palette = new Rickshaw.Color.Palette({ scheme: 'classic9' });

    // Handle the data passed in and make it a valid series array
    // for Rickshaw
    this.series = [];
    for(var obj in data) {
        if(simplify_data) {
            console.log('regular: %o', data[obj]);
            simp_data = simplify(data[obj], 0.1, true);
            console.log('simplified: %o', simp_data);

            this.series.push({
                'data': simp_data,
                'color': palette.color(),
                'name': obj + ' simplified'
            });
        } else {
            this.series.push({
                'data': data[obj],
                'color': palette.color(),
                'name': obj
            });
        }
    }

    // Keep track of the Rickshaw object
    this.graph = new Rickshaw.Graph({
        element: document.getElementById(container),
        renderer: 'line',
        width: width,
        height: height,
        min: 50,
        interpolation: 'linear', // ['linear', 'step-after', 'cardinal', 'basis']
        stroke: true,
        series: this.series
    });

    this.graph.render();

    this.displayAxes('plain');
    this.enableHover();
    this.enableLegend('legend');
    this.enableSmoother(container + '_smoother');
    this.enableSlider(container + '_slider');
}

// ## Chart.displayXAxis
// A function that renders the x axis and applies a CSS
// class to all of the tick marks
//
//     ticksTreatment: the CSS class to apply to tick marks
Chart.prototype.displayXAxis = function(ticksTreatment) {
    // ### Options
    //     graph: the Rickshaw graph object
    //     ticksTreatment [optional]: a CSS class
    this.xaxis = new Rickshaw.Graph.Axis.Time({
        graph: this.graph,
        ticksTreatment: ticksTreatment
    });

    this.xaxis.render();
};

// ## Chart.displayYAxis
// A function that renders the y axis and applies a CSS
// class to all of the tick marks
//
//     ticksTreatment: the CSS class to apply to tick marks
Chart.prototype.displayYAxis = function(ticksTreatment) {
    // ### Options
    //     graph: the Rickshaw graph object
    //     tickFormat: a function that applies formating to y
    //         tick values; function(y) { //do something with y }
    //     ticksTreatment [optional]: a CSS class
    this.yaxis = new Rickshaw.Graph.Axis.Y({
        graph: this.graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
    });

    this.yaxis.render();
};

// ## Chart.displayAxes
// A function that renders the axes and applies a CSS
// class to all of the tick marks
//
//     ticksTreatment: the CSS class to apply to tick marks
Chart.prototype.displayAxes = function(ticksTreatment) {
    this.displayXAxis(ticksTreatment);
    this.displayYAxis(ticksTreatment);
};

// ## Chart.enableLegend
// Generates and renders the legend for the chart at a 
// given DOM location
//
//     element: the ID of the element
Chart.prototype.enableLegend = function(element) {
    this.legend = new Rickshaw.Graph.Legend({
        graph: this.graph,
        element: document.getElementById(element)
    });

    /*var order = new Rickshaw.Graph.Behavior.Series.Order( {
        graph: this.graph,
        legend: this.legend
    });*/

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: this.graph,
        legend: this.legend
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: this.graph,
        legend: this.legend
    });
}

// ## Chart.enableSmoother
// Enable the smoother at the given DOM location
//
//     smoother: the ID of smoother
Chart.prototype.enableSmoother = function(element) {
    this.smoother = new Rickshaw.Graph.Smoother({
        graph: this.graph,
        element: $('#' + element)
    });
}

// ## Chart.enableSlider
// Enable the slider at the given DOM location
//
//     slider: the ID of the slider
Chart.prototype.enableSlider = function(slider) {
    thisslider = new Rickshaw.Graph.RangeSlider( {
        graph: this.graph,
        element: $('#' + slider)
    });
}

// ## Chart.addData
// Work in progress...
Chart.prototype.addData = function(data) {
    
};

// ## Chart.enableZoom
// Work in progress...
Chart.prototype.enableZoom = function() {

};

// ## Chart.enableHover
// Enable the hover capability
Chart.prototype.enableHover = function() {
    this.hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: this.graph
    });
};