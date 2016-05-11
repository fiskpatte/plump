import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
var authData;
var users;
var loggedinuserRef;
var currentGameRef;
var usersRef = root.child('users');
var gamesInProgressRef = root.child('gamesInProgress');

class Game extends React.Component {

  constructor(props){
    super(props);
    authData = root.getAuth();
    loggedinuserRef = usersRef.child(authData.uid);
    this.state = {uid: '', currentTable : '', currentHand : 99};

  }

  componentDidMount(){
    var self = this;
    loggedinuserRef.on("value", function(snapshot){
      var userData = snapshot.val();
      var newState = self.state;
      newState.uid = snapshot.key();
      newState.currentTable = userData.currenttable;
      newState.username = userData.displayname;
      newState.userTotalScore = userData.totalscore;
      self.setState(newState);
      console.log("ost" + userData.currenttable);
      gamesInProgressRef.child(userData.currenttable).on("value", function(childsnapshot){
        var gameData = childsnapshot.val();
        var newState = self.state;
        newState.currentHand = gameData.currentHand;
        self.setState(newState);
      });
    });
  }



  debugKnapp(){
    console.log(this.state.currentHand);
  }

  render() {
    return (
      <div>
        <p>THIS IS THE GAME</p>
        <button onClick={this.debugKnapp.bind(this)}>Click me</button>
      </div>
    )
  }
}
export default Game;
