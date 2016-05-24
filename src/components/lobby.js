import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

var root = firebase.database().ref();
var usersRef = root.child('users');
var openGamesRef = root.child('opengames');
var auth = firebase.auth();
var users;
var loggedinuserRef;

class Lobby extends React.Component{
  constructor(props){
    super(props);


    // myFuckingUid = auth.currentUser;
    this.state = {uid: '', username: '', userTotalScore: 0, openGames: [], currentTable: ''};
  }

  componentDidMount(){
    var self = this;
    auth = firebase.auth();
    console.log("Användare inloggad i lobby: " + auth.currentUser.uid);
    loggedinuserRef = usersRef.child(auth.currentUser.uid);
    loggedinuserRef.on("value", function(snapshot){
      var userData = snapshot.val();
      var newState = self.state;
      newState.uid = snapshot.key;
      newState.currentTable = userData.currenttable;
      newState.username = userData.displayname;
      newState.userTotalScore = userData.totalscore;
      self.setState(newState);
    });

    //
    //
    openGamesRef.on('value', function(snapshot){
      // radera alla games där det inte sitter någon
      var gamesToRemove = [];
      snapshot.forEach(game => {
        // Hoppa över det spelarens currentTable
        if(game.val().gameid != self.state.currentTable){
          if(game.val().player1 === self.state.uid){
            openGamesRef.child(game.val().gameid).child('player1').set('');
          } else if(game.val().player2 === self.state.uid){
            openGamesRef.child(game.val().gameid).child('player2').set('');
          } else if(game.val().player3 === self.state.uid){
            openGamesRef.child(game.val().gameid).child('player3').set('');
          } else if(game.val().player4 === self.state.uid){
            openGamesRef.child(game.val().gameid).child('player4').set('');
          }
        }
        if(game.val().player1 == ""
        && game.val().player2 == ""
        && game.val().player3 == ""
        && game.val().player4 == ""){
          gamesToRemove.push(game.key);
        }
      });

      for(var index in gamesToRemove){
        openGamesRef.child(gamesToRemove[index]).remove();
      }
    });
    openGamesRef.on('value', function(snapshot){
      const newGames = [];
      var oldGames = snapshot.val();
      for(var i in oldGames){
        newGames.push(oldGames[i]);
      }
      var newState = self.state;
      newState.openGames = newGames;
      self.setState(newState);
    });

    // kolla om gamet är fullt nu
    openGamesRef.on('value', function(snapshot){
      snapshot.forEach(game => {
        // Det enda intressanta bordet
        if(game.val().gameid == self.state.currentTable){
          if(game.val().player1 != ""
          && game.val().player2 != ""
          && game.val().player3 != ""
          && game.val().player4 != ""){
            // Bordet är fullt, alltså ska man redirectas till själva spelet.
            // player1 blir host och skapar det nya spelet.
            if(game.val().player1 == self.state.uid){
              root.child('gamesInProgress').child(game.val().gameid).set({
                "players" : {
                  "player1" : {
                    "uid": game.val().player1,
                    "host": true,
                    "currentBid": 0,
                    "cardPlayed": "",
                    "tricksTaken": 0,
                    "score": 0
                  },
                  "player2" : {
                    "uid": game.val().player2,
                    "host": false,
                    "currentBid": 0,
                    "cardPlayed": "",
                    "tricksTaken": 0,
                    "score": 0
                  },
                  "player3" : {
                    "uid": game.val().player3,
                    "host": false,
                    "currentBid": 0,
                    "cardPlayed": "",
                    "tricksTaken": 0,
                    "score": 0
                  },
                  "player4" : {
                    "uid": game.val().player4,
                    "host": false,
                    "currentBid": 0,
                    "cardPlayed": "",
                    "tricksTaken": 0,
                    "score": 0
                  }
                },
                "currentHand": 10,
                "currentDealer": 4,
                "playersTurn": 1,
                "highestBid": 0,
                "highestBidder": 1,
                "currentBidder": 1,
                "currentSuit": "",
                "biddingMode": true,
                "currentTableAsString": "",
                "host": game.val().player1,
                "scoreBoard": {
                  "round10p1": 0,
                  "round10p2": 0,
                  "round10p3": 0,
                  "round10p4": 0,
                  "round9p1": 0,
                  "round9p2": 0,
                  "round9p3": 0,
                  "round9p4": 0,
                  "round8p1": 0,
                  "round8p2": 0,
                  "round8p3": 0,
                  "round8p4": 0,
                  "round7p1": 0,
                  "round7p2": 0,
                  "round7p3": 0,
                  "round7p4": 0,
                  "round6p1": 0,
                  "round6p2": 0,
                  "round6p3": 0,
                  "round6p4": 0,
                  "round5p1": 0,
                  "round5p2": 0,
                  "round5p3": 0,
                  "round5p4": 0,
                  "round4p1": 0,
                  "round4p2": 0,
                  "round4p3": 0,
                  "round4p4": 0,
                  "round3p1": 0,
                  "round3p2": 0,
                  "round3p3": 0,
                  "round3p4": 0,
                  "round2p1": 0,
                  "round2p2": 0,
                  "round2p3": 0,
                  "round2p4": 0
                }
              });
            }
            openGamesRef.child(self.state.currentTable).remove();
            console.log("player1: ." + game.val().player1 + ".");
            console.log("player2: " + game.val().player2 + ".");
            console.log("player3: " + game.val().player3 + ".");
            console.log("player4: " + game.val().player4 + ".");
            browserHistory.push('/game');
          }
        }
      });
    });
  }


