import React, { useState } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// styles
const HostControlContainerStyle = styled.div`
  width: 100%;
  div {
    align-items: center;
    display: flex;
    justify-content: center;
    button {
      margin: 5px;
      width: 50%;
    }
  }
`

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
  .details {
    text-align: left;
    img {
      height: auto;
      width: 50%;
    }
    .question, .picture {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      hr {
        width: 100%;
      }
      .left {
        width: 66%;
      }
      .right {
        width: 33%;
      }
      .players-to-respond {
        width: 100%;
      }
    }
  }
`

// children components
const PlayRound = ({ roundNumber, roundData }) => {
  if (roundData.type === 'multipleChoice') {
    return (
      <RoundStyle>
        <hr />
        <p className='h5'>Play Round {roundNumber + 1}</p>
        <div className='info'>
          <p>
            <span className='font-weight-bold'>Type</span><br />
            {roundData.type}
          </p>
          <p>
            <span className='font-weight-bold'>Theme</span><br />
            {roundData.theme}
          </p>
          <p>
            <span className='font-weight-bold'>Questions</span><br />
            {roundData.questions.length}
          </p>
          <p>
            <span className='font-weight-bold'>Point Value</span><br />
            {roundData.pointValue}
          </p>
        </div>
        <div className='details'>
          {roundData.questions.map((question, i) => {
            return (
              <div className='question' key={i}>
                <hr />
                <div className='left'>
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
                <div className='right'>
                  <Button>Hidden</Button>
                </div>
                <div className='players-to-respond'>
                  <p className='font-weight-bold'>Players left to respond:</p>
                  <Badge variant='info'>sam</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </RoundStyle>
    )
  } else if (roundData.type === 'picture') {
    return (
      <RoundStyle>
        <hr />
        <p className='h5'>Play Round {roundNumber + 1}</p>
        <div className='info'>
          <p>
            <span className='font-weight-bold'>Type</span><br />
            {roundData.type}
          </p>
          <p>
            <span className='font-weight-bold'>Theme</span><br />
            {roundData.theme}
          </p>
          <p>
            <span className='font-weight-bold'>Questions</span><br />
            {roundData.pictures.length}
          </p>
          <p>
            <span className='font-weight-bold'>Point Value</span><br />
            {roundData.pointValue}
          </p>
        </div>
        <div className='details'>
          {roundData.pictures.map((picture, i) => {
            return (
              <div className='picture' key={i}>
                <hr />
                <div className='left'>
                  <p><span className='font-weight-bold'>Picture {i + 1}:</span></p>
                  <img alt={picture.answer} src={picture.url} />
                  <p><span className='font-weight-bold'>Answer:</span> {picture.answer}</p>
                </div>
                <div className='right'>
                  <Button>Hidden</Button>
                </div>
                <div className='players-to-respond'>
                  <p className='font-weight-bold'>Players left to respond:</p>
                  <Badge variant='info'>sam</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </RoundStyle>
    )
  } else if (roundData.type === 'lightning') {
    return (
      <RoundStyle>
        <hr />
        <p className='h5'>Play Round {roundNumber + 1}</p>
        <div className='info'>
          <p>
            <span className='font-weight-bold'>Type</span><br />
            {roundData.type}
          </p>
          <p>
            <span className='font-weight-bold'>Theme</span><br />
            {roundData.theme}
          </p>
          <p>
            <span className='font-weight-bold'>Questions</span><br />
            {roundData.questions.length}
          </p>
          <p>
            <span className='font-weight-bold'>Point Value</span><br />
            {roundData.pointValue}
          </p>
        </div>
        <div className='details'>
          {roundData.questions.map((question, i) => {
            return (
              <div className='question' key={i}>
                <hr />
                <div className='left'>
                  <p><span className='font-weight-bold'>Question {i + 1}:</span> {question.question}</p>
                  <p><span className='font-weight-bold'>Answer:</span> {question.answer}</p>
                </div>
                <div className='right'>
                  <Button>Hidden</Button>
                </div>
                <div className='players-to-respond'>
                  <p className='font-weight-bold'>Players left to respond:</p>
                  <Badge variant='info'>sam</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </RoundStyle>
    )
  }
}

const MarkRound = ({ roundNumber }) => {
  return (
    <>
      <hr />
      <p className='h5'>Mark Round {roundNumber + 1}</p>
    </>
  )
}

const PlayTieBreaker = ({ tieBreakerData }) => {
  return (
    <RoundStyle>
      <hr />
      <p className='h5'>Play Tie Breaker</p>
      <div className='details'>
        <div className='question'>
          <hr />
          <div className='left'>
            <p><span className='font-weight-bold'>Question:</span> {tieBreakerData.question}</p>
            <p><span className='font-weight-bold'>Answer:</span> {tieBreakerData.answer}</p>
          </div>
          <div className='right'>
            <Button>Hidden</Button>
          </div>
          <div className='players-to-respond'>
            <p className='font-weight-bold'>Players left to respond:</p>
            <Badge variant='info'>sam</Badge>
          </div>
        </div>
      </div>
    </RoundStyle>
  )
}

const MarkTieBreaker = ({ round }) => {
  return (
    <>
      <hr />
      <p className='h5'>Mark Tie Breaker</p>
    </>
  )
}

const DisplayLeaderBoard = ({ round }) => {
  return (
    <>
      <hr />
      <p className='h5'>Display Leaderboard</p>
    </>
  )
}

const HostDisplay = ({ triviaData }) => {
  const [currentHostActionState, setCurrentHostActionState] = useState(false)
  const [currentRoundDataState, setCurrentRoundDataState] = useState(false)
  const [currentRoundNumberState, setCurrentRoundNumberState] = useState(false)

  const hostAction = (action, target, round, roundNumber) => {
    // update checked style
    const buttons = document.getElementsByClassName('action-button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active')
    }
    target.classList.add('active')

    setCurrentHostActionState(action)
    setCurrentRoundDataState(round)
    setCurrentRoundNumberState(roundNumber)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Host Controls</Card.Title>
        <HostControlContainerStyle>
          {triviaData.rounds.map((round, idx) => {
            return (
              <div key={idx}>
                <Button className='action-button' onClick={(event) => { hostAction('play-round', event.target, round, idx) }}>Play Round {idx + 1}</Button>
                <Button className='action-button' onClick={(event) => { hostAction('mark-round', event.target, round, idx) }}>Mark Round {idx + 1}</Button>
              </div>
            )
          })}
          <div>
            <Button className='action-button' onClick={(event) => { hostAction('play-tie-breaker', event.target) }}>Play Tie Breaker</Button>
            <Button className='action-button' onClick={(event) => { hostAction('mark-tie-breaker', event.target) }}>Mark Tie Breaker</Button>
          </div>
          <div>
            <Button className='action-button' onClick={(event) => { hostAction('display-leaderboard', event.target) }}>Display Leaderboard</Button>
          </div>
        </HostControlContainerStyle>

        {currentHostActionState === 'play-round' && (
          <PlayRound roundData={currentRoundDataState} roundNumber={currentRoundNumberState} />
        )}
        {currentHostActionState === 'mark-round' && (
          <MarkRound roundNumber={currentRoundNumberState} />
        )}
        {currentHostActionState === 'play-tie-breaker' && (
          <PlayTieBreaker tieBreakerData={triviaData.tieBreaker} />
        )}
        {currentHostActionState === 'mark-tie-breaker' && (
          <MarkTieBreaker />
        )}
        {currentHostActionState === 'display-leaderboard' && (
          <DisplayLeaderBoard />
        )}
      </Card.Body>
    </Card>
  )
}

export default HostDisplay
