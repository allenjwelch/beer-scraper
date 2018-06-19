// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Require request and cheerio. This makes the scraping possible
const request = require("request");
const cheerio = require("cheerio");

// Initialize Express
const app = express();

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB

// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

  request("https://www.craftbeer.com/beer/beer-styles-guide", function(error, response, html) {
    let $ = cheerio.load(html);
    let results = [];
    $("div.style").each(function(i, element) {
      
      let styleName = $(element).children("h2.style-name").text().trim();
      let familyName = $(element).children("p.family-name").text().trim();
      let description = $(element).children("p").text().trim();
      let image = $(element).children("img.beer-image").attr("src");
      let stats = $(element).children("ul.simple").children("li").text();
        stats = stats.split(/(CO2)/); 
      let newStats = stats[2].split(/(Attenuation)/); 
      let basicStats = stats[0].split(/[A-Z]/g); 
        OG = basicStats[2]; 
        FG = basicStats[4]; 
        ABV = basicStats[7]; 
        IBU = basicStats[10]; 
        BU = basicStats[14]; 
        SRM = basicStats[17]; 
      let additionalStats = stats[0].split(/[A-Z]/g); 

      let examples = $(element).children("ul.winners").children("li").text().trim();
        examples = examples.split(/\s{27}/g);
        let removed = examples.splice(2, 1); 
      results.push({
        styleName: styleName,
        familyName: familyName,
        description: description,
        image: image,
        // stats: stats,
        // newStats: newStats,
        OG: OG, 
        FG: FG,
        ABV: ABV,
        IBU: IBU,
        BU: BU, 
        SRM: SRM,
        examples: examples,
      });      
    });
    console.log(results);
  })
