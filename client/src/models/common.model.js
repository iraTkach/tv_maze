import { combineReducers } from "redux";

const UPDATE_STATE = "UPDATE_STATE";
const GET_USERS = "GET_USERS";

export function updateState(payload) {
  return {
    type: UPDATE_STATE,
    payload,
  };
}

export function getUsers() {debugger
  return {
    type: GET_USERS,
    payload: 'userModel'
  };
}

function models(state = {}, action, payload) {
  switch (action.type) {
    case UPDATE_STATE:
      return [...state, ...payload];
    case GET_USERS:
        debugger
      return [...state, ...payload];
    default:
      return state;
  }
}

const commonModel = combineReducers({ models });

export default commonModel;
