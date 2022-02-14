import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main.layout";
import Users from "./pages/users";
import { history } from "./services/history.service";
import { alertActions } from "./models/actions";
import { connect } from "react-redux";
import Login from "./pages/login";
import { Result } from "antd";
import Movies from "./pages/movies";
import Members from "./pages/members";
import Subscriptions from "./pages/members/subscriptions";

const App = (props) => {
  useEffect(() => {
    history.listen((location, action) => {
      // Clear alert on location change
      props.clearAlerts();
    });
  });

  const { alert } = props;

  // TODO (Ira Tkach): Create redux call to check if user is
  // available and loggedin in the system.
  const userJson = window.localStorage.getItem("user");
  let user = null;

  if (userJson) {
    try {
      user = JSON.parse(userJson);
      if (user.error) {
        user = null;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout user={user} alert={alert} />}>
          <Route
            path="/"
            element={<Movies user={user} title="Movies" back={false} />}
          />
          <Route
            path="/login"
            element={<Login user={user} title="Login" back={false} />}
          />
          <Route
            path="/register"
            element={
              <Login
                user={user}
                title="Register"
                back={false}
                isRegister={true}
              />
            }
          />

          {user?.isAdmin && (
            <Route
              path="/users"
              element={
                <Users user={user} title="Users management" back={false} />
              }
            >
              <Route
                path="/users/:id"
                element={
                  <Users
                    user={user}
                    title="Users management"
                    back={false}
                    showUser={true}
                  />
                }
              />
            </Route>
          )}
          <Route
            path="/members"
            element={<Members user={user} title="Members" back={false} />}
          />
          <Route
            path="/members/:id/movies"
            element={
              <Subscriptions
                user={user}
                title="Subscribed to Movies"
                back={false}
              />
            }
          />
          <Route
            path="*"
            element={
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            }
          />
        </Route>
        <Route path={"users1"} element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
};

function mapState(state) {
  const {
    alert,
    authentication: { user },
  } = state;
  return { alert, user };
}

const actionCreators = {
  clearAlerts: alertActions.clear,
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };
