var data = [
  {
    'date': '1 May Wed', 'Received': 81, 'Sent': 43,
  },
  {
    'date': '2 May Thur', 'Received': 67, 'Sent': 37, 
  },
  {
    'date': '3 May Fri', 'Received': 72, 'Sent': 36, 
  },
  {
    'date': '4 May Sat', 'Received': 6, 'Sent': 0, 
  },
  {
    'date': '5 May Sun', 'Received': 5, 'Sent': 2, 
  },
  {
    'date': '6 May Mon', 'Received': 65, 'Sent': 37, 
  },
  {
    'date': '7 May Tue', 'Received': 79, 'Sent': 38, 
  },
  {
    'date': '8 May Wed', 'Received': 71, 'Sent': 41, 
  },
  {
    'date': '9 May Thu', 'Received': 79, 'Sent': 40, 
  },
  {
    'date': '10 May Fri', 'Received': 56, 'Sent': 36, 
  },
  {
    'date': '11 May Sat', 'Received': 2, 'Sent': 0, 
  },
  {
    'date': '12 May Sun', 'Received': 6, 'Sent': 2, 
  },
  {
    'date': '13 May Mon', 'Received': 64, 'Sent': 39, 
  },
  {
    'date': '14 May Tue', 'Received': 86, 'Sent': 48, 
  },
  {
    'date': '15 May Wed', 'Received': 57, 'Sent': 35, 
  },
  {
    'date': '16 May Thu', 'Received': 81, 'Sent': 30, 
  },
  {
    'date': '17 May Fri', 'Received': 57, 'Sent': 32, 
  },
  {
    'date': '18 May Sat', 'Received': 5, 'Sent': 0, 
  },
  {
    'date': '19 May Sun', 'Received': 1, 'Sent': 0, 
  },
  {
    'date': '20 May Mon', 'Received': 55, 'Sent': 31, 
  },
  {
    'date': '21 May Tue', 'Received': 82, 'Sent': 49, 
  },
  {
    'date': '22 May Wed', 'Received': 84, 'Sent': 49, 
  },
  {
    'date': '23 May Thu', 'Received': 72, 'Sent': 26, 
  },
  {
    'date': '24 May Fri', 'Received': 55, 'Sent': 32, 
  },
  {
    'date': '25 May Sat', 'Received': 8, 'Sent': 0, 
  },
  {
    'date': '26 May Sun', 'Received': 1, 'Sent': 0, 
  },
  {
    'date': '27 May Mon', 'Received': 45, 'Sent': 11, 
  },
  {
    'date': '28 May Tue', 'Received': 67, 'Sent': 45, 
  },
  {
    'date': '29 May Wed', 'Received': 77, 'Sent': 61, 
  },
  {
    'date': '30 May Thu', 'Received': 70, 'Sent': 39, 
  },
  {
    'date': '31 May Fri', 'Received': 62, 'Sent': 45, 
  }
];
var trendsText = {'Received': 'Emails Received', 'Sent': 'Emails Sent'};

// Setting graph dimensions
var margin = { top: 30, right: 330, bottom: 60, left: 80 },  
    svg = d3.select('svg'),
    width = +svg.attr('width') - margin.left - margin.right,
    height = +svg.attr('height') - margin.top - margin.bottom;
var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Setting the ranges and adjusting line colors
var x = d3.scaleBand().rangeRound([0, width]).paddingInner(20).paddingOuter(1),
    y = d3.scaleLinear().rangeRound([height, 0]),
    z = d3.scaleOrdinal(['orange','pink']);

// Defining line
var line = d3.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.total); });

// Scaling the range of the data
z.domain(d3.keys(data[0]).filter(function(key) {
  return key !== "date";
}));

var trends = z.domain().map(function(name) {
  return {
    name: name,
    values: data.map(function(d) {
      return {
        date: d.date,
        total: +d[name]
      };
    })
  };
});

x.domain(data.map(function(d) { return d.date; }));
y.domain([0, d3.max(trends, function(c) {
  return d3.max(c.values, function(v) {
    return v.total;
  });
})]);

// Adding legend
var legend = g.selectAll('g')
  .data(trends)
  .enter()
  .append('g')
  .attr('class', 'legend');

legend.append("rect")
  .attr('x', width - 370)
  .attr('y', function(d, i) { return height / 2 - (i + 1) * 20 - 170; })
  .attr('width', 35)
  .attr('height', 4)
  .style('fill', function(d) { return z(d.name); });

legend.append('text')
  .attr('x', width - 330)
  .attr('y', function(d, i) { return height / 2 - (i + 1) * 20  - 163; })
  .text(function(d) { return trendsText[d.name]; })
  .attr("font-size", 13);

legend.append('text')
  .attr('x', 1255)
  .attr('y', 0)
  .text("Legend")
  .attr('font-size', 14);

