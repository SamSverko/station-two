// dependencies
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'

// styles
const ButtonStyle = styled(Button)`
  font-size: 2.5em !important;
`

const Host = () => {
  return (
    <>
      <Header text='Host Trivia' emoji='👑' emojiDescription='crown' />

      <Link to='/host/new'>
        <ButtonStyle className='two-selection-buttons'>Create New <span aria-label='sparkles emoji' role='img'>✨</span></ButtonStyle>
      </Link>

      <Link to='/host/existing'>
        <ButtonStyle className='two-selection-buttons' variant='danger'>Edit Existing <span aria-label='building construction emoji' role='img'>🏗</span></ButtonStyle>
      </Link>

      <Link to='/'>Home</Link>
    </>
  )
}

export default Host
