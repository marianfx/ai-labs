//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
// It starts by requiring all of the used modules, and then defines the variable `messengerButton`.
// This contains the HTML that displays the Facebook messenger button you used earlier.
// It uses the values for `PAGE_ID` and `APP_ID` that you provide in the `.env` file.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('./index.js');
const path = require('path');

var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><script>window.fbAsyncInit = function() { FB.init({ appId: "+process.env.APP_ID+", xfbml: true, version: \"v2.8\" }); }; (function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) { return; } js = d.createElement(s); js.id = id; js.src = '//connect.facebook.net/en_US/sdk.js'; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk')); </script> <h3>Facebook Messenger Bot Example</h3> <div class=\"fb-messengermessageus\" messenger_app_id=\""+process.env.APP_ID+"\" page_id=\""+process.env.PAGE_ID+"\" color=\"blue\" size=\"large\"></div><br><br><br><hr><p><a href=\"https://gomix.com/#!/remix/messenger-bot/ca73ace5-3fff-4b8f-81c5-c64452145271\"><img src=\"https://gomix.com/images/background-light/remix-on-gomix.svg\"></a></p><p><a href=\"https://gomix.com/#!/project/messenger-bot\">View Code</a></p></body></html>";

// We define a new variable `bot`, which takes the tokens and secret supplied in `.env` and creates a new `Bot` instance,
// which utilizes the messenger-bot library.
let bot = new Bot({
  token: process.env.PAGE_TOKEN,
  verify: process.env.VERIFY_TOKEN,
  app_secret: process.env.APP_SECRET
});

// We then implement two Bot methods for error and message.
// 'Error' just writes its contents to the console. 
bot.on('error', (err) => {
  console.log(err.message);
});

// 'Message' gets the text from the message received, and uses the `reply()` method to send that same text back to the user,
// handling any errors that occur.
bot.on('message', (payload, reply) => {
  let text = payload.message.text;

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) { console.log(err); }
    else {
      reply({ text }, (err) => {
        if (err) console.log(err);
        
        if(profile)
          console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`);
      });
    }
  });
});

// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Route for GET requests to `/bot`.
// This is the route used by Facebook to verify the Callback URL you setup earlier.
app.get('/bot', (req, res) => {
  return bot._verify(req, res);
});

// Route for POSTs to `/bot`.
// This is where all of the messages get sent, and uses the library method `_handleMessage()`.
app.post('/bot', (req, res) => {
  bot._handleMessage(req.body);
  res.end(JSON.stringify({status: 'ok'}));
});

// Finally, we set up the route for GETs to `/`, which is the root URL of our app, and is how we
// render the contents of `messengerButton` to the page.
app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(messengerButton);
  res.end();
});

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});