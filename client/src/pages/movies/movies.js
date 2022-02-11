import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { mainActions } from "../../models/actions/main.actions";
import { movieActions } from "./../../models/actions/movie.actions";
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
} from "antd";
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
    xs: 12,
    sm: 8,
    md: 6,
    ls: 4,
    xl: 4,
    xxl: 4,
  };

  const [isSubscribersVisible, setIsSubscribersVisible] = useState(false);

  const showSubscribers = () => {
    setIsSubscribersVisible(true);
  };

  const cancelSubscribers = () => {
    setIsSubscribersVisible(false);
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
                <EyeOutlined key="subscribers" onClick={showSubscribers} />,
                <SettingOutlined key="edit" />,
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
      <Modal
        title="Subscribers"
        visible={isSubscribersVisible}
        onCancel={cancelSubscribers}
        footer={[
          <Button key="ok" onClick={cancelSubscribers}>
            Ok
          </Button>,
        ]}
      >
        <div>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
          <span>John Doe</span>
        </div>
        <div>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
          <span>John Doe</span>
        </div>
        <div>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
          <span>John Doe</span>
        </div>
      </Modal>
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
