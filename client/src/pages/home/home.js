import React, { useEffect } from "react";
import { connect } from "react-redux";
import { mainActions } from "./../../models/actions/main.actions";

const Home = (props) => {
  const { title, back, updateMeta } = props;

  useEffect(() => {
    updateMeta(title, back);
  }, [title, back, updateMeta]);

  return <div>home</div>;
};

function mapState(state) {
  return { ...state };
}

const homeCreators = {
  updateMeta: mainActions.updateMeta,
};

export default connect(mapState, homeCreators)(Home);
