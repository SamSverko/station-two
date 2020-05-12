// dependencies
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'

const codeInputStyle = {
  minWidth: '70px',
  textTransform: 'uppercase',
  width: '50%'
}

const IndexHostForm = () => {
  const history = useHistory()
  const [validated, setValidated] = useState(false)
  const [name, setName] = useState(false)
  const [code, setCode] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      // POST form data to server and redirect
      if (name && !code) {
        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.response)
            history.push(`/builder/${data[0].triviaId}`)
          }
        }
        xhttp.open('POST', 'http://localhost:4000/api/v1/createTrivia')
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify({ name: name }))
      } else {
        history.push(`/builder/${code}`)
      }
    }
    setValidated(true)
  }

  return (
    <Form noValidate onSubmit={handleSubmit} validated={validated}>
      <h2>Host Trivia</h2>

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
          maxLength='4'
          name='code'
          onChange={(event) => setCode(event.target.value)}
          pattern='[A-Za-z]{4}'
          placeholder='ABCD'
          style={codeInputStyle}
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
