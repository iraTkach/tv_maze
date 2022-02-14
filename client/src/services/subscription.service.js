import { api, authHeader } from "./api";
import { message } from "antd";

export const subscriptionService = {
  getAll,
  addSubscription,
  deleteSubscription,
};

async function getAll(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const response = await fetch(`${api.members}/${id}/movies`, requestOptions);
  return handleResponse(response);
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

async function addSubscription(id, subscription) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  };

  return fetch(`${api.members}/${id}/movies`, requestOptions).then(
    handleResponse
  );
}

async function deleteSubscription(id) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(`${api.subscriptions}/${id}`, requestOptions).then((response) =>
    handleResponse(response, false)
  );
}
