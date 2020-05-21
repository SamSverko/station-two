import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// styles
const RoundStyle = styled.div`
  .title {
    font-weight: bold;
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
  .options {
      align-items: center;
      display: flex;
      flex-direction: column;
      width: 100%;
      button {
        margin: 10px 0;
        width: 90%;
      }
    }
`

const Player = ({ playerDisplayDataState, socket }) => {
  const Display = () => {
    if (!playerDisplayDataState.roundData) {
      return (
        <p>Please wait for Host.</p>
      )
    } else if (playerDisplayDataState.roundData) {
      console.log(playerDisplayDataState)
      return <DisplayQuestion />
    }
  }

  const DisplayQuestion = () => {
    const { triviaId } = useParams()

    const [currentResponse, setCurrentResponse] = useState({ display: false, raw: false })

    const fetchPlayerResponse = useCallback(() => {
      const roundNumber = playerDisplayDataState.roundData.roundNumber
      const questionNumber = playerDisplayDataState.roundData.questionNumber
      const name = window.localStorage.getItem('playerName')
      const playerId = window.localStorage.getItem('playerId')
      window.fetch(`http://${window.location.hostname}:4000/api/v1/getDocument/lobbies/${triviaId}?roundNumber=${roundNumber}&questionNumber=${questionNumber}&name=${name}&uniqueId=${playerId}`)
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            return Promise.reject(response)
          }
        }).then((data) => {
          if (!data.statusCode) {
            if (data.length > 0) {
              setCurrentResponse({
                display: String.fromCharCode(97 + parseInt(data[0].response)).toUpperCase(),
                raw: data[0].response
              })
            }
          } else {
            console.error('Error fetching player response', data)
          }
        }).catch((error) => {
          console.error('Error fetching player response', error)
        })
    }, [triviaId])

    useEffect(() => {
      fetchPlayerResponse()
    }, [fetchPlayerResponse])

    const MultipleChoice = () => {
      const submitResponse = (target) => {
        const dataToSubmit = {
          triviaId: triviaId,
          name: window.localStorage.getItem('playerName'),
          uniqueId: window.localStorage.getItem('playerId'),
          roundType: playerDisplayDataState.roundData.type,
          playerResponse: target.dataset.response,
          roundNumber: parseInt(playerDisplayDataState.roundData.roundNumber),
          questionNumber: parseInt(playerDisplayDataState.roundData.questionNumber)
        }

        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              console.log('[OK] submitResponse')
              setCurrentResponse({
                display: String.fromCharCode(97 + parseInt(target.dataset.response)).toUpperCase(),
                raw: target.dataset.response
              })
              socket.emit('playerResponded', dataToSubmit)
            } else {
              console.warn(this.response)
              console.warn('Error posting response.')
            }
          }
        }
        xhttp.open('POST', 'http://localhost:4000/api/v1/submitResponse')
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      }

      return (
        <div>
          <p className='h5'>Question {playerDisplayDataState.roundData.questionNumber + 1}</p>
          <p>{playerDisplayDataState.question}</p>
          <div className='options'>
            {playerDisplayDataState.options.map((option, i) => {
              return (
                <Button data-response={i} key={i} onClick={(event) => { submitResponse(event.target) }} variant={(parseInt(currentResponse.raw) === parseInt(i)) ? 'success' : 'primary'}><span className='font-weight-bold'>{String.fromCharCode(97 + i).toUpperCase()})</span> {option}</Button>
              )
            })}
          </div>
        </div>
      )
    }

    if (playerDisplayDataState.roundData !== 'tieBreaker') {
      return (
        <RoundStyle>
          <Card.Title>Round {parseInt(playerDisplayDataState.roundData.roundNumber) + 1}</Card.Title>
          <div className='info'>
            <p>
              <span className='font-weight-bold'>Type</span><br />
              {playerDisplayDataState.roundData.type}
            </p>
            <p>
              <span className='font-weight-bold'>Theme</span><br />
              {playerDisplayDataState.roundData.theme}
            </p>
            <p>
              <span className='font-weight-bold'>Questions</span><br />
              {playerDisplayDataState.roundData.numberOfQuestions}
            </p>
            <p>
              <span className='font-weight-bold'>Point Value</span><br />
              {playerDisplayDataState.roundData.pointValue}
            </p>
          </div>
          <hr />
          {playerDisplayDataState.roundData.type === 'multipleChoice' && (<MultipleChoice />)}
          <hr />
          <div>
            <p className='h5'>
              Your response: {!currentResponse.display && (<Badge variant='danger'>Not Yet Recorded</Badge>)}{currentResponse.display && (<Badge variant='success'>{currentResponse.display}</Badge>)}
            </p>
          </div>
        </RoundStyle>
      )
    } else {
      return (
        <p>Tie Breaker</p>
      )
    }
  }

  return (
    <Card>
      <Card.Body>
        <Display />
      </Card.Body>
    </Card>
  )
}

export default Player
