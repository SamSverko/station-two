// dependencies
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

function IndexHostForm () {
  const [validated, setValidated] = useState(false)
  const [name, setName] = useState(false)
  const [code, setCode] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      // POST form data to server and redirect
      console.log(name)
      console.log(code)
    }
    setValidated(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit} validated={validated}>
      <h2>Host trivia</h2>

      <Form.Group className='text-left' controlId='formHostName'>
        <Form.Label>Name</Form.Label>
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
        <Form.Control.Feedback type='invalid'>Name must be between 3 and 10 alphanumeric characters (inclusive) [A-Za-z0-9].</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className='text-left' controlId='formHostCode'>
        <Form.Label>Code</Form.Label>
        <Form.Control
          className='text-uppercase w-25'
          maxLength='4'
          onChange={(event) => setCode(event.target.value)}
          pattern='[A-Za-z]{4}'
          placeholder='ABCD'
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

export default IndexHostForm
