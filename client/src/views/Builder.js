// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Card } from 'react-bootstrap'

// components
import Header from '../components/Header'
import BuilderStatus from '../components/Builder/BuilderStatus'
import Pin from '../components/Builder/Pin'
import ExistingRounds from '../components/Builder/ExistingRounds'
import TriviaInfo from '../components/TriviaInfo'
import AddARound from '../components/Builder/AddARound'
import TieBreaker from '../components/Builder/TieBreaker'

const Builder = () => {
  const history = useHistory()
  const { triviaId, triviaPin } = useParams()

  const [trivia, setTrivia] = useState(false)
  const [isRoundsComplete, setIsRoundsComplete] = useState(false)

  const fetchTrivia = useCallback(() => {
    window.fetch(`${process.env.REACT_APP_API_URL}/getDocument/trivia/${triviaId}?triviaPin=${triviaPin}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          if (data.error !== 'incorrect-pin') {
            setTrivia(data)
            setIsRoundsComplete((data.rounds.length > 0))
          } else {
            history.push({
              pathname: '/',
              state: {
                message: 'incorrect-pin',
                triviaId: triviaId,
                triviaPin: triviaPin
              }
            })
          }
        } else {
          history.push({
            pathname: '/',
            state: {
              message: 'trivia-not-found',
              triviaId: triviaId
            }
          })
        }
      }).catch((error) => {
        console.error('DB | ERROR | fetchTrivia', error)
      })
  }, [history, triviaId, triviaPin])

  useEffect(() => {
    fetchTrivia()
  }, [fetchTrivia])

  return (
    <>
      <Header text='Trivia Builder' emoji='🏗' emojiDescription='building construction' />

      {!trivia && (
        <Card>
          <Card.Body>
            <p className='font-weight-bold mb-0'>Loading trivia data <span aria-label='hourglass flowing sand emoji' role='img'>⏳</span></p>
          </Card.Body>
        </Card>
      )}

      {trivia && (
        <>
          <TriviaInfo code={trivia.triviaId} host={trivia.host} />
          <BuilderStatus host={trivia.host} isRoundsComplete={isRoundsComplete} isTieBreakerComplete={(trivia.tieBreaker.question)} triviaId={trivia.triviaId} />
          <Pin fetchTrivia={fetchTrivia} triviaId={trivia.triviaId} triviaPin={trivia.triviaPin} />
          <ExistingRounds rounds={trivia.rounds} setIsRoundsComplete={setIsRoundsComplete} triviaId={trivia.triviaId} />
          <TieBreaker fetchTrivia={fetchTrivia} tieBreaker={trivia.tieBreaker} triviaId={trivia.triviaId} />
          <AddARound triviaId={triviaId} />
        </>
      )}

      <Link to='/'>Home</Link>
    </>
  )
}

export default Builder
