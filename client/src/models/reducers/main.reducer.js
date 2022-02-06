import { mainConstants } from "../constants";

export function metadata(state = {}, action) {
  switch (action.type) {
    case mainConstants.UPDATE_META:
      return {
        title: action.title,
        back: action.back,
        buttons: action.buttons,
      };
    default:
      return state;
  }
}