  // Koppla loss alla callbacks
  componentWillUnmount(){
    root.off();
    openGamesRef.off();
    openGamesRef.off();
    loggedinuserRef.off();
  }

  // Lägg till ett nytt game med usern på plats1
  newGameButtonClicked(){
    var self = this;
    var newGameRef = openGamesRef.push();
    var newGameKey = newGameRef.key;
    loggedinuserRef.child('currenttable').set(newGameKey);
    openGamesRef.child(newGameKey).set({
      "gameid": newGameKey,
      "player1": this.state.uid,
      "player2": "",
      "player3": "",
      "player4": ""
      // // för att slussas direkt till game när man startar nytt spel
      // "player2": "sddsf",
      // "player3": "sdff",
      // "player4": "dfgdfg"
    });
  }

  // Sätt playern på vald plats om hen inte redan sitter på bordet
  takeSlotButtonClick(gameid, slotIndex){
    var self = this;
    openGamesRef.child(gameid).once('value', function(callback){
      if(callback.val().player1 == self.state.uid
        || callback.val().player2 == self.state.uid
        || callback.val().player3 == self.state.uid
        || callback.val().player4 == self.state.uid){
          console.log('Du sitter redan på detta bord!')
      } else {
        loggedinuserRef.child('currenttable').set(gameid);
        openGamesRef.child(gameid).child('player'+slotIndex).set(self.state.uid);

      }
    });
  }

  // // Ett öppet game bör nog göras om till en egen component
  render() {
    return (
      <div>
        <p>{this.state.username}</p>
        <p>Poäng: {this.state.userTotalScore}</p>
        <p>inloggad uid: {this.state.uid}</p>
        <button onClick={this.newGameButtonClicked.bind(this)}>NYTT SPEL</button>
        <p>Öppna spel:</p>
        {this.state.openGames.map((openGame, index) => (
          <div key={index} className="openGame">
            <div className="playerSlot">{openGame.player1 == "" ? <button onClick={this.takeSlotButtonClick.bind(this, openGame.gameid, 1)}>Ta plats</button>
                                    : "Spelare 1: " + openGame.player1}
            </div>
            <div className="playerSlot">{openGame.player2 == "" ? <button onClick={this.takeSlotButtonClick.bind(this, openGame.gameid, 2)}>Ta plats</button>
                                    : "Spelare 2: " + openGame.player2}
            </div>
            <div className="playerSlot">{openGame.player3 == "" ? <button onClick={this.takeSlotButtonClick.bind(this, openGame.gameid, 3)}>Ta plats</button>
                                    : "Spelare 3: " + openGame.player3}
            </div>
            <div className="playerSlot">{openGame.player4 == "" ? <button onClick={this.takeSlotButtonClick.bind(this, openGame.gameid, 4)}>Ta plats</button>
                                    : "Spelare 4: " + openGame.player4}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default Lobby;
