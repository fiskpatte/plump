import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
var authData = root.getAuth();
var loggedinuserRef = root.child('users').child(authData.uid);
var waitinglistRef = root.child('waitinglist');
class Lobby extends React.Component{
  constructor(props){
    super(props);


    this.state = {username: '', userTotalScore: 0};
  }

  componentDidMount(){

    var self = this;
    loggedinuserRef.on("value", function(snapshot){
        var userData = snapshot.val();
        var newState = self.state;
        newState.username = userData.displayname;
        newState.userTotalScore = userData.totalscore;
        self.setState(newState);
    });
    if(!authData){
      console.log('ej inloggad');
    } else {
      console.log("inloggad");
    }
  }

  componentWillUnmount(){
    root.off();
    loggedinuserRef.off();
  }

  render() {
    return (
      <div>
        <p>{this.state.username}</p>
        <p>Poäng: {this.state.userTotalScore}</p>

      </div>
    )
  }
}

export default Lobby;
