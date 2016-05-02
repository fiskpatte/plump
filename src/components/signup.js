import React, {contextTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

var root = new Firebase("https://plump.firebaseio.com");
var usersRef = root.child('users');

class SignUp extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <input type="text" placeholder="Ange din emailadress"/>
        <input type="password" placeholder="Välj ett lösenord"/>
        <button type="submit">OK</button>
      </div>
    )
  }
}
