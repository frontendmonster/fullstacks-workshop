import React, { useEffect, useState } from 'react';
import { Container, Button, List, Icon, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import { LecturerForm, Lecturer } from '../../components';

const IconContainer = styled('div')`
  position: absolute;
  height: 100%;
  display: flex;
  top: 0;
  align-items: center;
  padding-left: 1em;
`;

const Lecturers = ({ lecturers, onAdd, onEdit, onDelete }) => (
  <List selection verticalAlign="middle" size="large">
    {lecturers.map(lecturer => (
      <List.Item key={lecturer._id} className="relative">
        <List.Content>
          <Lecturer {...lecturer} onClick={() => onEdit(lecturer._id)} />
        </List.Content>
        <List.Content floated="left" verticalAlign="middle">
          <IconContainer>
            <Icon name="delete" size="small" onClick={() => onDelete(lecturer)} />
          </IconContainer>
        </List.Content>
      </List.Item>
    ))}
    <Button fluid onClick={onAdd}><Icon name="add" /></Button>
  </List>
);

const LecturerFormContainer = ({ history }) => {
  const [lecturers, setLecturers] = useState([]);
  const [fetchingLecturers, setFetchingLecturers] = useState(true);

  useEffect(async () => {
    try {
      const lecturersRes = await axios.get('http://localhost:4000/api/rest/lecturers');

      setLecturers(lecturersRes.data);
      setFetchingLecturers(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const onSubmit = async (values) => {
    const body = JSON.stringify(values);

    const newLecturer = await axios.post('http://localhost:4000/api/rest/lecturers', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setLecturers([...lecturers, newLecturer.data]);
    history.push('/manage/lecturers');
  };

  const onUpdate = async (values) => {
    const body = JSON.stringify(values);

    const updated = await axios.put(`http://localhost:4000/api/rest/lecturers/${values._id}`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setLecturers(lecturers.map(l => (l._id === updated.data._id ? updated.data : l)));
    history.push('/manage/lecturers');
  };

  const goToAdd = () => {
    history.push('lecturers/add');
  };

  const goToEdit = (id) => {
    history.push(`lecturers/${id}`);
  };

  const onDelete = async ({ _id, name }) => {
    const conf = window.confirm(`Are you sure to delete ${name}`);

    if (conf) {
      const deleted = await axios.delete(`http://localhost:4000/api/rest/lecturers/${_id}`);

      setLecturers(lecturers.filter(l => l._id !== deleted.data._id));
    }
  };

  const onCancel = () => {
    history.push('/manage/lecturers');
  };

  return (
    <Container>
      <Switch>
        <Route
          path="/manage/lecturers"
          exact
          render={() => (fetchingLecturers
            ? <Loader active inline="centered" />
            : <Lecturers lecturers={lecturers} onAdd={goToAdd} onEdit={goToEdit} onDelete={onDelete} />
          )}
        />

        <Route
          path="/manage/lecturers/add"
          render={props => (
            <LecturerForm
              onCancel={onCancel}
              submit={onSubmit}
            />
          )}
        />

        <Route
          path="/manage/lecturers/:id"
          render={(props) => {
            const lecturer = lecturers.find(l => l._id === props.match.params.id);

            return (
              <LecturerForm
                onCancel={onCancel}
                lecturer={lecturer}
                submit={onUpdate}
              />
            );
          }}
        />
      </Switch>
    </Container>
  );
};

export default withRouter(LecturerFormContainer);
