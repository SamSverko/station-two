// dependencies
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'

const BuilderStatus = ({ host, isRoundsComplete, isTieBreakerComplete, triviaId }) => {
  const [uuidState, setUuidState] = useState(false)

  const isTriviaReady = (isRoundsComplete && isTieBreakerComplete)

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & (0x3 | 0x8))
      return v.toString(16)
    })
  }

  useEffect(() => {
    if (window.localStorage.getItem('playerId') === null) {
      window.localStorage.setItem('playerId', generateUUID)
    }
    setUuidState(window.localStorage.getItem('playerId'))
  }, [uuidState])

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
      <Link onClick={() => { window.localStorage.setItem('playerName', host) }} to={`/lobby/${triviaId}/host/${host}`}>
        <Button disabled={!isTriviaReady}>Host Trivia</Button>
      </Link>
    </Alert>
  )
}

export default BuilderStatus
