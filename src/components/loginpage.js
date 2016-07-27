import React, {contextTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

var root = firebase.database().ref();
var usersRef = root.child('users');
var auth = firebase.auth();
// Om man redan är inloggad ska man redirectas till loggedInPage

class LoginPage extends React.Component {

  constructor(props){
    super(props);

    this.state = {users: [], auth: ''};
    var self = this;
    usersRef.on("value", function(snapshot){
      const newUsers = [];
      var usersInDB = snapshot.val();
      for(var userId in usersInDB){
          newUsers.push(usersInDB[userId]);
      }
      var newState = self.state;
      newState.users = newUsers;
      self.setState(newState);
    });
  }

  // Loggar ut en inloggad person. Detta ska ändras senare, detta var något jag gjorde för att se hur autentisering fungerar.
  componentWillMount(){
    var self = this;
    var signedInUser = firebase.User;
    if(signedInUser){
      console.log('Inloggad innan mount. Försöker logga ut.');
      auth.signOut().then(function() {
        console.log("Signed out");
      }, function(error){
        console.error("Sign out error: ", error);
      });
    }


  }

  debugAuth(){
    var user = firebase.auth().currentUser;
    if(user) {
      console.log(user.uid);
    } else {
      console.log("Ej inloggad");
    }
  }

  componentWillUnmount(){
    usersRef.off();
    root.off();
  }

  loginWithFacebookButtonClicked(){
    var self = this;
    var provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).then(function(result){
      // User signed in

      var uid = result.user.uid;
      console.log("Signed in with uid: " + uid);
      var userExists = false;
      for(var user in self.state.users){
        if(self.state.users[user].uid === uid){
          // usern fanns redan
          console.log("Han fanns redan");
          userExists = true;
        }
      }
      if(!userExists){
        // skapa ny användare i db
        const userid = uid;
        //var displayName = authData.facebook.displayName;
        var displayName = "dummy6name";
        const username = displayName.substr(0, displayName.indexOf(" "));
        const newUser = {
            "displayname": displayName,
            "totalscore": 0,
            "currenttable": '',
            "uid": uid
          };
        root.child('users').child(userid).set(newUser);
      }
      browserHistory.push('/lobby');
    }).catch(function(error) {
      console.error("Error signing in: " + error.message);
    });
    // redirecta till inloggningssidan

  }

  signInWithEmailButtonClicked(){
    var inputedEmail = $('#emailInputField').val();
    var inputedPassword = $('#passwordInputField').val();
    var signedIn = false;
    auth.signInWithEmailAndPassword(inputedEmail, inputedPassword).then(function(result){
      console.log("Kom in här");
      if(result != null){
        browserHistory.push('/lobby');
      }
    }).catch(function(error){
      console.error("Login with email/password failed: " + error.message);
    });
  }

  signupButtonClicked(){
    browserHistory.push('/signup');
  }

  logoutButtonClicked(){
    auth.signOut();

  }

  render() {
    return (
      <div id="loginPageDiv">
        <div>
        <img id="bildLogga" src="./images/plump1.jpg" />
        </div>

        <div>
          <input id="emailInputField" className="form-control" type="text" placeholder="Email"/><br />
          <input id="passwordInputField" className="form-control" type="password" placeholder="Lösenord"/><br />
        </div>
        <div>
          <button onClick={this.signInWithEmailButtonClicked.bind(this)} id="loggaIn" className="btn btn-primary">LOGGA IN</button>
          <span id="rememberMe"><input id="checkBoxRememberMe" type="checkbox" value="yes"/>Håll mig inloggad</span><br />
        </div>
        <div id="gloemtInlogg">
            <a href ="¤">Har du glömt dina inloggningsuppgifter?</a>
</div>
        <div>
          <button id="signUpButton" className="btn btn-primary" onClick={this.loginWithFacebookButtonClicked.bind(this)}>LOGGA IN MED FACEBOOK</button>
        </div>
        <div>
          <button id="newUserButton" onClick={this.signupButtonClicked.bind(this)}>NY ANVÄNDARE</button>
          </div>
      </div>

    )
  }
}

export default LoginPage;
