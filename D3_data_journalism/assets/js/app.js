// Define SVG area dimensions
const svgWidth = 960;
const svgHeight = 660;

// Set chart margins
const chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Calculating chart area with margins subtracted
const chartWidth = svgWidth - chartWidth.left - chartWidth.right;
const chartHeight = svgHeight - chartWidth.top - chartWidth.bottom;

// Append svg tag along with dimensions
const svg = d3.select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

// Shift the avg group by left and top margins
const chartGroup = svg.append('g')
    .attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load the CSV file
d3.csv('assets/data/data.csv').then(healthData => {
    console.log(healthData);

    // Convert numeric fields from string type to integers
    healthData.forEach(data => {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

}).catch(error => {
    console.log(`Error encountered: ${error}`);
});