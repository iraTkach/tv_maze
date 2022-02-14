import { subscriptionConstants } from "../constants";
import { subscriptionService } from "../../services/subscription.service";

export const subscriptionActions = {
  getUserSubscriptions,
  addSubscription,
  deleteSubscription
};

function getUserSubscriptions(id) {
  return (dispatch) => {
    dispatch(request());

    subscriptionService.getAll(id).then(
      (movies) => dispatch(success(movies)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: subscriptionConstants.GETALL_REQUEST };
  }
  function success(movies) {
    return { type: subscriptionConstants.GETALL_SUCCESS, movies };
  }
  function failure(error) {
    return { type: subscriptionConstants.GETALL_FAILURE, error };
  }
}

function addSubscription(id, subscription) {
  return (dispatch) => {
    dispatch(request());

    subscriptionService.addSubscription(id, subscription).then(
      (movies) => dispatch(success(movies)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: subscriptionConstants.NEW_SUBSCRIPTION_REQUEST };
  }
  function success(movies) {
    return { type: subscriptionConstants.NEW_SUBSCRIPTION_SUCCESS, movies };
  }
  function failure(error) {
    return { type: subscriptionConstants.NEW_SUBSCRIPTION_FAILURE, error };
  }
}

function deleteSubscription(id, subscriptions) {
  return (dispatch) => {
    dispatch(request());

    subscriptionService.deleteSubscription(id).then(
      () => dispatch(success(id, subscriptions)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: subscriptionConstants.DELETE_SUBSCRIPTION_REQUEST };
  }
  function success(id, subscriptions) {
    return { type: subscriptionConstants.DELETE_SUBSCRIPTION_SUCCESS, id, subscriptions };
  }
  function failure(error) {
    return { type: subscriptionConstants.DELETE_SUBSCRIPTION_FAILURE, error };
  }
}
