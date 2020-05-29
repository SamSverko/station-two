import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Badge, Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'

// styles
const FormControlStyle = styled(Form.Control)`
  min-width: 70px;
  text-transform: uppercase;
  width: 50%;
`

const TieBreaker = ({ fetchTrivia, triviaId, triviaPin }) => {
  const history = useHistory()

  const [validated, setValidated] = useState(false)
  const [pin, setPin] = useState(false)
  const [postStatus, setPostStatus] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      if (pin) {
        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              history.push(`/builder/${triviaId}/${pin}`)
              setPostStatus('success')
              window.setTimeout(() => {
                setPostStatus(false)
              }, 1500)
            } else {
              console.warn('DB | WARN | handleSubmit', this.response)
              setPostStatus('error')
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/updatePin`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify({ triviaId: triviaId, triviaPin: pin }))
      }
    } else {
      setValidated(true)
    }
  }

  return (
    <Card>
      <Card.Body>
        <details open={postStatus}>
          <summary className='h5 mb-0'>Pin <Badge variant='info'>{triviaPin}</Badge></summary>

          <hr />

          <Form noValidate onSubmit={handleSubmit} validated={validated}>

            <Form.Group className='text-left' controlId='formPin'>
              <Form.Label>Change Pin</Form.Label>
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

            {postStatus === 'error' && (<Alert className='mt-3' variant='danger'>Error changing Pin.</Alert>)}
            {postStatus === 'success' && (<Alert className='mt-3' variant='success'>Pin saved.</Alert>)}

            <Button type='submit' variant='primary'>Next</Button>

          </Form>

        </details>
      </Card.Body>
    </Card>
  )
}

export default TieBreaker
