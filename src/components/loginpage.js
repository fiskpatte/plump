import React from 'react';


class LoginPage extends React.Component {
  constructor(props){
    super(props);

  }

  signupButtonClicked(){
    console.log('sieg heil');
  }

  render() {
    return (
      <div>
        <div>
          <p>NU SKA VI SPELA PLUMP</p>
        </div>
        <div>
          Logga in eller <span><button onClick={this.signupButtonClicked.bind(this)}> registrera dig</button></span>
        </div>
        <div>
          <button className="btn btn-social btn-lg btn-facebook"><i className="fa fa-facebook"></i>Sign in with Facebook</button>
        </div>
      </div>
    )
  }
}

export default LoginPage;
