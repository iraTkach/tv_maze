const SERVER = {
    url: 'http://localhost:8000'
}

export const api = {
  users: `${SERVER.url}/api/users`,
  movies: `${SERVER.url}/api/movies`,
};

/**
 * @async
 * @param {string} url
 * @returns
 */
export const requestGet = async (url) => {
  const response = await fetch(url, {
    credentials: "same-origin",
    mode: "cors",
  });
  return await response.json();
};

/**
 * @async
 * @param {string} url
 * @param {*} data
 * @returns
 */
export const requestPost = async (url, data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  return await response.json(); // parses JSON response into native JavaScript objects
};

export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  } else {
    return {};
  }
}
