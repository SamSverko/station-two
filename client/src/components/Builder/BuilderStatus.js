// dependencies
import React from 'react'
import { Alert, Button } from 'react-bootstrap'

const BuilderStatus = () => {
  return (
    <Alert variant='danger'>
      <p className='h5'>This trivia is not ready for hosting.</p>
      <p>Complete the following:</p>
      <ol className='text-left'>
        <li>Add a least 1 round.</li>
        <li>Complete the Tie Breaker.</li>
      </ol>
      <Button disabled>Host Trivia</Button>
    </Alert>
  )
}

export default BuilderStatus
