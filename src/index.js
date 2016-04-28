import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createHashHistory } from 'history';

import LoginPage from './components/LoginPage';

ReactDOM.render(
  <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={LoginPage}/>
  </Router>,
  document.getElementById('app')
);
