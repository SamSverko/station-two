// dependencies
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'

const BuilderStatus = ({ host, isRoundsComplete, isTieBreakerComplete, triviaId }) => {
  const history = useHistory()

  const [uuidState, setUuidState] = useState(false)

  const isTriviaReady = (isRoundsComplete && isTieBreakerComplete)

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & (0x3 | 0x8))
      return v.toString(16)
    })
  }

  const joinLobby = () => {
    const dataToSubmit = {
      triviaId: triviaId,
      name: host,
      uniqueId: uuidState
    }

    const xhttp = new window.XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (this.response === 'OK') {
          history.push(`/lobby/${triviaId}/host/${host}`)
        } else {
          console.warn('Error joining lobby.')
        }
      }
    }
    xhttp.open('POST', 'http://localhost:4000/api/v1/joinLobby')
    xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify(dataToSubmit))
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
      <Button disabled={!isTriviaReady} onClick={joinLobby}>Host Trivia</Button>
    </Alert>
  )
}

export default BuilderStatus
