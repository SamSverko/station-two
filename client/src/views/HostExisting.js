// dependencies
import React, { useState } from 'react'
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

const HostExisting = () => {
  const history = useHistory()

  const [validated, setValidated] = useState(false)
  const [code, setCode] = useState(false)
  const [pin, setPin] = useState(false)
  const [postStatus, setPostStatus] = useState(false)

  const fetchTrivia = () => {
    window.fetch(`${process.env.REACT_APP_API_URL}/getDocument/trivia/${code}?triviaPin=${pin}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          console.log(data)
          if (data.error !== 'incorrect-pin') {
            history.push(`/builder/${code}/${pin}`)
          } else {
            setPostStatus('incorrect-pin')
          }
        } else {
          console.error('DB | WARN | fetchTrivia', data)
          setPostStatus('not-found')
        }
      }).catch((error) => {
        console.error('DB | ERROR | fetchTrivia', error)
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      if (code && pin) {
        fetchTrivia()
      }
    } else {
      setValidated(true)
    }
  }

  return (
    <>
      <Header text='Edit Existing Trivia' emoji='🏗' emojiDescription='building construction' />

      <Card>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>

            <Form.Group className='text-left' controlId='formCode'>
              <Form.Label>Code</Form.Label>
              <FormControlStyle
                maxLength='4'
                name='code'
                onChange={(event) => {
                  setCode(event.target.value)
                  setPostStatus(false)
                }}
                pattern='[A-Za-z]{4}'
                placeholder='_ _ _ _'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Code must be 4 alphabetical characters [A-Z].</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='text-left' controlId='formPin'>
              <Form.Label>Pin</Form.Label>
              <FormControlStyle
                maxLength='4'
                minLength='4'
                name='pin'
                onChange={(event) => {
                  setPin(event.target.value)
                  setPostStatus(false)
                }}
                pattern='\d*'
                placeholder='_ _ _ _'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Pin must be 4 numerical characters [0-9].</Form.Control.Feedback>
            </Form.Group>

            {postStatus === 'not-found' && (
              <Alert variant='danger'>
                Lobby <span className='font-weight-bold text-uppercase'>{code}</span> not found.<br />
                Please try with a different code.
              </Alert>
            )}
            {postStatus === 'incorrect-pin' && (
              <Alert variant='danger'>
                Pin <span className='font-weight-bold text-uppercase'>{pin}</span> is not correct.<br />
                Please try with a different pin.
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

export default HostExisting
