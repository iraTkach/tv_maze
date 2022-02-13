import { api, authHeader } from "./api";

export const movieService = {
  getAll, addMovie, updateMovie
};

async function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const response = await fetch(api.movies, requestOptions);
  return handleResponse(response);
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

async function addMovie(movie) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  };

  return fetch(`${api.movies}`, requestOptions).then(handleResponse);
}

async function updateMovie(_id, movie) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  };

  return fetch(`${api.movies}/${_id}`, requestOptions).then(handleResponse);
}


