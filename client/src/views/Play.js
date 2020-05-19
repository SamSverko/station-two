// dependencies
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'

// styles
const FormControlStyle = styled(Form.Control)`
  min-width: 70px;
  text-transform: uppercase;
  width: 50%;
`

const Play = () => {
  const history = useHistory()
  const [validated, setValidated] = useState(false)
  const [uuidState, setUuidState] = useState(false)
  const [name, setName] = useState(false)
  const [code, setCode] = useState(false)
  const [checkLobbyState, setCheckLobbyState] = useState(false)

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & (0x3 | 0x8))
      return v.toString(16)
    })
  }

  const fetchLobby = () => {
    setCheckLobbyState('pending')
    window.fetch(`http://${window.location.hostname}:4000/api/v1/getDocument/lobbies/${code}?playersOnly=true`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          if (data.players.length > 0) {
            joinLobby(data.host)
          } else if (data.players.length === 0) {
            setCheckLobbyState('not-ready')
          }
        } else {
          setCheckLobbyState('not-found')
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }

  const joinLobby = (host) => {
    const dataToSubmit = {
      triviaId: code,
      name: name,
      uniqueId: uuidState
    }

    console.log(dataToSubmit)

    const xhttp = new window.XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (this.response === 'OK') {
          history.push(`/lobby/${code}/player/${host}`)
        } else {
          setCheckLobbyState('error')
        }
      }
    }
    xhttp.open('POST', 'http://localhost:4000/api/v1/joinLobby')
    xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify(dataToSubmit))
  }

  useEffect(() => {
    if (window.localStorage.getItem('playerId') === null) {
      window.localStorage.setItem('playerId', generateUUID())
    }
    setUuidState(window.localStorage.getItem('playerId'))
  }, [uuidState])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      if (name && code) {
        fetchLobby()
      }
    } else {
      setValidated(true)
    }
  }

  return (
    <>
      <Header text='Play Trivia' emoji='🎉' emojiDescription='tada' />

      <Card>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>

            <Form.Group className='text-left' controlId='formName'>
              <Form.Label>Player name</Form.Label>
              <Form.Control
                className='text-lowercase'
                maxLength='10'
                name='name'
                onChange={(event) => setName(event.target.value)}
                pattern='[A-Za-z0-9]{3,10}'
                placeholder='Name'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Player name</b> must be between 3 and 10 alphanumeric characters (inclusive) [A-Z || 0-9].</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='text-left' controlId='formCode'>
              <Form.Label>Trivia code</Form.Label>
              <FormControlStyle
                maxLength='4'
                name='code'
                onChange={(event) => {
                  setCheckLobbyState(false)
                  setCode(event.target.value)
                }}
                pattern='[A-Za-z]{4}'
                placeholder='_ _ _ _'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Trivia code</b> must be 4 alphabetical characters [A-Z].</Form.Control.Feedback>
            </Form.Group>

            {checkLobbyState === 'pending' && (
              <Alert variant='info'>Checking lobby <span className='font-weight-bold text-uppercase'>{code}</span>.</Alert>
            )}

            {checkLobbyState === 'not-ready' && (
              <Alert variant='danger'>Lobby is not ready to join.</Alert>
            )}

            {checkLobbyState === 'not-found' && (
              <Alert variant='danger'>
                Lobby <span className='font-weight-bold text-uppercase'>{code}</span> not found.<br />
                Please try with a different code.
              </Alert>
            )}

            {checkLobbyState === 'error' && (
              <Alert variant='danger'>
                Error joining lobby.
                Please try clearing your browser's cache.
              </Alert>
            )}

            <Button type='submit' variant='primary'>Next</Button>

          </Form>
        </Card.Body>
      </Card>

      <Link to='/'>Home</Link>
    </>
  )
}

export default Play
