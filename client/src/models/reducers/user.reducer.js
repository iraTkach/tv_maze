import { userConstants } from "../constants";

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
    case userConstants.SUBSCRIPTION_REQUEST:
    case userConstants.MOVIE_SUBSCRIPTION_REQUEST:
      return {
        loading: true,
      };
    case userConstants.GETALL_SUCCESS:
    case userConstants.SUBSCRIPTION_SUCCESS:
      return {
        items: action.users,
        loading: false,
      };
    case userConstants.MOVIE_SUBSCRIPTION_SUCCESS:
      return {
        movie: action.movie,
        loading: false,
      };
    case userConstants.GETALL_FAILURE:
    case userConstants.SUBSCRIPTION_FAILURE:
    case userConstants.MOVIE_SUBSCRIPTION_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    case userConstants.NEW_USER_REQUEST:
    case userConstants.NEW_ADMIN_USER_REQUEST:
    case userConstants.UPDATE_ADMIN_USER_REQUEST:
    case userConstants.USER_PERMISSIONS_REQUEST:
      return {
        loading: true,
      };
    case userConstants.NEW_USER_SUCCESS:
      return {
        items: action.users,
        loading: false,
      };
    case userConstants.USER_PERMISSIONS_SUCCESS:
      return {
        items: action.items,
        permissions: action.permissions,
        loading: false,
      };
    case userConstants.NEW_USER_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map((user) =>
          user.id === action.id ? { ...user, deleting: true } : user
        ),
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter((user) => user.id !== action.id),
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user
      return {
        ...state,
        items: state.items.map((user) => {
          if (user.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...userCopy } = user;
            // return copy of user with 'deleteError:[error]' property
            return { ...userCopy, deleteError: action.error };
          }

          return user;
        }),
      };
    default:
      return state;
  }
}
