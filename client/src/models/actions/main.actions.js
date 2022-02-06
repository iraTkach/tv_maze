import { mainConstants } from "../constants";

export const mainActions = {
  updateMeta
};

function updateMeta(title, back, buttons) {
  return (dispatch) => {
    dispatch(request(title, back, buttons));
  };

  function request(title) {
    return { type: mainConstants.UPDATE_META, title, back, buttons };
  }
}