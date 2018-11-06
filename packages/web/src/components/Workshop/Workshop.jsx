import React, { Component } from 'react';
import styled from 'styled-components';
import { string, arrayOf, shape, number } from 'prop-types';
import GeneralPanel from './GeneralPanel';
import MorePanel from './MorePanel';

const Container = styled('div')`
  display: flex;
  flex-flow: row wrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  width: 800px;
  height: 430px;
  border-radius: 5px;
  overflow: hidden;
`;

class Workshop extends Component {
  static propTypes = {
    title: string.isRequired,
    stacks: arrayOf(shape({})).isRequired,
    curriculum: arrayOf(shape({})).isRequired,
    lecturers: arrayOf(shape({})).isRequired,
    thumbnail: string.isRequired,
    skill: string.isRequired,
    time: number.isRequired,
    students: number.isRequired,
    description: string.isRequired,
  }

  state = {
  }

  render() {
    const { title, stacks, curriculum, lecturers, thumbnail, time, students, skill, description } = this.props;

    return (
      <Container>
        <GeneralPanel
          lecturers={lecturers}
          title={title}
          thumbnail={thumbnail}
          time={time}
          students={students}
          skill={skill}
        />
        <MorePanel
          description={description}
          stacks={stacks}
          curriculum={curriculum}
        />
      </Container>
    );
  }
}

export default Workshop;
