import { combineReducers } from "redux";

import { authentication } from "./authentication.reducer";
import { registration } from "./registration.reducer";
import { users } from "./user.reducer";
import { notification } from "./alert.reducer";
import { metadata } from "./main.reducer";
import { movies } from './movie.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  notification,
  metadata,
  movies
});

export default rootReducer;
