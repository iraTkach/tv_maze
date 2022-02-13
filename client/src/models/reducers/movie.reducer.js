import { movieConstants } from "../constants";

export function movies(state = {}, action) {
  switch (action.type) {
    case movieConstants.GETALL_REQUEST:
    case movieConstants.NEW_MOVIE_REQUEST:
    case movieConstants.UPDATE_MOVIE_REQUEST:
      return {
        loading: true,
      };
    case movieConstants.GETALL_SUCCESS:
    case movieConstants.NEW_MOVIE_SUCCESS:
    case movieConstants.UPDATE_MOVIE_SUCCESS:
      return {
        items: action.movies,
        loading: false,
      };
    case movieConstants.GETALL_FAILURE:
    case movieConstants.NEW_MOVIE_FAILURE:
    case movieConstants.UPDATE_MOVIE_FAILURE:
      return {
        error: action.error,
        loading: false,
      };

    default:
      return state;
  }
}
