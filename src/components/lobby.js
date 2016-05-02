import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");

class Lobby extends React.Component{
  constructor(props){
    super(props);

    var authData = root.getAuth();
    if(!authData){
      console.log('ej inloggad');
    } else {
      //console.log(authData.uid);
    }
    const userid = authData.uid;
    this.state = {user: userid};
    console.log(this.state.userid)

  }

  render() {
    return (
      <div>
        <p>{this.state.userid}</p>
      </div>
    )
  }
}

export default Lobby;
