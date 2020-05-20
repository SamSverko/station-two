// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { Badge, Card } from 'react-bootstrap'
import styled from 'styled-components'

// components
import Header from '../components/Header'
import TriviaInfo from '../components/TriviaInfo'
import HostDisplay from '../components/Lobby/HostDisplay'
import PlayerDisplay from '../components/Lobby/PlayerDisplay'

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

  const [playerNameState] = useState(window.localStorage.getItem('playerName'))
  const [playerIdState] = useState(window.localStorage.getItem('playerId'))
  const [playersState, setPlayersState] = useState([])
  const [triviaDataState, setTriviaDataState] = useState(false)

  const fetchTriviaData = useCallback(() => {
    window.fetch(`http://${window.location.hostname}:4000/api/v1/getDocument/trivia/${triviaId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          console.log(data)
          setTriviaDataState(data)
        } else {
          console.error('Error fetching trivia document', data)
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }, [triviaId])

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
            console.warn('Empty lobby retrieved.', data)
          }
        } else {
          console.error('Error fetching trivia document', data)
        }
      }).catch((error) => {
        console.error('Error fetching trivia document', error)
      })
  }, [triviaId])

  const joinLobby = useCallback((socket) => {
    const dataToSubmit = {
      triviaId: triviaId,
      name: playerNameState,
      uniqueId: playerIdState
    }

    const xhttp = new window.XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (this.response === 'OK') {
          console.log('OK POSTING TO DB')
          socket.emit('joinRoom', { triviaId: triviaId, playerName: playerNameState, playerId: playerIdState })
        } else {
          console.warn('Error joining lobby.')
        }
      }
    }
    xhttp.open('POST', 'http://localhost:4000/api/v1/joinLobby')
    xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify(dataToSubmit))
  }, [playerIdState, playerNameState, triviaId])

  useEffect(() => {
    const socket = io('http://localhost:4000')
    joinLobby(socket)
    if (role === 'host') {
      fetchTriviaData()
    }

    socket.on('player joined', () => {
      console.log('[SOCKET - player joined]')
      fetchPlayers()
    })

    socket.on('player left', () => {
      console.log('[SOCKET - player joined]')
      fetchPlayers()
    })

    return () => {
      socket.close()
    }
  }, [fetchPlayers, fetchTriviaData, joinLobby, role])

  // children components
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

  const Display = () => {
    if (role === 'host' && triviaDataState) {
      return <HostDisplay triviaData={triviaDataState} />
    } else {
      return <PlayerDisplay />
    }
  }

  const Footer = () => {
    if (role === 'host') {
      return <Link to={`/builder/${triviaId}`}>To Builder</Link>
    } else {
      return <Link to='/'>Home</Link>
    }
  }

  return (
    <>
      <Header text='Lobby' emoji='🏟' emojiDescription='stadium' />
      <TriviaInfo code={triviaId} host={hostName} />
      {playersState && (<Players players={playersState} />)}
      <Display />
      <Footer />
    </>
  )
}

export default Lobby
