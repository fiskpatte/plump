import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
// Om man redan är inloggad ska man redirectas till loggedInPage

class LoginPage extends React.Component {

  constructor(props){
    super(props);

    root.onAuth(routeUserToLoggedInPageCallback);
  }

  componentWillMount(){
    var authData = root.getAuth();
    if(authData){
      // Routra usern till loggedInPage
    }
  }

  routeUserToLoggedInPageCallback(){
    // Här ska kod finnas som routrar om usern till loggedInPage
  }

  loginWithFacebookButtonClicked(){
    root.authWithOAuthPopup("facebook", function(error, authData){
      if(error){
        console.log("Login failed", error);
      } else {
        console.log("Logged in")
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
