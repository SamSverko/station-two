// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import io from 'socket.io-client'

// components
import Header from '../components/Header'
import TriviaInfo from '../components/TriviaInfo'
import Players from '../components/Lobby/Players'
import HostDisplay from '../components/Lobby/HostDisplay'
import PlayerDisplay from '../components/Lobby/PlayerDisplay'

const Lobby = () => {
  const { hostName, triviaId, role } = useParams()

  const [socket] = useState(io('http://localhost:4000'))
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
          console.log('[OK] fetchTriviaData')
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
            console.log('[OK] fetchPlayers')
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
          console.log('[OK] joinLobby')
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

    socket.on('host action', (data) => {
      console.log('[SOCKET - host action]')
    })

    return () => {
      socket.close()
    }
  }, [fetchPlayers, fetchTriviaData, joinLobby, role, socket])

  // children components
  const Display = () => {
    if (role === 'host' && triviaDataState) {
      return <HostDisplay socket={socket} triviaData={triviaDataState} />
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
      {playersState && (<Players hostName={hostName} playerIdState={playerIdState} players={playersState} />)}
      <Display />
      <Footer />
    </>
  )
}

export default Lobby
