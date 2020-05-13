// dependencies
import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// styles
const RoundStyle = styled.div`
  .title {
    font-size: 1.25em;
    font-weight: bold;
  }
  .buttons {
    display: flex;
    justify-content: center;
    button {
      margin: 0 10px;
      width: 25%;
    }
  }
  .info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    p {
      margin: 10px;
      width: 40%;
    }
  }
  details {
    text-align: left;
  }
`

const ExistingRounds = ({ rounds }) => {
  console.log(rounds)

  const NoRounds = () => {
    return (
      <Card.Title>No rounds in trivia</Card.Title>
    )
  }

  const DisplayRounds = () => {
    return (
      <>
        {rounds.map((round, i) => {
          if (round.type === 'multipleChoice') {
            return <MultipleChoiceRound key={i} round={round} roundNumber={i} />
          }
        })}
      </>
    )
  }

  const MultipleChoiceRound = ({ round, roundNumber }) => {
    const [areDetailsVisible, setAreDetailsVisible] = useState(false)

    return (
      <RoundStyle>
        <h2>Rounds</h2>
        <hr />
        <p className='title'>Round {roundNumber + 1}</p>
        <div className='buttons'>
          <Button onClick={() => { console.log(`EDIT round ${roundNumber}`) }} variant='primary'>Edit</Button>
          <Button onClick={() => { console.log(`DELETE round ${roundNumber}`) }} variant='danger'>Delete</Button>
        </div>
        <div className='info'>
          <p>
            <span className='font-weight-bold'>Type</span><br />
            {round.type}
          </p>
          <p>
            <span className='font-weight-bold'>Theme</span><br />
            {round.theme}
          </p>
          <p>
            <span className='font-weight-bold'>Questions</span><br />
            {round.questions.length}
          </p>
          <p>
            <span className='font-weight-bold'>Point Value</span><br />
            {round.pointValue}
          </p>
        </div>
        <details>
          <summary onClick={() => { setAreDetailsVisible(!areDetailsVisible) }}>{(areDetailsVisible) ? 'Hide' : 'Show'} questions</summary>
          {round.questions.map((question, i) => {
            return (
              <div key={i}>
                <hr className='w-50' />
                <p><span className='font-weight-bold'>Question {i + 1}:</span> {question.question}</p>
                <p><span className='font-weight-bold'>Answer:</span> {String.fromCharCode(97 + question.answer).toUpperCase()}</p>
                <ol className='font-weight-bold' type='A'>
                  {question.options.map((option, i) => {
                    return (
                      <li className='font-weight-normal' key={i}>{option}</li>
                    )
                  })}
                </ol>
              </div>
            )
          })}
        </details>
        <hr />
      </RoundStyle>
    )
  }

  return (
    <Card>
      <Card.Body>
        {rounds.length < 1 && <NoRounds />}
        {rounds.length >= 1 && <DisplayRounds />}
      </Card.Body>
    </Card>
  )
}

export default ExistingRounds
