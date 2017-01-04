
var fs = require('fs');
var Twitter = require('twitter');
var Keys = require('./keys.js');
var spotify = require('spotify');
var request = require('request');

var nodeArgs = process.argv;
var param = "";
var action = process.argv[2];

/**
 * Capitalize first letter of query strings to fix undefined queries
 **/
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// Loop through all the words in the node argument
for (var i=3; i<nodeArgs.length; i++){
  if (i>3 && i< nodeArgs.length){
		param = param + "+" + nodeArgs[i].capitalizeFirstLetter();
	} else {
		param = param + nodeArgs[i].capitalizeFirstLetter();
	}
}
switch (action) {
  case 'latest-tweets':
      twitterStream(param);
      break;

  case 'spotify-this':
      spotifyTrack(param);
      break;

  case 'movie-this':
      movieInfo(param)
      break;

  case 'do-what-it-says':
      doIt();
      break;
}
//Twitter functionality
var options = { screen_name: 'Guy_Pham',
                count: 20 };

var twit = new Twitter({
    consumer_key: Keys.consumer_key,
    consumer_secret: Keys.consumer_secret,
    access_token_key: Keys.access_token_key,
    access_token_secret: Keys.access_token_secret
})

twit.get('statuses/user_timeline', options , function(err, data) {
  // console.log(err,data);
  for (var i = 0; i < data.length ; i++) {
    console.log(data[i].text);
  }
})
//Spotify functionality
function spotifyTrack(param) {
  if(!param) {
    param = "Ace of Base The Sign";
  }

  spotify.search({
    type: 'track',
    query: param + '&limit=1&'
  }, function(error, data) {
    if(error) {
      console.log('Error occurred: ' + error);
      return;
    }
    if(!error && data) {
      console.log('');
      console.log('===============');
      console.log("Track Title: " + data.tracks.items[0].name);
      console.log('===============');
      console.log('');
      console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("Preview URL: " + data.tracks.items[0].preview_url);
      console.log('');
      console.log('===============');
      console.log('');
    }
  });
}
// OMDB Functionality
function movieInfo(param) {
    if (!param) {
        param = "Mr.+Nobody";
    }

 //Then run a request to the OMDB API with the movie specified
var queryUrl = 'http://www.omdbapi.com/?t=' + param +'&y=&plot=short&tomatoes=true&r=json';
// This line is just to help us debug against the actual URL.
console.log(queryUrl);

request(queryUrl, function (error, response, body) {
	// If the request is successful (i.e. if the response status code is 200)
	if (error){
    console.log('Error occured: ' + error);
    return;
  }
	 // Parse the body of the site and recover just the imdbRating
    if (!error && response.statusCode == 200) {
            console.log('');
            console.log('==========================================');
            console.log("Movie: " + JSON.parse(body).Title);
            console.log('==========================================');
            console.log('');
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log('');
            console.log("Year Released: " + JSON.parse(body).Year);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log('');
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
            console.log('');
            console.log('==========================================');
            console.log('');
          }
	    });
    }
 //Do What It Says Functionality
function doIt() {
    fs.readFile('random.txt', "utf8", function(error, data) {
        data = data.split(",");
        param = data[1].replace(/"/g,'');
        if (data[0] === 'latest-tweets') {
            twitterStream(param);
        } else if (data[0] === 'spotify-this') {
            spotifyTrack(param);
        } else if (data[0] === 'movie-this') {
            movieInfo(param);
        }
    });
}
