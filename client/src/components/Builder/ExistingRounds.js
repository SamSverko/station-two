// dependencies
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// components
import ReadyBadge from './ReadyBadge'

// styles
const RoundStyle = styled.div`
  .title {
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
    img {
      height: auto;
      width: 50%;
    }
  }
`

const ExistingRounds = ({ rounds, setIsRoundsComplete, triviaId }) => {
  // history & params
  const history = useHistory()

  // state
  const [roundsState, setRoundsState] = useState(rounds)
  const [deleteRoundError, setDeleteRoundError] = useState(false)

  const editRound = (roundType, roundNumber) => {
    history.push(`/builder/${triviaId}/${roundType}/${roundNumber}`)
  }

  const deleteRound = (roundNumber) => {
    const xhttp = new window.XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (this.response === 'OK') {
          const currentRounds = [...roundsState]
          const updatedRounds = currentRounds.slice(0, roundNumber).concat(currentRounds.slice(roundNumber + 1, currentRounds.length))
          setRoundsState(updatedRounds)
          setIsRoundsComplete((updatedRounds.length > 0))
        } else {
          setDeleteRoundError(true)
        }
      }
    }
    xhttp.open('DELETE', 'http://localhost:4000/api/v1/deleteRound')
    xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify({ triviaId: triviaId, roundNumber: roundNumber }))
  }

  const DisplayRoundsTitle = () => {
    let titleText = ''
    if (roundsState.length !== 1) {
      titleText = `${roundsState.length} Rounds`
    } else if (roundsState.length === 1) {
      titleText = '1 Round'
    }
    return <summary className='h5 mb-0'>{titleText} <ReadyBadge isReady={roundsState.length} /></summary>
  }

  const DisplayRounds = () => {
    return (
      <details>
        <DisplayRoundsTitle />
        {roundsState.map((round, i) => {
          if (round.type === 'multipleChoice') {
            return <MultipleChoiceRound key={i} round={round} roundNumber={i} />
          } else if (round.type === 'picture') {
            return <PictureRound key={i} round={round} roundNumber={i} />
          } else if (round.type === 'lightning') {
            return <LightningRound key={i} round={round} roundNumber={i} />
          }
          return null
        })}
      </details>
    )
  }

  const MultipleChoiceRound = ({ round, roundNumber }) => {
    const [areDetailsVisible, setAreDetailsVisible] = useState(false)

    return (
      <RoundStyle>
        <hr />
        <p className='title'>Round {roundNumber + 1}</p>
        <div className='buttons'>
          <Button onClick={() => { editRound('multipleChoice', roundNumber) }} variant='primary'>Edit</Button>
          <Button onClick={() => { deleteRound(roundNumber) }} variant='danger'>Delete</Button>
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
                      <li key={i}><span className='font-weight-normal'>{option}</span></li>
                    )
                  })}
                </ol>
              </div>
            )
          })}
        </details>
      </RoundStyle>
    )
  }

  const PictureRound = ({ round, roundNumber }) => {
    const [areDetailsVisible, setAreDetailsVisible] = useState(false)

    return (
      <RoundStyle>
        <hr />
        <p className='title'>Round {roundNumber + 1}</p>
        <div className='buttons'>
          <Button onClick={() => { editRound('picture', roundNumber) }} variant='primary'>Edit</Button>
          <Button onClick={() => { deleteRound(roundNumber) }} variant='danger'>Delete</Button>
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
            {round.pictures.length}
          </p>
          <p>
            <span className='font-weight-bold'>Point Value</span><br />
            {round.pointValue}
          </p>
        </div>
        <details>
          <summary onClick={() => { setAreDetailsVisible(!areDetailsVisible) }}>{(areDetailsVisible) ? 'Hide' : 'Show'} pictures</summary>
          {round.pictures.map((picture, i) => {
            return (
              <div key={i}>
                <hr className='w-50' />
                <p><span className='font-weight-bold'>Picture {i + 1}:</span></p>
                <img alt={picture.answer} className='mb-3' src={picture.url} />
                <p><span className='font-weight-bold'>Answer:</span> {picture.answer}</p>
              </div>
            )
          })}
        </details>
      </RoundStyle>
    )
  }

  const LightningRound = ({ round, roundNumber }) => {
    const [areDetailsVisible, setAreDetailsVisible] = useState(false)

    return (
      <RoundStyle>
        <hr />
        <p className='title'>Round {roundNumber + 1}</p>
        <div className='buttons'>
          <Button onClick={() => { editRound('lightning', roundNumber) }} variant='primary'>Edit</Button>
          <Button onClick={() => { deleteRound(roundNumber) }} variant='danger'>Delete</Button>
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
                <p><span className='font-weight-bold'>Answer:</span> {question.answer}</p>
              </div>
            )
          })}
        </details>
      </RoundStyle>
    )
  }

  return (
    <Card>
      <Card.Body>
        {deleteRoundError && (
          <Alert variant='danger'>Failed to delete round. Please try again.</Alert>
        )}
        <DisplayRounds />
      </Card.Body>
    </Card>
  )
}

export default ExistingRounds
