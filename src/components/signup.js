import React, {contextTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

var root = firebase.database().ref();
var usersRef = root.child('users');
var auth = firebase.auth();

class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {displayName: ''};
  }

  componentDidMount(){
    var self = this;
    // Det här är temporärt. När man kommer hit ska man ju aldrig vara inloggad.
    // Först när man skapar en användare så loggas man in, och då körs denna kod.
    // Den känns ej intiutiv. Kommer åtgärdas när jag kommer på hur jag får tag på
    // datan för en användare som precis skapats.
    auth.onAuthStateChanged(function(user) {
      if(user) {
        // spara ner den nya användaren.
        const userid = user.uid;
        const newUser = {
            "displayname": self.state.displayName,
            "totalscore": 0,
            "currenttable": '',
            "uid": userid
          };
        root.child('users').child(userid).set(newUser);
        browserHistory.push('/lobby');
      } else {
        // Gör inte ett JÄVLA SKIT.
      }
    });
  }

  componentWillUnmount(){
    root.off();
    usersRef.off();
  }

  submitButtonClicked(){
    var inputedEmail = $('#emailInputField').val();
    var inputedPassword = $('#passwordInputField').val();
    var inputedUsername = $('#usernameInputField').val();
    var newState = this.state;
    newState.displayName = inputedUsername;
    this.setState(newState);

    auth.createUserWithEmailAndPassword(inputedEmail, inputedPassword)
    .catch(function(error) {
      console.error("Error creating user with email/password: " + error.message);
    });
  }

  render(){
    return (
      <div>
          <input id="emailInputField" type="email" placeholder="Ange din emailadress" required/>
          <input id="usernameInputField" type="text" placeholder="Välj ett användarnamn" required />
          <input id="passwordInputField" type="password" placeholder="Välj ett lösenord" required/>
          <button onClick={this.submitButtonClicked.bind(this)}>OK</button>

      </div>
    )
  }
}

export default SignUp;
