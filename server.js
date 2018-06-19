// Dependencies
const mongojs = require("mongojs");

// Require request and cheerio. This makes the scraping possible
const request = require("request");
const cheerio = require("cheerio");

// Database configuration
const databaseUrl = "scraper";
const collections = ["scrapedBeer"];

// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl, collections);
  db.on("error", function(error) {
   console.log("Database Error:", error);
  });


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
        OG: OG, 
        FG: FG,
        ABV: ABV,
        IBU: IBU,
        BU: BU, 
        SRM: SRM,
        examples: examples,
      });      

      db.scrapedBeer.insert({
        styleName: styleName,
        familyName: familyName,
        description: description,
        image: image,
        OG: OG, 
        FG: FG,
        ABV: ABV,
        IBU: IBU,
        BU: BU, 
        SRM: SRM,
        examples: examples,
      },
      function(err, inserted) {
        if (err) {
          // Log the error if one is encountered during the query
          console.log(err);
        }
        else {
          // Otherwise, log the inserted data
          console.log(inserted);
        }
      });
    });
    console.log(results);
  })
