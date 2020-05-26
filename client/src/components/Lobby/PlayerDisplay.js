import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Button, Card, Form } from 'react-bootstrap'
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
  img {
    width: 100%;
  }
`

const Player = ({ mustPlayerWait, playerDisplayDataState, socket }) => {
  const Display = () => {
    console.log(mustPlayerWait)
    if (mustPlayerWait === 'marking') {
      return (
        <p className='mb-0 h5'>
          Host is marking.<br />
          <span aria-label='memo emoji' className='h1' role='img'>📝</span>
        </p>
      )
    } else if (mustPlayerWait === 'leaderboard') {
      return (
        <p className='mb-0 h5'>
          First place yet?<br />
          <span aria-label='trophy emoji' className='h1' role='img'>🏆</span>
        </p>
      )
    } else if (mustPlayerWait === 'play') {
      return (
        <p className='mb-0 h5'>
          Host is selecting a round.<br />
          <span aria-label='memo emoji' className='h1' role='img'>🔢</span>
        </p>
      )
    } else if (playerDisplayDataState.roundData && !mustPlayerWait) {
      return <DisplayQuestion />
    } else {
      return (
        <p className='mb-0 h5'>
          Please wait for Host.<br />
          <span aria-label='hourglass flowing sand emoji' className='h1' role='img'>⏳</span>
        </p>
      )
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
      let fetchUrl = ''
      if (playerDisplayDataState.roundData !== 'tieBreaker') {
        fetchUrl = `${process.env.REACT_APP_API_URL}/getDocument/lobbies/${triviaId}?roundNumber=${roundNumber}&questionNumber=${questionNumber}&name=${name}&uniqueId=${playerId}`
      } else {
        fetchUrl = `${process.env.REACT_APP_API_URL}/getDocument/lobbies/${triviaId}?tieBreaker=true`
      }
      window.fetch(fetchUrl)
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            return Promise.reject(response)
          }
        }).then((data) => {
          if (!data.statusCode) {
            if (data.length > 0) {
              if (playerDisplayDataState.roundData.type === 'multipleChoice') {
                setCurrentResponse({
                  display: String.fromCharCode(97 + parseInt(data[0].response)).toUpperCase(),
                  raw: data[0].response
                })
              } else if (playerDisplayDataState.roundData === 'tieBreaker') {
                data.forEach((response) => {
                  if (response.name === name && response.uniqueId === playerId) {
                    setCurrentResponse({
                      display: response.response,
                      raw: response.response
                    })
                  }
                })
                console.log(data)
              } else {
                setCurrentResponse({
                  display: data[0].response,
                  raw: data[0].response
                })
              }
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
              console.log('SOCKET | EMIT | playerResponded', dataToSubmit)
            } else {
              console.warn(this.response)
              console.warn('Error posting response.')
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/submitResponse`)
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

    const Picture = () => {
      const [validated, setValidated] = useState(false)
      const [response, setResponse] = useState(false)

      const submitResponse = (target) => {
        const dataToSubmit = {
          triviaId: triviaId,
          name: window.localStorage.getItem('playerName'),
          uniqueId: window.localStorage.getItem('playerId'),
          roundType: playerDisplayDataState.roundData.type,
          playerResponse: response,
          roundNumber: parseInt(playerDisplayDataState.roundData.roundNumber),
          questionNumber: parseInt(playerDisplayDataState.roundData.questionNumber)
        }

        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              console.log('[OK] submitResponse')
              setCurrentResponse({
                display: response,
                raw: response
              })
              socket.emit('playerResponded', dataToSubmit)
              console.log('SOCKET | EMIT | playerResponded', dataToSubmit)
            } else {
              console.warn(this.response)
              console.warn('Error posting response.')
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/submitResponse`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      }

      const handleSubmit = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.currentTarget.checkValidity() !== false) {
          if (response) {
            submitResponse()
          }
        } else {
          setValidated(true)
        }
      }

      return (
        <div>
          <p className='h5'>Picture {playerDisplayDataState.roundData.questionNumber + 1}</p>
          <img alt='super-secret' src={playerDisplayDataState.pictureUrl} />
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Form.Group className='text-left' controlId='formResponse'>
              <Form.Label>Response</Form.Label>
              <Form.Control
                name='response'
                onChange={(event) => setResponse(event.target.value)}
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Response</b> is required.</Form.Control.Feedback>
            </Form.Group>

            <Button type='submit' variant='primary'>Submit</Button>
          </Form>
        </div>
      )
    }

    const Lightning = () => {
      const [validated, setValidated] = useState(false)
      const [response, setResponse] = useState(false)

      const submitResponse = (target) => {
        const dataToSubmit = {
          triviaId: triviaId,
          name: window.localStorage.getItem('playerName'),
          uniqueId: window.localStorage.getItem('playerId'),
          roundType: playerDisplayDataState.roundData.type,
          playerResponse: response,
          roundNumber: parseInt(playerDisplayDataState.roundData.roundNumber),
          questionNumber: parseInt(playerDisplayDataState.roundData.questionNumber)
        }

        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              console.log('[OK] submitResponse')
              setCurrentResponse({
                display: response,
                raw: response
              })
              socket.emit('playerResponded', dataToSubmit)
              console.log('SOCKET | EMIT | playerResponded', dataToSubmit)
            } else {
              console.warn(this.response)
              console.warn('Error posting response.')
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/submitResponse`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      }

      const handleSubmit = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.currentTarget.checkValidity() !== false) {
          if (response) {
            submitResponse()
          }
        } else {
          setValidated(true)
        }
      }

      return (
        <div>
          <p className='h5'>Question {playerDisplayDataState.roundData.questionNumber + 1}</p>
          <p>{playerDisplayDataState.question}</p>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Form.Group className='text-left' controlId='formResponse'>
              <Form.Label>Response</Form.Label>
              <Form.Control
                name='response'
                onChange={(event) => setResponse(event.target.value)}
                required
                type='text'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Response</b> is required.</Form.Control.Feedback>
            </Form.Group>

            <Button type='submit' variant='primary'>Submit</Button>
          </Form>
        </div>
      )
    }

    const TieBreaker = () => {
      const [validated, setValidated] = useState(false)
      const [response, setResponse] = useState(false)

      const submitResponse = (target) => {
        const dataToSubmit = {
          triviaId: triviaId,
          name: window.localStorage.getItem('playerName'),
          uniqueId: window.localStorage.getItem('playerId'),
          roundType: 'tieBreaker',
          playerResponse: response
        }

        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              console.log('[OK] submitResponse')
              setCurrentResponse({
                display: response,
                raw: response
              })
              socket.emit('playerResponded', dataToSubmit)
              console.log('SOCKET | EMIT | playerResponded', dataToSubmit)
            } else {
              console.warn(this.response)
              console.warn('Error posting response.')
            }
          }
        }
        xhttp.open('POST', `${process.env.REACT_APP_API_URL}/submitResponse`)
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      }

      const handleSubmit = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.currentTarget.checkValidity() !== false) {
          if (response) {
            submitResponse()
          }
        } else {
          setValidated(true)
        }
      }

      return (
        <div>
          <p className='h5'>Tie Breaker</p>
          <p>{playerDisplayDataState.question}</p>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Form.Group className='text-left' controlId='formResponse'>
              <Form.Label>Response</Form.Label>
              <Form.Control
                name='response'
                onChange={(event) => setResponse(event.target.value)}
                required
                type='number'
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Response</b> must be a number.</Form.Control.Feedback>
            </Form.Group>

            <Button type='submit' variant='primary'>Submit</Button>
          </Form>
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
          {playerDisplayDataState.roundData.type === 'picture' && (<Picture />)}
          {playerDisplayDataState.roundData.type === 'lightning' && (<Lightning />)}
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
        <div>
          <TieBreaker />
          <hr />
          <div>
            <p className='h5'>
              Your response: {!currentResponse.display && (<Badge variant='danger'>Not Yet Recorded</Badge>)}{currentResponse.display && (<Badge variant='success'>{currentResponse.display}</Badge>)}
            </p>
          </div>
        </div>
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
