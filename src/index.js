import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createHashHistory } from 'history';

import LoginPage from './components/LoginPage';
import Lobby from './components/Lobby';
import SignUp from './components/SignUp';
import Game from './pages/Game';

ReactDOM.render(
  <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={LoginPage} />
    <Route path="/lobby" component={Lobby} />
    <Route path="/signup" component={SignUp} />
    <Route path="/game" component={Game} />
  </Router>,
  document.getElementById('app')
);
