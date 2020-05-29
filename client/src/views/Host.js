// dependencies
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

// components
import Header from '../components/Header'

const Host = () => {
  return (
    <>
      <Header text='Host Trivia' emoji='👑' emojiDescription='crown' />

      <Link to='/host/new'>
        <Button className='two-selection-buttons' variant='primary'>
          <div className='top'>
            Create <span aria-label='sparkles emoji' role='img'>✨</span>
          </div>
          <div className='bottom'>
            <span>You want to create a new trivia game</span>
          </div>
        </Button>
      </Link>

      <Link to='/host/existing'>
        <Button className='two-selection-buttons' variant='primary'>
          <div className='top'>
            Edit <span aria-label='building construction emoji' role='img'>🏗</span>
          </div>
          <div className='bottom'>
            <span>You want to edit an existing trivia game</span>
          </div>
        </Button>
      </Link>

      <Link to='/'>Home</Link>
    </>
  )
}

export default Host
