// dependencies
import React from 'react'
import { Alert, Button } from 'react-bootstrap'

const BuilderStatus = ({ isRoundsComplete, isTieBreakerComplete }) => {
  const isTriviaReady = (isRoundsComplete && isTieBreakerComplete)

  const hostTrivia = () => {
    console.log('HOST TRIVIA!')
  }

  return (
    <Alert variant={isTriviaReady ? 'success' : 'danger'}>
      <p className='h5'>This trivia is {isTriviaReady ? null : 'not'} ready for hosting.</p>
      <div className={isTriviaReady ? 'd-none' : 'd-block'}>
        <p>Complete the following:</p>
        <ol className='text-left'>
          <li className={isRoundsComplete ? 'd-none' : 'd-list-item'}>Add a least 1 round.</li>
          <li className={isTieBreakerComplete ? 'd-none' : 'd-list-item'}>Complete the Tie Breaker.</li>
        </ol>
      </div>
      <Button disabled={!isTriviaReady} onClick={hostTrivia}>Host Trivia</Button>
    </Alert>
  )
}

export default BuilderStatus
