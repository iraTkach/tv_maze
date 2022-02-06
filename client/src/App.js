import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main.layout";
import Users from "./pages/users";
import Home from "./pages/home";
import { history } from "./services/history.service";
import { alertActions } from "./models/actions";
import { connect } from "react-redux";

const App = (props) => {
  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      props.clearAlerts();
    });
  });

  const { alert } = props;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout alert={alert} />}>
          <Route path="/" element={<Home title="Home" back={false} />} />
          <Route
            path="users"
            element={<Users title="Users management" back={true} />}
          />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
        <Route path={"users1"} element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
};

function mapState(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear,
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };
