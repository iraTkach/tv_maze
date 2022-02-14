import { subscriptionConstants } from "../constants";

export function subscriptions(state = {}, action) {
  switch (action.type) {
    case subscriptionConstants.GETALL_REQUEST:
    case subscriptionConstants.NEW_SUBSCRIPTION_REQUEST:
    case subscriptionConstants.DELETE_SUBSCRIPTION_REQUEST:
      return {
        loading: true,
      };
    case subscriptionConstants.GETALL_SUCCESS:
    case subscriptionConstants.NEW_SUBSCRIPTION_SUCCESS:
      return {
        items: action.movies,
        loading: false,
      };
    case subscriptionConstants.DELETE_SUBSCRIPTION_SUCCESS:          
      return {
        items: action.subscriptions.items.filter(s => s._id !== action.id),
        loading: false,
      };
    case subscriptionConstants.GETALL_FAILURE:
    case subscriptionConstants.NEW_SUBSCRIPTION_FAILURE:
    case subscriptionConstants.DELETE_SUBSCRIPTION_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
