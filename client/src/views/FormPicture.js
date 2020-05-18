// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Alert, Badge, Button, Card, Form } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'

// styles
const RoundActionButtons = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  width: 100%;
  .item {
    width: 33%;
  }
`

const FormPicture = () => {
  // constants
  const maxPictures = 20

  // history & params
  const history = useHistory()
  const { triviaId } = useParams()
  const { roundNumber } = useParams()

  // state
  const [validated, setValidated] = useState(false)
  const [postStatus, setPostStatus] = useState('pending')
  const [isMaxPicturesReached, setIsMaxPicturesReached] = useState(false)

  const [roundInfoState, setRoundInfoState] = useState({
    theme: 'none',
    picturePointValue: 1
  })
  const handleRoundInfoChange = (event) => setRoundInfoState({
    ...roundInfoState,
    [event.target.name]: event.target.value
  })

  const blankPicture = { url: '', answer: '' }
  const [pictureState, setPictureState] = useState([
    { ...blankPicture }
  ])

  // fetch round data (if editing existing round)
  const fetchRound = useCallback(() => {
    window.fetch(`http://${window.location.hostname}:4000/api/v1/getDocument/trivia/${triviaId}?roundNumber=${roundNumber}`)
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
            picturePointValue: data.pointValue
          })
          setPictureState(data.pictures)
        } else {
          history.push(`/builder/${triviaId}`)
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }, [history, roundNumber, triviaId])

  useEffect(() => {
    if (roundNumber !== 'new') {
      fetchRound()
    }
  }, [fetchRound, roundNumber])

  // handle form updates
  const addPicture = () => {
    setPictureState([...pictureState, { ...blankPicture }])

    if (pictureState.length < maxPictures - 1) {
      setIsMaxPicturesReached(false)
    } else {
      setIsMaxPicturesReached(true)
    }
  }

  const removePicture = (id) => {
    const currentPictures = [...pictureState]
    const updatedPictures = currentPictures.slice(0, id).concat(currentPictures.slice(id + 1, currentPictures.length))
    setPictureState(updatedPictures)

    if (pictureState.length <= maxPictures) {
      setIsMaxPicturesReached(false)
    }
  }

  const handlePictureChange = (event) => {
    const updatedPictures = [...pictureState]
    updatedPictures[event.target.dataset.idx][event.target.dataset.field] = event.target.value
    setPictureState(updatedPictures)
  }

  const validateImageUrl = (event, idx) => {
    event.persist()
    const imageThumbnail = document.getElementById(`picture-${idx}-thumbnail`)
    return new Promise((resolve, reject) => {
      const timeout = 5000
      let timer = ''
      const img = new window.Image()
      img.onerror = img.onabort = () => {
        clearTimeout(timer)
        // Promise.reject(new Error('Error loading image source.'))
        console.log('Error loading image source.')
        event.target.classList.remove('is-valid')
        event.target.classList.add('is-invalid')
        imageThumbnail.classList.add('d-none')
      }
      img.onload = () => {
        clearTimeout(timer)
        resolve('Success.')
        event.target.classList.remove('is-invalid')
        event.target.classList.add('is-valid')
        imageThumbnail.classList.remove('d-none')
        imageThumbnail.src = event.target.value
      }
      timer = setTimeout(() => {
        img.src = '//!!!!/noexist.jpg'
        // Promise.reject(new Error('Timeout loading image source.'))
        console.log('Invalid URL.')
      }, timeout)
      img.src = event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.currentTarget.checkValidity() !== false) {
      const dataToSubmit = {
        triviaId: triviaId,
        roundTheme: roundInfoState.theme,
        roundPointValue: roundInfoState.picturePointValue,
        roundPictures: pictureState
      }

      if (roundNumber === 'new') {
        const xhttp = new window.XMLHttpRequest()
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            if (this.response === 'OK') {
              setPostStatus(true)
              window.setTimeout(() => {
                history.push(`/builder/${triviaId}`)
              }, 1500)
            } else {
              console.log(JSON.parse(this.response))
              setPostStatus(false)
            }
          }
        }
        xhttp.open('POST', 'http://localhost:4000/api/v1/addPictureRound')
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
                history.push(`/builder/${triviaId}`)
              }, 1500)
            } else {
              console.log(JSON.parse(this.response))
              setPostStatus(false)
            }
          }
        }
        xhttp.open('POST', 'http://localhost:4000/api/v1/updatePictureRound')
        xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        xhttp.send(JSON.stringify(dataToSubmit))
      }
    } else {
      setValidated(true)
    }
  }

  return (
    <>
      <Header text='Picture' emoji='🖼' emojiDescription='framed picture emoji' />

      <Card>
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>

            <Form.Group className='text-left' controlId='formTheme'>
              <Form.Label>Theme</Form.Label>
              <Form.Control
                name='theme'
                onChange={handleRoundInfoChange}
                placeholder={roundInfoState.theme}
                type='text'
                value={roundInfoState.theme}
              />
              <Form.Text className='text-muted'>Default if left blank: 'none'</Form.Text>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>Code must be 4 alphabetical characters [A-Z].</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className='text-left' controlId='formPicturePointValue'>
              <Form.Label>Picture point value</Form.Label>
              <Form.Control
                name='picturePointValue'
                onChange={handleRoundInfoChange}
                placeholder={roundInfoState.picturePointValue}
                type='number'
                value={roundInfoState.picturePointValue}
              />
              <Form.Text className='text-muted'>Default if left blank: 1</Form.Text>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'><b>Picture point value</b> must be a number.</Form.Control.Feedback>
            </Form.Group>

            {
              pictureState.map((item, idx) => {
                return (
                  <div key={`picture-container-${idx}`}>
                    {/* url */}
                    <Form.Group className='text-left' controlId={`url-${idx}`}>
                      <Form.Label>Picture {idx + 1} URL {idx > 0 && (<Badge onClick={() => { removePicture(idx) }} variant='danger'>Remove</Badge>)}</Form.Label>
                      <Form.Control
                        data-field='url'
                        data-idx={idx}
                        name={`picture-${idx}-url`}
                        onBlur={(event) => { validateImageUrl(event, idx) }}
                        onChange={handlePictureChange}
                        required
                        type='text'
                        value={pictureState[idx].url}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'><b>Picture {idx + 1} URL</b> must link to an image (hint: 'https://image.png').</Form.Control.Feedback>
                      <img alt='Url thumbnail preview.' className='d-none mt-3 w-25' id={`picture-${idx}-thumbnail`} />
                    </Form.Group>

                    {/* answer */}
                    <Form.Group className='text-left' controlId={`answer-${idx}`}>
                      <Form.Label>Answer</Form.Label>
                      <Form.Control
                        data-field='answer'
                        data-idx={idx}
                        name={`picture-${idx}-answer`}
                        onChange={handlePictureChange}
                        required
                        type='text'
                        value={pictureState[idx].answer}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type='invalid'><b>Answer {idx + 1}</b> must be filled out.</Form.Control.Feedback>
                    </Form.Group>

                    <hr />
                  </div>
                )
              })
            }

            <div className='text-left'>
              {!isMaxPicturesReached && (
                <Button disabled={isMaxPicturesReached} onClick={addPicture} variant='outline-primary'>Add a Picture</Button>
              )}
              {isMaxPicturesReached && (
                <Alert variant='warning'>Rounds are limited to a maximum of {maxPictures} pictures.</Alert>
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
              <Button className='item' type='submit' variant='primary'>Save</Button>
              <Link className='item' to={`/builder/${triviaId}`}>
                <Button className='w-100' variant='danger'>{(roundNumber === 'new' ? 'Discard' : 'Cancel')}</Button>
              </Link>
            </RoundActionButtons>

          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default FormPicture
