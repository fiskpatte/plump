import React, {contextTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

var root = new Firebase("https://plump.firebaseio.com");
var usersRef = root.child('users');

class SignUp extends React.Component {
  constructor(props){
    super(props);
  }

  submitButtonClicked(){
    var inputedEmail = $('emailInputField').val();
    var inputedPassword = $('passwordInputField').val();

    root.createUser({
      email    : inputedEmail,
      password : inputedPassword
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        root.authWithPassword({
          email    : inputedEmail,
          password : inputedPassword
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            browserHistory.push('/lobby');
          }
        });
      }
    });
  }

  render(){
    return (
      <div>
        <form>
          <input id="emailInputField" type="email" placeholder="Ange din emailadress" required/>
          <input id="passwordInputField" type="password" placeholder="Välj ett lösenord" required/>
          <button type="submit" onClick={this.submitButtonClicked.bind(this)}>OK</button>
        </form>
      </div>
    )
  }
}
