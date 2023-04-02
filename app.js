const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_field: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/ae00458383";

  const options = {
    method: "POST",
    auth: "Mojid: 4fc417ea3245f98fbf0358d51c024c50-us21"
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
        console.log(JSON.parse(data));
    })
    app.post("/failure", function(req, res) {
      res.redirect("/")
    })
  })

  request.write(jsonData);
  request.end();

});

app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000.")
});

// API Key
// 2d3edaeef9a4df90c27d11a787aa9540-us21

// Audience Id
//  ae00458383


// app.post("/", function(req, res){
//   const query = req.body.cityName;
//   const apiKey = "b950e7793cf21df7cb357ea0aff39fe3";
//   const unit = "metric";
//   const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
//
//   https.get(url, function(response){
//     console.log(response.statusCode);
//
//     response.on("data", function(data){
//       const weatherData = JSON.parse(data)
//       const weatherdescription = weatherData.weather[0].description
//       const temp = weatherData.main.temp
//       const icon = weatherData.weather[0].icon
//       const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
//       res.write("<h1>The temperature in " + query + " is " + temp + " Degree Celcius</h1>");
//       res.write("<p>The weather is currently " + weatherdescription + "</p>");
//       res.write("<img src=" + imageURL + ">");
//       res.send();
//     });
//   });
// })
