import React, { useEffect, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'

// components
import ReadyBadge from './ReadyBadge'

const TieBreaker = ({ tieBreaker }) => {
  const [validated, setValidated] = useState(false)
  const [question, setQuestion] = useState(false)
  const [answer, setAnswer] = useState(false)

  // update tie breaker form if data already exists
  useEffect(() => {
    if (tieBreaker.question) {
      setQuestion(tieBreaker.question)
      document.getElementById('formQuestion').value = tieBreaker.question
    }
    if (tieBreaker.answer) {
      setAnswer(tieBreaker.answer)
      document.getElementById('formAnswer').value = tieBreaker.answer
    }
  }, [tieBreaker.question, tieBreaker.answer])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      if (question && answer) {
        console.log('EDIT TIE BREAKER')
      } else {
        console.log('SAM WAS RIGHT')
      }
    } else {
      setValidated(true)
    }
  }

  return (
    <Card>
      <Card.Body>
        <details open={!tieBreaker.question}>
          <summary className='h5 mb-0'>Tie Breaker <ReadyBadge isReady={tieBreaker.question} /></summary>

          <hr />

          <p className='text-muted'>
            Question must be number-based.<br />
          (e.g. "How tall is the CN tower in metres?")
          </p>

          <Form noValidate onSubmit={handleSubmit} validated={validated}>

            <Form.Group className='text-left' controlId='formQuestion'>
              <Form.Label>Question</Form.Label>
              <Form.Control
                name='question'
                onChange={(event) => setQuestion(event.target.value)}
                placeholder='Question'
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Question</b> must be filled out.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='text-left' controlId='formAnswer'>
              <Form.Label>Answer</Form.Label>
              <Form.Control
                name='answer'
                onChange={(event) => setAnswer(event.target.value)}
                placeholder='Answer'
                required
                type='number'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Answer</b> must be a number.</Form.Control.Feedback>
            </Form.Group>

            {!tieBreaker.question && (
              <Button type='submit' variant='primary'>Save Tie Breaker</Button>
            )}

            {tieBreaker.question && (
              <Button type='submit' variant='primary'>Update Tie Breaker</Button>
            )}
          </Form>
        </details>
      </Card.Body>
    </Card>
  )
}

export default TieBreaker
