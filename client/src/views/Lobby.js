// dependencies
import React from 'react'
import { Link } from 'react-router-dom'

// components
import Header from '../components/Header'

const Lobby = () => {
  return (
    <>
      <Header text='Lobby' emoji='🏟' emojiDescription='stadium' />
      <Link to='/'>To Index</Link>
    </>
  )
}

export default Lobby
