// dependencies
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'
import Question from '../components/Builder/FormMultipleChoice/Question'

// styles
const RoundActionButtons = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  width: 100%;
  .item {
    width: 33%;
  }
`

const FormMultipleChoice = () => {
  const { triviaId } = useParams()

  const [validated, setValidated] = useState(false)
  const [roundTheme, setRoundTheme] = useState('none')
  const [roundPointValue, setRoundPointValue] = useState(1)
  const [roundQuestions, setRoundQuestions] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      console.log(roundTheme, roundPointValue, roundQuestions)
    } else {
      setValidated(true)
    }
  }

  return (
    <>
      <Header text='Multiple Choice' emoji='❓' emojiDescription='question emoji' />

      <Card>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>

            <Form.Group className='text-left' controlId='formTheme'>
              <Form.Label>Theme</Form.Label>
              <Form.Control
                name='roundTheme'
                onChange={(event) => setRoundTheme((event.target.value.length !== 0) ? event.target.value : 'none')}
                placeholder='none'
                type='text'
              />
              <Form.Text className='text-muted'>Default if left blank: 'none'</Form.Text>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Code must be 4 alphabetical characters [A-Z].</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='text-left' controlId='formRoundPointValue'>
              <Form.Label>Question point value</Form.Label>
              <Form.Control
                name='roundPointValue'
                onChange={(event) => setRoundPointValue((event.target.value.length !== 0) ? parseInt(event.target.value) : 1)}
                placeholder='1'
                type='number'
              />
              <Form.Text className='text-muted'>Default if left blank: 1</Form.Text>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Question point value</b> must be a number.</Form.Control.Feedback>
            </Form.Group>

            <Question id={0} roundQuestions={roundQuestions} setRoundQuestions={setRoundQuestions} />

            <hr />

            <RoundActionButtons>
              <Button className='item' type='submit' variant='primary'>Save</Button>
              <Link className='item' to={`/builder/${triviaId}`}>
                <Button className='w-100' variant='danger'>Discard</Button>
              </Link>
            </RoundActionButtons>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default FormMultipleChoice
