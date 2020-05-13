// dependencies
import React from 'react'
import { Card } from 'react-bootstrap'

const RoundInfo = ({ code, host }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title className='mb-0'>Code: <span className='font-weight-normal'>{code}</span> | Host: <span className='font-weight-normal'>{host}</span></Card.Title>
      </Card.Body>
    </Card>
  )
}

export default RoundInfo
