// dependencies
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

// components
import Header from '../components/Header'

const Lobby = () => {
  const { triviaId, role } = useParams()

  const [roleState] = useState(role)

  return (
    <>
      <Header text='Lobby' emoji='🏟' emojiDescription='stadium' />

      {roleState === 'player' && (
        <Link to='/'>To Index</Link>
      )}
      {roleState === 'host' && (
        <Link to={`/builder/${triviaId}`}>To Builder</Link>
      )}
    </>
  )
}

export default Lobby
