// dependencies
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'

// components
import Header from '../components/Header'

const Index = () => {
  const location = useLocation()

  return (
    <>
      <Header text='Station Two Trivia' emoji='🚒' emojiDescription='firetruck' />

      <Link to='/play'>
        <Button className='two-selection-buttons' variant='primary'>
          <div className='top'>
            Play <span aria-label='tada emoji' role='img'>🎉</span>
          </div>
          <div className='bottom'>
            <span>You want to play trivia</span>
          </div>
        </Button>
      </Link>

      <Link to='/host'>
        <Button className='two-selection-buttons' variant='primary'>
          <div className='top'>
            Host <span aria-label='crown emoji' role='img'>👑</span>
          </div>
          <div className='bottom'>
            <span>You want to create a new or host an existing trivia game</span>
          </div>
        </Button>
      </Link>

      {typeof location.state === 'object' && location.state.message === 'incorrect-pin' && (
        <Alert variant='danger'>Pin <span className='font-weight-bold text-uppercase'>{location.state.triviaPin}</span> for trivia <span className='font-weight-bold text-uppercase'>{location.state.triviaId}</span> is incorrect.</Alert>
      )}

      {typeof location.state === 'object' && location.state.message === 'trivia-not-found' && (
        <Alert variant='danger'>Trivia <span className='font-weight-bold text-uppercase'>{location.state.triviaId}</span> was not found.</Alert>
      )}
    </>
  )
}

export default Index
