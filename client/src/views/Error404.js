// dependencies
import React from 'react'
import { Link } from 'react-router-dom'

// components
import Header from '../components/Header'

const Error404 = () => {
  return (
    <>
      <Header text='404' emoji='🔮' emojiDescription='crystal ball' />

      <Link to='/'>To Index</Link>
    </>
  )
}

export default Error404
