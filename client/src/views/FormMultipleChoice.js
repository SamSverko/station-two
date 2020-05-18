// dependencies
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Badge, Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'
// import Question from '../components/Builder/FormMultipleChoice/Question'

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
  const optionsArray = [0, 1, 2, 3]

  const { triviaId } = useParams()

  const [validated, setValidated] = useState(false)
  const [isMaxQuestionsReached, setIsMaxQuestionsReached] = useState(false)

  const [roundInfoState, setRoundInfoState] = useState({
    theme: 'none',
    questionPointValue: 0
  })
  const handleRoundInfoChange = (event) => setRoundInfoState({
    ...roundInfoState,
    [event.target.name]: event.target.value
  })

  const blankQuestion = { question: '', answer: '' }
  const [questionState, setQuestionState] = useState([
    { ...blankQuestion }
  ])

  const addQuestion = () => {
    if (questionState.length < 3) {
      setIsMaxQuestionsReached(false)
      setQuestionState([...questionState, { ...blankQuestion }])
    } else {
      setIsMaxQuestionsReached(true)
    }
  }

  const removeQuestion = (id) => {
    const currentQuestions = [...questionState]
    const updatedQuestions = currentQuestions.slice(0, id).concat(currentQuestions.slice(id + 1, currentQuestions.length))
    setQuestionState(updatedQuestions)
  }

  const handleQuestionChange = (event) => {
    const updatedQuestions = [...questionState]
    updatedQuestions[event.target.dataset.idx][event.target.dataset.field] = event.target.value
    setQuestionState(updatedQuestions)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    console.log(roundInfoState)
    console.log(questionState)

    if (event.currentTarget.checkValidity() !== false) {
      // console.log(roundTheme, roundPointValue, roundQuestions)
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
                name='theme'
                onChange={handleRoundInfoChange}
                placeholder={roundInfoState.theme}
                type='text'
                value={roundInfoState.theme}
              />
              <Form.Text className='text-muted'>Default if left blank: 'none'</Form.Text>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Code must be 4 alphabetical characters [A-Z].</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='text-left' controlId='formQuestionPointValue'>
              <Form.Label>Question point value</Form.Label>
              <Form.Control
                name='questionPointValue'
                onChange={handleRoundInfoChange}
                placeholder={roundInfoState.questionPointValue}
                type='number'
                value={roundInfoState.questionPointValue}
              />
              <Form.Text className='text-muted'>Default if left blank: 1</Form.Text>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Question point value</b> must be a number.</Form.Control.Feedback>
            </Form.Group>

            {
              questionState.map((item, idx) => {
                return (
                  <div key={`question-container-${idx}`}>
                    {/* question */}
                    <Form.Group className='text-left' controlId={`name-${idx}`}>
                      <Form.Label>Question {idx + 1} {idx > 0 && (<Badge onClick={() => { removeQuestion(idx) }} variant='danger'>Remove</Badge>)}</Form.Label>
                      <Form.Control
                        data-field='question'
                        data-idx={idx}
                        name={`name-${idx}`}
                        value={questionState[idx].name}
                        onChange={handleQuestionChange}
                        required
                        type='text'
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'><b>Question {idx + 1}</b> must be filled out.</Form.Control.Feedback>
                    </Form.Group>

                    {/* answer */}
                    <div className='text-left'>
                      <p>Actual answer for question {idx + 1}</p>
                      {optionsArray.map((item) =>
                        <Form.Check
                          className='mr-4'
                          data-field='answer'
                          data-idx={idx}
                          id={`question-${idx}-answer-${item}`}
                          inline
                          key={item}
                          label={String.fromCharCode(97 + item).toUpperCase()}
                          name={`question-${idx}-answer`}
                          onChange={handleQuestionChange}
                          required
                          type='radio'
                          value={item}
                        />
                      )}
                    </div>

                    <hr />
                  </div>
                )
              })
            }

            <div className='mb-3 text-left'>
              <Button className='mb-3' disabled={isMaxQuestionsReached} onClick={addQuestion} variant='outline-primary'>Add a question</Button>
              {isMaxQuestionsReached && (
                <Alert variant='danger'>Rounds are limited to a mamximum of 20 questions.</Alert>
              )}
            </div>

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
