// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.find(obj => obj.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, append new tags for each key-value pair in the filtered metadata
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
      });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.find(obj => obj.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = filteredSample.otu_ids;
    let otuLabels = filteredSample.otu_labels;
    let sampleValues = filteredSample.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Earth'
        }
      }];

    // Render the Bubble Chart
    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample'
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let topOtuIds = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let topSampleValues = sampleValues.slice(0, 10).reverse();
    let topOtuLabels = otuLabels.slice(0, 10).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      x: topSampleValues,
      y: topOtuIds,
      text: topOtuLabels,
      type: 'bar',
      orientation: 'h'
     }];
    
    // Render the Bar Chart
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    names.forEach((name) => {
      dropdown
          .append("option")
          .text(name)
          .property("value", name);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();