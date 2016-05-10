import React, {contextTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

var root = new Firebase("https://plump.firebaseio.com");
var usersRef = root.child('users');
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
    var authData = root.getAuth();
    if(authData){
      console.log('Inloggad innan mount. Försöker logga ut.');
      root.unauth();
    }
  }

  debugAuth(){
    console.log(root.authData.uid);
  }

  componentWillUnmount(){
    usersRef.off();
    root.off();
  }

  loginWithFacebookButtonClicked(){
    var self = this;
    root.authWithOAuthPopup("facebook", function(error, authData){
      if(error){
        console.log("Login failed", error);
      } else {
        // kolla om usern redan finns
        // om inte, skapa ny user.
        var userExists = false;
        var uid = authData.uid;
        for(var user in self.state.users){
          if(self.state.users[user].uid === uid){
            // usern fanns redan
            userExists = true;
          }
        }
        if(!userExists){
          // skapa ny användare i db
          const userid = authData.uid;
          var displayName = authData.facebook.displayName;
          const username = displayName.substr(0, displayName.indexOf(" "));
          const newUser = {
              "displayname": username,
              "totalscore": 0,
              "currenttable": ''
            };
          root.child('users').child(userid).set(newUser);
        }
        // redirecta till inloggningssidan
        browserHistory.push('/lobby');
      }
    });
  }

  signInWithEmailButtonClicked(){
    var inputedEmail = $('#emailInputField').val();
    var inputedPassword = $('#passwordInputField').val();
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

  signupButtonClicked(){
    browserHistory.push('/signup');
  }

  logoutButtonClicked(){
    root.unauth();
  }

  render() {
    return (
      <div>
        <div>
          <p>PLUMP</p>
        </div>
        <div>
          <button id="signUpButton" onClick={this.loginWithFacebookButtonClicked.bind(this)}>Logga in med Facebook</button>
        </div>
        <div>
        <p>-----eller-----</p>
        </div>
        <div>
          <input id="emailInputField" type="text" placeholder="Email"/>
          <input id="passwordInputField" type="password" placeholder="Lösenord"/>
        </div>
        <div>
          <span><input id="checkBoxRememberMe" type="checkbox" value="yes"/>Kom ihåg mig</span><button onClick={this.signInWithEmailButtonClicked.bind(this)}>Logga in</button>
        </div>
        <a href="¤">Har du glömt dina inloggningsuppgifter?</a>
        <button onClick={this.signupButtonClicked.bind(this)}>Registrera dig</button>
        <button onClick={this.logoutButtonClicked.bind(this)}>Logga ut</button>
        <button onClick={this.debugAuth.bind(this)}>kolla auth</button>
      </div>
    )
  }
}

export default LoginPage;
