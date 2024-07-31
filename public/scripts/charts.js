
let dailyRevenueCurrentIndex = 0;
    const dailyRevenuePageSize = 7;
    let stats = {};

    async function fetchOrderStats() {
      const response = await fetch('/getOrderStats');
      const stats = await response.json();
      return stats;
    }

    function updateDailyChart(data, chartId, xLabel, yLabel, xFormat, currentIndex, pageSize, titleId) {
      // Clear the existing chart
      d3.select(chartId).select("svg").remove();

      // Get the subset of data for the current page
      const paginatedData = data.slice(currentIndex, currentIndex + pageSize);

      createBarChart(paginatedData, chartId, xLabel, yLabel, xFormat);

      // Update the title with the current date range
      if (titleId) {
        const startDate = new Date(paginatedData[0][xLabel]);
        const endDate = new Date(paginatedData[paginatedData.length - 1][xLabel]);
        const dateRangeText = `Showing data from ${d3.timeFormat("%Y-%m-%d")(startDate)} to ${d3.timeFormat("%Y-%m-%d")(endDate)}`;
        d3.select(titleId).text(dateRangeText);
      }
    }

    function createBarChart(data, chartId, xLabel, yLabel, xFormat) {
      const svg = d3.select(chartId).append("svg")
        .attr("width", 1000)
        .attr("height", 500);
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = +svg.attr("width") - margin.left - margin.right;
      const height = +svg.attr("height") - margin.top - margin.bottom;
      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand().rangeRound([0, width]).padding(0.5);
      const y = d3.scaleLinear().rangeRound([height, 0]);

      if (xFormat) {
        data.forEach(d => {
          d[xLabel] = xFormat(d[xLabel]);
        });
      }

      x.domain(data.map(d => d[xLabel]));
      y.domain([0, d3.max(data, d => d[yLabel])]);

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "s"))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(yLabel);

      // Tooltip setup
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[xLabel]))
        .attr("y", d => y(d[yLabel]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[yLabel]))
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "#0E1A40"); // Ravenclaw blue
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(`${xLabel}: ${d[xLabel]}<br>${yLabel}: ${d[yLabel]}`)
            .style("background", "#0E1A40") // Ravenclaw blue
            .style("color", "#EEE117") // Hufflepuff yellow
            .style("border-color", "#000") // Black border
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
          d3.select(this).attr("fill", "#740001"); // Reset to Gryffindor red
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    }

    async function renderCharts() {
      stats = await fetchOrderStats();

      // Initial rendering of the daily chart with pagination
      updateDailyChart(stats.dailyRevenue, "#dailyRevenueChart", 'date', 'revenue', d => d3.timeFormat("%Y-%m-%d")(new Date(d)), dailyRevenueCurrentIndex, dailyRevenuePageSize, "#dailyRevenueTitle");

      // Rendering the other charts without pagination
      createBarChart(stats.monthlyRevenue, "#monthlyRevenueChart", 'month', 'revenue', d => d);
    //   createBarChart(stats.yearlyRevenue, "#yearlyRevenueChart", 'month', 'revenue', d => d);
      createBarChart(stats.categorySales, "#categorySalesChart", 'category', 'totalRevenue');
      createBarChart(stats.regionalSales, "#regionalSalesChart", 'region', 'revenue');
    }

    // Event listeners for navigation buttons for daily chart
    document.getElementById("prevDaily").addEventListener("click", () => {
      if (dailyRevenueCurrentIndex > 0) {
        dailyRevenueCurrentIndex -= dailyRevenuePageSize;
        updateDailyChart(stats.dailyRevenue, "#dailyRevenueChart", 'date', 'revenue', d => d3.timeFormat("%Y-%m-%d")(new Date(d)), dailyRevenueCurrentIndex, dailyRevenuePageSize, "#dailyRevenueTitle");
      }
    });

    document.getElementById("nextDaily").addEventListener("click", () => {
      if (dailyRevenueCurrentIndex + dailyRevenuePageSize < stats.dailyRevenue.length) {
        dailyRevenueCurrentIndex += dailyRevenuePageSize;
        updateDailyChart(stats.dailyRevenue, "#dailyRevenueChart", 'date', 'revenue', d => d3.timeFormat("%Y-%m-%d")(new Date(d)), dailyRevenueCurrentIndex, dailyRevenuePageSize, "#dailyRevenueTitle");
      }
    });

    // Initial call to render the charts
    renderCharts();