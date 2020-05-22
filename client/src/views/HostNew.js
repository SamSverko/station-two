// dependencies
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Card, Form } from 'react-bootstrap'

// components
import Header from '../components/Header'

const HostNew = () => {
  const history = useHistory()
  const [validated, setValidated] = useState(false)
  const [name, setName] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      const xhttp = new window.XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const data = JSON.parse(this.response)
          history.push(`/builder/${data[0].triviaId}`)
        }
      }
      xhttp.open('POST', `${process.env.REACT_APP_API_URL}/createTrivia`)
      xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
      xhttp.send(JSON.stringify({ name: name }))
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
                onChange={(event) => setName(event.target.value)}
                pattern='[A-Za-z0-9]{3,10}'
                placeholder='Name'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Name must be between 3 and 10 alphanumeric characters (inclusive) [A-Z || 0-9].</Form.Control.Feedback>
            </Form.Group>

            <Button type='submit' variant='primary'>Next</Button>

          </Form>
        </Card.Body>
      </Card>

      <Link to='/'>Home</Link>
    </>
  )
}

export default HostNew
