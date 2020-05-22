// dependencies
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

// components
import Header from '../components/Header'

const Index = () => {
  console.log(process.env.REACT_APP_API_URL)

  return (
    <>
      <Header text='Station Two Trivia' emoji='🚒' emojiDescription='firetruck' />

      <Link to='/play'>
        <Button className='two-selection-buttons'>Play <span aria-label='tada emoji' role='img'>🎉</span></Button>
      </Link>

      <Link to='/host'>
        <Button className='two-selection-buttons' variant='danger'>Host <span aria-label='crown emoji' role='img'>👑</span></Button>
      </Link>
    </>
  )
}

export default Index
