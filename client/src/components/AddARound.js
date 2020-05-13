// dependencies
import React from 'react'
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

const AddARoundSelection = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Add A Round</Card.Title>
        <hr />
        <AddARoundSelectionRowStyle>
          <div>
            <Button variant='primary'>Multiple Choice</Button>
            <p className='text-muted'>Players guess A, B, C, or D.</p>
          </div>
          <hr />
          <div>
            <Button variant='primary'>Picture</Button>
            <p className='text-muted'>Players guess the picture.</p>
          </div>
          <hr />
          <div>
            <Button variant='primary'>Lightning</Button>
            <p className='text-muted'>Players provide exact answer.</p>
          </div>
        </AddARoundSelectionRowStyle>
      </Card.Body>
    </Card>
  )
}

export default AddARoundSelection