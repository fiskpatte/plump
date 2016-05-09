import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
var authData;
var users
var loggedinuserRef;
var usersRef = root.child('users');
var gamesRef = root.child('games');

class Lobby extends React.Component{
  constructor(props){
    authData = root.getAuth();
    loggedinuserRef = root.child('users').child(authData.uid);
    super(props);
    const opengames = [];
    this.state = {uid: '', username: '', userTotalScore: 0, openGames: opengames};
  }

  componentDidMount(){
    var self = this;

    loggedinuserRef.on("value", function(snapshot){
        var userData = snapshot.val();
        var newState = self.state;
        newState.uid = snapshot.key();
        newState.username = userData.displayname;
        newState.userTotalScore = userData.totalscore;
        self.setState(newState);
    });

    gamesRef.orderByChild("gameState").equalTo("waitingForPlayers").on("value", function(snapshot){
      // var openGamesFromFirebase = snapshot.val();
      // // uppdatera this.state.openGames
      // const newOpenGames = [];
      // for(var gameIndex in openGamesFromFirebase){
      //   newOpenGames.push(openGamesFromFirebase[gameIndex]);
      // }
      // var newState = self.state;
      // newState.openGames = newOpenGames;
      // self.setState(newState);
      const newOpenGames = [];
      snapshot.forEach(function(childSnapshot){
        newOpenGames.push({gameid: childSnapshot.key(), player1: childSnapshot.val().player1, player2: childSnapshot.val().player2, player3: childSnapshot.val().player3,  player4: childSnapshot.val().player4});
      });
      console.log(newOpenGames);
      var newState = self.state;
      newState.openGames = newOpenGames;
      self.setState(newState);
    });

  }

  componentWillUnmount(){
    root.off();
    loggedinuserRef.off();
    loggedinuserRef.off();
  }

  newGameButtonClicked(){
    var self = this;
      root.child('games').push({
        "gameid": "",
        "player1": self.state.uid,
        "player2" : "",
        "player3": "",
        "player4": "",
        "gameState" : "waitingForPlayers"
      });
  }

  takeSlotButtonClick(gameid, slotIndex){
    var game;
    for(var g in this.state.openGames){
      if(this.state.openGames[g].gameid === gameid){
        game = this.state.openGames[g];
        break;
      }
    }
    console.log(g);
    if(this.state.uid === game.player1
      || this.state.uid === game.player2
      || this.state.uid === game.player3
      || this.state.uid === game.player4){
        console.log("Man kan bara sitta på ett ställe!")
    } else {
      gamesRef.child(gameid).child('player'+slotIndex).set(this.state.uid);
    }
  }

  // Ett öppet game bör nog göras om till en egen component
  render() {
    return (
      <div>
        <p>{this.state.username}</p>
        <p>Poäng: {this.state.userTotalScore}</p>
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
      </div>);
  }
}

export default Lobby;
