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

        return rigatoniId;
      })
      .catch(error => console.log(`Unable to get Rigatoni id: ${error}`))
  })
  .then((rigatoniId) => {
    return Recipe.findOneAndUpdate({ _id: rigatoniId }, { duration: 100 })
          .then(() => console.log("Update successful"))
          .catch(error => console.log(`Update failed: ${error}`))
  })
  .then(() => {
    let carrotCakeId;

    return Recipe.find({ title: "Carrot Cake" }, "_id")
      .then(docs => {
        // carrotCakeId = docs[0]._id.toString()
        carrotCakeId = docs[0].id;

        return carrotCakeId
      })
      .catch(error => console.log(`Unable to get Rigatoni id: ${error}`))
  })
  .then((carrotCakeId) => {
    return Recipe.deleteOne({ _id: carrotCakeId })
          .then(() => console.log("Delete one successful"))
          .catch(error => console.log(`Delete one failed: ${error}`));
  })
  .then(() => {
    mongoose.connection.close();
    console.log("Connection closed");
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });

  // Same operations with async/await
  async function main() {
    await mongoose.connect(MONGODB_URI)
    await Recipe.deleteMany()
  
    console.log(new Date())
    await Promise.all([
      Recipe.create({
        title: "Poutine",
        level: "Easy",
        ingredients: ["Potatoes", "Curd cheese", "Gravy sauce"],
        cuisine: "Canadian",
        dishType: "Fast and Fat",
        image: "https://producteurslaitiersducanada.ca/sites/default/files/styles/recipe_image/public/image_file_browser/conso_recipe/autumn-vegetable-poutine.jpg.jpeg?itok=ToeXDmDC",
        duration: 15,
        creator: "Jean-Francis Poutine",
        // created: new Date(Date.now())
      }),
      Recipe.insertMany(data)
    ])
  
    const docs = await Recipe.find({ title: "Rigatoni alla Genovese" }, "_id")
    const rigatoniId = docs[0].id;
  
    await Recipe.findOneAndUpdate({ _id: rigatoniId }, { duration: 100 })
  
    const docs2 = await Recipe.find({ title: "Carrot Cake" }, "_id")
    const carrotCakeId = docs2[0].id;
  
    await Recipe.deleteOne({ _id: carrotCakeId }).catch(error => console.log(`Delete one failed: ${error}`)) // throw?
    console.log("Delete one successful")
  }
  
  // Uncomment below to run main()
  // main()
  //   .catch(err => {console.log('oopsy', err)})
  //   .finally(() => {
  //     mongoose.connection.close()
  //     console.log("Connection closed");
  // })