const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(() => { // Connected to an empty database
    return Recipe.create({
      title: "Poutine",
      level: "Easy",
      ingredients: ["Potatoes", "Curd cheese", "Gravy sauce"],
      cuisine: "Canadian",
      dishType: "Fast and Fat",
      image: "https://producteurslaitiersducanada.ca/sites/default/files/styles/recipe_image/public/image_file_browser/conso_recipe/autumn-vegetable-poutine.jpg.jpeg?itok=ToeXDmDC",
      duration: 15,
      creator: "Jean-Francis Poutine",
      // created: new Date(Date.now())
    })
  })
  .then(() => {
    return Recipe.insertMany(data);  // Consumes an array of recipes
    //Recipe.create(data);    // Seems to do the same (but we also can use validators in the schema)
  })
  .then(() => {
    let rigatoniId;

    return Recipe.find({ title: "Rigatoni alla Genovese" }, "_id")
      .then(docs => {
        // rigatoniId = docs[0]._id.toString()
        rigatoniId = docs[0].id;

        Recipe.findOneAndUpdate({ _id: rigatoniId }, { duration: 100 })
          .then(() => console.log("Update successful"))
          .catch(error => console.log(`Update failed: ${error}`))
      })
      .catch(error => console.log(`Unable to get Rigatoni id: ${error}`))
  })
  .then(() => {
    let carrotCakeId;

    return Recipe.find({ title: "Carrot Cake" }, "_id")
      .then(docs => {
        // carrotCakeId = docs[0]._id.toString()
        carrotCakeId = docs[0].id;

        Recipe.deleteOne({ _id: carrotCakeId })
          .then(() => console.log("Delete one successful"))
          .catch(error => console.log(`Delete one failed: ${error}`))
          .finally(() => { 
            mongoose.connection.close();
            console.log("Connection closed");
          });
      })
      .catch(error => console.log(`Unable to get Rigatoni id: ${error}`))
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });



// Close connection : mongoose.connection.close();
