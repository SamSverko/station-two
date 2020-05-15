// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

const Question = ({ id, updateRoundQuestion }) => {
  const [question, setQuestion] = useState(false)
  const [options, setOptions] = useState([])
  const [answer, setAnswer] = useState(false)
  const optionsArray = [0, 1, 2, 3]

  const updateCallback = useCallback(() => {
    updateRoundQuestion(questionToSave)
  }, [questionToSave])

  useEffect(() => {
    const questionToSave = {
      question: (question.length > 0) ? question : false,
      options: [],
      answer: (answer !== false) ? answer : false
    }

    const hideOptions = []
    options.forEach((option) => {
      if (typeof option !== 'undefined' && option.length > 0) {
        hideOptions.push(1)
      }
    })
    if (hideOptions.length === 4) {
      questionToSave.options = options
    }

    if (questionToSave.question !== false && questionToSave.options.length === 4 && questionToSave.answer !== false) {
      updateRoundQuestion(questionToSave)
      console.log('inChildUseEffect')
    }
  }, [answer, id, options, question, updateRoundQuestion])

  return (
    <>
      {/* question */}
      <Form.Group className='text-left' controlId={`question${id}`}>
        <Form.Label>Question {id + 1}</Form.Label>
        <Form.Control
          onChange={(event) => setQuestion(event.target.value)}
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
                const savedOptions = [...options]
                savedOptions[option] = event.target.value
                setOptions(savedOptions)
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
              setAnswer(parseInt(event.target.value))
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

export default Question
