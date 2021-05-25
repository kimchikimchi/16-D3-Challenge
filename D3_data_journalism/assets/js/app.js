const makeResponsive = function() {
    // Clear svg area if isn't empty
    const svgArea = d3.select('body').select('svg');
    if (!svgArea.empty()) {
        svgArea.remove();
    }
    
    // Get svg dimensions based on the current widow size
    // const svgWidth = window.innerWidith;
    // const svgHeight = window.innerHeight;
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
    const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
    
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
        healthData.forEach(row => {
            row.healthcare = +row.healthcare;
            row.poverty = +row.poverty;
            row.smokes = +row.smokes;
            row.age = +row.age;
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
        
        // See https://www.d3-graph-gallery.com/graph/scatter_basic.html
        chartGroup.selectAll('circle')
            .data(healthData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.poverty))
            .attr('cy', d => yScale(d.healthcare))
            .attr('r', 10)
            .style('fill', 'lightblue');
        
        // Add axes labels
        chartGroup.append("text")
            .classed('.aText', true)
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight + chartMargin.top + 20})`)
            .text("Testing");
        
    }).catch(error => {
        console.log(`Error encountered: ${error}`);
    });
}

// When the browser loads, makeResponsive() is called
makeResponsive();

// When the browser is resized, the same function is called
d3.select(window).on('resize', makeResponsive)