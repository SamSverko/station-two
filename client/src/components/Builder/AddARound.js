// dependencies
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// styles
const AddARoundSelectionRowStyle = styled.div`
  div {
    &:last-child {
      p {
        margin: 0
      }
    }
    button {
      min-width: 150px;
      width: 50%;
    }
  }
`

const ButtonStyle = styled(Button)`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  text-decoration: none;
`

const AddARoundSelection = ({ triviaId, triviaPin }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Add A Round</Card.Title>
        <hr />
        <AddARoundSelectionRowStyle>
          <div>
            <Link className='text-decoration-none' to={`/builder/${triviaId}/${triviaPin}/multipleChoice/new`}>
              <ButtonStyle variant='primary'>Multiple Choice <span aria-label='question emoji' role='img'>❓</span></ButtonStyle>
            </Link>
            <p className='text-muted'>Players guess A, B, C, or D.</p>
          </div>
          <hr />
          <div>
            <Link className='text-decoration-none' to={`/builder/${triviaId}/${triviaPin}/picture/new`}>
              <ButtonStyle variant='primary'>Picture <span aria-label='framed picture emoji' role='img'>🖼</span></ButtonStyle>
            </Link>
            <p className='text-muted'>Players guess the picture.</p>
          </div>
          <hr />
          <div>
            <Link className='text-decoration-none' to={`/builder/${triviaId}/${triviaPin}/lightning/new`}>
              <ButtonStyle variant='primary'>Lightning <span aria-label='zap emoji' role='img'>⚡️</span></ButtonStyle>
            </Link>
            <p className='text-muted'>Players provide exact answer.</p>
          </div>
        </AddARoundSelectionRowStyle>
      </Card.Body>
    </Card>
  )
}

export default AddARoundSelection
