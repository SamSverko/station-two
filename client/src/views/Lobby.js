// dependencies
import React from 'react'
import { Link, useParams } from 'react-router-dom'

// components
import Header from '../components/Header'
import TriviaInfo from '../components/TriviaInfo'

const Lobby = () => {
  const { hostName, triviaId, role } = useParams()

  return (
    <>
      <Header text='Lobby' emoji='🏟' emojiDescription='stadium' />

      <TriviaInfo code={triviaId} host={hostName} />

      {role === 'player' && (
        <Link to='/'>Home</Link>
      )}
      {role === 'host' && (
        <Link to={`/builder/${triviaId}`}>To Builder</Link>
      )}
    </>
  )
}

export default Lobby
