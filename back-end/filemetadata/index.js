var express = require('express');
var cors = require('cors');
require('dotenv').config();
const multer = require('multer');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const decodedName = Buffer.from(file.originalname, 'latin1').toString(
      'utf-8'
    );
    cb(null, decodedName);
  }
});

const upload = multer({ storage });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  console.log(req.file);
  const { filename: name, size, mimetype: type } = req.file;
  res.json({ name, size, type });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
