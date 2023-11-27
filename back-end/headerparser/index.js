// index.js
// where your node app starts

// init project
require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/whoami', (req, res) => {
  res.json({
    ipaddress: req.headers['x-forwarded-for'],
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  });
});

const urlMap = new Map();

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  // url 有效
  const regex =
    /^(https?):\/\/([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/;
  if (!url || !regex.test(url)) {
    res.json({ error: 'invalid url' });
  } else {
    // 判断是否存在
    if (!Array.from(urlMap.values()).includes(url)) {
      urlMap.set(urlMap.size + 1, url);
    }
    console.log('post:', urlMap);
    res.json({ original_url: url, short_url: urlMap.size });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  const original_url = urlMap.get(+short_url);
  console.log('get', +short_url, original_url);
  if (original_url) {
    res.redirect(original_url);
  } else {
    res.json({ error: 'invalid url' });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
