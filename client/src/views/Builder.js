// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// components
import BuilderAddARound from '../components/BuilderAddARound'

const pageStyle = {
  maxWidth: '400px',
  padding: '15px',
  textAlign: 'center'
}

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
    <Container fluid style={pageStyle}>
      <h1>Trivia Builder <span aria-label='building construction emoji' role='img'>🏗</span></h1>
      <hr />
      {trivia &&
        <>
          <p>
            <b>Host:</b> {trivia.host} | <b>Code:</b> <span className='text-uppercase'>{trivia.triviaId}</span>
          </p>
          <BuilderAddARound />
        </>}
    </Container>
  )
}

export default Builder
