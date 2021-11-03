const express = require("express");
const morgan = require("morgan");
var axios = require("axios").default;

const app = express();
app.use(morgan("dev"));

app.use(express.static(__dirname + "/public"));

let movie = "Harry Potter";

var options = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/auto-complete",
  params: { q: movie },
  headers: {
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
    "x-rapidapi-key": "a24c2adaa9msh4e35f50fd42ecebp15a3bbjsnb2a103b118fa",
  },
};

app.get(`/`, (req, res) => {
  var options = {
    method: "GET",
    url: "https://imdb8.p.rapidapi.com/auto-complete",
    params: { q: movie },
    headers: {
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
      "x-rapidapi-key": "a24c2adaa9msh4e35f50fd42ecebp15a3bbjsnb2a103b118fa",
    },
  };
  axios
    .request(options)
    .then(function (response) {
      const resArr = response.data.d;
      res.send(`
        <!DOCTYPE html>
          <html>
            <head>
              <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
              <div class="movie-container">
                ${resArr
                  .map(
                    (movie, index) => `
                  <div class='movie'>
                    <a href="/movie/${index}">
                      <img class='movie-img' src='${movie.i.imageUrl}'/>
                      <h3 class='title'>${movie.l}</h3>
                    </a>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </body>
          </html>
      `);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.get("/movie/:id", (req, res, next) => {
  axios.request(options).then(function (response) {
    if (!response.data.d[req.params.id]) {
      const postError = new Error("Does not exist");
      next(postError);
    } else {
      const movie = response.data.d[req.params.id];
      res.send(`
        <!DOCTYPE html>
          <html>
            <head>
              <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
              <div class="inputfield">
                
              </div>
            
              <div class="movie-container">
                  <div class='movie'>
                    <img class='movie-img' src='${movie.i.imageUrl}'/>
                    <h3 class='title'>${movie.l}</h3>
                    <p> Type: ${movie.q}
                    <p> Rank: ${movie.rank}</p>
                    <p> Release Year: ${movie.y}</p>
                  </div>
              </div>
            </body>
          </html>
      `);
    }
  });
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
