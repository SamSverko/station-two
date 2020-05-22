// dependencies
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Table } from 'react-bootstrap'
import io from 'socket.io-client'

// components
import Header from '../components/Header'
import TriviaInfo from '../components/TriviaInfo'
import Players from '../components/Lobby/Players'
import HostDisplay from '../components/Lobby/HostDisplay'
import PlayerDisplay from '../components/Lobby/PlayerDisplay'

const Lobby = () => {
  const { hostName, triviaId, role } = useParams()

  const [socket] = useState(io(process.env.REACT_APP_SOCKET_URL))
  const [playerNameState] = useState(window.localStorage.getItem('playerName'))
  const [playerIdState] = useState(window.localStorage.getItem('playerId'))
  const [playersState, setPlayersState] = useState([])
  const [triviaDataState, setTriviaDataState] = useState(false)
  const [playerDisplayDataState, setPlayerDisplayDataState] = useState(false)
  const [lobbyData, setLobbyData] = useState(false)
  const [mustPlayerWait, setMustPlayerWait] = useState(false)

  const fetchLobbyData = useCallback(() => {
    window.fetch(`${process.env.REACT_APP_API_URL}/getDocument/lobbies/${triviaId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(response)
        }
      }).then((data) => {
        if (!data.statusCode) {
          console.log('[OK] fetchLobbyData')
          setLobbyData(data)
        } else {
          console.error('Error fetching lobby document', data)
        }
      }).catch((error) => {
        console.error('Error fetching lobby document', error)
      })
  }, [triviaId])

  const fetchTriviaData = useCallback(() => {
    window.fetch(`${process.env.REACT_APP_API_URL}/getDocument/trivia/${triviaId}`)
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
    window.fetch(`${process.env.REACT_APP_API_URL}/getDocument/lobbies/${triviaId}?playersOnly=true`)
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
          console.warn(this.response)
        }
      }
    }
    xhttp.open('POST', `${process.env.REACT_APP_API_URL}/joinLobby`)
    xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
    xhttp.send(JSON.stringify(dataToSubmit))
  }, [playerIdState, playerNameState, triviaId])

  useEffect(() => {
    joinLobby(socket)

    if (role === 'host') {
      fetchTriviaData()
      fetchLobbyData()
    }

    socket.on('player joined', () => {
      console.log('[SOCKET - player joined]')
      fetchPlayers()
      if (role === 'host') {
        fetchLobbyData()
      }
    })

    socket.on('player left', () => {
      console.log('[SOCKET - player left]')
      fetchPlayers()
      if (role === 'host') {
        fetchLobbyData()
      }
    })

    socket.on('display question', (data) => {
      console.log('[SOCKET - display question]')
      setMustPlayerWait(false)
      setPlayerDisplayDataState(data)
    })

    socket.on('player responded', (data) => {
      if (role === 'host') {
        console.log('[SOCKET - player responded]')
        fetchLobbyData()
      }
    })

    socket.on('player must wait', (data) => {
      console.log(`[SOCKET - player must wait] ${data}`)
      setMustPlayerWait(data)
      if (data === 'leaderboard') {
        fetchLobbyData()
      }
    })

    return () => {
      socket.close()
    }
  }, [fetchLobbyData, fetchPlayers, fetchTriviaData, joinLobby, role, socket])

  // children components
  const Display = () => {
    if (role === 'host' && triviaDataState && lobbyData) {
      return <HostDisplay lobbyData={lobbyData} socket={socket} triviaData={triviaDataState} />
    } else {
      return <PlayerDisplay mustPlayerWait={mustPlayerWait} socket={socket} playerDisplayDataState={playerDisplayDataState} />
    }
  }

  const Leaderboard = ({ lobbyData }) => {
    // group by player and sum all scores by round
    const groupedPlayers = Object.values(lobbyData.responses.reduce((r, { name, uniqueId, roundNumber, score }) => {
      r[uniqueId] = r[uniqueId] || { name, uniqueId, scores: [] }
      r[uniqueId].scores[roundNumber] = (r[uniqueId].scores[roundNumber] || 0) + score
      return r
    }, {}))
    // sum total score for each player
    const arrSum = arr => arr.reduce((a, b) => a + b, 0)
    groupedPlayers.forEach((player) => {
      player.totalScore = arrSum(player.scores)
    })
    // sort players by rank
    const sortedPlayers = groupedPlayers.sort((a, b) => {
      return b.totalScore - a.totalScore
    })

    return (
      <Card>
        <Card.Body>
          <Card.Title>Leaderboard</Card.Title>
          <Table bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.totalScore}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
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

  return (
    <>
      <Header text='Lobby' emoji='🏟' emojiDescription='stadium' />
      <TriviaInfo code={triviaId} host={hostName} />
      {playersState && (<Players hostName={hostName} playerIdState={playerIdState} players={playersState} />)}
      <Display playersState={playersState} />
      {mustPlayerWait === 'leaderboard' && lobbyData && (<Leaderboard lobbyData={lobbyData} />)}
      <Footer />
    </>
  )
}

export default Lobby
