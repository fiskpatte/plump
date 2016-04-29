import React from 'react';


class LoginPage extends React.Component {
  constructor(props){
    super(props);

  }

  signupButtonClicked(){
    console.log('');
  }

  render() {
    return (
      <div>
        <div>
          <p>NU SKA VI SPELA PLUMP</p>
        </div>
        <div>
          <button>Logga in med Facebook</button>
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
