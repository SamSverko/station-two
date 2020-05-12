// dependencies
import React from 'react'
import { Container } from 'react-bootstrap'

// components
import HostForm from '../components/IndexHostForm'
import PlayerForm from '../components/IndexPlayerForm'

const pageStyle = {
  maxWidth: '400px',
  padding: '15px',
  textAlign: 'center'
}

const Index = () => {
  return (
    <Container fluid style={pageStyle}>
      <h1>Station Two Trivia&nbsp;<span aria-label='firetruck emoji' role='img'>🚒</span></h1>
      <hr />
      <HostForm />
      <hr />
      <PlayerForm />
    </Container>
  )
}

export default Index
