import { combineReducers } from "redux";

import { authentication } from "./authentication.reducer";
import { registration } from "./registration.reducer";
import { users } from "./user.reducer";
import { notification } from "./alert.reducer";
import { metadata } from "./main.reducer";
import { movies } from './movie.reducer';
import { members } from './member.reducer';
import { subscriptions } from './subscription.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  subscriptions,
  notification,
  metadata,
  movies,
  members
});

export default rootReducer;
