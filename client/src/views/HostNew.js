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

const HostNew = () => {
  const history = useHistory()
  const [validated, setValidated] = useState(false)
  const [name, setName] = useState(false)
  const [pin, setPin] = useState(false)
  const [postStatus, setPostStatus] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      if (name && pin) {
        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.response)
            if (!data.statusCode) {
              history.push(`/builder/${data[0].triviaId}/${pin}`)
            } else {
              setPostStatus('error')
              console.error('DB | WARN | handleSubmit', data)
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/createTrivia`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify({ name: name, triviaPin: pin }))
      }
    } else {
      setValidated(true)
    }
  }

  return (
    <>
      <Header text='Host New Trivia' emoji='✨' emojiDescription='sparkles' />

      <Card>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>

            <Form.Group className='text-left' controlId='formName'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                className='text-lowercase'
                maxLength='10'
                name='name'
                onChange={(event) => {
                  setName(event.target.value.toLowerCase())
                  setPostStatus(false)
                }}
                pattern='[A-Za-z0-9]{3,10}'
                placeholder='Name'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Name must be between 3 and 10 alphanumeric characters (inclusive) [A-Z || 0-9].</Form.Control.Feedback>
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
              <Form.Text className='text-muted'>Remember this pin to access this trivia as a host at a later time.</Form.Text>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Pin must be 4 numerical characters [0-9].</Form.Control.Feedback>
            </Form.Group>

            {postStatus === 'error' && (
              <Alert variant='danger'>
                There was an error creating a new trivia.
                Please try again.
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

export default HostNew
