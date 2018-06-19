$(document).ready(function() {

  $.ajax({
    method: "GET", 
    url: "/scrape", 
  }).then(function(data) { 
    // For each one
    data.forEach((style) => {
      console.log(style); 
    });
  });

}); 