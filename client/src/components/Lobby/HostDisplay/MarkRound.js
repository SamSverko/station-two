import React, { useCallback, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const TableStyle = styled(Table)`
  button {
    margin: 5px;
  }
  img {
    height: auto;
    width: 100%;
  }
  th {
    vertical-align: middle;
  }
  thead th, tbody td {
    vertical-align: middle;
    width: 50%;
  }
  .striped {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .opacity-marked {
    opacity: 1
  }
  .opacity-unmarked {
    opacity: 0.1
  }
`

const MarkRound = ({ lobbyData, roundData, roundNumber }) => {
  const { triviaId } = useParams()

  const [savedLobbyData, setSavedLobbyData] = useState(lobbyData)
  const [currentRoundResponses, setCurrentRoundResponses] = useState([])
  const displayRound = parseInt(roundNumber) + 1

  const fetchLobbyData = useCallback(() => {
    window.fetch(`${process.env.REACT_APP_API_URL}/getDocument/lobbies/${triviaId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          console.log('DB | OK | fetchLobbyData')
          setSavedLobbyData(data)
        } else {
          console.warn('DB | WARN | fetchLobbyData', data)
        }
      }).catch((error) => {
        console.error('DB | ERROR | fetchLobbyData', error)
      })
  }, [triviaId])

  useEffect(() => {
    const tempCurrentRound = []
    savedLobbyData.responses.forEach((response) => {
      if (parseInt(response.roundNumber) === parseInt(roundNumber)) {
        tempCurrentRound.push(response)
      } else if (roundNumber === 'tieBreaker' && response.roundType === 'tieBreaker') {
        tempCurrentRound.push(response)
      }
    })
    setCurrentRoundResponses(tempCurrentRound)
  }, [savedLobbyData, roundData, roundNumber])

  const markResponse = (questionNumber, pointValue, name, uniqueId) => {
    const dataToSubmit = {
      triviaId: triviaId,
      name: name,
      uniqueId: uniqueId,
      score: parseFloat(pointValue)
    }

    if (roundNumber !== 'tieBreaker') {
      dataToSubmit.roundType = roundData.type
      dataToSubmit.roundNumber = parseInt(roundNumber)
      dataToSubmit.questionNumber = parseInt(questionNumber)
    } else {
      dataToSubmit.roundType = 'tieBreaker'
    }

    const xhttp = new window.XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (this.response === 'OK') {
          console.log('DB | OK | markResponse')
          fetchLobbyData()
        } else {
          console.warn('DB | WARN | markResponse', this.response)
        }
      } else {
        console.error('DB | ERROR | markResponse', this.response)
      }
    }
    xhttp.open('POST', `${process.env.REACT_APP_API_URL}/markResponse`)
    xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify(dataToSubmit))
  }

  const MultipleChoice = () => {
    const CurrentQuestion = ({ response, questionNumber }) => {
      if (response.questionNumber === questionNumber) {
        return (
          <tr>
            <td>{String.fromCharCode(97 + response.response).toUpperCase()}</td>
            <td>
              <Button className={(parseFloat(response.score) === parseFloat(roundData.pointValue)) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, roundData.pointValue, response.name, response.uniqueId) }} variant='success'>{roundData.pointValue}</Button>
              <Button className={(parseFloat(response.score) === parseFloat(roundData.pointValue) / 2) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, roundData.pointValue / 2, response.name, response.uniqueId) }} variant='warning'>{roundData.pointValue / 2}</Button>
              <Button className={(parseFloat(response.score) === 0) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, 0, response.name, response.uniqueId) }} variant='danger'>0</Button>
            </td>
          </tr>
        )
      } else {
        return null
      }
    }

    return (
      <>
        <hr />
        <p className='h5'>Mark Round {displayRound}</p>
        <TableStyle bordered size='sm'>
          <thead>
            <tr className='striped'>
              <th>Player Answer</th>
              <th>Mark</th>
            </tr>
          </thead>
          {roundData.questions.map((question, i) => {
            return (
              <tbody key={i}>
                <tr className='striped'>
                  <th>Q{i + 1}: <span className='font-weight-normal'>{question.question}</span></th>
                  <th>A{i + 1}: <span className='font-weight-normal'>{String.fromCharCode(97 + question.answer).toUpperCase()}</span></th>
                </tr>
                {currentRoundResponses.map((response, j) => {
                  return <CurrentQuestion key={j} questionNumber={i} response={response} />
                })}
              </tbody>
            )
          })}
        </TableStyle>
      </>
    )
  }

  const Picture = () => {
    const CurrentQuestion = ({ response, questionNumber }) => {
      if (response.questionNumber === questionNumber) {
        return (
          <tr>
            <td>{response.response}</td>
            <td>
              <Button className={(parseFloat(response.score) === parseFloat(roundData.pointValue)) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, roundData.pointValue, response.name, response.uniqueId) }} variant='success'>{roundData.pointValue}</Button>
              <Button className={(parseFloat(response.score) === parseFloat(roundData.pointValue) / 2) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, roundData.pointValue / 2, response.name, response.uniqueId) }} variant='warning'>{roundData.pointValue / 2}</Button>
              <Button className={(parseFloat(response.score) === 0) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, 0, response.name, response.uniqueId) }} variant='danger'>0</Button>
            </td>
          </tr>
        )
      } else {
        return null
      }
    }

    return (
      <>
        <hr />
        <p className='h5'>Mark Round {displayRound}</p>
        <TableStyle bordered size='sm'>
          <thead>
            <tr className='striped'>
              <th>Player Answer</th>
              <th>Mark</th>
            </tr>
          </thead>
          {roundData.pictures.map((picture, i) => {
            return (
              <tbody key={i}>
                <tr className='striped'>
                  <th>Image {i + 1}: <img alt={picture.answer} src={picture.url} /></th>
                  <th>A{i + 1}: <span className='font-weight-normal'>{picture.answer}</span></th>
                </tr>
                {currentRoundResponses.map((response, j) => {
                  return <CurrentQuestion key={j} questionNumber={i} response={response} />
                })}
              </tbody>
            )
          })}
        </TableStyle>
      </>
    )
  }

  const Lightning = () => {
    const CurrentQuestion = ({ response, questionNumber }) => {
      if (response.questionNumber === questionNumber) {
        return (
          <tr>
            <td>{response.response}</td>
            <td>
              <Button className={(parseFloat(response.score) === parseFloat(roundData.pointValue)) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, roundData.pointValue, response.name, response.uniqueId) }} variant='success'>{roundData.pointValue}</Button>
              <Button className={(parseFloat(response.score) === parseFloat(roundData.pointValue) / 2) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, roundData.pointValue / 2, response.name, response.uniqueId) }} variant='warning'>{roundData.pointValue / 2}</Button>
              <Button className={(parseFloat(response.score) === 0) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, 0, response.name, response.uniqueId) }} variant='danger'>0</Button>
            </td>
          </tr>
        )
      } else {
        return null
      }
    }

    return (
      <>
        <hr />
        <p className='h5'>Mark Round {displayRound}</p>
        <TableStyle bordered size='sm'>
          <thead>
            <tr className='striped'>
              <th>Player Answer</th>
              <th>Mark</th>
            </tr>
          </thead>
          {roundData.questions.map((question, i) => {
            return (
              <tbody key={i}>
                <tr className='striped'>
                  <th>Q{i + 1}: <span className='font-weight-normal'>{question.question}</span></th>
                  <th>A{i + 1}: <span className='font-weight-normal'>{question.answer}</span></th>
                </tr>
                {currentRoundResponses.map((response, j) => {
                  return <CurrentQuestion key={j} questionNumber={i} response={response} />
                })}
              </tbody>
            )
          })}
        </TableStyle>
      </>
    )
  }

  const TieBreaker = () => {
    const CurrentQuestion = ({ response }) => {
      return (
        <tr>
          <td>{response.response} ({roundData.answer - response.response})</td>
          <td>
            <Button className={(parseFloat(response.score) === 1) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, 1, response.name, response.uniqueId) }} variant='success'>Winner</Button>
            <Button className={(parseFloat(response.score) === 0) ? 'opacity-marked' : 'opacity-unmarked'} onClick={() => { markResponse(response.questionNumber, 0, response.name, response.uniqueId) }} variant='danger'>Loser</Button>
          </td>
        </tr>
      )
    }

    return (
      <>
        <hr />
        <p className='h5'>Mark Tie Breaker</p>
        <TableStyle bordered size='sm'>
          <thead>
            <tr className='striped'>
              <th>Player Answer</th>
              <th>Mark</th>
            </tr>
          </thead>
          <tbody>
            <tr className='striped'>
              <th>Q: <span className='font-weight-normal'>{roundData.question}</span></th>
              <th>A: <span className='font-weight-normal'>{roundData.answer}</span></th>
            </tr>
            {currentRoundResponses.map((response, j) => {
              return <CurrentQuestion key={j} response={response} />
            })}
          </tbody>
        </TableStyle>
      </>
    )
  }

  return (
    <>
      {roundData.type === 'multipleChoice' && (<MultipleChoice />)}
      {roundData.type === 'picture' && (<Picture />)}
      {roundData.type === 'lightning' && (<Lightning />)}
      {roundNumber === 'tieBreaker' && (<TieBreaker />)}
    </>
  )
}

export default MarkRound
