import { api, authHeader } from "./api";
import { message } from "antd";

export const memberService = {
  getAll,
  getById,
  update,
  delete: _delete,
  addMember,
  getMember,
  updateMember,
  updateUserSubs,
  getMovieSubs,
};

async function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const response = await fetch(api.members, requestOptions);
  return handleResponse(response);
}

async function addMember(member) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  };

  return fetch(`${api.members}`, requestOptions).then(handleResponse);
}

async function updateMember(_id, member) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  };

  return fetch(`${api.members}/${_id}`, requestOptions).then(handleResponse);
}

async function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${api.members}/${id}`, requestOptions).then(handleResponse);
}

async function updateUserSubs(_id, movies) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movies),
  };

  return fetch(`${api.members}/${_id}`, requestOptions).then(handleResponse);
}

async function getMovieSubs(_id) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(`${api.movies}/${_id}/members`, requestOptions).then(
    handleResponse
  );
}

async function getMember(_id) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(`${api.members}/${_id}`, requestOptions).then(handleResponse);
}

async function update(member) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(member),
  };

  const response = await fetch(
    `${api.apiUrl}/members/${member.id}`,
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

  const response = await fetch(`${api.members}/${id}`, requestOptions);
  return handleResponse(response, false);
}

function handleResponse(response, parse = true) {
  return response.text().then((text) => {
    if (!response.ok) {
      const error = response.statusText;
      message.error(`${error}: ${response.url}`);
      return Promise.reject(error);
    }

    if (parse) {
      const data = text && JSON.parse(text);
      return data;
    } else {
      return text;
    }
  });
}
