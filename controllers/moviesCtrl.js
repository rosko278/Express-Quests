// Import the movie model that we'll need in controller functions
const Movie = require("../models/movie");

exports.getMoviesController = (req, res) => {
  const { max_duration, color } = req.query;
  Movie.findMany({ filters: { max_duration, color } })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving movies from database");
    });
};

exports.getAMovieController = (req, res) => {
  const movieId = req.params.id;
  connection.query(
    "SELECT * FROM movies WHERE id = ?",
    [movieId],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving movie from database");
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send("Movie not found");
      }
    }
  );
};
