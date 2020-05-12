// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

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
    <div>
      <Link to='/'>To Index</Link>
      <h1>Trivia builder page</h1>
      <p>{trivia.host}</p>
      <button onClick={fetchTrivia}>Fetch data</button>
    </div>
  )
}

export default Builder
