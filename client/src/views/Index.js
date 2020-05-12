// dependencies
import React from 'react'

// components
import HostForm from '../components/IndexHostForm'
import PlayerForm from '../components/IndexPlayerForm'

const Index = () => {
  return (
    <div>
      <h1>Station Two Trivia&nbsp;<span aria-label='firetruck emoji' role='img'>🚒</span></h1>
      <hr />
      <HostForm />
      <hr />
      <PlayerForm />
    </div>
  )
}

export default Index
