import React, { useEffect, useState } from "react";
import { Button, Spin, Table, Popconfirm, Row, Col, Card, Avatar } from "antd";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { subscriptionActions } from "../../../models/actions/subscription.actions";
import { mainActions } from "../../../models/actions/main.actions";
import { memberActions } from "./../../../models/actions/member.actions";

import { DeleteOutlined } from "@ant-design/icons";

import styles from "./subscription.module.css";
import { sanitize } from "../../../utils/form";
import { AddSubscription } from "./add.subscription";
import { movieActions } from "./../../../models/actions/movie.actions";

const { Meta } = Card;

const getButtons = (user, loading, onClick) => {
  const { createSub } = user?.permission?.abilities || {};
  return (
    (user?.isAdmin || createSub) && [
      <Button loading={loading} key="new" type="primary" onClick={onClick}>
        New
      </Button>,
    ]
  );
};

const Subscriptions = (props) => {
  const {
    title,
    back,
    user,
    member,
    movies,
    subscriptions = {},
    getAllSubscriptions,
    getAllMovies,
    updateMeta,
    getMember,
    addSubscription,
    deleteSubscription,
  } = props;

  const params = useParams();

  useEffect(() => {
    if (user && params.id) {
      getMember(params.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.id]);

  useEffect(() => {
    if (member && params.id) {
      getAllSubscriptions(params.id);
      getAllMovies();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllSubscriptions, params.id, member]);

  useEffect(() => {
    updateMeta(
      `${member?.name}, ${title}`,
      back,
      getButtons(user, subscriptions?.loading, () =>
        handleAddNewSubscription("Add Subscription")
      )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, member, subscriptions, back, title]);

  const handleAddNewSubscription = (_title) => {
    setIsMovieForm(true);
    setModalTitle(_title);
    setIsEdit(false);
    setFields(null);
  };

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setIsMovieForm(false);
    addSubscription(params.id, sanitize(values));
  };

  const [isMovieForm, setIsMovieForm] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Movie");
  const [isEdit, setIsEdit] = useState(false);
  const [fields, setFields] = useState(null);

  const colProps = {
    xs: 12,
    sm: 8,
    md: 6,
    ls: 4,
    xl: 4,
    xxl: 4,
  };

  const subsIds = subscriptions?.items?.map((movie) => movie.movieId);
  const subscribedMovies = movies?.items?.filter((movie) =>
    subsIds?.includes(movie._id)
  );

  const handleDelete = (id) => {
    deleteSubscription(id, subscriptions);
  };

  return (
    <Spin spinning={subscriptions?.loading}>
      {subscribedMovies?.length ? (
        <Row className={styles.movies} gutter={[20, 20]}>
          {subscribedMovies?.map((movie, idx) => {
            const sub = subscriptions?.items.find(
              (s) => s.movieId === movie._id
            );
            return (
              <Col key={idx} {...colProps}>
                <Card
                  hoverable
                  className={styles.card}
                  cover={
                    <div className={styles.imgWrapper}>
                      <img alt={movie.name} src={movie.image} />
                    </div>
                  }
                  actions={[
                    <Popconfirm
                      title={"Are you sure want to delete subscription?"}
                      onConfirm={() => handleDelete(sub._id)}
                    >
                      <DeleteOutlined />,
                    </Popconfirm>,
                  ]}
                >
                  <Meta
                    title={movie.name}
                    description={
                      <div className={styles.desc}>
                        <div>
                          <strong>Subscribed at: </strong>
                          <span>
                            {new Date(sub?.subscribedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        "No movies available for the current user."
      )}
      {isMovieForm && (
        <AddSubscription
          movies={movies?.items}
          fields={fields}
          title={modalTitle}
          visible={isMovieForm}
          isEdit={isEdit}
          onSave={(values) => onCreate(values)}
          onCancel={() => {
            setIsMovieForm(false);
          }}
        />
      )}
    </Spin>
  );
};

function mapState(state) {
  const {
    movies,
    members: { member },
    subscriptions,
    authentication: { user },
  } = state;
  return { subscriptions, user, member, movies };
}

const subscriptionCreators = {
  getAllMovies: movieActions.getAll,
  getAllSubscriptions: subscriptionActions.getUserSubscriptions,
  addSubscription: subscriptionActions.addSubscription,
  deleteSubscription: subscriptionActions.deleteSubscription,
  getMember: memberActions.getMember,
  updateMeta: mainActions.updateMeta,
};

export default connect(mapState, subscriptionCreators)(Subscriptions);
