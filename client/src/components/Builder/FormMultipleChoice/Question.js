// dependencies
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
const Question = ({ id }) => {
  const [question, setQuestion] = useState(false)
  const [options, setOptions] = useState([])
  const [answer, setAnswer] = useState(false)
  const optionsArray = [0, 1, 2, 3]

  useEffect(() => {
    if (question.length > 0) {
      console.log('question', question)
    }

    const hideOptions = []
    options.forEach((option) => {
      if (typeof option !== 'undefined') {
        hideOptions.push(1)
      }
    })
    if (hideOptions.length === 4) {
      console.log('options', options)
    }

    if (answer !== false) {
      console.log('answer', answer)
    }
  }, [question, options, answer])

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
