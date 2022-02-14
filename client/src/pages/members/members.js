import React, { useEffect, useState } from "react";
import { Button, Spin, Table, Popconfirm, Row, Col, Card, Avatar } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { memberActions } from "../../models/actions/member.actions";
import { mainActions } from "../../models/actions/main.actions";
import { AddMember } from "./add.member";
import { history } from "../../services/history.service";
import {
  DeleteOutlined,
  EditOutlined,
  TableOutlined,
  IdcardOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";

import styles from "./member.module.css";
import { sanitize } from "../../utils/form";

const { Meta } = Card;

const getButtons = (user, loading, onClick) => {
  return (
    user?.isAdmin && [
      <Button loading={loading} key="new" type="primary" onClick={onClick}>
        New
      </Button>,
    ]
  );
};

const Members = (props) => {
  const {
    title,
    back,
    user,
    members = {},
    getAll,
    updateMeta,
    addMember,
    updateMember,
  } = props;

  useEffect(() => {
    user && getAll();
  }, [getAll, user]);

  useEffect(() => {
    updateMeta(
      title,
      back,
      getButtons(user, members?.loading, () => handleAddNewMember("Add Member"))
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, members, back, title]);

  const handleAddNewMember = (_title) => {
    setVisible(true);
    setModalTitle(_title);
    setIsEdit(false);
    setFields(null);
  };

  const handleEditMember = (_title, member) => {
    setVisible(true);
    setModalTitle(_title);
    setIsEdit(true);
    setFields(member);
  };

  const handleSubscriptions = member => {
    window.location.replace(`/members/${member._id}/movies`)
  }

  const dataSource = members?.items?.map((member, idx) => ({
    key: idx,
    _id: member._id,
    name: member.name,
    email: member.email,
    city: member.city,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render(email, data) {
        return (
          <Link
            to={`/members/${data._id}`}
            onClick={(e) => {
              e.preventDefault();
              handleEditMember("Edit Member", data);
            }}
          >
            {email}
          </Link>
        );
      },
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Actions",
      render(_, data) {
        return (
          <div className={styles.actions}>
            <EditOutlined
              onClick={() => {
                handleEditMember("Edit Member", data);
              }}
            />
            <VideoCameraOutlined
              onClick={() => {
                handleSubscriptions(data);
              }}
            />
            <Popconfirm
              title={`Are you sure to delete this member: ${data.memberName}?`}
              onConfirm={() => {
                alert("Delete");
              }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
    addMember(sanitize(values));
  };

  const onUpdate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
    updateMember(fields._id, sanitize(values));
  };

  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Member");
  const [isEdit, setIsEdit] = useState(false);
  const [fields, setFields] = useState(null);
  const [layout, setLayout] = useState("table");

  const changeLayout = () => {
    let value;
    if (layout === "table") value = "card";
    if (layout === "card") value = "table";
    setLayout(value);
  };

  const colProps = {
    xs: 12,
    sm: 8,
    md: 6,
    ls: 4,
    xl: 4,
    xxl: 4,
  };

  return (
    <Spin spinning={members?.loading}>
      <Button style={{ marginBottom: 20 }} onClick={changeLayout}>
        {layout === "table" ? <IdcardOutlined /> : <TableOutlined />}
      </Button>
      {layout === "table" ? (
        <Table dataSource={dataSource} columns={columns} />
      ) : members?.items?.length ? (
        <Row className={styles.members} gutter={[20, 20]}>
          {members?.items?.map((member, idx) => (
            <Col key={idx} {...colProps}>
              <Link
                to={`/members/${member._id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleEditMember("Edit Member", member);
                }}
              >
                <Card
                  hoverable
                  className={styles.card}
                  cover={
                    <div className={styles.imgWrapper}>
                      <Avatar
                        src={`https://joeschmoe.io/api/v1/random?${idx}`}
                      />
                    </div>
                  }
                  actions={[]}
                >
                  <Meta
                    title={member.name}
                    description={
                      <div className={styles.desc}>
                        <div>
                          <strong>Email: </strong>
                          <span>{member.email}</span>
                        </div>
                        <div>
                          <strong>City : </strong>
                          <span>{member.city}</span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        "No movies available for the current user."
      )}
      {visible && (
        <AddMember
          fields={fields}
          title={modalTitle}
          visible={visible}
          isEdit={isEdit}
          onSave={(values) => (isEdit ? onUpdate(values) : onCreate(values))}
          onCancel={() => {
            setVisible(false);
          }}
        />
      )}
    </Spin>
  );
};

function mapState(state) {
  const {
    members,
    authentication: { user },
  } = state;
  return { members, user };
}

const memberCreators = {
  getAll: memberActions.getAll,
  updateMeta: mainActions.updateMeta,
  addMember: memberActions.addMember,
  updateMember: memberActions.updateMember,
};

export default connect(mapState, memberCreators)(Members);
