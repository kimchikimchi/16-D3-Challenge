// Set SVG width and height
const svgWidth = 960;
const svgHeight = 660;

// Set chart margins
const chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Calculating chart area with margins subtracted
const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Append svg tag along with dimensions
const svg = d3.select('body #scatter')
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
    healthData.forEach(row => {
        row.healthcare = +row.healthcare;
        row.poverty = +row.poverty;
    });
    
    // Configure linear scales for both axes
    const xScale = d3.scaleLinear()
        .domain(d3.extent(healthData, d => d.poverty))
        .range([0, chartWidth]);    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(healthData, d => d.healthcare))
        .range([chartHeight, 0]);
    
    // Create two new axes functions passing our scales in as arguments
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);
    chartGroup.append("g")
        .call(yAxis);
    
    // Adding tooltip
    const toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return `${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare Lacks: ${d.healthcare}%`;
        });
    chartGroup.call(toolTip);

    // See https://www.d3-graph-gallery.com/graph/scatter_basic.html
    chartGroup.selectAll('circle')
        .data(healthData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.poverty))
        .attr('cy', d => yScale(d.healthcare))
        .attr('r', 15)
        .classed('stateCircle', true)
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    //Add labels
    chartGroup.selectAll('text')
        .data(healthData)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.poverty)-11)
        .attr('y', d => yScale(d.healthcare)+5)
        .text(d => d.abbr)
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);;

    // Add axes labels
    chartGroup.append("text")
        .classed('aText', true)
        .attr("transform", `translate(${svgWidth / 2}, ${svgHeight -  chartMargin.top - 20})`)
        .text("In Poverty (%)");

    chartGroup.append('text')
        .classed('aText', true)
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - svgHeight/2 + 40)
        .attr('y', 0 - chartMargin.left + 40)
        .text("Lacks Healthcare (%)");

    
}).catch(error => {
    console.log(`Error encountered: ${error}`);
});
