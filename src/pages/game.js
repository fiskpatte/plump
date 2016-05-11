import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
var authData;
var users;
var loggedinuserRef;
var currentGameRef;
var usersRef = root.child('users');
var gamesInProgressRef = root.child('gamesInProgress');
var sortedDeck;

class Game extends React.Component {

  constructor(props){
    super(props);
    sortedDeck = [
     "ac", "ah", "as", "ad",
     "2c", "2h", "2s", "2d",
     "3c", "3h", "3s", "3d",
     "4c", "4h", "4s", "4d",
     "5c", "5h", "5s", "5d",
     "6c", "6h", "6s", "6d",
     "7c", "7h", "7s", "7d",
     "8c", "8h", "8s", "8d",
     "9c", "9h", "9s", "9d",
     "tc", "th", "ts", "td",
     "jc", "jh", "js", "jd",
     "qc", "qh", "qs", "qd",
     "kc", "kh", "ks", "kd" ];
    authData = root.getAuth();
    loggedinuserRef = usersRef.child(authData.uid);
    this.state = {uid: '', currentTable : '', currentRound : 10, deck : sortedDeck};
    this.dealNewHand = this.dealNewHand.bind(this);
    this.getCardsForRound = this.getCardsForRound.bind(this, this.state.currentRound);
    this.shuffle = this.shuffle.bind(this);
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
      gamesInProgressRef.child(userData.currenttable).on("value", function(childsnapshot){
        var gameData = childsnapshot.val();
        console.log(gameData);
        var newState = self.state;
        newState.currentRound = gameData.currentRound;
        self.setState(newState);
      });
    });
  }

  dealNewHand(){
    var allCardsForThisRound = this.getCardsForRound(this.state.currentRound);
    console.log("alla kort: "+allCardsForThisRound);
  }

  getCardsForRound(cardsPerPerson){
    var shuffledDeck = this.shuffle(sortedDeck);
    var cardsForThisRound = [];
    for(var i = 0; i < cardsPerPerson * 4; i++){
      cardsForThisRound.push(shuffledDeck[i]);
    }
    return cardsForThisRound;
  }

  shuffle(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    return array;
  }

  debugKnapp(){
    this.dealNewHand();
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
