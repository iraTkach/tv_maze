import { memberConstants } from "../constants";

export function members(state = {}, action) {
  switch (action.type) {
    case memberConstants.GETALL_REQUEST:
    case memberConstants.GET_MEMBER_REQUEST:
    case memberConstants.NEW_MEMBER_REQUEST:
    case memberConstants.UPDATE_MEMBER_REQUEST:
      return {
        loading: true,
      };
    case memberConstants.GETALL_SUCCESS:
      return {
        items: action.members,
        loading: false,
      };
    case memberConstants.GET_MEMBER_SUCCESS:
      return {
        member: action.member,
        loading: false,
      };
    case memberConstants.GETALL_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    case memberConstants.NEW_MEMBER_SUCCESS:
      return {
        items: action.members,
        loading: false,
      };
    case memberConstants.NEW_MEMBER_FAILURE:
      return {
        error: action.error,
        loading: false,
      };
    case memberConstants.DELETE_REQUEST:
      // add 'deleting:true' property to member being deleted
      return {
        ...state,
        items: state.items.map((member) =>
          member.id === action.id ? { ...member, deleting: true } : member
        ),
      };
    case memberConstants.DELETE_SUCCESS:
      // remove deleted member from state
      return {
        items: state.items.filter((member) => member.id !== action.id),
      };
    case memberConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to member
      return {
        ...state,
        items: state.items.map((member) => {
          if (member.id === action.id) {
            // make copy of member without 'deleting:true' property
            const { deleting, ...memberCopy } = member;
            // return copy of member with 'deleteError:[error]' property
            return { ...memberCopy, deleteError: action.error };
          }

          return member;
        }),
      };
    default:
      return state;
  }
}
