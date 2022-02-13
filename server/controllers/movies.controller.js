import Movie from "../models/movie.model";
import { getAll } from "../services/axios";
//import { movieAPI } from "../services/config/movie.config";

const assert = require("assert");

const url = "https://api.tvmaze.com/shows";

/**
 * @export
 * @async
 */
export const setAllMovies = async () => {
  const movies = await getAllMovies();
  !movies.length &&
    _getAll()
      .then((data) => {
        console.log(`>>> Massive insert of: ${data.length} movies`);
        Movie.collection.insertMany(
          data.map((item) => ({
            name: item?.name,
            genres: [...item?.genres],
            image: item?.image?.medium,
            premiered: item?.premiered,
          })),
          (err, docs) => {
            assert.equal(null, err);
            assert.equal(data.length, docs.insertedCount);
          }
        );
      })
      .catch((err) => console.log(err));
};

/**
 * @export
 * @async
 */
export const getAllMovies = async () => {
  return new Promise((resolve, reject) => {
    Movie.find({}, async (err, movies) => {
      if (err) reject(err);
      resolve(movies);
    });
  });
};

/**
 * @export
 * @async
 * @param {*} id
 *
 */
export const getMovieById = (id) => {
  return new Promise((resolve, reject) => {
    Movie.findById(id, (err, movies) => {
      if (err) {
        reject(err);
      } else {
        resolve(movies);
      }
    });
  });
};

/**
 * @export
 * @async
 * @param {*} vewMovie
 */
export const addMovie = async (newMovie) => {
  const movie = new Movie(newMovie);

  await movie.save((err) => {
    if (err) {
      console.warn(err);
    } else {
      console.info("Added successfully", newMovie);
    }
  });

  return getAllMovies();
};

/**
 * @export
 * @async
 * @param {*} id
 */
export const updateMovie = (id, movieToUpdate) => {
  return new Promise((resolve, reject) => {
    Movie.findByIdAndUpdate(id, movieToUpdate, (err) => {
      if (err) {
        reject(err);
      } else {
        console.info("Updated successfully", movieToUpdate)
        resolve(getAllMovies());
      }
    });
  });

};

/**
 * @export
 * @async
 * @param {*} id
 */
export const deleteMovie = (id) => {
  return new Promise((resolve, reject) => {
    Movie.findByIdAndDelete(id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted successfully");
      }
    });
  });
};
