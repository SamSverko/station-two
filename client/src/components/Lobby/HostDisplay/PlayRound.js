import React, { useEffect, useState } from 'react'
import { Badge, Button } from 'react-bootstrap'
import styled from 'styled-components'

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

const PlayRound = ({ lobbyData, roundNumber, roundData, socket }) => {
  const displayRound = parseInt(roundNumber) + 1

  const socketQuestion = (question, questionNumber) => {
    let dataToSend = {}

    if (question !== 'tieBreaker') {
      dataToSend = {
        roundData: {
          pointValue: roundData.pointValue,
          roundNumber: roundNumber,
          theme: roundData.theme,
          type: roundData.type
        }
      }
      if (roundData.type === 'multipleChoice') {
        dataToSend.roundData.numberOfQuestions = roundData.questions.length
        dataToSend.roundData.questionNumber = questionNumber
        dataToSend.question = question.question
        dataToSend.options = question.options
      } else if (roundData.type === 'picture') {
        dataToSend.roundData.questionNumber = questionNumber
        dataToSend.pictureUrl = question.url
      } else if (roundData.type === 'lightning') {
        dataToSend.roundData.questionNumber = questionNumber
        dataToSend.question = question.question
      }
    } else {
      dataToSend = {
        roundData: 'tieBreaker',
        question: roundData.question
      }
    }

    socket.emit('displayQuestion', dataToSend)
  }

  const PlayersLeftToRespond = ({ roundNumber, questionNumber }) => {
    const [playersToRespond, setPlayersToResponse] = useState([])

    useEffect(() => {
      const playersInLobby = []
      lobbyData.players.forEach((player) => {
        playersInLobby.push(player)
      })

      const playerResponses = []
      lobbyData.responses.forEach((response) => {
        if (response.roundNumber === parseInt(roundNumber) && response.questionNumber === parseInt(questionNumber)) {
          playerResponses.push({ name: response.name, uniqueId: response.uniqueId })
        }
      })

      const playersLeft = playersInLobby.filter(user => {
        return playerResponses.findIndex(owner => (owner.name === user.name && owner.uniqueId === user.uniqueId)) === -1
      })
      if (playersLeft.length > 1) {
        setPlayersToResponse(playersLeft)
      } else {
        setPlayersToResponse(false)
      }
    }, [questionNumber, roundNumber])

    return (
      <>
        {!playersToRespond && (<Badge variant='success'>All Responses In</Badge>)}
        {Array.isArray(playersToRespond) && (
          playersToRespond.map((player, i) => {
            if (player.name !== window.localStorage.getItem('playerName') && player.uniqueId !== window.localStorage.getItem('playerId')) {
              return (
                <Badge className='mr-1' key={i} variant='danger'>{player.name}</Badge>
              )
            }
            return null
          })
        )}
      </>
    )
  }

  if (roundData.type === 'multipleChoice') {
    return (
      <RoundStyle>
        <hr />
        <p className='h5'>Play Round {displayRound}</p>
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
                        <li key={i}><span className='font-weight-normal'>{option}</span></li>
                      )
                    })}
                  </ol>
                </div>
                <div className='right'>
                  <Button onClick={() => { socketQuestion(question, i) }}>Display</Button>
                </div>
                <div className='players-to-respond'>
                  <p className='font-weight-bold'>Players left to respond:</p>
                  <PlayersLeftToRespond roundNumber={roundNumber} questionNumber={i} />
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
        <p className='h5'>Play Round {displayRound}</p>
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
                  <Button onClick={() => { socketQuestion(picture) }}>Display</Button>
                </div>
                <div className='players-to-respond'>
                  <p className='font-weight-bold'>Players left to respond:</p>
                  <PlayersLeftToRespond roundNumber={roundNumber} questionNumber={i} />
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
        <p className='h5'>Play Round {displayRound}</p>
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
                  <Button onClick={() => { socketQuestion(question) }}>Display</Button>
                </div>
                <div className='players-to-respond'>
                  <p className='font-weight-bold'>Players left to respond:</p>
                  <PlayersLeftToRespond roundNumber={roundNumber} questionNumber={i} />
                </div>
              </div>
            )
          })}
        </div>
      </RoundStyle>
    )
  } else {
    return (
      <RoundStyle>
        <hr />
        <p className='h5'>Play Tie Breaker</p>
        <div className='details'>
          <div className='question'>
            <hr />
            <div className='left'>
              <p><span className='font-weight-bold'>Question:</span> {roundData.question}</p>
              <p><span className='font-weight-bold'>Answer:</span> {roundData.answer}</p>
            </div>
            <div className='right'>
              <Button onClick={() => { socketQuestion('tieBreaker') }}>Display</Button>
            </div>
            <div className='players-to-respond'>
              <p className='font-weight-bold'>Players left to respond:</p>
              <PlayersLeftToRespond roundNumber='tieBreaker' questionNumber='tieBreaker' />
            </div>
          </div>
        </div>
      </RoundStyle>
    )
  }
}

export default PlayRound
