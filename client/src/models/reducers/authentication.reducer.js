import { userConstants } from "../constants";
import {message} from 'antd';

let user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        loading: true,
      };
    case userConstants.LOGIN_SUCCESS:
      if (action?.user?.error) {
        message.error(action?.user?.error);

        return {
          user: null,
          loading: false,
          loggedIn: false,
        };
      }
      return {
        loggedIn: true,
        user: action.user,
        loading: false,
      };
    case userConstants.LOGIN_FAILURE:
      return {
        user: null,
        loading: false,
        loggedIn: false,
      };
    case userConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
