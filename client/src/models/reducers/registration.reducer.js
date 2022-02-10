import { userConstants } from "../constants";
import { message } from "antd";

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return {
        loading: true,
        registering: true,
      };
    case userConstants.REGISTER_SUCCESS:
      if (action?.user?.error) {
        message.error(action?.user?.error);

        return {
          registering: false,
        };
      }
      return {
        loading: false,
      };
    case userConstants.REGISTER_FAILURE:
      return {};
    default:
      return state;
  }
}
