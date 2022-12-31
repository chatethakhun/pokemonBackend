const express = require("express");
const fs = require("fs");
const { parse } = require("csv-parse");
const pokemon = require('pokemon')

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.json({ message: "Hello Word"})
})
app.get('/pokemons', (req, res) => {
  readPokemon((data) => {
    res.json(data)
  })
})

app.get('/pokemons/:id', (req, res) => {
  readPokemon((data) => {
    if(req.params.id) {
      const pokemonId = !isNaN(parseInt(req.params.id)) ? parseInt(req.params.id) :  pokemon.getId(req.params.id)
      const pokemonData = data.find(pokemon => parseInt(pokemon.id) === pokemonId)
      res.json({ pokemonData })
    } else {
      res.json({ message: 'please send id'})
    }
    
  })
})

const readPokemon = (cb) => {
  const data = [];
  fs.createReadStream("./csv/pokemonData.csv")
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      // 👇 push the object row into the array
      const newRow = {
        ...row,
        types: row.types.split(",")
      }
      data.push(newRow);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      // 👇 log the result array
      cb(data)
      
    });
}

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
}); 

module.exports = app;