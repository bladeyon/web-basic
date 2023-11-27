const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch {
  throw new Error('mongoose connection error');
}

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.use((req, res, next) => {
  console.log('request', req.method + ' ' + req.path);
  console.log('body:', req.body);
  console.log('query:', req.query);
  next();
});

const exerciseSchema = new mongoose.Schema({
  userId: { type: String },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date
});
const Exercise = mongoose.model('Exercise', exerciseSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: Number,
  log: [Object]
});
const User = mongoose.model('User', userSchema);

// mongoose@^8.0.0 写法有些不一样，之前项目用的是5
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app
  .route('/api/users')
  .post(async (req, res) => {
    const { username, _id } = req.body;
    const user = new User({ username, _id });
    const data = await user.save();
    res.json({ username: data.username, _id: data._id });
  })
  .get(async (req, res) => {
    const data = await User.find({});
    res.json(data);
  });

app
  .route('/api/users/:_id/exercises')
  .post(async (req, res) => {
    const { description, duration, date } = req.body;
    const { _id } = req.params;
    const user = await User.findById(_id);
    if (user) {
      const exercise = new Exercise({
        userId: _id,
        description,
        duration: +duration,
        date: date || new Date()
      });

      const data = await exercise.save();
      // FCC 测试用例 这里太难猜了
      res.json({
        _id: user._id,
        username: user.username,
        description: data.description,
        duration: data.duration,
        date: data.date.toDateString(),
      });
    } else {
      res.json({
        errorMsg: 'user not found'
      });
    }
  })
  .get((req, res) => {
    const { _id } = req.params;
    Exercise.find({ userId: _id }).then((data) => {
      res.json(data);
    });
  });

app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = await User.findById(_id);
  if (user) {
    const query = Exercise.find({ userId: _id });
    if (from) {
      query.where('date').gt(from);
    }

    if (to) {
      query.where('date').lt(to);
    }

    if (limit) {
      query.limit(limit);
    }
    const data = await query.exec();
    res.json({
      _id: user._id,
      username: user.username,
      count: data.length,
      log: data.map((d) => ({
        description: d.description,
        duration: d.duration,
        date: d.date.toDateString()
      }))
    });
  } else {
    res.json({
      errorMsg: 'user not found'
    });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
