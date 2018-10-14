var RocketWatch = require('./server.js');
var Notify = require('./notifications.js');


setInterval(function() {

  var lastone = RocketWatch.storage.get("/agency?limit=200&format=news");

  RocketWatch.load("/agency?limit=200&format=news&islsp=1", function(data) {
    for (var i in data.agencies) {
      // order of agencies doesnt change, should be ok. Handle new ones!
      var oldnews = lastone.agencies[i].news
      var newnews = data.agencies[i].news;
      for(var o in newnews) {
        if(newnews[i])
      }
    }
  });
}, 600000);
