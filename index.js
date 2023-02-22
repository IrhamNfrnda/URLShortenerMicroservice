require('dotenv').config();
const express = require('express');
const cors = require('cors');
var bodyParser = require("body-parser");
const fs = require('fs');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const filePath = __dirname + "/data/short-url.json";
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//Use body-parser to Parse POST Requests
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:shorturl', function (req, res) {
  let shortUrl = req.params.shorturl;

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if(err){
      res.json({
        error: err
      })
    }

  }) 
})

app.post('/api/shorturl', function (req, res) {
  let originalUrl = req.body.url;
  let shortUrl = 1;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return
    }

    let dataBase = JSON.parse(data);

    console.log(dataBase);

    res.json({
      mes:'okkay'
    })
    
    while(dataBase.find(record => record.short_url === shortUrl)){
      shortUrl++;
    }

    let newData = {
      originalUrl: originalUrl,
      short_url: shortUrl
    }

    dataBase.push(newData);
  
    fs.writeFile(filePath, JSON.stringify(dataBase), 'utf8', err => {
      if (err) {
        return res.json({
          error: err
        })
      }
      return res.json({
        original_url: originalUrl,
        short_url: shortUrl
      });
    });
  });
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
