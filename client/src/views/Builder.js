// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Card } from 'react-bootstrap'

// components
import Header from '../components/Header'
import BuilderStatus from '../components/Builder/BuilderStatus'
import TriviaInfo from '../components/TriviaInfo'
import AddARound from '../components/Builder/AddARound'
import TieBreaker from '../components/Builder/TieBreaker'

// components
import ExistingRounds from '../components/Builder/ExistingRounds'

const Builder = () => {
  const history = useHistory()
  const { triviaId } = useParams()
  const [trivia, setTrivia] = useState(false)

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
          // console.log(data)
        } else {
          history.push('/')
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }, [history, triviaId])

  useEffect(() => {
    fetchTrivia()
  }, [fetchTrivia, triviaId])

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
          <BuilderStatus isRoundsComplete={(trivia.rounds.length > 0)} isTieBreakerComplete={(trivia.tieBreaker.question)} />
          <ExistingRounds rounds={trivia.rounds} />
          <TieBreaker fetchTrivia={fetchTrivia} tieBreaker={trivia.tieBreaker} triviaId={trivia.triviaId} />
          <AddARound />
        </>
      )}

      <Link to='/'>Home</Link>
    </>
  )
}

export default Builder
