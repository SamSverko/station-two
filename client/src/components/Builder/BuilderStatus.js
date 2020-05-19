// dependencies
import React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'

const BuilderStatus = ({ isRoundsComplete, isTieBreakerComplete, triviaId }) => {
  const isTriviaReady = (isRoundsComplete && isTieBreakerComplete)

  return (
    <Alert variant={isTriviaReady ? 'success' : 'danger'}>
      <p className='h5'>This trivia is {isTriviaReady ? null : 'not'} ready for hosting.</p>
      <hr />
      <div className={isTriviaReady ? 'd-none' : 'd-block'}>
        <p>Complete the following:</p>
        <ol className='text-left'>
          <li className={isRoundsComplete ? 'd-none' : 'd-list-item'}>Add a least 1 round.</li>
          <li className={isTieBreakerComplete ? 'd-none' : 'd-list-item'}>Complete the Tie Breaker.</li>
        </ol>
      </div>
      <Link to={`/lobby/${triviaId}/host`}>
        <Button disabled={!isTriviaReady}>Host Trivia</Button>
      </Link>
    </Alert>
  )
}

export default BuilderStatus
