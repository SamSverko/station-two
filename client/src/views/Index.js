// dependencies
import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'

const pageStyle = {
  textAlign: 'center'
}

const inputCodeStyle = {
  textTransform: 'uppercase'
}

const inputTextStyle = {
  textTransform: 'lowercase'
}

function HostTriviaForm () {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit} validated={validated}>
      <h2>Host trivia</h2>
      <Form.Group controlId='formHostName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          maxLength='10'
          pattern='[A-Za-z0-9]{3,10}'
          placeholder='Name'
          required
          style={inputTextStyle}
          type='text'
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type='invalid'>Name must be between 3 and 10 alphanumeric characters (inclusive) [A-Za-z0-9].</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId='formHostCode'>
        <Form.Label>Code</Form.Label>
        <Form.Control
          maxLength='4'
          pattern='[A-Za-z]{4}'
          placeholder='ABCD'
          style={inputCodeStyle}
          type='text'
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type='invalid'>Code must be 4 alphabetical characters [A-Za-z].</Form.Control.Feedback>
        <Form.Text className='text-muted'>Leave blank if creating a new trivia.</Form.Text>
      </Form.Group>
      <Button type='submit' variant='primary'>Next</Button>
    </Form>
  )
}

function Index () {
  return (
    <Container fluid style={pageStyle}>
      <h1>Welcome to Station Two <span aria-label='firetruck emohji' role='img'>🚒</span></h1>
      <HostTriviaForm />
      <hr />
    </Container>
  )
}

export default Index
