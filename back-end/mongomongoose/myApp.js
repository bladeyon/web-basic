require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);

function done(err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log('success');
    console.log(data);
  }
}

const person = new Person({
  name: 'Lily',
  age: 18,
  favoriteFoods: ['pizza', 'pasta']
});

const createAndSavePerson = (done) => {
  person.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// createAndSavePerson(done);

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// createManyPeople([{name: 'Lily1', age: 18, favoriteFoods: ['pizza', 'pasta']}, {name: 'Lily2', age: 18, favoriteFoods: ['pizza', 'pasta']}, {name: 'Lily3', age: 18, favoriteFoods: ['pizza', 'pasta']}],done)

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// findPeopleByName('Lily', done)

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// findOneByFood('pizza', done)

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// findPersonById('655b07db3d529368ce669de4', done)

const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';
  Person.findById(personId, (err, data) => {
    if (data) {
      data.favoriteFoods.push(foodToAdd);
      data.save((err, data) => {
        if (err) return done(err);
        done(null, data);
      });
    }
  });
};

// findEditThenSave('655b07db3d529368ce669de4', done)

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { $set: { age: ageToSet } },
    { new: true },
    (err, data) => {
      if (data) {
        data.age = ageToSet;
        data.save((err, data) => {
          if (err) return done(err);
          done(null, data);
        });
      }
    }
  );
};

// findAndUpdate('Lily', done)

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// removeById('655b07db3d529368ce669de4', done)

const removeManyPeople = (done) => {
  const nameToRemove = 'Lily';
  Person.remove({ name: nameToRemove }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

// removeManyPeople(done)

const queryChain = (done) => {
  const foodToSearch = 'burrito';
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec(done);
};

queryChain(done);

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
