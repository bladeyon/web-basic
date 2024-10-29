const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/getFile', (req, res) => {
  const { url } = req.body;
  const GroupDocs = require('@groupdocs/groupdocs.viewer');
  
  let viewer = new GroupDocs.Viewer(url);
  
  // Create an HTML rendering options object
  let options = new GroupDocs.HtmlOptions.forEmbeddedResources(
    '/views/output-responsive.html'
  );
  
  // Enable rendering of document into responsive HTML
  options.isResponsive = true;
  
  // Render the document to HTML
  viewer.view(options);
  
  // Assuming you have a callback function
  let callbackUrl = 'http://your_callback_url';
  res.sendFile(__dirname + '/views/output-responsive.html');
  // res.json({ url });
});

app.listen(3000, () => console.log('Listening on port 3000'));
