import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { mainActions } from "../../models/actions/main.actions";
import { movieActions } from "./../../models/actions/movie.actions";
import { userActions } from "./../../models/actions/user.actions";
import { Link } from "react-router-dom";
import { AddMovie } from "./add.movie";

import {
  Modal,
  Avatar,
  Card,
  Spin,
  Divider,
  Row,
  Col,
  Tag,
  Button,
  Tooltip,
} from "antd";

import {
  EyeOutlined,
  EditOutlined,
  FrownOutlined,
  EyeInvisibleOutlined,
  HeartTwoTone,
} from "@ant-design/icons";

import { sanitize } from "./../../utils/form";
import styles from "./movies.module.css";

const getButtons = (user, loading, onClick) => {
  return (
    user?.permission?.abilities?.createMovie && [
      <Button loading={loading} key="new" type="primary" onClick={onClick}>
        New
      </Button>,
    ]
  );
};

const { Meta } = Card;

const Movies = (props) => {
  const {
    user,
    users,
    movies,
    title,
    back,
    updateMeta,
    getAll,
    updateMovie,
    addMovie,
    handleUserSubs,
    getMovieSubs,
  } = props;

  const [abilities, setAbilities] = useState(user?.permission?.abilities || {});
  const [selectedMovies, setSelectedMovies] = useState({});

  useEffect(() => {
    updateMeta(
      title,
      back,
      getButtons(user, movies?.loading, () => handleAddNewMovie("Add Movie"))
    );

    setAbilities(user?.permission?.abilities || {});

    const subscriptions = user?.subscriptions || [];
    setSelectedMovies({
      ...subscriptions.reduce((a, v) => ({ ...a, [v]: true }), {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, movies, back, title, updateMeta]);

  const { viewMovie, viewSub, createSub } = abilities;

  useEffect(() => {
    !!viewMovie && getAll();
  }, [viewMovie, getAll]);

  const colProps = {
    xs: 12,
    sm: 8,
    md: 6,
    ls: 4,
    xl: 4,
    xxl: 4,
  };

  const handleAddNewMovie = (_title) => {
    setIsMovieForm(true);
    setModalTitle(_title);
    setIsEdit(false);
    setFields(null);
  };

  const handleEditMovie = (_title, movie) => {
    setIsMovieForm(true);
    setModalTitle(_title);
    setIsEdit(true);
    setFields(movie);
  };

  const showSubscribers = (movie) => {
    setIsSubscribersVisible(true);
    getMovieSubs(movie);
  };

  const cancelSubscribers = () => {
    setIsSubscribersVisible(false);
  };

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setIsMovieForm(false);
    addMovie(sanitize(values));
  };

  const onUpdate = (values) => {
    console.log("Received values of form: ", values);
    setIsMovieForm(false);
    updateMovie(fields._id, sanitize(values));
  };

  const handleSubscription = (movie) => {
    let subs = { ...selectedMovies };
    if (subs[movie._id]) {
      delete subs[movie._id];
    } else {
      subs = {
        ...subs,
        [movie._id]: true,
      };
    }

    setSelectedMovies({ ...subs });

    handleUserSubs(user, Object.keys(subs));
  };

  const [isSubscribersVisible, setIsSubscribersVisible] = useState(false);
  const [isMovieForm, setIsMovieForm] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Movie");
  const [isEdit, setIsEdit] = useState(false);
  const [fields, setFields] = useState(null);

  const loading = viewMovie ? movies?.loading : false;

  return (
    <Spin spinning={loading}>
      {movies?.items?.length ? (
        <Row className={styles.movies} gutter={[20, 20]}>
          {movies?.items?.map((movie, idx) => (
            <Col key={idx} {...colProps}>
              <Card
                hoverable
                className={styles.card}
                cover={
                  <div className={styles.imgWrapper}>
                    <img alt={movie.name} src={movie.image} />
                    {createSub && (
                      <div
                        className={styles.heart}
                        onClick={() => handleSubscription(movie)}
                      >
                        <HeartTwoTone
                          twoToneColor={
                            selectedMovies[movie._id] ? "#eb2f96" : "#cccccc"
                          }
                        />
                      </div>
                    )}
                  </div>
                }
                actions={[
                  viewSub ? (
                    <EyeOutlined
                      key="subscribers"
                      onClick={() => showSubscribers(movie)}
                    />
                  ) : (
                    <Tooltip title="User have no credentials to view movie subscribers.">
                      <EyeInvisibleOutlined key="subscribers" />
                    </Tooltip>
                  ),
                  abilities.updateMovie ? (
                    <EditOutlined
                      key="edit"
                      onClick={() => handleEditMovie("Edit Movie", movie)}
                    />
                  ) : (
                    <Tooltip title="User have no credentials to edit movie.">
                      <FrownOutlined key="edit" />
                    </Tooltip>
                  ),
                ]}
              >
                <Meta
                  title={movie.name}
                  description={
                    <div className={styles.desc}>
                      <div>
                        <strong>Premiered at: </strong>
                        <span>
                          {new Date(movie.premiered).toLocaleDateString()}
                        </span>
                      </div>
                      <Divider orientation="left" plain>
                        Genres
                      </Divider>
                      <div className={styles.tags}>
                        {movie.genres.map((genre, idx) => (
                          <Tag key={idx}>{genre}</Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        "No movies available for the current user."
      )}
      <Modal
        className={styles.subscribers}
        title="Subscribers"
        visible={isSubscribersVisible}
        onCancel={cancelSubscribers}
        footer={[
          <Button key="ok" onClick={cancelSubscribers}>
            Ok
          </Button>,
        ]}
      >
        <Spin spinning={users?.loading}>
          {users?.movie?.subscribers?.map((_user, idx) => (
            <div className={styles.subscriberWrapper} key={idx}>
              <Avatar src="https://joeschmoe.io/api/v1/random" />
              {user.isAdmin ? (
                <Link to={`/users/${_user._id}`}>{_user.userName}</Link>
              ) : (
                <span>{_user.userName}</span>
              )}
            </div>
          ))}
        </Spin>
      </Modal>
      {isMovieForm && (
        <AddMovie
          fields={fields}
          title={modalTitle}
          visible={isMovieForm}
          isEdit={isEdit}
          onSave={(values) => (isEdit ? onUpdate(values) : onCreate(values))}
          onCancel={() => {
            setIsMovieForm(false);
          }}
        />
      )}
    </Spin>
  );
};

function mapState(state) {
  const { movies, users } = state;
  return { movies, users };
}

const moviesCreators = {
  getAll: movieActions.getAll,
  updateMeta: mainActions.updateMeta,
  addMovie: movieActions.addMovie,
  updateMovie: movieActions.updateMovie,
  getMovieSubs: userActions.getMovieSubs,
  handleUserSubs: userActions.handleUserSubs,
};

export default connect(mapState, moviesCreators)(Movies);
