import Movies from "../models/movie.model";
import { getAll } from "../services/axios";
//import { movieAPI } from "../services/config/movie.config";

const assert = require("assert");

const url = "https://api.tvmaze.com/shows"
/**
 * @async
 * @private
 */
async function _getAll() {
  const response = await getAll(url);

  if (response.status === 200) {
    return response.data;
  } else {
    console.log("Error!");
  }
}

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
        Movies.collection.insertMany(
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
    Movies.find({}, async (err, movies) => {
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
    Movies.findById(id, (err, movies) => {
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
  //const numOfMovies = await Movie.count({})
  //const movie = new Movie({...newMovie, id: numOfMovies+1});
  const movie = new Movies(newMovie); //{...newMovie, id: numOfMovies+1});

  await movie.save((err) => {
    if (err) {
      console.warn(err);
    } else {
      console.info("Added successfully");
    }
  });
}

/**
 * @export
 * @async
 * @param {*} id
 */
  export const updateMovie = (id, movieToUpdate) => {
    return new Promise((resolve, reject) => {
      Movies.findByIdAndUpdate(id, movieToUpdate, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Updated successfully");
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
      Movies.findByIdAndDelete(id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Deleted successfully");
        }
      });
    });
  };
