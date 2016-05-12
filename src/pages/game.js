import React from 'react';

var root = new Firebase("https://plump.firebaseio.com");
var authData;
var users;
var loggedinuserRef;
var currentGameRef;
var usersRef = root.child('users');
var gamesInProgressRef = root.child('gamesInProgress');
var sortedDeck;
var ranks;

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
     "kc", "kh", "ks", "kd"
   ];
   ranks = {
    "ac" : 13, "ah" : 26, "as" : 39, "ad" : 52,
    "2c" : 1, "2h" : 14, "2s" : 27, "2d" : 40,
    "3c" : 2, "3h" : 15, "3s" : 28, "3d" : 41,
    "4c" : 3, "4h" : 16, "4s" : 29, "4d" : 42,
    "5c" : 4, "5h" : 17, "5s" : 30, "5d" : 43,
    "6c" : 5, "6h" : 18, "6s" : 31, "6d" : 44,
    "7c" : 6, "7h" : 19, "7s" : 32, "7d" : 45,
    "8c" : 7, "8h" : 20, "8s" : 33, "8d" : 46,
    "9c" : 8, "9h" : 21, "9s" : 34, "9d" : 47,
    "tc" : 9, "th" : 22, "ts" : 35, "td" : 48,
    "jc" : 10, "jh" : 23, "js" : 36, "jd" : 49,
    "qc" : 11, "qh" : 24, "qs" : 37, "qd" : 50,
    "kc" : 12, "kh" : 25, "ks" : 38, "kd" : 51
  };
    authData = root.getAuth();
    loggedinuserRef = usersRef.child(authData.uid);
    const cards = [];
    this.state = {uid: '', currentTable : '', currentRound : 10, deck : sortedDeck,
      player1cards : "", player2cards : "", player3cards : "", player4cards : "",
      player1bid : 0, player2bid : 0, player3bid : 0, player4bid : 0,
      currentDealer: 3, myCards : cards, myPlayerNumber : 0, playersTurn: 1,
      highestBidder: 1, biddingMode : true, };
    this.dealNewHand = this.dealNewHand.bind(this, this.state.currentRound);
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
        var newState = self.state;
        //currentGameRef = gamesInProgressRef.child(userData.currenttable);
        newState.currentRound   = gameData.currentRound;
        newState.currentDealer  = gameData.currentDealer;
        newState.playersTurn    = gameData.playersTurn;
        newState.player1cards   = gameData.players.player1.currentCards;
        newState.player2cards   = gameData.players.player2.currentCards;
        newState.player3cards   = gameData.players.player3.currentCards;
        newState.player4cards   = gameData.players.player4.currentCards;
        newState.player1bid     = gameData.players.player1.currentBid;
        newState.player2bid     = gameData.players.player2.currentBid;
        newState.player3bid     = gameData.players.player3.currentBid;
        newState.player4bid     = gameData.players.player4.currentBid;
        newState.highestBidder  = gameData.highestBidder;
        newState.biddingMode    = gameData.biddingMode;

        var tempCards = "";
        var tempCardArray = [];
        if(self.state.uid == gameData.players.player1.uid){
          newState.myPlayerNumber = 1;
          tempCards = gameData.players.player1.currentCards;
        } else if(uid == gameData.players.player2.uid){
          newState.myPlayerNumber = 2;
          tempCards = gameData.players.player2.currentCards;
        } else if(uid == gameData.players.player3.uid){
          newState.myPlayerNumber = 3;
          tempCards = gameData.players.player3.currentCards;
        } else if(uid == gameData.players.player4.uid){
          newState.myPlayerNumber = 4;
          tempCards = gameData.players.player4.currentCards;
        }
        for(var i = 0; i < tempCards.length; i += 2){
          tempCardArray.push(tempCards.substring(i, i+2));
        }
        tempCardArray = tempCardArray.sort(function(left, right) {
                          return ranks[right] - ranks[left]; // descending order
                        });
        newState.myCards = tempCardArray;
        self.setState(newState);
      });
    });
    // dealNewHand();
    // Detta sätter igång spelet.
    // Ska bara ske hos hosten.
    // Alla får göra en check, se om hosten är online. Om inte: sätt nästa spelare som är online till host osv.
    // Detta kommer definitivt bli meckigt men lösbart.
  }

  // det sista som händer är att man ändrar dealer och cards, annars skiter det sig med det asynchrona.
  dealNewHand(cardsCount){
    //console.log(newDealer);
    var allCardsForThisRound = this.getCardsForRound();
    // ge varje spelare sina kort.
    for(var i = 0; i < 4; i++){
      var cardsAsString = "";
      for(var j = 0; j < cardsCount ; j++){
        cardsAsString += allCardsForThisRound[(i * cardsCount) + j];
      }
      gamesInProgressRef.child(this.state.currentTable).child('players').child('player'+ (i+1)).child('currentCards').set(cardsAsString);
    }


    // BUDGIVNING
    // Ha en div som innehåller budgivningsmekanismen. Visa den när spelet är i budläge.
    // Sätt en timer som timar ut efter ~20 sekunder. Har man inte valt tills dess så
    // autoväljs något åt en.




    // var nextRound = this.state.currentRound - 1;
    // if(this.state.currentRound >= 2){
    //  gamesInProgressRef.child(this.state.currentTable).child('currentRound').set(nextRound);
    // } else {
    //  endTheGame();
    // }
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

  // Här tar jag bort kortet man klickade på och uppdaterar db.
  cardClicked(index, card){
    if(this.state.playersTurn == this.state.myPlayerNumber){
      console.log("index: " + index + " card: "+ card);
      // ta ut mina currentCards. pilla ut detta kort. uppdatera db. sen ska allt vara fixat.
      var updatedCards = "";
      if(this.state.myPlayerNumber == 1){
        updatedCards = this.state.player1cards;
      } else if(this.state.myPlayerNumber == 2){
        updatedCards = this.state.player2cards;
      } else if(this.state.myPlayerNumber == 3){
        updatedCards = this.state.player3cards;
      } else if(this.state.myPlayerNumber == 4){
        updatedCards = this.state.player4cards;
      } else {
        console.log("error returning currentCards");
      }
      updatedCards= updatedCards.replace(card, '');
      gamesInProgressRef.child(this.state.currentTable).child('players').child('player'+ (this.state.myPlayerNumber)).child('currentCards').set(updatedCards);

      // Nästa spelares tur.
      var nextPlayer = (this.state.playersTurn + 1) % 4;
      gamesInProgressRef.child(this.state.currentTable).child("playersTurn").set(nextPlayer);
      if(nextPlayer == this.state.highestBidder){
        // given slut, dags att dela ut poäng
      } else {
        gamesInProgressRef.child(this.state.currentTable).child("playersTurn").set(nextPlayer);
      }

    }
  }

  bidButtonClicked(){
    console.log("bud lagt");
  }

  render() {
    return (
      <div>
        <p>THIS IS THE GAME</p>
        <button onClick={this.debugKnapp.bind(this)}>Click me</button>
        <p>Spelare1s kort: {this.state.player1cards}</p>
        <p>Spelare2s kort: {this.state.player2cards}</p>
        <p>Spelare3s kort: {this.state.player3cards}</p>
        <p>Spelare4s kort: {this.state.player4cards}</p>
        <p>Dealer: {this.state.currentDealer}</p>
        <div className="biddingBox">
          <input type="text" placeholder="Lägg ett bud" />
          <button onClick={this.bidButtonClicked.bind(this)}>Ok</button>
        </div>
        <p>Mina kort: </p>
        {this.state.myCards.map((card, index) => (
          <img key={index} className="cardImage" src={"./images/cards/minifiedcards/"+card+".png"} onClick={this.cardClicked.bind(this, index, card)}/>
        ))}
      </div>
    )
  }
}
export default Game;
