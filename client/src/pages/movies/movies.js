import React, { useEffect } from "react";
import { connect } from "react-redux";
import { mainActions } from "../../models/actions/main.actions";
import { movieActions } from "./../../models/actions/movie.actions";
import { Avatar, Card, Spin, Divider, Row, Col, Tag } from "antd";
import { EyeOutlined, SettingOutlined } from "@ant-design/icons";

import styles from "./movies.module.css";

const { Meta } = Card;

const Movies = (props) => {
  const { user, movies, title, back, updateMeta, getAll } = props;

  useEffect(() => {
    updateMeta(title, back);
  }, [title, back, updateMeta]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  const colProps = {
    xs: 24,
    sm: 12,
    md: 8,
    ls: 6,
    xl: 4,
    xxl: 4,
  };

  return (
    <Spin spinning={movies?.loading}>
      <Row className={styles.movies} gutter={[20, 20]}>
        {movies?.items?.map((movie, idx) => (
          <Col key={idx} {...colProps}>
            <Card
              className={styles.card}
              cover={<img alt={movie.name} src={movie.image} />}
              actions={[
                <EyeOutlined key="subscribers" />,
                <SettingOutlined key="edit" />,
              ]}
            >
              <Meta
                // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
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
    </Spin>
  );
};

function mapState(state) {
  const { movies } = state;
  return { movies };
}

const moviesCreators = {
  getAll: movieActions.getAll,
  updateMeta: mainActions.updateMeta,
};

export default connect(mapState, moviesCreators)(Movies);
