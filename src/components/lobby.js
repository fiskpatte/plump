import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");

class Lobby extends React.Component{
  constructor(props){
    super(props);

    var authData = root.getAuth();
    var userRef = root.child('users').child(authData.uid);
    this.state = {username: '', userTotalScore: 0};
    var self = this;
    userRef.on("value", function(snapshot){

    });
    if(!authData){
      console.log('ej inloggad');
    } else {
      console.log(authData.uid);
    }
    const username = userRef.child('displayname');
    this.state = {user: username};
    console.log(this.state.userid)
  }

  render() {
    return (
      <div>
        <p>{this.state.user}</p>
      </div>
    )
  }
}

export default Lobby;
