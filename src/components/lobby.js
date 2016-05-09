import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
var authData;
var users
var loggedinuserRef;

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
      var openGamesFromFirebase = snapshot.val();
      // uppdatera this.state.openGames
      const newOpenGames = [];
      for(var gameIndex in openGamesFromFirebase){
        newOpenGames.push(openGamesFromFirebase[gameIndex]);
      }
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
        "player1": self.state.username,
        "player2" : "",
        "player3": "",
        "player4": "",
        "gameState" : "waitingForPlayers"
      });
  }

  takeSlotButtonClick(){
    console.log("Tar slot");
  }

  render() {
    return (
      <div>
        <p>{this.state.username}</p>
        <p>Poäng: {this.state.userTotalScore}</p>
        <button onClick={this.newGameButtonClicked.bind(this)}>NYTT SPEL</button>

        <p>Öppna spel:</p>
        {this.state.openGames.map((openGame, index) => (
          <div key={index} className="openGame">
            <div className="playerSlot">{openGame.player1 == "" ? <button onClick={this.takeSlotButtonClick.bind(this)}>Ta plats</button>
                                    : "Spelare 1: " + openGame.player1}
            </div>
            <div className="playerSlot">{openGame.player2 == "" ? <button onClick={this.takeSlotButtonClick.bind(this)}>Ta plats</button>
                                    : "Spelare 2: " + openGame.player2}
            </div>
            <div className="playerSlot">{openGame.player3 == "" ? <button onClick={this.takeSlotButtonClick.bind(this)}>Ta plats</button>
                                    : "Spelare 3: " + openGame.player3}
            </div>
            <div className="playerSlot">{openGame.player4 == "" ? <button onClick={this.takeSlotButtonClick.bind(this)}>Ta plats</button>
                                    : "Spelare 4: " + openGame.player4}
            </div>
          </div>
        ))}
      </div>);
  }
}

export default Lobby;
