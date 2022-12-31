const express = require("express");
const fs = require("fs");
const { parse } = require("csv-parse");


const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.json({ message: "Hello Word"})
})
app.get('/pokemons', (req, res) => {
  const data = [];

  fs.createReadStream("./pokemonData.csv")
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      // 👇 push the object row into the array
      data.push(row);
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      // 👇 log the result array
      res.json(data)
    });
})

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
}); 

module.exports = app;