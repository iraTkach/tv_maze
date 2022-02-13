import { movieConstants } from "../constants";
import { movieService } from "../../services/movie.service";

export const movieActions = {
  getAll,
  addMovie,
  updateMovie
};

function getAll() {
  return (dispatch) => {
    dispatch(request());

    movieService.getAll().then(
      (movies) => dispatch(success(movies)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: movieConstants.GETALL_REQUEST };
  }
  function success(movies) {
    return { type: movieConstants.GETALL_SUCCESS, movies };
  }
  function failure(error) {
    return { type: movieConstants.GETALL_FAILURE, error };
  }
}

function addMovie(movie) {
  return (dispatch) => {
    dispatch(request(movie));

    movieService.addMovie(movie).then(
      (movies) => dispatch(success(movies)),
      (error) => dispatch(failure(movie, error.toString()))
    );
  };
  function request() {
    return { type: movieConstants.NEW_MOVIE_REQUEST };
  }
  function success(movies) {
    return { type: movieConstants.NEW_MOVIE_SUCCESS, movies };
  }
  function failure(error) {
    return { type: movieConstants.NEW_MOVIE_FAILURE, error };
  }
}

function updateMovie(_id, movie) {
  return (dispatch) => {
    dispatch(request(movie));

    movieService.updateMovie(_id, movie).then(
      (movies) => dispatch(success(movies)),
      (error) => dispatch(failure(movie, error.toString()))
    );
  };

  function request() {
    return { type: movieConstants.UPDATE_MOVIE_REQUEST };
  }
  function success(movies) {
    return { type: movieConstants.NEW_MOVIE_SUCCESS, movies };
  }
  function failure(error) {
    return { type: movieConstants.NEW_MOVIE_FAILURE, error };
  }
}
