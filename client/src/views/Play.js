// dependencies
import React, { useCallback, useState } from 'react'
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
  const [name, setName] = useState(false)
  const [code, setCode] = useState(false)
  const [checkLobbyState, setCheckLobbyState] = useState(false)

  const fetchLobby = useCallback(() => {
    window.fetch(`http://${window.location.hostname}:4000/api/v1/getDocument/lobbies/${code}?playersOnly=true`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          console.log(data)
          if (data.length > 0) {
            history.push(`/lobby/${code}/player`)
          } else if (data.length === 0) {
            setCheckLobbyState('not-ready')
          }
        } else {
          setCheckLobbyState('not-found')
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }, [history, code])

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
              <Alert variant='info'>Checking lobby {code}.</Alert>
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

            <Button type='submit' variant='primary'>Next</Button>

          </Form>
        </Card.Body>
      </Card>

      <Link to='/'>Home</Link>
    </>
  )
}

export default Play
