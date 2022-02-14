import { memberConstants } from "../constants";
import { memberService } from "../../services/member.service";

export const memberActions = {
  getAll,
  delete: _delete,
  getMember,
  addMember,
  updateMember,
  handleUserSubs,
  getMovieSubs,
};

function getAll() {
  return (dispatch) => {
    dispatch(request());

    memberService.getAll().then(
      (members) => dispatch(success(members)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: memberConstants.GETALL_REQUEST };
  }
  function success(members) {
    return { type: memberConstants.GETALL_SUCCESS, members };
  }
  function failure(error) {
    return { type: memberConstants.GETALL_FAILURE, error };
  }
}

function getMember(id) {
  return (dispatch) => {
    dispatch(request(id));

    memberService.getMember(id).then(
      (member) => dispatch(success(member)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: memberConstants.GET_MEMBER_REQUEST };
  }
  function success(member) {
    return { type: memberConstants.GET_MEMBER_SUCCESS, member };
  }
  function failure(error) {
    return { type: memberConstants.GET_MEMBER_FAILURE, error };
  }
}

function handleUserSubs(member, movies) {
  return (dispatch) => {
    dispatch(request(member));

    memberService.updateUserSubs(member.permission._id, movies).then(
      (members) => dispatch(success(members)),
      (error) => dispatch(failure(member, error.toString()))
    );
  };

  function request() {
    return { type: memberConstants.SUBSCRIPTION_REQUEST };
  }
  function success(members) {
    return { type: memberConstants.SUBSCRIPTION_SUCCESS, members };
  }
  function failure(error) {
    return { type: memberConstants.SUBSCRIPTION_FAILURE, error };
  }
}

function getMovieSubs(movie) {
  return (dispatch) => {
    dispatch(request(movie));

    memberService.getMovieSubs(movie._id).then(
      (movie) => dispatch(success(movie)),
      (error) => dispatch(failure(movie, error.toString()))
    );
  };

  function request() {
    return { type: memberConstants.MOVIE_SUBSCRIPTION_REQUEST };
  }
  function success(movie) {
    return { type: memberConstants.MOVIE_SUBSCRIPTION_SUCCESS, movie };
  }
  function failure(error) {
    return { type: memberConstants.MOVIE_SUBSCRIPTION_FAILURE, error };
  }
}

function addMember(member) {
  return (dispatch) => {
    dispatch(request(member));

    memberService.addMember(member).then(
      (members) => dispatch(success(members)),
      (error) => dispatch(failure(member, error.toString()))
    );
  };

  function request() {
    return { type: memberConstants.NEW_MEMBER_REQUEST };
  }
  function success(members) {
    return { type: memberConstants.NEW_MEMBER_SUCCESS, members };
  }
  function failure(error) {
    return { type: memberConstants.NEW_MEMBER_FAILURE, error };
  }
}

function updateMember(_id, member) {
  return (dispatch) => {
    dispatch(request(member));

    memberService.updateMember(_id, member).then(
      (members) => dispatch(success(members)),
      (error) => dispatch(failure(member, error.toString()))
    );
  };

  function request() {
    return { type: memberConstants.UPDATE_MEMBER_REQUEST };
  }
  function success(members) {
    return { type: memberConstants.NEW_MEMBER_SUCCESS, members };
  }
  function failure(error) {
    return { type: memberConstants.NEW_MEMBER_FAILURE, error };
  }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return (dispatch) => {
    dispatch(request(id));

    memberService.delete(id).then(
      (member) => dispatch(success(id)),
      (error) => dispatch(failure(id, error.toString()))
    );
  };

  function request(id) {
    return { type: memberConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: memberConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: memberConstants.DELETE_FAILURE, id, error };
  }
}
