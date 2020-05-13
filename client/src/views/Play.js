// dependencies
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Card, Form } from 'react-bootstrap'
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

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      if (name && code) {
        history.push(`/lobby/${code}`)
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
                onChange={(event) => setCode(event.target.value)}
                pattern='[A-Za-z]{4}'
                placeholder='_ _ _ _'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Trivia code</b> must be 4 alphabetical characters [A-Z].</Form.Control.Feedback>
            </Form.Group>

            <Button type='submit' variant='primary'>Next</Button>

          </Form>
        </Card.Body>
      </Card>

      <Link to='/'>Home</Link>
    </>
  )
}

export default Play
