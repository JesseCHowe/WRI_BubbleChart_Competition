/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */

function bubbleChart() {
  // Constants for sizing
  var width = 1200;
  var height = 1000;

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip("gates_tooltip", 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = {
    x: width / 2.5,
    y: height / 2
  };
  /*var countrytt = d3.select('#country_tooltip_container')
    .append('div')
    .attr('class', 'country_tooltip')
    .attr('id', "countrytooltipId")

  .style("width","200px")
  .style("height","200px")
  .style("background","gray")
    countrytt.html("TEST");*/
  var totaltt = d3
    .select("#total_container")
    .append("div")
    .attr("class", "total_tooltip")
    .attr("id", "totaltooltipId")
    .style("width", "100%")
    .style("height", "50px");
  totaltt.html("<p>Total Emissions for 2013:</p><h1>34389 MtCO2e</h1>");
  var emphasis = {
    Amputate: {
      x: 200,
      y: 310
    },
    Chemnep: {
      x: 400,
      y: 270
    },
    Chrome6: {
      x: 600,
      y: 250
    },
    Dustexpl: {
      x: 800,
      y: 250
    },
    Lead: {
      x: 1000,
      y: 270
    },
    none: {
      x: -5000,
      y: 220
    },
    Silica: {
      x: 400,
      y: 520
    },
    Svep: {
      x: 600,
      y: 520
    },
    Trench: {
      x: 800,
      y: 550
    }
  };
  // X locations of the year titles.

  // @v4 strength to apply to the position forces
  var forceStrength = 0.05;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var bubbles2 = null;
  var bubblesindus = null;
  var bubblesagri = null;
  var bubbleswaste = null;
  var bubbleselec = null;
  var bubblesmanu = null;
  var bubblestrans = null;
  var bubblesother = null;
  var bubblesfug = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -Math.pow(d.totalGHG2013, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3
    .forceSimulation()
    .velocityDecay(0.2)
    .force("x", d3.forceX().strength(forceStrength).x(center.x))
    .force("y", d3.forceY().strength(forceStrength).y(center.y))
    .force("charge", d3.forceManyBody().strength(charge))
    .on("tick", ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3
    .scaleOrdinal()
    .domain([])
    .range(["#a2727e", "#ffe56a", "#f7b883", "#ec8080", "#b6afd2"]);
  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */ var compareCirc = d3
    .select("#vis")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 1050)
    .append("circle")
    .attr("cx", width / 2.5)
    .attr("cy", height / 2)
    .attr("r", 420)
    .style("opacity", 0)
    .style("fill", "none")
    .style("stroke", "purple");
  var countryMenu = d3.select("select .select").on("change", countryFocus);

  function countryFocus() {
    var selectedCountry = $("#countrySelection").val();
    var energytestone = $("#energySelection").val();
    /*countrytt.html(function (d) { return selectedCountry ; });*/
    d3
      .selectAll(".bubble")
      .transition()
      .duration(500)
    .style("stroke", "rgba(0,0,0,0.35)")
      .style("fill", "rgba(240,240,240,0.15)");

    if (energytestone == "all") {
      if(selectedCountry == "Select_Country"){
      d3
        .selectAll(".bubble")
        .transition()
        .duration(500)
        .style("fill", "#C68EFF");

      }else{
              d3
        .selectAll(".energy")
        .transition()
        .duration(500)
        .style("fill", "rgba(240,240,240,0.15)");
      d3
        .selectAll("#" + selectedCountry)
        .transition()
        .duration(500)
        .style("fill", "orange");
      d3
        .selectAll("#" + selectedCountry + "energy")
        .transition()
        .duration(500)
        .style("fill", "orange");
      }
    } else {
      if(selectedCountry == "Select_Country"){
      d3
        .selectAll(".energy")
        .transition()
        .duration(500)
        .style("fill", "#C68EFF");

    }else{
            d3
        .selectAll(".energy")
        .transition()
        .duration(1000)
        .style("fill", "#C68EFF");

      d3
        .selectAll("#" + selectedCountry + "energy")
        .transition()
        .duration(1000)
        .style("fill", "orange");
    }
    }
    d3.selectAll("#" + selectedCountry).moveToFront();
    d3.selectAll("#" + selectedCountry + "energy").moveToFront();
  }
  d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
      this.parentNode.appendChild(this);
    });
  };

  var energyMenu = d3.select("#energyMenu select").on("change", showEnergy);
  function showEnergy() {
    var energytestone = $("#energySelection").val();
    var selectedCountry = $("#countrySelection").val();
    var testone = $("#yearSelection").val().replace("y", "");
    var anothertest = "electric" + testone;
    console.log(anothertest);
    if (selectedCountry == "Select_Country") {
      if (energytestone == "all") {
        document.getElementById("GHG").disabled = false;
        d3.selectAll(".bubble").attr("pointer-events", "null");
        d3.selectAll(".bubble2").on("mouseover", showDetailall);
        $("option[class=noghg]").prop("disabled", false);
        var energytestone = $("#energySelection").val();
        bubbles.transition().duration(1000).style("fill", "#C68EFF");
        bubbles2.transition().duration(1000).style("opacity", 0);
      } else if (energytestone == "energy") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailenergy);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var energyvalue = "energy" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[energyvalue];
          });
      } else if (energytestone == "industrial") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailindustrial);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var industrialvalue = "industrial" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[industrialvalue];
          });
      } else if (energytestone == "agriculture") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailagriculture);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var agriculturalvalue = "agricultural" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
            .attr("r", function(d) {
            return d[agriculturalvalue];
          });
      } else if (energytestone == "waste") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailwaste);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var wastevalue = "waste" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
           .attr("r", function(d) {
            return d[wastevalue];
          });
      } else if (energytestone == "electric") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailelectric);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var electricval = "electric" + testone;
        console.log(electricval);
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[electricval];
          });
      } else if (energytestone == "manufract") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailmanufacturing);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var manufactval = "manufract" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
            .attr("r", function(d) {
            return d[manufactval];
          });
      } else if (energytestone == "transport") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailtransport);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var transportval = "transport" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
            .attr("r", function(d) {
            return d[transportval];
          });
      } else if (energytestone == "other") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailother);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var otherval = "other" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
            .attr("r", function(d) {
            return d[otherval];
          });
      } else if (energytestone == "fugitive") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailfugitive);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
         var fugitiveval = "fugitive" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
           .attr("r", function(d) {
            return d[fugitiveval];
          });
      }
    } else {
      if (energytestone == "all") {
        document.getElementById("co2").disabled = false;
        d3.selectAll(".bubble").attr("pointer-events", "null");
        d3.selectAll(".bubble2").attr("pointer-events", "none");
        //d3.selectAll(".bubble").attr("pointer-events", "null");
        bubbles2.on("mouseover", showDetailall).style("opacity", 0);


        $("option[class=noghg]").prop("disabled", false);
        var energytestone = $("#energySelection").val();
        var totalghgValue = "totalGHG" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");
        bubbles
          .transition()
          .duration(1000)
          .style("fill", "rgba(0,0,0,0)")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[totalghgValue];
          });
        d3
          .selectAll("#" + selectedCountry)
          .transition()
          .duration(1000)
          .style("fill", "orange");
      } else if (energytestone == "energy") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailenergy);
        $("option[class=noghg]").prop("disabled", true);
        var energytestone = $("#energySelection").val();
        var energyvalue = "energy" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[energyvalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[energyvalue];
          });
      } else if (energytestone == "industrial") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailindustrial);
        $("option[class=noghg]").prop("disabled", true);
        var industrialvalue = "industrial" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[industrialvalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[industrialvalue];
          });
      } else if (energytestone == "agriculture") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailagriculture);
        $("option[class=noghg]").prop("disabled", true);
        var agriculturevalue = "agricultural" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[agriculturevalue];
          });

        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[agriculturevalue];
          });
      } else if (energytestone == "waste") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailwaste);
        $("option[class=noghg]").prop("disabled", true);
        var wastevalue = "waste" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[wastevalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[wastevalue];
          });
      } else if (energytestone == "electric") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailelectric);
        $("option[class=noghg]").prop("disabled", true);
        var electricvalue = "electric" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[electricvalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[electricvalue];
          });
      } else if (energytestone == "manufract") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailmanufacturing);
        $("option[class=noghg]").prop("disabled", true);
        var manufacturevalue = "manufract" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[manufacturevalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[manufacturevalue];
          });
      } else if (energytestone == "transport") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailtransport);
        $("option[class=noghg]").prop("disabled", true);
        var transportvalue = "transport" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[transportvalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[transportvalue];
          });
      } else if (energytestone == "other") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailother);
        $("option[class=noghg]").prop("disabled", true);
        var othervalue = "other" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[othervalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[othervalue];
          });
      } else if (energytestone == "fugitive") {
        document.getElementById("co2").disabled = true;
        d3.selectAll(".bubble").attr("pointer-events", "none");
        bubbles2.on("mouseover", showDetailfugitive);
        $("option[class=noghg]").prop("disabled", true);
        var fugitivevalue = "fugitive" + testone;
        bubbles.transition().duration(1000).style("fill", "rgba(0,0,0,0)");

        bubbles2
          .transition()
          .duration(1000)
          .style("fill", "#C68EFF")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[fugitivevalue];
          });
        d3
          .selectAll("#" + selectedCountry + "energy")
          .transition()
          .duration(1000)
          .style("fill", "orange")
          .style("opacity", 1)
          .attr("r", function(d) {
            return d[fugitivevalue];
          });
      }
    }
  }

  var yearMenu = d3.select("#yearMenu select").on("change", splitUnionBubbles);

  function splitUnionBubbles() {
    var testone = $("#yearSelection").val();
    var testthree = $("#yearSelection").val().replace("y", "");
    var totalGHG = "totalGHG" + testthree;
    var agrivalue = "agricultural" + testthree;
    var indusvalue = "industrial" + testthree;
    var wastevalue = "waste" + testthree;
    var elecvalue = "electric" + testthree;
    var manuvalue = "manufract" + testthree;
    var transvalue = "transport" + testthree;
    var othervalue = "other" + testthree;
    var fugitivevalue = "fugitive" + testthree;
    console.log(totalGHG);
    var yearid = $('select[id="yearSelection"] :selected').attr("id");
    var energy = "energ" + $("#yearSelection").val();
    totaltt.html(
      "<p>Total Emissions for " +
        testone.replace("y", "") +
        ":</p><h1>" +
        yearid.replace("w", "") +
        " MtCO2e</h1>"
    );
    var testnumber = Number(testone.replace("y", ""));
    if (testnumber < 1990) {
      $("#energySelection").val("all");
      document.getElementById("GHG").disabled = true;
      document.getElementById("energySelection").disabled = true;
    } else {
      document.getElementById("energySelection").disabled = false;
      document.getElementById("GHG").disabled = false;
    }

    if (testnumber == 2013) {
      compareCirc.transition().duration(1000).style("opacity", 0);
    } else {
      compareCirc.transition().duration(1000).style("opacity", 1);
    }

    //console.log(testnumber)
    var testwo = $('select[id="yearSelection"] :selected').attr("class");

    function createNodes(rawData) {
      var maxAmount2 = d3.max(rawData, function(d) {
        return +d[testone];
      });
      var minAmount2 = d3.min(rawData, function(d) {
        return +d[testone];
      });
      var radiusScale2 = d3
        .scalePow()
        .exponent(0.5)
        .range([0, maxAmount2])
        .domain([minAmount2, maxAmount2]);
    }
    function charge2(d) {
      if($("#GHG").hasClass("active")){
      return -Math.pow(d[totalGHG], 2.0) * forceStrength;
    }else{
      return -Math.pow(d[testone], 2.0) * forceStrength;
    }
    }

    var simulation2 = d3
      .forceSimulation()
      .velocityDecay(0.2)
      .force("x", d3.forceX().strength(forceStrength).x(center.x))
      .force("y", d3.forceY().strength(forceStrength).y(center.y))
      .force("charge", d3.forceManyBody().strength(charge2))
      .on("tick", ticked);
    simulation2.force("x", d3.forceX().strength(forceStrength).x(center.x));
    simulation2.force("y", d3.forceY().strength(forceStrength).y(center.y));
    simulation2.nodes(nodes);
    simulation2.alpha(1).restart();
    bubbles.transition().duration(500).attr("r", function(d) {
      if ($("#GHG").hasClass("active")) {
        return d[totalGHG];
      } else {
        return d[testone];
      }

      bubbles2
        .transition()
        .duration(500)
        .style("opacity", 0)
        .attr("r", function(d) {
          if (energy === "energy2000") {
            return 0;
          } else {
            return d[energy];
          }
        });

      bubblesindus.transition().duration(500).attr("r", function(d) {
        return d[indusvalue];
      });
      bubblesagri.transition().duration(500).attr("r", function(d) {
        return d[agrivalue];
      });
      bubbleswaste.transition().duration(500).attr("r", function(d) {
        return d[wastevalue];
      });
      bubbleselec.transition().duration(500).attr("r", function(d) {
        return d[elecvalue];
      });
      bubblesmanu.transition().duration(500).attr("r", function(d) {
        return d[manuvalue];
      });
      bubblestrans.transition().duration(500).attr("r", function(d) {
        return d[transvalue];
      });
      bubblesother.transition().duration(500).attr("r", function(d) {
        return d[othervalue];
      });
      bubblesfug.transition().duration(500).attr("r", function(d) {
        return d[fugitivevalue];
      });

      d3.selectAll(".bubble").on("mouseover", showDetail2);
      function showDetail2(d) {
        // change outline to indicate hover state.
        d3.select(this).attr("stroke", "black");

        var content2 =
          '<div><p class="name">' +
          d.energy2012text +
          "</p>" +
          '<p class="amount" style="color:' +
          d3.rgb(fillColor(d.status)) +
          ';">' +
          addCommas(d.value4) +
          "</p>" +
          "</div>";

        tooltip.showTooltip(content2, d3.event);
      }
    });
  }
  function createNodes(rawData) {
    document.getElementById("GHG").onclick = function() {
      GHGFunction();
    };

    function GHGFunction() {
      $("#GHG").addClass("active");
      var testone = $("#yearSelection").val().replace("y", "");
      var totalGHG = "totalGHG" + testone;
      //Testing Force
      document.getElementById("energySelection").disabled = false;
      function charge2(d) {
        return -Math.pow(d[totalGHG], 2.0) * forceStrength;
      }
      var simulation2 = d3
        .forceSimulation()
        .velocityDecay(0.2)
        .force("x", d3.forceX().strength(forceStrength).x(center.x))
        .force("y", d3.forceY().strength(forceStrength).y(center.y))
        .force("charge", d3.forceManyBody().strength(charge2))
        .on("tick", ticked);
      simulation2.force("x", d3.forceX().strength(forceStrength).x(center.x));
      simulation2.force("y", d3.forceY().strength(forceStrength).y(center.y));
      simulation2.nodes(nodes);
      simulation2.alpha(1).restart();
      ///
      $("option[class=noghg]").prop("disabled", true);
      bubbles.transition().duration(500).attr("r", function(d) {
        return d[totalGHG];
      });
    }
    $("#GHG").hasClass("active");
    document.getElementById("co2").onclick = function() {
      co2Function();
    };
    function co2Function() {
      $("#GHG").removeClass("active");
      var testone = $("#yearSelection").val();

      document.getElementById("energySelection").disabled = true;
      function charge2(d) {
        return -Math.pow(d[testone], 2.0) * forceStrength;
      }
      var simulation2 = d3
        .forceSimulation()
        .velocityDecay(0.2)
        .force("x", d3.forceX().strength(forceStrength).x(center.x))
        .force("y", d3.forceY().strength(forceStrength).y(center.y))
        .force("charge", d3.forceManyBody().strength(charge2))
        .on("tick", ticked);
      simulation2.force("x", d3.forceX().strength(forceStrength).x(center.x));
      simulation2.force("y", d3.forceY().strength(forceStrength).y(center.y));
      simulation2.nodes(nodes);
      $("option[class=noghg]").prop("disabled", false);
      bubbles.transition().duration(500).attr("r", function(d) {
        return d[testone];
      });
    }
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    /////////////////////////////////////////////////////////////////////////////////////////
    var select2 = d3
      .select("#yearMenu")
      .append("select")
      .attr("id", "yearSelection")
      .attr("class", "form-control")
      .on("change", splitUnionBubbles);

    var options2 = select2
      .selectAll("option")
      .data(rawData)
      .enter()
      .append("option")
      .text(function(d) {
        return d.year;
      })
      .attr("value", function(d) {
        return "y" + d.year;
      })
      .attr("id", function(d) {
        return "w" + Math.ceil(d.World);
      })
      .attr("class", function(d) {
        if (+d.year > 1989) {
          return "withghg";
        } else {
          return "noghg";
        }
      })
      .filter(function() {
        return (
          !this.value ||
          $.trim(this.value).length == 0 ||
          $.trim(this.text).length == 0
        );
      })
      .remove();
    $("option[class=noghg]").prop("disabled", true);
    var select = d3
      .select("#countryMenu")
      .append("select")
      .attr("class", "select form-control")
      .attr("id", "countrySelection")
      .on("change", countryFocus);

    var options = select
      .selectAll("option")
      .data(rawData)
      .enter()
      .append("option")
      .attr("value", function(d) {
        return d.country.split(" ").join("_");
      })
      .text(function(d) {
        return d.country;
      });
      $('select option[value="Select_Country"]').attr("selected",true);
    var maxAmount = d3.max(rawData, function(d) {
      return +d.y2010;
    });
    var minAmount = d3.min(rawData, function(d) {
      return +d.y2010;
    });
    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    var radiusScale = d3
      .scalePow()
      .exponent(0.5)
      .range([minAmount / 50, maxAmount / 50])
      .domain([minAmount, maxAmount]);
    /*var maxAmount2 = d3.max(rawData, function(d) {
      return +d.y1990;
    });
 /*        var minAmount2 = d3.min(rawData, function(d) {
      return +d.y1990;
    });
    var radiusScale2 = d3.scalePow()
      .exponent(0.5)
      .range([0, 50])
      .domain([minAmount2, maxAmount2]);
    console.log(maxAmount)
    console.log(maxAmount2)*/

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function(d) {
      console.log(d.world);
      return {
        id: d.country,
        radius: radiusScale(+d.y2010),
        value: +d.y2010,
        year: d.year,
        world: Math.ceil(d.World),
        y1850: radiusScale(+d.y1850),
        y1851: radiusScale(+d.y1851),
        y1852: radiusScale(+d.y1852),
        y1853: radiusScale(+d.y1853),
        y1854: radiusScale(+d.y1854),
        y1855: radiusScale(+d.y1855),
        y1856: radiusScale(+d.y1856),
        y1857: radiusScale(+d.y1857),
        y1858: radiusScale(+d.y1858),
        y1859: radiusScale(+d.y1859),
        y1860: radiusScale(+d.y1860),
        y1861: radiusScale(+d.y1861),
        y1862: radiusScale(+d.y1862),
        y1863: radiusScale(+d.y1863),
        y1864: radiusScale(+d.y1864),
        y1865: radiusScale(+d.y1865),
        y1866: radiusScale(+d.y1866),
        y1867: radiusScale(+d.y1867),
        y1868: radiusScale(+d.y1868),
        y1869: radiusScale(+d.y1869),
        y1870: radiusScale(+d.y1870),
        y1871: radiusScale(+d.y1871),
        y1872: radiusScale(+d.y1872),
        y1873: radiusScale(+d.y1873),
        y1874: radiusScale(+d.y1874),
        y1875: radiusScale(+d.y1875),
        y1876: radiusScale(+d.y1876),
        y1877: radiusScale(+d.y1877),
        y1878: radiusScale(+d.y1878),
        y1879: radiusScale(+d.y1879),
        y1880: radiusScale(+d.y1880),
        y1881: radiusScale(+d.y1881),
        y1882: radiusScale(+d.y1882),
        y1883: radiusScale(+d.y1883),
        y1884: radiusScale(+d.y1884),
        y1885: radiusScale(+d.y1885),
        y1886: radiusScale(+d.y1886),
        y1887: radiusScale(+d.y1887),
        y1888: radiusScale(+d.y1888),
        y1889: radiusScale(+d.y1889),
        y1890: radiusScale(+d.y1890),
        y1891: radiusScale(+d.y1891),
        y1892: radiusScale(+d.y1892),
        y1893: radiusScale(+d.y1893),
        y1894: radiusScale(+d.y1894),
        y1895: radiusScale(+d.y1895),
        y1896: radiusScale(+d.y1896),
        y1897: radiusScale(+d.y1897),
        y1898: radiusScale(+d.y1898),
        y1899: radiusScale(+d.y1899),
        y1900: radiusScale(+d.y1900),
        y1901: radiusScale(+d.y1901),
        y1902: radiusScale(+d.y1902),
        y1903: radiusScale(+d.y1903),
        y1904: radiusScale(+d.y1904),
        y1905: radiusScale(+d.y1905),
        y1906: radiusScale(+d.y1906),
        y1907: radiusScale(+d.y1907),
        y1908: radiusScale(+d.y1908),
        y1909: radiusScale(+d.y1909),
        y1910: radiusScale(+d.y1910),
        y1911: radiusScale(+d.y1911),
        y1912: radiusScale(+d.y1912),
        y1913: radiusScale(+d.y1913),
        y1914: radiusScale(+d.y1914),
        y1915: radiusScale(+d.y1915),
        y1916: radiusScale(+d.y1916),
        y1917: radiusScale(+d.y1917),
        y1918: radiusScale(+d.y1918),
        y1919: radiusScale(+d.y1919),
        y1920: radiusScale(+d.y1920),
        y1921: radiusScale(+d.y1921),
        y1922: radiusScale(+d.y1922),
        y1923: radiusScale(+d.y1923),
        y1924: radiusScale(+d.y1924),
        y1925: radiusScale(+d.y1925),
        y1926: radiusScale(+d.y1926),
        y1927: radiusScale(+d.y1927),
        y1928: radiusScale(+d.y1928),
        y1929: radiusScale(+d.y1929),
        y1930: radiusScale(+d.y1930),
        y1931: radiusScale(+d.y1931),
        y1932: radiusScale(+d.y1932),
        y1933: radiusScale(+d.y1933),
        y1934: radiusScale(+d.y1934),
        y1935: radiusScale(+d.y1935),
        y1936: radiusScale(+d.y1936),
        y1937: radiusScale(+d.y1937),
        y1938: radiusScale(+d.y1938),
        y1939: radiusScale(+d.y1939),
        y1940: radiusScale(+d.y1940),
        y1941: radiusScale(+d.y1941),
        y1942: radiusScale(+d.y1942),
        y1943: radiusScale(+d.y1943),
        y1944: radiusScale(+d.y1944),
        y1945: radiusScale(+d.y1945),
        y1946: radiusScale(+d.y1946),
        y1947: radiusScale(+d.y1947),
        y1948: radiusScale(+d.y1948),
        y1949: radiusScale(+d.y1949),
        y1950: radiusScale(+d.y1950),
        y1951: radiusScale(+d.y1951),
        y1952: radiusScale(+d.y1952),
        y1953: radiusScale(+d.y1953),
        y1954: radiusScale(+d.y1954),
        y1955: radiusScale(+d.y1955),
        y1956: radiusScale(+d.y1956),
        y1957: radiusScale(+d.y1957),
        y1958: radiusScale(+d.y1958),
        y1959: radiusScale(+d.y1959),
        y1960: radiusScale(+d.y1960),
        y1961: radiusScale(+d.y1961),
        y1962: radiusScale(+d.y1962),
        y1963: radiusScale(+d.y1963),
        y1964: radiusScale(+d.y1964),
        y1965: radiusScale(+d.y1965),
        y1966: radiusScale(+d.y1966),
        y1967: radiusScale(+d.y1967),
        y1968: radiusScale(+d.y1968),
        y1969: radiusScale(+d.y1969),
        y1970: radiusScale(+d.y1970),
        y1971: radiusScale(+d.y1971),
        y1972: radiusScale(+d.y1972),
        y1973: radiusScale(+d.y1973),
        y1974: radiusScale(+d.y1974),
        y1975: radiusScale(+d.y1975),
        y1976: radiusScale(+d.y1976),
        y1977: radiusScale(+d.y1977),
        y1978: radiusScale(+d.y1978),
        y1979: radiusScale(+d.y1979),
        y1980: radiusScale(+d.y1980),
        y1981: radiusScale(+d.y1981),
        y1982: radiusScale(+d.y1982),
        y1983: radiusScale(+d.y1983),
        y1984: radiusScale(+d.y1984),
        y1985: radiusScale(+d.y1985),
        y1986: radiusScale(+d.y1986),
        y1987: radiusScale(+d.y1987),
        y1988: radiusScale(+d.y1988),
        y1989: radiusScale(+d.y1989),
        y1990: radiusScale(+d.y1990),
        y1991: radiusScale(+d.y1991),
        y1992: radiusScale(+d.y1992),
        y1993: radiusScale(+d.y1993),
        y1994: radiusScale(+d.y1994),
        y1995: radiusScale(+d.y1995),
        y1996: radiusScale(+d.y1996),
        y1997: radiusScale(+d.y1997),
        y1998: radiusScale(+d.y1998),
        y1999: radiusScale(+d.y1999),
        y2000: radiusScale(+d.y2000),
        y2001: radiusScale(+d.y2001),
        y2002: radiusScale(+d.y2002),
        y2003: radiusScale(+d.y2003),
        y2004: radiusScale(+d.y2004),
        y2005: radiusScale(+d.y2005),
        y2006: radiusScale(+d.y2006),
        y2007: radiusScale(+d.y2007),
        y2008: radiusScale(+d.y2008),
        y2009: radiusScale(+d.y2009),
        y2010: radiusScale(+d.y2010),
        y2011: radiusScale(+d.y2011),
        y2012: radiusScale(+d.y2012),
        y2013: radiusScale(+d.y2013),
        y2014: radiusScale(+d.y2014),
        y2015: radiusScale(+d.y2015),
        y2016: radiusScale(+d.y2016),
        y2017: radiusScale(+d.y2017),
        radius2: radiusScale(+d.y2005),
        radius3: radiusScale(+d.y2000),
        radius4: radiusScale(+d.y1990),
        totalGHG1990: radiusScale(+d.totalGHG1990),
        totalGHG1991: radiusScale(+d.totalGHG1991),
        totalGHG1992: radiusScale(+d.totalGHG1992),
        totalGHG1993: radiusScale(+d.totalGHG1993),
        totalGHG1994: radiusScale(+d.totalGHG1994),
        totalGHG1995: radiusScale(+d.totalGHG1995),
        totalGHG1996: radiusScale(+d.totalGHG1996),
        totalGHG1997: radiusScale(+d.totalGHG1997),
        totalGHG1998: radiusScale(+d.totalGHG1998),
        totalGHG1999: radiusScale(+d.totalGHG1999),
        totalGHG2000: radiusScale(+d.totalGHG2000),
        totalGHG2001: radiusScale(+d.totalGHG2001),
        totalGHG2002: radiusScale(+d.totalGHG2002),
        totalGHG2003: radiusScale(+d.totalGHG2003),
        totalGHG2004: radiusScale(+d.totalGHG2004),
        totalGHG2005: radiusScale(+d.totalGHG2005),
        totalGHG2006: radiusScale(+d.totalGHG2006),
        totalGHG2007: radiusScale(+d.totalGHG2007),
        totalGHG2008: radiusScale(+d.totalGHG2008),
        totalGHG2009: radiusScale(+d.totalGHG2009),
        totalGHG2010: radiusScale(+d.totalGHG2010),
        totalGHG2011: radiusScale(+d.totalGHG2011),
        totalGHG2012: radiusScale(+d.totalGHG2012),
        totalGHG2013: radiusScale(+d.totalGHG2013),
        energy1990: radiusScale(+d.energy1990),
        energy1991: radiusScale(+d.energy1991),
        energy1992: radiusScale(+d.energy1992),
        energy1993: radiusScale(+d.energy1993),
        energy1994: radiusScale(+d.energy1994),
        energy1995: radiusScale(+d.energy1995),
        energy1996: radiusScale(+d.energy1996),
        energy1997: radiusScale(+d.energy1997),
        energy1998: radiusScale(+d.energy1998),
        energy1999: radiusScale(+d.energy1999),
        energy2000: radiusScale(+d.energy2000),
        energy2001: radiusScale(+d.energy2001),
        energy2002: radiusScale(+d.energy2002),
        energy2003: radiusScale(+d.energy2003),
        energy2004: radiusScale(+d.energy2004),
        energy2005: radiusScale(+d.energy2005),
        energy2006: radiusScale(+d.energy2006),
        energy2007: radiusScale(+d.energy2007),
        energy2008: radiusScale(+d.energy2008),
        energy2009: radiusScale(+d.energy2009),
        energy2010: radiusScale(+d.energy2010),
        energy2011: radiusScale(+d.energy2011),
        energy2012: radiusScale(+d.energy2012),
        energy2013: radiusScale(+d.energy2013),
        textenergy1990: +d.energy1990,
        textenergy1991: +d.energy1991,
        textenergy1992: +d.energy1992,
        textenergy1993: +d.energy1993,
        textenergy1994: +d.energy1994,
        textenergy1995: +d.energy1995,
        textenergy1996: +d.energy1996,
        textenergy1997: +d.energy1997,
        textenergy1998: +d.energy1998,
        textenergy1999: +d.energy1999,
        textenergy2000: +d.energy2000,
        textenergy2001: +d.energy2001,
        textenergy2002: +d.energy2002,
        textenergy2003: +d.energy2003,
        textenergy2004: +d.energy2004,
        textenergy2005: +d.energy2005,
        textenergy2006: +d.energy2006,
        textenergy2007: +d.energy2007,
        textenergy2008: +d.energy2008,
        textenergy2009: +d.energy2009,
        textenergy2010: +d.energy2010,
        textenergy2011: +d.energy2011,
        textenergy2012: +d.energy2012,
        textenergy2013: +d.energy2013,
        industrial1990: radiusScale(+d.industrial1990),
        industrial1991: radiusScale(+d.industrial1991),
        industrial1992: radiusScale(+d.industrial1992),
        industrial1993: radiusScale(+d.industrial1993),
        industrial1994: radiusScale(+d.industrial1994),
        industrial1995: radiusScale(+d.industrial1995),
        industrial1996: radiusScale(+d.industrial1996),
        industrial1997: radiusScale(+d.industrial1997),
        industrial1998: radiusScale(+d.industrial1998),
        industrial1999: radiusScale(+d.industrial1999),
        industrial2000: radiusScale(+d.industrial2000),
        industrial2001: radiusScale(+d.industrial2001),
        industrial2002: radiusScale(+d.industrial2002),
        industrial2003: radiusScale(+d.industrial2003),
        industrial2004: radiusScale(+d.industrial2004),
        industrial2005: radiusScale(+d.industrial2005),
        industrial2006: radiusScale(+d.industrial2006),
        industrial2007: radiusScale(+d.industrial2007),
        industrial2008: radiusScale(+d.industrial2008),
        industrial2009: radiusScale(+d.industrial2009),
        industrial2010: radiusScale(+d.industrial2010),
        industrial2011: radiusScale(+d.industrial2011),
        industrial2012: radiusScale(+d.industrial2012),
        industrial2013: radiusScale(+d.industrial2013),
        textindustrial1990: +d.industrial1990,
        textindustrial1991: +d.industrial1991,
        textindustrial1992: +d.industrial1992,
        textindustrial1993: +d.industrial1993,
        textindustrial1994: +d.industrial1994,
        textindustrial1995: +d.industrial1995,
        textindustrial1996: +d.industrial1996,
        textindustrial1997: +d.industrial1997,
        textindustrial1998: +d.industrial1998,
        textindustrial1999: +d.industrial1999,
        textindustrial2000: +d.industrial2000,
        textindustrial2001: +d.industrial2001,
        textindustrial2002: +d.industrial2002,
        textindustrial2003: +d.industrial2003,
        textindustrial2004: +d.industrial2004,
        textindustrial2005: +d.industrial2005,
        textindustrial2006: +d.industrial2006,
        textindustrial2007: +d.industrial2007,
        textindustrial2008: +d.industrial2008,
        textindustrial2009: +d.industrial2009,
        textindustrial2010: +d.industrial2010,
        textindustrial2011: +d.industrial2011,
        textindustrial2012: +d.industrial2012,
        textindustrial2013: +d.industrial2013,
        agricultural1990: radiusScale(+d.agricultural1990),
        agricultural1991: radiusScale(+d.agricultural1991),
        agricultural1992: radiusScale(+d.agricultural1992),
        agricultural1993: radiusScale(+d.agricultural1993),
        agricultural1994: radiusScale(+d.agricultural1994),
        agricultural1995: radiusScale(+d.agricultural1995),
        agricultural1996: radiusScale(+d.agricultural1996),
        agricultural1997: radiusScale(+d.agricultural1997),
        agricultural1998: radiusScale(+d.agricultural1998),
        agricultural1999: radiusScale(+d.agricultural1999),
        agricultural2000: radiusScale(+d.agricultural2000),
        agricultural2001: radiusScale(+d.agricultural2001),
        agricultural2002: radiusScale(+d.agricultural2002),
        agricultural2003: radiusScale(+d.agricultural2003),
        agricultural2004: radiusScale(+d.agricultural2004),
        agricultural2005: radiusScale(+d.agricultural2005),
        agricultural2006: radiusScale(+d.agricultural2006),
        agricultural2007: radiusScale(+d.agricultural2007),
        agricultural2008: radiusScale(+d.agricultural2008),
        agricultural2009: radiusScale(+d.agricultural2009),
        agricultural2010: radiusScale(+d.agricultural2010),
        agricultural2011: radiusScale(+d.agricultural2011),
        agricultural2012: radiusScale(+d.agricultural2012),
        agricultural2013: radiusScale(+d.agricultural2013),
        textagricultural1990: +d.agricultural1990,
        textagricultural1991: +d.agricultural1991,
        textagricultural1992: +d.agricultural1992,
        textagricultural1993: +d.agricultural1993,
        textagricultural1994: +d.agricultural1994,
        textagricultural1995: +d.agricultural1995,
        textagricultural1996: +d.agricultural1996,
        textagricultural1997: +d.agricultural1997,
        textagricultural1998: +d.agricultural1998,
        textagricultural1999: +d.agricultural1999,
        textagricultural2000: +d.agricultural2000,
        textagricultural2001: +d.agricultural2001,
        textagricultural2002: +d.agricultural2002,
        textagricultural2003: +d.agricultural2003,
        textagricultural2004: +d.agricultural2004,
        textagricultural2005: +d.agricultural2005,
        textagricultural2006: +d.agricultural2006,
        textagricultural2007: +d.agricultural2007,
        textagricultural2008: +d.agricultural2008,
        textagricultural2009: +d.agricultural2009,
        textagricultural2010: +d.agricultural2010,
        textagricultural2011: +d.agricultural2011,
        textagricultural2012: +d.agricultural2012,
        textagricultural2013: +d.agricultural2013,
        waste1990: radiusScale(+d.waste1990),
        waste1991: radiusScale(+d.waste1991),
        waste1992: radiusScale(+d.waste1992),
        waste1993: radiusScale(+d.waste1993),
        waste1994: radiusScale(+d.waste1994),
        waste1995: radiusScale(+d.waste1995),
        waste1996: radiusScale(+d.waste1996),
        waste1997: radiusScale(+d.waste1997),
        waste1998: radiusScale(+d.waste1998),
        waste1999: radiusScale(+d.waste1999),
        waste2000: radiusScale(+d.waste2000),
        waste2001: radiusScale(+d.waste2001),
        waste2002: radiusScale(+d.waste2002),
        waste2003: radiusScale(+d.waste2003),
        waste2004: radiusScale(+d.waste2004),
        waste2005: radiusScale(+d.waste2005),
        waste2006: radiusScale(+d.waste2006),
        waste2007: radiusScale(+d.waste2007),
        waste2008: radiusScale(+d.waste2008),
        waste2009: radiusScale(+d.waste2009),
        waste2010: radiusScale(+d.waste2010),
        waste2011: radiusScale(+d.waste2011),
        waste2012: radiusScale(+d.waste2012),
        waste2013: radiusScale(+d.waste2013),
        textwaste1990: +d.waste1990,
        textwaste1991: +d.waste1991,
        textwaste1992: +d.waste1992,
        textwaste1993: +d.waste1993,
        textwaste1994: +d.waste1994,
        textwaste1995: +d.waste1995,
        textwaste1996: +d.waste1996,
        textwaste1997: +d.waste1997,
        textwaste1998: +d.waste1998,
        textwaste1999: +d.waste1999,
        textwaste2000: +d.waste2000,
        textwaste2001: +d.waste2001,
        textwaste2002: +d.waste2002,
        textwaste2003: +d.waste2003,
        textwaste2004: +d.waste2004,
        textwaste2005: +d.waste2005,
        textwaste2006: +d.waste2006,
        textwaste2007: +d.waste2007,
        textwaste2008: +d.waste2008,
        textwaste2009: +d.waste2009,
        textwaste2010: +d.waste2010,
        textwaste2011: +d.waste2011,
        textwaste2012: +d.waste2012,
        textwaste2013: +d.waste2013,
        electric1990: radiusScale(+d.electric1990),
        electric1991: radiusScale(+d.electric1991),
        electric1992: radiusScale(+d.electric1992),
        electric1993: radiusScale(+d.electric1993),
        electric1994: radiusScale(+d.electric1994),
        electric1995: radiusScale(+d.electric1995),
        electric1996: radiusScale(+d.electric1996),
        electric1997: radiusScale(+d.electric1997),
        electric1998: radiusScale(+d.electric1998),
        electric1999: radiusScale(+d.electric1999),
        electric2000: radiusScale(+d.electric2000),
        electric2001: radiusScale(+d.electric2001),
        electric2002: radiusScale(+d.electric2002),
        electric2003: radiusScale(+d.electric2003),
        electric2004: radiusScale(+d.electric2004),
        electric2005: radiusScale(+d.electric2005),
        electric2006: radiusScale(+d.electric2006),
        electric2007: radiusScale(+d.electric2007),
        electric2008: radiusScale(+d.electric2008),
        electric2009: radiusScale(+d.electric2009),
        electric2010: radiusScale(+d.electric2010),
        electric2011: radiusScale(+d.electric2011),
        electric2012: radiusScale(+d.electric2012),
        electric2013: radiusScale(+d.electric2013),
        textelectric1990: +d.electric1990,
        textelectric1991: +d.electric1991,
        textelectric1992: +d.electric1992,
        textelectric1993: +d.electric1993,
        textelectric1994: +d.electric1994,
        textelectric1995: +d.electric1995,
        textelectric1996: +d.electric1996,
        textelectric1997: +d.electric1997,
        textelectric1998: +d.electric1998,
        textelectric1999: +d.electric1999,
        textelectric2000: +d.electric2000,
        textelectric2001: +d.electric2001,
        textelectric2002: +d.electric2002,
        textelectric2003: +d.electric2003,
        textelectric2004: +d.electric2004,
        textelectric2005: +d.electric2005,
        textelectric2006: +d.electric2006,
        textelectric2007: +d.electric2007,
        textelectric2008: +d.electric2008,
        textelectric2009: +d.electric2009,
        textelectric2010: +d.electric2010,
        textelectric2011: +d.electric2011,
        textelectric2012: +d.electric2012,
        textelectric2013: +d.electric2013,
        manufract1990: radiusScale(+d.manufract1990),
        manufract1991: radiusScale(+d.manufract1991),
        manufract1992: radiusScale(+d.manufract1992),
        manufract1993: radiusScale(+d.manufract1993),
        manufract1994: radiusScale(+d.manufract1994),
        manufract1995: radiusScale(+d.manufract1995),
        manufract1996: radiusScale(+d.manufract1996),
        manufract1997: radiusScale(+d.manufract1997),
        manufract1998: radiusScale(+d.manufract1998),
        manufract1999: radiusScale(+d.manufract1999),
        manufract2000: radiusScale(+d.manufract2000),
        manufract2001: radiusScale(+d.manufract2001),
        manufract2002: radiusScale(+d.manufract2002),
        manufract2003: radiusScale(+d.manufract2003),
        manufract2004: radiusScale(+d.manufract2004),
        manufract2005: radiusScale(+d.manufract2005),
        manufract2006: radiusScale(+d.manufract2006),
        manufract2007: radiusScale(+d.manufract2007),
        manufract2008: radiusScale(+d.manufract2008),
        manufract2009: radiusScale(+d.manufract2009),
        manufract2010: radiusScale(+d.manufract2010),
        manufract2011: radiusScale(+d.manufract2011),
        manufract2012: radiusScale(+d.manufract2012),
        manufract2013: radiusScale(+d.manufract2013),
        textmanufract1990: +d.manufract1990,
        textmanufract1991: +d.manufract1991,
        textmanufract1992: +d.manufract1992,
        textmanufract1993: +d.manufract1993,
        textmanufract1994: +d.manufract1994,
        textmanufract1995: +d.manufract1995,
        textmanufract1996: +d.manufract1996,
        textmanufract1997: +d.manufract1997,
        textmanufract1998: +d.manufract1998,
        textmanufract1999: +d.manufract1999,
        textmanufract2000: +d.manufract2000,
        textmanufract2001: +d.manufract2001,
        textmanufract2002: +d.manufract2002,
        textmanufract2003: +d.manufract2003,
        textmanufract2004: +d.manufract2004,
        textmanufract2005: +d.manufract2005,
        textmanufract2006: +d.manufract2006,
        textmanufract2007: +d.manufract2007,
        textmanufract2008: +d.manufract2008,
        textmanufract2009: +d.manufract2009,
        textmanufract2010: +d.manufract2010,
        textmanufract2011: +d.manufract2011,
        textmanufract2012: +d.manufract2012,
        textmanufract2013: +d.manufract2013,
        transport1990: radiusScale(+d.transport1990),
        transport1991: radiusScale(+d.transport1991),
        transport1992: radiusScale(+d.transport1992),
        transport1993: radiusScale(+d.transport1993),
        transport1994: radiusScale(+d.transport1994),
        transport1995: radiusScale(+d.transport1995),
        transport1996: radiusScale(+d.transport1996),
        transport1997: radiusScale(+d.transport1997),
        transport1998: radiusScale(+d.transport1998),
        transport1999: radiusScale(+d.transport1999),
        transport2000: radiusScale(+d.transport2000),
        transport2001: radiusScale(+d.transport2001),
        transport2002: radiusScale(+d.transport2002),
        transport2003: radiusScale(+d.transport2003),
        transport2004: radiusScale(+d.transport2004),
        transport2005: radiusScale(+d.transport2005),
        transport2006: radiusScale(+d.transport2006),
        transport2007: radiusScale(+d.transport2007),
        transport2008: radiusScale(+d.transport2008),
        transport2009: radiusScale(+d.transport2009),
        transport2010: radiusScale(+d.transport2010),
        transport2011: radiusScale(+d.transport2011),
        transport2012: radiusScale(+d.transport2012),
        transport2013: radiusScale(+d.transport2013),
        texttransport1990: +d.transport1990,
        texttransport1991: +d.transport1991,
        texttransport1992: +d.transport1992,
        texttransport1993: +d.transport1993,
        texttransport1994: +d.transport1994,
        texttransport1995: +d.transport1995,
        texttransport1996: +d.transport1996,
        texttransport1997: +d.transport1997,
        texttransport1998: +d.transport1998,
        texttransport1999: +d.transport1999,
        texttransport2000: +d.transport2000,
        texttransport2001: +d.transport2001,
        texttransport2002: +d.transport2002,
        texttransport2003: +d.transport2003,
        texttransport2004: +d.transport2004,
        texttransport2005: +d.transport2005,
        texttransport2006: +d.transport2006,
        texttransport2007: +d.transport2007,
        texttransport2008: +d.transport2008,
        texttransport2009: +d.transport2009,
        texttransport2010: +d.transport2010,
        texttransport2011: +d.transport2011,
        texttransport2012: +d.transport2012,
        texttransport2013: +d.transport2013,
        other1990: radiusScale(+d.other1990),
        other1991: radiusScale(+d.other1991),
        other1992: radiusScale(+d.other1992),
        other1993: radiusScale(+d.other1993),
        other1994: radiusScale(+d.other1994),
        other1995: radiusScale(+d.other1995),
        other1996: radiusScale(+d.other1996),
        other1997: radiusScale(+d.other1997),
        other1998: radiusScale(+d.other1998),
        other1999: radiusScale(+d.other1999),
        other2000: radiusScale(+d.other2000),
        other2001: radiusScale(+d.other2001),
        other2002: radiusScale(+d.other2002),
        other2003: radiusScale(+d.other2003),
        other2004: radiusScale(+d.other2004),
        other2005: radiusScale(+d.other2005),
        other2006: radiusScale(+d.other2006),
        other2007: radiusScale(+d.other2007),
        other2008: radiusScale(+d.other2008),
        other2009: radiusScale(+d.other2009),
        other2010: radiusScale(+d.other2010),
        other2011: radiusScale(+d.other2011),
        other2012: radiusScale(+d.other2012),
        other2013: radiusScale(+d.other2013),
        textother1990: +d.other1990,
        textother1991: +d.other1991,
        textother1992: +d.other1992,
        textother1993: +d.other1993,
        textother1994: +d.other1994,
        textother1995: +d.other1995,
        textother1996: +d.other1996,
        textother1997: +d.other1997,
        textother1998: +d.other1998,
        textother1999: +d.other1999,
        textother2000: +d.other2000,
        textother2001: +d.other2001,
        textother2002: +d.other2002,
        textother2003: +d.other2003,
        textother2004: +d.other2004,
        textother2005: +d.other2005,
        textother2006: +d.other2006,
        textother2007: +d.other2007,
        textother2008: +d.other2008,
        textother2009: +d.other2009,
        textother2010: +d.other2010,
        textother2011: +d.other2011,
        textother2012: +d.other2012,
        textother2013: +d.other2013,
        fugitive1990: radiusScale(+d.fugitive1990),
        fugitive1991: radiusScale(+d.fugitive1991),
        fugitive1992: radiusScale(+d.fugitive1992),
        fugitive1993: radiusScale(+d.fugitive1993),
        fugitive1994: radiusScale(+d.fugitive1994),
        fugitive1995: radiusScale(+d.fugitive1995),
        fugitive1996: radiusScale(+d.fugitive1996),
        fugitive1997: radiusScale(+d.fugitive1997),
        fugitive1998: radiusScale(+d.fugitive1998),
        fugitive1999: radiusScale(+d.fugitive1999),
        fugitive2000: radiusScale(+d.fugitive2000),
        fugitive2001: radiusScale(+d.fugitive2001),
        fugitive2002: radiusScale(+d.fugitive2002),
        fugitive2003: radiusScale(+d.fugitive2003),
        fugitive2004: radiusScale(+d.fugitive2004),
        fugitive2005: radiusScale(+d.fugitive2005),
        fugitive2006: radiusScale(+d.fugitive2006),
        fugitive2007: radiusScale(+d.fugitive2007),
        fugitive2008: radiusScale(+d.fugitive2008),
        fugitive2009: radiusScale(+d.fugitive2009),
        fugitive2010: radiusScale(+d.fugitive2010),
        fugitive2011: radiusScale(+d.fugitive2011),
        fugitive2012: radiusScale(+d.fugitive2012),
        fugitive2013: radiusScale(+d.fugitive2013),
        textfugitive1990: +d.fugitive1990,
        textfugitive1991: +d.fugitive1991,
        textfugitive1992: +d.fugitive1992,
        textfugitive1993: +d.fugitive1993,
        textfugitive1994: +d.fugitive1994,
        textfugitive1995: +d.fugitive1995,
        textfugitive1996: +d.fugitive1996,
        textfugitive1997: +d.fugitive1997,
        textfugitive1998: +d.fugitive1998,
        textfugitive1999: +d.fugitive1999,
        textfugitive2000: +d.fugitive2000,
        textfugitive2001: +d.fugitive2001,
        textfugitive2002: +d.fugitive2002,
        textfugitive2003: +d.fugitive2003,
        textfugitive2004: +d.fugitive2004,
        textfugitive2005: +d.fugitive2005,
        textfugitive2006: +d.fugitive2006,
        textfugitive2007: +d.fugitive2007,
        textfugitive2008: +d.fugitive2008,
        textfugitive2009: +d.fugitive2009,
        textfugitive2010: +d.fugitive2010,
        textfugitive2011: +d.fugitive2011,
        textfugitive2012: +d.fugitive2012,
        textfugitive2013: +d.fugitive2013,
        energy2012text: +d.energy2012,
        energy2013: radiusScale(+d.energy2013),
        energy: d.energy,
        totalGHG: d.totalGHG,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function(a, b) {
      return b.value - a.value;
    });

    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width)
      .attr("height", height); // Bind nodes data to what will become DOM elements to represent them.
    /*.on("click",function(){
                    //select new data
                    if (dataIndex==1) {
                        dataIndex=2;
                    } else   {
                        dataIndex=1;
                    }
                    //rejoin data
                    var circle = svgDoc.select("g").selectAll("circle")
                        .data(eval("dataArray"+dataIndex))*/ bubbles = svg
      .selectAll(".bubble")
      .data(nodes, function(d) {
        return d.id;
      });
    bubbles2 = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubblesindus = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubblesagri = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubbleswaste = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubbleselec = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubblesmanu = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubblestrans = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubblesother = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });
    bubblesfug = svg.selectAll(".bubble2").data(nodes, function(d) {
      return d.id;
    });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.

    var bubblesF = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "energy";
      })
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesIndus = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "industrial";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesAgri = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "agriculture";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesWaste = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "waste";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesElectric = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "electric";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesManufacture = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "manufract";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesTransport = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "transport";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesOther = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "other";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesFugitive = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "blue")
      .attr("class", "energy")
      .attr("id", function(d) {
        return d.id.split(" ").join("_") + "fugitive";
      })
      .style("stroke", "red")
      .style("opacity", 0)
      .style("stroke-width", 2)
      .on("mouseover", showDetail3)
      .on("mouseout", hideDetail3);

    var bubblesE = bubbles
      .enter()
      .append("circle")
      .classed("bubble", true)
      .attr("r", 0)
      .style("fill", "#C68EFF")
      .attr("id", function(d) {
        return d.id.split(" ").join("_");
      })
      .style("stroke", function(d) {
        return d3.rgb(fillColor(d.status)).darker();
      })
      .style("stroke-width", 2)
      .on("mouseover", showDetail)
      .on("mouseout", hideDetail);
    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);
    bubbles2 = bubbles2.merge(bubblesF);
    bubblesindus = bubblesindus.merge(bubblesIndus);
    bubblesagri = bubblesagri.merge(bubblesAgri);
    bubbleswaste = bubbleswaste.merge(bubblesWaste);
    bubbleselec = bubbleselec.merge(bubblesElectric);
    bubblesmanu = bubblesmanu.merge(bubblesManufacture);
    bubblestrans = bubblestrans.merge(bubblesTransport);
    bubblesother = bubblesother.merge(bubblesOther);
    bubblesfug = bubblesfug.merge(bubblesFugitive);
    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition().duration(2000).attr("r", function(d) {
      return d.totalGHG2013;
    });
    bubbles2.style("opacity", 0).attr("r", function(d) {
      return d.energy2000;
    });
    bubblesindus.style("opacity", 0).attr("r", function(d) {
      return d.energy2000;
    });
    bubblesagri.style("opacity", 0).attr("r", function(d) {
      return d.energy2000;
    });
    bubbleswaste.style("opacity", 0).attr("r", function(d) {
      return d.energy2000;
    });
    bubbleselec.style("opacity", 0).attr("r", function(d) {
      return d.energy2000;
    });
    bubblesmanu.style("opacity", 0).attr("r", function(d) {
      return d.energy2000;
    });
    bubblestrans.style("opacity", 0).attr("r", function(d) {
      return d.energy2000;
    });
    bubblesother.style("opacity", 0).attr("r", function(d) {
      return d.waste2000;
    });
    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
    bubbles2
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  }

  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  function nodeYearPos(d) {
    return yearCenters[d.year].x;
  }

  function nodeYearPosY(d) {
    return yearCenters[d.year].y;
  }

  function nodeYearTwoPos(d) {
    return yearTwoCenters[d.safety].x;
  }

  function nodeYearTwoPosY(d) {
    return yearTwoCenters[d.safety].y;
  }

  function nodeYearThreePos(d) {
    return unionCenters[d.union].x;
  }

  function nodeYearThreePosY(d) {
    return unionCenters[d.union].y;
  }

  function nodeYearFourPos(d) {
    return states[d.states].x;
  }

  function nodeYearFourPosY(d) {
    return states[d.states].y;
  }

  function nodeYearFivePos(d) {
    return emphasis[d.id].x;
  }

  function nodeYearFivePosY(d) {
    return emphasis[d.id].y;
  }

  /*
   * Sets visualization in "single group mode".
   * The year labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideYearTitles();
    showAllTitles();
    hideCategoryTitles();
    drawLegend();
    hideStateTitles();
    hideUnionTitles();
    hideEmphasisTitles();
    showChartDesc();
    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force("x", d3.forceX().strength(forceStrength).x(center.x));
    simulation.force("y", d3.forceY().strength(forceStrength).y(center.y));
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Sets visualization in "split by year mode".
   * The year labels are shown and the force layout
   * tick function is set to move nodes to the
   * yearCenter of their data's year.
   */
  function splitBubbles() {
    showYearTitles();
    hideAllTitles();
    hideCategoryTitles();
    hideStateTitles();
    hideUnionTitles();
    hideEmphasisTitles();
    hidedescTitles();
    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force("x", d3.forceX().strength(forceStrength).x(nodeYearPos));
    simulation.force("y", d3.forceY().strength(forceStrength).y(nodeYearPosY));
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitTwoBubbles() {
    showCategoryTitles();
    hideAllTitles();
    hideYearTitles();
    hideStateTitles();
    hideUnionTitles();
    hideEmphasisTitles();
    hidedescTitles();
    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force(
      "x",
      d3.forceX().strength(forceStrength).x(nodeYearTwoPos)
    );
    simulation.force(
      "y",
      d3.forceY().strength(forceStrength).y(nodeYearTwoPosY)
    );
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitStateBubbles() {
    hideCategoryTitles();
    hideAllTitles();
    hideYearTitles();
    showStateTitles();
    hideUnionTitles();
    hidedescTitles();
    hideEmphasisTitles();
    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force(
      "x",
      d3.forceX().strength(forceStrength).x(nodeYearFourPos)
    );
    simulation.force(
      "y",
      d3.forceY().strength(forceStrength).y(nodeYearFourPosY)
    );
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  function splitEmphasisBubbles() {
    hideCategoryTitles();
    hideYearTitles();
    hideAllTitles();
    hideStateTitles();
    hideUnionTitles();
    hidedescTitles();
    showEmphasisTitles();
    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force(
      "x",
      d3.forceX().strength(forceStrength).x(nodeYearFivePos)
    );
    simulation.force(
      "y",
      d3.forceY().strength(forceStrength).y(nodeYearFivePosY)
    );
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }
  /*
   * Hides Year title displays.
   */
  function hideYearTitles() {
    svg.selectAll(".year").remove();
    svg.selectAll(".safetynum").remove();
  }

  function hidedescTitles() {
    svg.selectAll().remove();
    svg.selectAll(".dec").remove();
  }

  function hideUnionTitles() {
    svg.selectAll(".union").remove();
    svg.selectAll(".unionnum").remove();
  }

  function hideCategoryTitles() {
    svg.selectAll(".category").remove();
    svg.selectAll(".categorynum").remove();
  }

  function hideStateTitles() {
    svg.selectAll(".state").remove();
    svg.selectAll(".statenum").remove();
  }

  function hideEmphasisTitles() {
    svg.selectAll(".emphasis").remove();
    svg.selectAll(".emphasisnum").remove();
  }

  function hideAllTitles() {
    svg.selectAll(".all").remove();
    svg.selectAll(".allnum").remove();
    svg.selectAll("g").remove();
  }
  /*
   * Shows Year title displays.
   */
  function showYearTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll(".year").data(yearsData);

    years
      .enter()
      .append("text")
      .attr("class", "year")
      .attr("x", function(d) {
        return yearsTitleX[d];
      })
      .attr("y", 140)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d;
      });

    var category = svg.selectAll(".safetynum").data(safetynumdata);

    category
      .enter()
      .append("text")
      .attr("class", "safetynum")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
  }

  function showUnionTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var unionData = d3.keys(unionTitleX);
    var years = svg.selectAll(".union").data(unionData);

    years
      .enter()
      .append("text")
      .attr("class", "union")
      .attr("x", function(d) {
        return unionTitleX[d];
      })
      .attr("y", 140)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d;
      });

    var categoryData = d3.keys(unionnumdata);
    var category = svg.selectAll(".unionnum").data(unionnumdata);

    category
      .enter()
      .append("text")
      .attr("class", "unionnum")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
  }

  function showChartDesc() {
    var legend = svg.append("g"),
      legW = 40;

    legend
      .append("circle")
      .attr("cx", 1100)
      .attr("cy", 780)
      .attr("r", 80)
      .style("stroke-dasharray", "5")
      .style("fill", "none")
      .style("stroke", "black");
    legend
      .append("circle")
      .attr("cx", 1100)
      .attr("cy", 810)
      .attr("r", 50)
      .style("stroke-dasharray", "5")
      .style("fill", "none")
      .style("stroke", "black");
    legend
      .append("circle")
      .attr("cx", 1100)
      .attr("cy", 840)
      .attr("r", 20)
      .style("stroke-dasharray", "5")
      .style("fill", "none")
      .style("stroke", "black");


    var myText = svg
      .append("text")
      .attr("y", 695) //magic number here
      .attr("x", 1100)
    .attr("font-size", "2.5em")
      .attr("text-anchor", "middle")
      .attr("class", "dec") //easy to style with CSS
      .text("100 mtCO2e");
    var myText = svg
      .append("text")
      .attr("y", 820) //magic number here
      .attr("x", 1100)
    .attr("font-size", "2.5em")
      .attr("text-anchor", "middle")
      .attr("class", "dec") //easy to style with CSS
      .text("25 MtCO2e");
    var myText = svg
      .append("text")
      .attr("y", 915) //magic number here
      .attr("x", 1020)
    .attr("font-size", "1.5em")
      .attr("text-anchor", "middle")
      .attr("class", "dec") //easy to style with CSS
      .text("Circles sized according to emissions");
  }

  function showStateTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var categoryData = d3.keys(statedata);
    var category = svg.selectAll(".state").data(statedata);
    category
      .enter()
      .append("text")
      .attr("class", "state")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
    var categoryDatatwo = d3.keys(statenumdata);
    var categorytwo = svg.selectAll(".statenum").data(statenumdata);

    categorytwo
      .enter()
      .append("text")
      .attr("class", "statenum")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y + 30;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
  }

  function showEmphasisTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var categoryData = d3.keys(emphasisdata);
    var category = svg.selectAll(".emphasis").data(emphasisdata);

    category
      .enter()
      .append("text")
      .attr("class", "emphasis")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
    var categorynumData = d3.keys(emphasisnumdata);
    var categorynum = svg.selectAll(".emphasisnum").data(emphasisnumdata);

    categorynum
      .enter()
      .append("text")
      .attr("class", "emphasisnum")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
  }

  function showCategoryTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var categoryData = d3.keys(data);
    var category = svg.selectAll(".category").data(data);

    category
      .enter()
      .append("text")
      .attr("class", "category")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
    var categorynumData = d3.keys(datanum);
    var categorynum = svg.selectAll(".categorynum").data(datanum);

    categorynum
      .enter()
      .append("text")
      .attr("class", "categorynum")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y + 30;
      })
      .attr("text-anchor", "middle")
      .each(function(d) {
        var arr = d.label.split("  ");
        for (i = 0; i < arr.length; i++) {
          d3
            .select(this)
            .append("tspan")
            .text(arr[i])
            .attr("dy", i ? "1.2em" : 0)
            .attr("x", d.x)
            .attr("text-anchor", "middle")
            .attr("class", "tspan" + i);
        }
      });
  }

  function showAllTitles() {}

  function drawLegend() {}
  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
 var yearselect = $("#yearSelection").val().replace("y","");
    var selectedCountry = $("#countrySelection").val();
    var totalGHG = "totalGHG" + yearselect;
   var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d[yearselect])) +
      ';">' +
      addCommas(d[totalGHG]) +
      " MtC02e</p></div>";


    tooltip.showTooltip(content, d3.event);
  }
  function showDetail3(d) {
    var selectedCountry = $("#countrySelection").val();
    if(selectedCountry == "Select_Country"){
           d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
                 d3
        .selectAll("#" + selectedCountry)
        .style("fill", "orange");
    }else{
           d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
                 d3
        .selectAll("#" + selectedCountry)
        .style("fill", "orange");
    }
  }

  function showDetailall(d) {
        var yearselect = $("#yearSelection").val();
    var energyvalue = "textenergy" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
   var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d[yearselect])) +
      ';">' +
      addCommas(d[yearselect]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailenergy(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var energyvalue = "textenergy" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[energyvalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailindustrial(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var industrialvalue = "textindustrial" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[industrialvalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailagriculture(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var agriculturevalue = "textagricultural" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[agriculturevalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailwaste(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var wastevalue = "textwaste" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[wastevalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailelectric(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var electricvalue = "textelectric" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[electricvalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailmanufacturing(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var manufacuringvalue = "textmanufract" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[manufacuringvalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailtransport(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var transportvalue = "texttransport" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[transportvalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailother(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var othervalue = "textother" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[othervalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  function showDetailfugitive(d) {
    var yearselect = $("#yearSelection").val().replace("y", "");
    var fugitivevalue = "textfugitive" + yearselect;
    d3.select(this).style("fill", d3.rgb(fillColor(d.status)).darker());
    var content =
      '<div><p class="name">' +
      d.id +
      "</p>" +
      "<p " +
      d3.rgb(fillColor(d.status)) +
      ';">' +
      addCommas(d[fugitivevalue]) +
      " MtC02e</p></div>";

    tooltip.showTooltip(content, d3.event);
  }
  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline

        var selectedCountry = $("#countrySelection").val();
     var energySelect = $("#energySelection").val();
    if(energySelect == "all"){
      if(selectedCountry == "Select_Country"){
          d3.select(this).style("fill","#C68EFF");
                 d3
        .selectAll("#" + selectedCountry)
        .style("fill", "orange");
      }
      else{
          d3.select(this).style("fill","rgba(0,0,0,0)");
                 d3
        .selectAll("#" + selectedCountry)
        .style("fill", "orange");
      }
    }else{
    d3.select(this).style("fill","rgba(0,0,0,0)");
                 d3
        .selectAll("#" + selectedCountry+"energy")
        .style("fill", "orange");
    }
    tooltip.hideTooltip();

  }
  function hideDetail3(d) {
    var selectedCountry = $("#countrySelection").val();
    var energySelect = $("#energySelection").val();
    if(selectedCountry == "Select_Country"){
      if(energySelect == "all"){
    d3.select(this).style("fill", "#C68EFF");
                d3
        .selectAll("#" + selectedCountry)
        .style("fill", "orange");
  }else{
     d3.select(this).style("fill", "#C68EFF");
              d3
        .selectAll("#" + selectedCountry+"energy")
        .style("fill", "orange");
  }
    }else{
       if(energySelect == "all"){
    d3.select(this).style("fill", "rgba(0,0,0,0)")
                d3
        .selectAll("#" + selectedCountry)
        .style("fill", "orange");
  }else{
     d3.select(this).style("fill", "#C68EFF");
              d3
        .selectAll("#" + selectedCountry+"energy")
        .style("fill", "orange");
  }
    }
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function(displayName) {
    if (displayName === "year") {
      splitBubbles();
    } else if (displayName === "totals") {
      splitTwoBubbles();
    } else if (displayName === "union") {
      splitUnionBubbles();
    } else if (displayName === "state") {
      splitStateBubbles();
    } else if (displayName === "emphasis") {
      splitEmphasisBubbles();
    } else {
      groupBubbles();
    }
  };

  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    //console.log(error);
  }

  myBubbleChart("#vis", data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select("#toolbar").selectAll(".button").on("click", function() {
    // Remove active class from all buttons
    d3.selectAll(".button").classed("active", false);
    // Find the button just clicked
    var button = d3.select(this);

    // Set it as the active button
    button.classed("active", true);

    // Get the id of the button
    var buttonId = button.attr("id");

    // Toggle the bubble chart based on
    // the currently clicked button.
    myBubbleChart.toggleDisplay(buttonId);
  });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }

  return x1 + x2;
}
var columns = null;
// Load the data.
d3.csv(
  "https://raw.githubusercontent.com/JesseCHowe/WRI_BubbleChart_Competition/master/wri-emissions-visual-all-ghg/emissionsTest.csv",
  display
);

d3
  .csv(
    "https://gist.githubusercontent.com/JesseCHowe/9cebd2e1b191f26726af76427d0a75fe/raw/0383415958a4cf2d524c17a43784c3ea41a60054/TestWRIData.csv",
    display
  )
  .row(function(row) {
    if (columns == null) {
      columns = Object.keys(row);
      columns = columns.slice(2, 48); //Optional - to remove columns you dont need
    }
    return { name: row.Shrt_Desc }; // Do data manipulation here
  })
  .get(function(error, data) {
    //console.log("Finished Getting Data");
    //console.log(data.columns)
  });

// setup the buttons.
setupButtons();

/*
 * Creates tooltip with provided id that
 * floats on top of visualization.
 * Most styling is expected to come from CSS
 * so check out bubble_chart.css for more details.
 */
function floatingTooltip(tooltipId, width) {
  // Local variable to hold tooltip div for
  // manipulation in other functions.
  var tt = d3
    .select("#tooltip_contain")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", tooltipId)
    .style("pointer-events", "none");

  // Set a width if it is provided.
  if (width) {
    tt.style("width", "100%");
  }

  // Initially it is hidden.
  hideTooltip();

  /*
   * Display tooltip with provided content.
   *
   * content is expected to be HTML string.
   *
   * event is d3.event for positioning.
   */
  function showTooltip(content, event) {
    tt.style("opacity", 1).html(content);

    updatePosition(event);
  }

  /*
   * Hide the tooltip div.
   */
  function hideTooltip() {
    tt.style("opacity", 0.0);
  }

  /*
   * Figure out where to place the tooltip
   * based on d3 mouse event.
   */
  function updatePosition(event) {
    var xOffset = 20;
    var yOffset = 30;

    //var ttw = tt.style('width');
    //var tth = tt.style('height');

    var wscrY = window.scrollY;
    var wscrX = window.scrollX;

    var curX = document.all ? event.clientX + wscrX : event.pageX;
    var curY = document.all ? event.clientY + wscrY : event.pageY;
    var ttleft = curX - wscrX + xOffset * 2 + ttw > window.innerWidth
      ? curX - ttw - xOffset * 2
      : curX + xOffset;

    if (ttleft < wscrX + xOffset) {
      ttleft = wscrX + xOffset;
    }

    var tttop = curY - wscrY + yOffset * 2 + tth > window.innerHeight
      ? curY - tth - yOffset * 2
      : curY + yOffset;

    if (tttop < wscrY + yOffset) {
      tttop = curY + yOffset;
    }
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}

$("a#all").click(function(e) {
  // Cancel the default action
  e.preventDefault();
});
$("a#state").click(function(e) {
  // Cancel the default action
  e.preventDefault();
});
$("a#emphasis").click(function(e) {
  // Cancel the default action
  e.preventDefault();
});
$("a#totals").click(function(e) {
  // Cancel the default action
  e.preventDefault();
});
$("a#year").click(function(e) {
  // Cancel the default action
  e.preventDefault();
});
$("a#union").click(function(e) {
  // Cancel the default action
  e.preventDefault();
});
