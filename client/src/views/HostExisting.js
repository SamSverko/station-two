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

const HostExisting = () => {
  const history = useHistory()
  const [validated, setValidated] = useState(false)
  const [code, setCode] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      history.push(`/builder/${code}`)
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
                onChange={(event) => setCode(event.target.value)}
                pattern='[A-Za-z]{4}'
                placeholder='_ _ _ _'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Code must be 4 alphabetical characters [A-Z].</Form.Control.Feedback>
            </Form.Group>

            <Button type='submit' variant='primary'>Next</Button>

          </Form>
        </Card.Body>
      </Card>

      <Link to='/'>Home</Link>
    </>
  )
}

export default HostExisting