// Drawing out the line
var trend = g.selectAll(".trend")
  .data(trends)
  .enter()
  .append("g")
  .attr("class", "trend");

trend.append("path")
  .attr("class", "line")
  .attr("d", function(d) { return line(d.values); })
  .style("stroke", function(d) { return z(d.name); })
  .style("stroke-width", 4);

// Drawing empty value for each point
var points = g.selectAll('.points')
  .data(trends)
  .enter()
  .append('g')
  .attr('class', 'points')
  .append('text');

// Adding the circle
trend
  .style("fill", "#FFF")
  .style("stroke", function(d) { return z(d.name); })
  .selectAll("circle.line")
  .data(function(d){ return d.values })
  .enter()
  .append("circle")
  .attr("r", 6)
  .style("stroke-width", 3)
  .attr("stroke","black")
  .attr("cx", function(d) { return x(d.date); })
  .attr("cy", function(d) { return y(d.total); });

// Adding x axis
g.append("g")
  .attr("class", "axis axis-x")
  .attr("transform", "translate(0, " + height + ")")
  .call(d3.axisBottom(x))
  .selectAll(".tick text")
      .call(wrap, 50);

// Adding x axis label
  g.append("g")
      .attr("class","axis")
      .append("text")
      .attr("y", 510)
      .attr("x",825)
      .attr("x1", 625)
      .attr("dx", "-2em")
      .style("text-anchor", "middle")
      .text("Date")
      .style("font-size", "14px")
      .style("fill", "black")
      .style("font-weight", "bold");

// Wrapping text labels for x axis to show day of week on next row
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = .1,
        lineHeight = 1.3, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      // Width of 30 adjusted manually
      if (tspan.node().getComputedTextLength() > 35) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function type(d) {
  d.date = +d.date;
  return d;
}

// Adding y axis
g.append("g")
  .attr("class", "axis axis-y")
  .call(d3.axisLeft(y).ticks(10));

