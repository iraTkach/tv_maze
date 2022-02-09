import { userConstants } from "../constants";
import { userService } from "../../services/user.service";
import { alertActions } from "./alert.actions";
import { history } from "./../../services/history.service";

export const userActions = {
  login,
  logout,
  register,
  getAll,
  delete: _delete,
  addAdminUser,
  updateAdminUser,
  userPermissions,
};

function login({ user }) {
  const { username, password } = user;
  return (dispatch) => {
    dispatch(request({ username }));

    userService.login(username, password).then(
      (user) => {
        dispatch(success(user));
        history.push("/");
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.register(user).then(
      (user) => {
        dispatch(success());
        history.push("/login");
        dispatch(alertActions.success("Registration successful"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function getAll() {
  return (dispatch) => {
    dispatch(request());

    userService.getAll().then(
      (users) => dispatch(success(users)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(users) {
    return { type: userConstants.GETALL_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error };
  }
}

function addAdminUser(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.addAdminUser(user).then(
      (users) => dispatch(success(users)),
      (error) => dispatch(failure(user, error.toString()))
    );
  };

  function request() {
    return { type: userConstants.NEW_ADMIN_USER_REQUEST };
  }
  function success(users) {
    return { type: userConstants.NEW_USER_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.NEW_USER_FAILURE, error };
  }
}

function updateAdminUser(_id, user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.updateAdminUser(_id, user).then(
      (users) => dispatch(success(users)),
      (error) => dispatch(failure(user, error.toString()))
    );
  };

  function request() {
    return { type: userConstants.UPDATE_ADMIN_USER_REQUEST };
  }
  function success(users) {
    return { type: userConstants.NEW_USER_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.NEW_USER_FAILURE, error };
  }
}

function userPermissions(user, users) {
  return (dispatch) => {
    dispatch(request(user));

    userService.userPermissions(user._id).then(
      (permissions) => dispatch(success(permissions, users)),
      (error) => dispatch(failure(user, error.toString()))
    );
  };

  function request() {
    return { type: userConstants.USER_PERMISSIONS_REQUEST };
  }
  function success(permissions, { items }) {
    return { type: userConstants.USER_PERMISSIONS_SUCCESS, permissions, items };
  }
  function failure(error) {
    return { type: userConstants.NEW_USER_FAILURE, error };
  }
}
// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return (dispatch) => {
    dispatch(request(id));

    userService.delete(id).then(
      (user) => dispatch(success(id)),
      (error) => dispatch(failure(id, error.toString()))
    );
  };

  function request(id) {
    return { type: userConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: userConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: userConstants.DELETE_FAILURE, id, error };
  }
}
