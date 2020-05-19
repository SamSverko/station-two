// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Card } from 'react-bootstrap'

// components
import Header from '../components/Header'
import BuilderStatus from '../components/Builder/BuilderStatus'
import ExistingRounds from '../components/Builder/ExistingRounds'
import TriviaInfo from '../components/TriviaInfo'
import AddARound from '../components/Builder/AddARound'
import TieBreaker from '../components/Builder/TieBreaker'

const Builder = () => {
  const history = useHistory()
  const { triviaId } = useParams()

  const [trivia, setTrivia] = useState(false)
  const [isRoundsComplete, setIsRoundsComplete] = useState(false)

  const fetchTrivia = useCallback(() => {
    window.fetch(`http://${window.location.hostname}:4000/api/v1/getDocument/trivia/${triviaId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          setTrivia(data)
          setIsRoundsComplete((data.rounds.length > 0))
        } else {
          history.push('/')
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }, [history, triviaId])

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
          <BuilderStatus isRoundsComplete={isRoundsComplete} isTieBreakerComplete={(trivia.tieBreaker.question)} triviaId={trivia.triviaId} />
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
