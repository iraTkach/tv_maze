import { api, authHeader } from "./api";

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
  addAdminUser,
  updateAdminUser,
  userPermissions,  
  updateUserSubs,
  getMovieSubs
};

async function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  const response = await fetch(`${api.users}/authenticate`, requestOptions);
  const user = await handleResponse(response);

  if (user?.isSignedIn) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    window.localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
}

async function logout() {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: window.localStorage.getItem("user"),
  };

  await fetch(`${api.users}/logout`, requestOptions);

  // remove user from local storage to log user out
  window.localStorage.removeItem("user");
  window.location.replace("/login");
}

async function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const response = await fetch(api.users, requestOptions);
  return handleResponse(response);
}

async function addAdminUser(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`${api.users}/admin`, requestOptions).then(handleResponse);
}

async function updateAdminUser(_id, user) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(`${api.users}/${_id}`, requestOptions).then(handleResponse);
}

/**
 * @async
 * @param {*} _id
 * @returns
 */
async function userPermissions(_id) {
  const requestOptions = {
    method: "get",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(`${api.users}/permissions/${_id}`, requestOptions).then(
    handleResponse
  );
}

async function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${api.users}/${id}`, requestOptions).then(handleResponse);
}

async function updateUserSubs(_id, movies) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movies),
  };

  return fetch(`${api.users}/${_id}`, requestOptions).then(handleResponse);
}

async function getMovieSubs(_id) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  return fetch(`${api.movies}/${_id}/users`, requestOptions).then(handleResponse);
}

async function register(user) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  const response = await fetch(`${api.users}/register`, requestOptions);
  return handleResponse(response);
}

async function update(user) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  const response = await fetch(
    `${api.apiUrl}/users/${user.id}`,
    requestOptions
  );
  return handleResponse(response);
}

// prefixed function name with underscore because delete is a reserved word in javascript
async function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };

  const response = await fetch(`${api.apiUrl}/users/${id}`, requestOptions);
  return handleResponse(response);
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
