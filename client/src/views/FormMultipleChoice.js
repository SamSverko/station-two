// dependencies
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'

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

const Question = ({ id, roundQuestions, setRoundQuestion }) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState([])
  const [answer, setAnswer] = useState('')

  const optionsArray = [0, 1, 2, 3]

  const updateRoundQuestion = (id) => {
    if (question.length > 0 && options.length > 0 && answer.length > 0) {
      console.log(question, options, answer)
    }
  }

  return (
    <>
      {/* question */}
      <Form.Group className='text-left' controlId={`question${id}`}>
        <Form.Label>Question {id + 1}</Form.Label>
        <Form.Control
          onChange={(event) => {
            setQuestion(event.target.value)
            updateRoundQuestion(id)
          }}
          placeholder='Question'
          required
          type='text'
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type='invalid'><b>Question {id + 1}</b> must be filled out.</Form.Control.Feedback>
      </Form.Group>

      {/* options */}
      <div className='text-left'>
        <p>Possible answers for question {id + 1}</p>
        {optionsArray.map((option) =>
          <Form.Group className='text-left' controlId={`question${id}Option${option}`} key={option}>
            <Form.Label className='d-inline mr-3'>{String.fromCharCode(97 + option).toUpperCase()}</Form.Label>
            <Form.Control
              className='d-inline w-50'
              onChange={(event) => {
                const savedOptions = options

                savedOptions[option] = event.target.value

                setOptions(savedOptions)
                updateRoundQuestion(id)
              }}
              placeholder='Answer'
              required
              type='text'
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type='invalid'><b>{String.fromCharCode(97 + option).toUpperCase()}</b> must be filled out.</Form.Control.Feedback>
          </Form.Group>
        )}
      </div>

      {/* answer */}
      <div className='text-left'>
        <p>Actual answer for question {id + 1}</p>
        {optionsArray.map((item) =>
          <Form.Check
            className='mr-4'
            id={`question${id}Answer${item}`}
            inline
            key={item}
            label={String.fromCharCode(97 + item).toUpperCase()}
            name={`question${id}Answer`}
            onChange={(event) => {
              setAnswer(event.target.value)
              updateRoundQuestion(id)
            }}
            required
            type='radio'
            value={item}
          />
        )}
      </div>

      <hr />
    </>
  )
}

const FormMultipleChoice = () => {
  const { triviaId } = useParams()

  const [validated, setValidated] = useState(false)
  const [roundTheme, setRoundTheme] = useState('none')
  const [roundPointValue, setRoundPointValue] = useState(1)
  const [roundQuestions, setRoundQuestion] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      console.log(roundTheme, roundPointValue)
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

            <hr />

            <Question id={0} roundQuestions={roundQuestions} setRoundQuestion={setRoundQuestion} />

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
