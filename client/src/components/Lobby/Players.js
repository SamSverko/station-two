import React from 'react'
import { Badge, Card } from 'react-bootstrap'
import styled from 'styled-components'

// styles
const PlayersStyle = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 90px;
  overflow-y: scroll;
  width: 100%;
  .badge {
    margin: 5px;
  }
`

const Players = ({ hostName, players, playerIdState }) => {
  // players = [
  //   { name: 'aye' },
  //   { name: 'beeeeee' },
  //   { name: 'ceeee' },
  //   { name: 'cdd' },
  //   { name: 'adfger' },
  //   { name: 'reyhtrw' },
  //   { name: 'ewrtyhw' },
  //   { name: 'wrtg' },
  //   { name: 'wrgtreg' },
  //   { name: 'ertyuiiop' },
  //   { name: 'kojmkojkoi' },
  //   { name: 'ddf' },
  //   { name: 'sdfsdf' },
  //   { name: 'ssdfsam' },
  //   { name: 'sadfam' },
  //   { name: 'ssdafam' }
  // ]

  return (
    <Card>
      <Card.Body>
        <Card.Title>Players</Card.Title>
        <PlayersStyle>
          {players.map((player, counter) => {
            // display player
            if (player.name === hostName) {
              return <Badge key={counter} variant='success'>{player.name} <span aria-label='crown emoji' role='img'>👑</span></Badge>
            } else if (player.uniqueId === playerIdState) {
              return <Badge key={counter} variant='primary'>{player.name} <span aria-label='hand wave emoji' role='img'>👋</span></Badge>
            } else {
              return <Badge key={counter} variant='info'>{player.name}</Badge>
            }
          })}
        </PlayersStyle>
      </Card.Body>
    </Card>
  )
}

export default Players