// Adding y axis label
  g.append("g")
      .attr("class","axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -15)
      .attr("x",-200)
      .attr("dy", "-2em")
      .style("text-anchor", "middle")
      .text("Number of Emails")
      .style("font-size", "14px")
      .style("fill", "black")
      .style("font-weight", "bold"); 

// Adding horizontal gridlines


var focus = g.append('g')
  .attr('class', 'focus')
  .style('display', 'none');

focus.append('line')
  .attr('class', 'x-hover-line hover-line')
  .attr('y1' , 0)
  .attr('y2', height);

svg.append('rect')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("class", "overlay")
  .attr("width", width)
  .attr("height", height)
  .on("mouseover", mouseover)
  .on("mouseout", mouseout)
  .on("mousemove", mousemove);

var dates = data.map(function(name) { return x(name.date); });

function mouseover() {
  focus.style("display", null);
  d3.selectAll('.points text').style("display", null);
}
function mouseout() {
  focus.style("display", "none");
  d3.selectAll('.points text').style("display", "none");
}
function mousemove() {
  var i = d3.bisect(dates, d3.mouse(this)[0], 1);
  var di = data[i-1];
  focus.attr("transform", "translate(" + x(di.date) + ",0)");
  d3.selectAll('.points text')
    .attr('x', function(d) { return x(di.date) + 13; })
    .attr('y', function(d) { return y(d.values[i-1].total); })
    .text(function(d) { return d.values[i-1].total; })
    .style("font-size", "14px")
    .style("font-weight", "bold") 
  var ratio = Math.round(di.Received/di.Sent)
    .attr("y", 380).attr("x", 1570)
    .text(function(d) {return ratio[i-1]})
    .format(".3f")
    .style("font-size", "13px")
};


// Adding on-click annotation for 1-May
 var note1 = svg.append("g")
    .append("circle")
    .attr("r", 4)     
    .attr("cx", 140)
    .attr("cy", 57)
    .style("fill", "red")
    .style("opacity", 0.9)
    .style("stroke", "white")
 // Making the annotation appear on-click
    .on("click", function (d) {
     note1.style("fill", "green")
     text1a = g.append('text')
       .text('Inbox spikes observed on Tues/Thurs')
       .attr('transform', 'translate(79,28)') 
       .style("font-size", "12px")
       text1b = g.append('text')
       .text('for first 3 weeks of May')
       .attr('transform', 'translate(79,43)') 
       .style("font-size", "12px")
   
 .on("click", remove())});

// Adding on-click annotation for 4-May
 var note2 = svg.append("g")
    .append("circle")
    .attr("r", 4)     
    .attr("cx", 287)
    .attr("cy", 490)
    .style("fill", "red")
    .style("opacity", 0.9)
    .style("stroke", "white")
 // Making the annotation appear on-click
    .on("click", function (d) {
     note2.style("fill", "green")
     text2a = g.append('text')
       .text('No emails sent on Saturdays')
       .attr('transform', 'translate(25,430)') 
       .style("font-size", "12px")
      text2b = g.append('text')
       .text('throughout month of May')
       .attr('transform', 'translate(30,445)') 
       .style("font-size", "12px")
  
 .on("click", remove())});

// Adding on-click annotation for 10-May
 var note3 = svg.append("g")
    .append("circle")
    .attr("r", 4)     
    .attr("cx", 581)
    .attr("cy", 297)
    .style("fill", "red")
    .style("opacity", 0.9)
    .style("stroke", "white")
 // Making the annotation appear on-click
    .on("click", function (d) {
     note3.style("fill", "green")
     text3a = g.append('text')
       .text('Low variability in week 2 send volume ')
       .attr('transform', 'translate(400,289)') 
       .style("font-size", "12px")
     text3b = g.append('text')
       .text('due to week-long workshop')
       .attr('transform', 'translate(430,304)') 
       .style("font-size", "12px")
   
 .on("click", remove())});

// Adding on-click annotation for 14-May
 var note4 = svg.append("g")
    .append("circle")
    .attr("r", 4)     
    .attr("cx", 777)
    .attr("cy", 30)
    .style("fill", "red")
    .style("opacity", 0.9)
    .style("stroke", "white")
 // Making the annotation appear on-click
    .on("click", function (d) {
     note4.style("fill", "green")
     text4a = g.append('text')
       .text('Spike due to high number')
       .attr('transform', 'translate(712,-6)') 
       .style("font-size", "12px")
      text4b = g.append('text')
       .text('of meetings on 14-May')
       .attr('transform', 'translate(714,9)') 
       .style("font-size", "12px")
  
 .on("click", remove())});

// Adding on-click annotation for 27-May
var note5 = svg.append("g")
    .append("circle")
    .attr("r", 4)     
    .attr("cx", 1414)
    .attr("cy", 431)
    .style("fill", "red")
    .style("opacity", 0.9)
    .style("stroke", "white")
 // Making the annotation appear on-click
    .on("click", function (d) {
     note5.style("fill", "green")
     text5a = g.append('text')
     .text('Low send volume due to')
    .attr('transform', 'translate(1350,403)')
      text5b = g.append('text')
      .text('27-May Memorial Day holiday')
      .attr('transform', 'translate(1350,418)') 
    .style("font-size", "12px")
    text2b.duration(2)
    text2b.display(none)});

// Adding on-click annotation for 29-May
 var note6 = svg.append("g")
    .append("circle")
    .attr("r", 4)     
    .attr("cx", 1512)
    .attr("cy", 164)
    .style("fill", "red")
    .style("opacity", 0.9)
    .style("stroke", "white")
 // Making the annotation appear on-click
    .on("click", function (d) {
     note6.style("fill", "green")
     text6a = g.append('text')
       .text('Max send volume corresponding')
       .attr('transform', 'translate(1230,135)') 
       .style("font-size", "12px")
     text6b = g.append('text')
       .text('to urgent deadline on 29-May')
       .attr('transform', 'translate(1239,150)') 
       .style("font-size", "12px")
   
 .on("click", function(d) {text4a.attr("display", "none")})
    });


// Adding Quick Stats Panel
// Adding on-click annotation for 29-May
 var quickstats = svg.append("g")
    .append("rect")   
    .attr("width", 170).attr("height", 30)
    .attr("x", 1700)
    .attr("y", 100)
    .style("fill", "red")
    .style("opacity", 0.5)
 // Making the annotation appear on-click
    .on("click", function (d) {
     quickstats.style("fill", "green")
     stat1 = g.append('text')
       .text('Avg emails received on weekdays: 69')
       .attr('transform', 'translate(1600,135)') 
       .style("font-size", "13px")
     stat2 = g.append('text')
       .text('Avg emails sent on weekdays: 38')
       .attr('transform', 'translate(1600,155)') 
       .style("font-size", "13px")
      stat3 = g.append('text')
       .text('Avg received-to-sent ratio highest on: Thu')
       .attr('transform', 'translate(1600,195)') 
       .style("font-size", "13px")
      stat5 = g.append('text')
       .text('Avg emails received peaks on: Wed')
       .attr('transform', 'translate(1600,235)') 
       .style("font-size", "13px")
      stat6 = g.append('text')
       .text('Avg emails sent peaks on: Wed')
       .attr('transform', 'translate(1600,255)') 
       .style("font-size", "13px")
       .style("font-style", "helvetica")
      

   
 .on("click", function(d) {text4a.attr("display", "none")})
    });

// Adding text
g.append('text')
  .attr('x', 1635)
  .attr('y', 91)
  .text("Click for Quick Stats!")
  .attr('font-size', 14);
