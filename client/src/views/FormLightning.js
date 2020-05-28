// dependencies
import React, { useCallback, useEffect, useState } from 'react'
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

const FormLightning = () => {
  // constants
  const maxQuestions = 20

  // history & params
  const history = useHistory()
  const { triviaId, triviaPin } = useParams()
  const { roundNumber } = useParams()

  // state
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

  const blankQuestion = { question: '', answer: '' }
  const [questionState, setQuestionState] = useState([
    { ...blankQuestion }
  ])

  // fetch round data (if editing existing round)
  const fetchRound = useCallback(() => {
    window.fetch(`${process.env.REACT_APP_API_URL}/getDocument/trivia/${triviaId}?roundNumber=${roundNumber}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          // populate form data
          setRoundInfoState({
            theme: data.theme,
            questionPointValue: data.pointValue
          })
          setQuestionState(data.questions)
        } else {
          history.push(`/builder/${triviaId}/${triviaPin}`)
        }
      }).catch((error) => {
        console.error('DB | ERROR | fetchRound', error)
      })
  }, [history, roundNumber, triviaId, triviaPin])

  useEffect(() => {
    if (roundNumber !== 'new') {
      fetchRound()
    }
  }, [fetchRound, roundNumber])

  // handle form updates
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

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      const dataToSubmit = {
        triviaId: triviaId,
        roundTheme: roundInfoState.theme,
        roundPointValue: roundInfoState.questionPointValue,
        roundLightningQuestions: questionState
      }

      if (roundNumber === 'new') {
        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              setPostStatus(true)
              window.setTimeout(() => {
                history.push(`/builder/${triviaId}/${triviaPin}`)
              }, 1500)
            } else {
              console.error('DB | ERROR | handleSubmit new', this.response)
              setPostStatus(false)
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/addLightningRound`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      } else {
        dataToSubmit.roundNumber = roundNumber

        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              setPostStatus(true)
              window.setTimeout(() => {
                history.push(`/builder/${triviaId}/${triviaPin}`)
              }, 1500)
            } else {
              console.error('DB | ERROR | handleSubmit existing', this.response)
              setPostStatus(false)
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/updateLightningRound`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      }
    } else {
      setValidated(true)
    }
  }

  return (
    <>
      <Header text='Lightning' emoji='⚡️' emojiDescription='zap emoji' />

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
                    <Form.Group className='text-left' controlId={`question-${idx}`}>
                      <Form.Label>Question {idx + 1} {idx > 0 && (<Badge onClick={() => { removeQuestion(idx) }} variant='danger'>Remove</Badge>)}</Form.Label>
                      <Form.Control
                        data-field='question'
                        data-idx={idx}
                        name={`question-${idx}-question`}
                        onChange={handleQuestionChange}
                        required
                        type='text'
                        value={questionState[idx].question}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'><b>Question</b> must be filled out.</Form.Control.Feedback>
                    </Form.Group>

                    {/* answer */}
                    <Form.Group className='text-left' controlId={`answer-${idx}`}>
                      <Form.Label>Answer</Form.Label>
                      <Form.Control
                        data-field='answer'
                        data-idx={idx}
                        name={`question-${idx}-answer`}
                        onChange={handleQuestionChange}
                        required
                        type='text'
                        value={questionState[idx].answer}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'><b>Answer {idx + 1}</b> must be filled out.</Form.Control.Feedback>
                    </Form.Group>

                    <hr />
                  </div>
                )
              })
            }

            <div className='text-left'>
              {!isMaxQuestionsReached && (
                <Button disabled={isMaxQuestionsReached} onClick={addQuestion} variant='outline-primary'>Add a Question</Button>
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
              <Link className='item' to={`/builder/${triviaId}/${triviaPin}`}>
                <Button className='w-100' variant='danger'>{(roundNumber === 'new' ? 'Discard' : 'Cancel')}</Button>
              </Link>
            </RoundActionButtons>

          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default FormLightning
