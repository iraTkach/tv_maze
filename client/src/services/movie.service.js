import { api, authHeader } from "./api";

export const movieService = {
  getAll,
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


