import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
// Om man redan är inloggad ska man redirectas till loggedInPage

class LoginPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {users: []};
    var self = this;
    var usersRef = root.child('users');
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

    //root.onAuth(routeUserToLoggedInPageCallback);
  }

  componentWillMount(){
    var authData = root.getAuth();
    if(authData){
      // Routra usern till loggedInPage
    }
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
          if(self.state.users[user].userid === uid){
            // usern fanns redan
            userExists = true;
          }
        }
        if(!userExists){
          const userid = authData.uid;
          const newUser = {
              "displayname": authData.facebook.displayName,
              "totalscore": 0
            };
          root.child('users').child(userid).set(newUser);
        } else{
          console.log('HAN FANNS REDAN!');
        }
        // redirecta till inloggningssidan
      }
    });
  }

  signupButtonClicked(){
    console.log('');
  }

  render() {
    return (
      <div>
        <div>
          <p>PLUMP</p>
        </div>
        <div>
          <button onClick={this.loginWithFacebookButtonClicked.bind(this)}>Logga in med Facebook</button>
        </div>
        <div>
        <p>-----eller-----</p>
        </div>
        <div>
          <input type="text" placeholder="Email"/>
          <input type="password" placeholder="Lösenord"/>
        </div>
        <div>
          <span><input id="checkBoxRememberMe" type="checkbox" value="yes"/>Kom ihåg mig</span><button>Logga in</button>
        </div>
        <a href="¤">Har du glömt dina inloggningsuppgifter?</a>
        <button>Registrera dig</button>
      </div>
    )
  }
}

export default LoginPage;
