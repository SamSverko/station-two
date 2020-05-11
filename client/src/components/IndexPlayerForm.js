// dependencies
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

function IndexPlayerForm () {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      window.location.href = '/lobby'
    }
    setValidated(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit} validated={validated}>
      <h2>Play trivia</h2>
      <Form.Group className='text-left' controlId='formHostName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          className='text-lowercase'
          maxLength='10'
          pattern='[A-Za-z0-9]{3,10}'
          placeholder='Name'
          required
          type='text'
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type='invalid'>Name must be between 3 and 10 alphanumeric characters (inclusive) [A-Za-z0-9].</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className='text-left' controlId='formHostCode'>
        <Form.Label>Code</Form.Label>
        <Form.Control
          className='text-uppercase w-25'
          maxLength='4'
          pattern='[A-Za-z]{4}'
          placeholder='ABCD'
          required
          type='text'
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type='invalid'>Code must be 4 alphabetical characters [A-Za-z].</Form.Control.Feedback>
      </Form.Group>
      <Button type='submit' variant='primary'>Next</Button>
    </Form>
  )
}

export default IndexPlayerForm
