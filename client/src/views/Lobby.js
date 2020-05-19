// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { Badge, Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'
import TriviaInfo from '../components/TriviaInfo'

// socket
const socket = io('http://localhost:4000')

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

const Lobby = () => {
  const { hostName, triviaId, role } = useParams()

  const [playersState, setPlayersState] = useState(false)
  const [playerIdState] = useState(window.localStorage.getItem('playerId'))

  const fetchPlayers = useCallback(() => {
    window.fetch(`http://${window.location.hostname}:4000/api/v1/getDocument/lobbies/${triviaId}?playersOnly=true`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          if (data.players.length > 0) {
            setPlayersState(data.players)
          } else if (data.players.length === 0) {
            console.error('Error fetching trivia document', data)
          }
        } else {
          console.error('Error fetching trivia document', data)
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }, [triviaId])

  useEffect(() => {
    fetchPlayers()
    socket.connect()
    socket.emit('joinRoom', { triviaId: triviaId, playerId: playerIdState })
    return () => {
      socket.disconnect()
    }
  }, [fetchPlayers, playerIdState, triviaId])

  const Players = ({ players }) => {
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

  const Footer = () => {
    if (role === 'host') {
      return <Link to={`/builder/${triviaId}`}>To Builder</Link>
    } else {
      return <Link to='/'>Home</Link>
    }
  }

  // socket
  socket.on('button test', (data) => {
    console.log('button test', data)
  })

  socket.on('player joined', (data) => {
    console.log('A new player has joined the lobby.')
  })

  return (
    <>
      <Header text='Lobby' emoji='🏟' emojiDescription='stadium' />
      <TriviaInfo code={triviaId} host={hostName} />
      {playersState && (<Players players={playersState} />)}
      <Footer />
      <Button onClick={() => { socket.emit('button test', 'hello there!') }}>SOCKET TEST</Button>
    </>
  )
}

export default Lobby
