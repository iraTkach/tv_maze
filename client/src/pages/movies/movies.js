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
  Input,
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
import { memberActions } from "./../../models/actions/member.actions";

const { Search } = Input;

const getButtons = (user, loading, onClick, onSearch) => {
  const actions = [<Search disabled={loading} placeholder="Search" onSearch={onSearch} onChange={onSearch} style={{ width: 200 }} />];
  return user?.permission?.abilities?.createMovie
    ? [
        ...actions,
        <Button loading={loading} key="new" type="primary" onClick={onClick}>
          New
        </Button>,
      ]
    : actions;
};

const { Meta } = Card;

const Movies = (props) => {
  const {
    user,
    movies,
    title,
    back,
    members,
    updateMeta,
    getAll,
    updateMovie,
    addMovie,
    handleUserSubs,
    getMovieSubs,
  } = props;

  const [abilities, setAbilities] = useState(user?.permission?.abilities || {});
  const [selectedMovies, setSelectedMovies] = useState({});
  const [filteredMovies, setFilteredMovies] = useState(movies?.items);

  useEffect(() => {
    updateMeta(
      title,
      back,
      getButtons(user, movies?.loading, () => handleAddNewMovie("Add Movie"), onSearch)
    );

    setAbilities(user?.permission?.abilities || {});

    const subscriptions = user?.subscriptions || [];
    setSelectedMovies({
      ...subscriptions.reduce((a, v) => ({ ...a, [v]: true }), {}),
    });

    setFilteredMovies(movies?.items);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, movies, back, title, updateMeta]);

  const { viewMovie, viewSub, createSub } = abilities;

  const onSearch = (e) => {
    const value = e?.target?.value || e;
    const regExp = new RegExp(value, 'ig')
    setFilteredMovies(movies?.items?.filter(movie => movie.name.match(regExp)));
  }

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
      {filteredMovies?.length ? (
        <Row className={styles.movies} gutter={[20, 20]}>
          {filteredMovies?.map((movie, idx) => (
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
        <Spin spinning={members?.loading}>
          {members?.subscribers?.length
            ? members?.subscribers?.map((member, idx) => (
                <div className={styles.subscriberWrapper} key={idx}>
                  <Avatar src={`https://joeschmoe.io/api/v1/random?${idx}`} />
                  {user.isAdmin ? (
                    <Link to={`/members/${member._id}`}>{member.name}</Link>
                  ) : (
                    <span>{member.name}</span>
                  )}
                </div>
              ))
            : "No movie subscribers"}
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
  const { movies, users, members } = state;
  return { movies, users, members };
}

const moviesCreators = {
  getAll: movieActions.getAll,
  updateMeta: mainActions.updateMeta,
  addMovie: movieActions.addMovie,
  updateMovie: movieActions.updateMovie,
  getMovieSubs: memberActions.getMovieSubs,
  handleUserSubs: userActions.handleUserSubs,
};

export default connect(mapState, moviesCreators)(Movies);
