// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

// components
import Header from '../components/Header'
import AddARound from '../components/AddARound'

const Builder = () => {
  const history = useHistory()
  const { triviaId } = useParams()
  const [trivia, setTrivia] = useState(false)

  const fetchTrivia = useCallback(() => {
    window.fetch(`http://localhost:4000/api/v1/getDocument/trivia/${triviaId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          setTrivia(data)
          console.log(data)
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

      {trivia &&
        <>
          <p>
            <b>Host:</b> {trivia.host} | <b>Code:</b> <span className='text-uppercase'>{trivia.triviaId}</span>
          </p>
          <AddARound />
        </>}

      <Link to='/'>Home</Link>
    </>
  )
}

export default Builder
