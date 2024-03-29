import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import styled from 'styled-components'

// components
import PlayRound from './HostDisplay/PlayRound'
import MarkRound from './HostDisplay/MarkRound'

// styles
const HostControlContainerStyle = styled.div`
  width: 100%;
  div {
    align-items: center;
    display: flex;
    justify-content: center;
    button {
      margin: 5px;
      width: 50%;
    }
  }
`

const HostDisplay = ({ lobbyData, socket, triviaData }) => {
  const [currentButtonSelected, setCurrentButtonSelectedState] = useState(window.localStorage.getItem('currentButtonSelected') || false)
  const [currentHostActionState, setCurrentHostActionState] = useState(window.localStorage.getItem('currentHostActionState') || false)
  const [currentRoundDataState, setCurrentRoundDataState] = useState(JSON.parse(window.localStorage.getItem('currentRoundDataState')) || false)
  const [currentRoundNumberState, setCurrentRoundNumberState] = useState(window.localStorage.getItem('currentRoundNumberState') || false)

  const hostAction = (action, target, round, roundNumber) => {
    // update checked style
    const buttons = document.getElementsByClassName('action-button')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active')
    }
    target.classList.add('active')

    // save data to state or local storage
    window.localStorage.setItem('currentButtonSelected', target.id)
    setCurrentButtonSelectedState(target.id)
    window.localStorage.setItem('currentHostActionState', action)
    setCurrentHostActionState(action)
    window.localStorage.setItem('currentRoundDataState', JSON.stringify(round))
    setCurrentRoundDataState(round)
    window.localStorage.setItem('currentRoundNumberState', roundNumber)
    setCurrentRoundNumberState(roundNumber)

    if (action === 'mark-round') {
      socket.emit('playerMustWait', 'marking')
      console.log('SOCKET | EMIT | playerMustWait', 'marking')
    } else if (action === 'display-leaderboard') {
      socket.emit('playerMustWait', 'leaderboard')
      console.log('SOCKET | EMIT | playerMustWait', 'leaderboard')
    } else if (action === 'play-round') {
      socket.emit('playerMustWait', 'play')
      console.log('SOCKET | EMIT | playerMustWait', 'play')
    }
  }

  useEffect(() => {
    if (currentButtonSelected !== 'false' && currentButtonSelected !== false) {
      // document.getElementById(currentButtonSelected).classList.add('active')
    }
  }, [currentButtonSelected, currentRoundNumberState])

  return (
    <Card>
      <Card.Body>
        <Card.Title>Host Controls</Card.Title>
        <HostControlContainerStyle>
          {triviaData.rounds.map((round, idx) => {
            const displayRound = idx + 1
            return (
              <div key={idx}>
                <Button className='action-button' id={`host-control-play-${idx}`} onClick={(event) => { hostAction('play-round', event.target, round, idx) }}>Play Round {displayRound}</Button>
                <Button className='action-button' id={`host-control-mark-${idx}`} onClick={(event) => { hostAction('mark-round', event.target, round, idx) }}>Mark Round {displayRound}</Button>
              </div>
            )
          })}
          <div>
            <Button className='action-button' id='host-control-play-tie' onClick={(event) => { hostAction('play-round', event.target, triviaData.tieBreaker, 'tieBreaker') }}>Play Tie Breaker</Button>
            <Button className='action-button' id='host-control-mark-tie' onClick={(event) => { hostAction('mark-round', event.target, triviaData.tieBreaker, 'tieBreaker') }}>Mark Tie Breaker</Button>
          </div>
          <div>
            <Button className='action-button' id='host-control-leaderboard' onClick={(event) => { hostAction('display-leaderboard', event.target, '{"type":"leaderboard"}') }}>Display Leaderboard</Button>
          </div>
        </HostControlContainerStyle>

        {currentHostActionState === 'play-round' && (<PlayRound lobbyData={lobbyData} roundData={currentRoundDataState} roundNumber={currentRoundNumberState} socket={socket} />)}
        {currentHostActionState === 'mark-round' && (<MarkRound lobbyData={lobbyData} roundData={currentRoundDataState} roundNumber={currentRoundNumberState} socket={socket} />)}
      </Card.Body>
    </Card>
  )
}

export default HostDisplay
