import React from 'react'
import { Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

const AddARoundRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center
`

const BuilderAddARound = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Add A Round</Card.Title>
        <AddARoundRow>
          <div>
            <Button variant='primary'>Multiple Choice</Button>
            <p className='text-muted'>Players guess A, B, C, or D.</p>
          </div>
          <div>
            <Button variant='primary'>Picture</Button>
            <p className='text-muted'>Players guess the picture.</p>
          </div>
          <div>
            <Button variant='primary'>Lightning</Button>
            <p className='text-muted'>Players provide exact answer.</p>
          </div>
        </AddARoundRow>
      </Card.Body>
    </Card>
  )
}

export default BuilderAddARound
