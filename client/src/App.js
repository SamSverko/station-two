// dependencies
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import styled, { createGlobalStyle } from 'styled-components'

// views
import IndexView from './views/Index'
import PlayView from './views/Play'

import HostView from './views/Host'
import HostNewView from './views/HostNew'
import HostExistingView from './views/HostExisting'

import BuilderView from './views/Builder'
import FormMultipleChoiceView from './views/FormMultipleChoice'
import FormPictureView from './views/FormPicture'

import LobbyView from './views/Lobby'

import Error404 from './views/Error404'

// styles
const GlobalStyle = createGlobalStyle`
  .card {
    margin: 0 0 15px 0;
  }
  .two-selection-buttons {
    font-size: 3em;
    margin: 0 0 15px 0;
    min-height: 25vh;
    width: 100%;
  }
`

const PageStyle = styled(Container)`
  max-width: 400px;
  padding: 15px;
  text-align: center;
`

// routes
const routes = [
  {
    title: 'Home',
    path: '/',
    component: IndexView,
    exact: true
  },
  {
    title: 'Play',
    path: '/play',
    component: PlayView,
    exact: true
  },
  {
    title: 'Host',
    path: '/host',
    component: HostView,
    exact: true
  },
  {
    title: 'Host - New',
    path: '/host/new',
    component: HostNewView,
    exact: true
  },
  {
    title: 'Host - Existing',
    path: '/host/existing',
    component: HostExistingView,
    exact: true
  },
  {
    title: 'Builder',
    path: '/builder/:triviaId',
    component: BuilderView,
    exact: true
  },
  {
    title: 'Host - Multiple Choice',
    path: '/builder/:triviaId/multipleChoice/:roundNumber',
    component: FormMultipleChoiceView,
    exact: true
  },
  {
    title: 'Host - Picture',
    path: '/builder/:triviaId/picture/:roundNumber',
    component: FormPictureView,
    exact: true
  },
  {
    title: 'Lobby',
    path: '/lobby/:triviaId',
    component: LobbyView,
    exact: true
  }
]

const App = () => {
  return (
    <Router>
      <PageStyle fluid>
        <GlobalStyle />
        <Route render={(props) => {
          // update page title
          routes.forEach((route) => {
            if (route.path === props.location.pathname) {
              document.title = `${route.title} | Station Two`
            } else if (props.location.pathname.includes('/builder')) {
              document.title = 'Builder | Station Two'
            } else if (props.location.pathname.includes('/lobby')) {
              document.title = 'Lobby | Station Two'
            }
          })

          // display view, or if no view found, display 404 page
          return (
            <Switch>
              {routes.map((route, i) => (
                <Route key={i} {...route} />
              ))}
              <Route component={Error404} />
            </Switch>
          )
        }}
        />
      </PageStyle>
    </Router>
  )
}

export default App
