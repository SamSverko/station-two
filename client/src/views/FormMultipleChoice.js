// dependencies
import React, { useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Alert, Badge, Button, Card, Form } from 'react-bootstrap'
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

const FormMultipleChoice = () => {
  const optionsArray = [0, 1, 2, 3]
  const maxQuestions = 20

  const history = useHistory()
  const { triviaId } = useParams()

  const [validated, setValidated] = useState(false)
  const [postStatus, setPostStatus] = useState('pending')
  const [isMaxQuestionsReached, setIsMaxQuestionsReached] = useState(false)

  const [roundInfoState, setRoundInfoState] = useState({
    theme: 'none',
    questionPointValue: 1
  })
  const handleRoundInfoChange = (event) => setRoundInfoState({
    ...roundInfoState,
    [event.target.name]: event.target.value
  })

  const blankQuestion = { question: '', answer: '', options: ['', '', '', ''] }
  const [questionState, setQuestionState] = useState([
    { ...blankQuestion }
  ])

  const addQuestion = () => {
    setQuestionState([...questionState, { ...blankQuestion }])

    if (questionState.length < maxQuestions - 1) {
      setIsMaxQuestionsReached(false)
    } else {
      setIsMaxQuestionsReached(true)
    }
  }

  const removeQuestion = (id) => {
    const currentQuestions = [...questionState]
    const updatedQuestions = currentQuestions.slice(0, id).concat(currentQuestions.slice(id + 1, currentQuestions.length))
    setQuestionState(updatedQuestions)

    if (questionState.length <= maxQuestions) {
      setIsMaxQuestionsReached(false)
    }
  }

  const handleQuestionChange = (event) => {
    const updatedQuestions = [...questionState]
    updatedQuestions[event.target.dataset.idx][event.target.dataset.field] = event.target.value
    setQuestionState(updatedQuestions)
  }

  const handleOptionsChange = (event) => {
    const updatedQuestions = [...questionState]
    updatedQuestions[event.target.dataset.idx][event.target.dataset.field][event.target.dataset.optionindex] = event.target.value
    setQuestionState(updatedQuestions)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      const dataToSubmit = {
        triviaId: triviaId,
        roundTheme: roundInfoState.theme,
        roundPointValue: roundInfoState.questionPointValue,
        roundQuestions: questionState
      }

      const xhttp = new window.XMLHttpRequest()
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          console.log(this.response)
          if (this.response === 'OK') {
            setPostStatus(true)
            window.setTimeout(() => {
              history.push(`/builder/${triviaId}`)
            }, 1500)
          } else {
            setPostStatus(false)
          }
        }
      }
      xhttp.open('POST', 'http://localhost:4000/api/v1/addMultipleChoiceRound')
      xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
      xhttp.send(JSON.stringify(dataToSubmit))
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
                        name={`question-${idx}-question`}
                        onChange={handleQuestionChange}
                        required
                        type='text'
                        value={questionState[idx].name}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'><b>Question {idx + 1}</b> must be filled out.</Form.Control.Feedback>
                    </Form.Group>

                    {/* options */}
                    <div className='text-left'>
                      <p>Possible answers for question {idx + 1}</p>
                      {optionsArray.map((option) =>
                        <Form.Group className='text-left' controlId={`question-${idx}-option-${option}`} key={`question-${idx}-option-${option}`}>
                          <Form.Label className='d-inline mr-3'>{String.fromCharCode(97 + option).toUpperCase()}</Form.Label>
                          <Form.Control
                            className='d-inline w-50'
                            data-field='options'
                            data-idx={idx}
                            data-optionindex={option}
                            name={`question-${idx}-option-${option}`}
                            onChange={handleOptionsChange}
                            placeholder='Answer'
                            required
                            type='text'
                            value={questionState[idx].options[option]}
                          />
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          <Form.Control.Feedback type='invalid'><b>{String.fromCharCode(97 + option).toUpperCase()}</b> must be filled out.</Form.Control.Feedback>
                        </Form.Group>
                      )}
                    </div>

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

            <div className='text-left'>
              {!isMaxQuestionsReached && (
                <Button disabled={isMaxQuestionsReached} onClick={addQuestion} variant='outline-primary'>Add a question</Button>
              )}
              {isMaxQuestionsReached && (
                <Alert variant='warning'>Rounds are limited to a maximum of {maxQuestions} questions.</Alert>
              )}
            </div>

            <hr />

            {postStatus === true && (
              <Alert className='mt-3' variant='success'>Round saved. You will now be directed back to the Builder.</Alert>
            )}
            {postStatus === false && (
              <Alert className='mt-3' variant='danger'>Failed to save round. Please try again.</Alert>
            )}

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
