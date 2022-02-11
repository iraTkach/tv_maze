import { movieConstants } from "../constants";

export function movies(state = {}, action) {
  switch (action.type) {
    case movieConstants.GETALL_REQUEST:
      return {
        loading: true,
      };
    case movieConstants.GETALL_SUCCESS:
      return {
        items: action.movies,
        loading: false,
      };
    case movieConstants.GETALL_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}
