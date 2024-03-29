// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'

// styles
const RemoveQuestionDivStyle = styled.div`
  margin: 10px 0 0 0;
  text-align: left;
`

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
  // constants
  const optionsArray = [0, 1, 2, 3]
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

  const blankQuestion = { question: '', answer: '', options: ['', '', '', ''] }
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
          // check the proper answer radio button
          data.questions.forEach((question, counter) => {
            document.getElementById(`question-${counter}-answer-${question.answer}`).checked = true
          })
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
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/addMultipleChoiceRound`)
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
              console.error('DB | ERROR | handleSubmit exist', this.response)
              setPostStatus(false)
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/updateMultipleChoiceRound`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      }
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

            <p className='h3'>Round Settings</p>

            <Form.Group className='text-left' controlId='formTheme'>
              <Form.Label>Theme</Form.Label>
              <Form.Control
                name='theme'
                onChange={handleRoundInfoChange}
                placeholder={roundInfoState.theme}
                type='text'
                value={roundInfoState.theme}
              />
              <Form.Text className='text-muted'>Default if left blank: none</Form.Text>
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

            <hr />

            {
              questionState.map((item, idx) => {
                return (
                  <div key={`question-container-${idx}`}>

                    <p className='h3'>Question {idx + 1}</p>

                    {/* question */}
                    <Form.Group className='text-left' controlId={`name-${idx}`}>
                      <Form.Label>Question {idx + 1}</Form.Label>
                      <Form.Control
                        data-field='question'
                        data-idx={idx}
                        name={`question-${idx}-question`}
                        onChange={handleQuestionChange}
                        placeholder='Question'
                        required
                        type='text'
                        value={questionState[idx].question}
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
                            placeholder={`Option ${String.fromCharCode(97 + option).toUpperCase()}`}
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

                    {idx > 0 && (
                      <RemoveQuestionDivStyle>
                        <Button onClick={() => { removeQuestion(idx) }} variant='danger'>Remove Question {idx + 1}</Button>
                      </RemoveQuestionDivStyle>
                    )}

                    <hr />
                  </div>
                )
              })
            }

            <div>
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
              <Link className='item' to={`/builder/${triviaId}/${triviaPin}`}>
                <Button className='w-100' variant='danger'>{(roundNumber === 'new' ? 'Discard' : 'Cancel')}</Button>
              </Link>
              <Button className='item' type='submit' variant='primary'>Save</Button>
            </RoundActionButtons>

          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default FormMultipleChoice
