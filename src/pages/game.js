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
    "ac" : 52, "ah" : 39, "as" : 26, "ad" : 13,
    "2c" : 40, "2h" : 27, "2s" : 14, "2d" : 1,
    "3c" : 41, "3h" : 28, "3s" : 15, "3d" : 2,
    "4c" : 42, "4h" : 29, "4s" : 16, "4d" : 3,
    "5c" : 43, "5h" : 30, "5s" : 17, "5d" : 4,
    "6c" : 44, "6h" : 31, "6s" : 18, "6d" : 5,
    "7c" : 45, "7h" : 32, "7s" : 19, "7d" : 6,
    "8c" : 46, "8h" : 33, "8s" : 20, "8d" : 7,
    "9c" : 47, "9h" : 34, "9s" : 21, "9d" : 8,
    "tc" : 48, "th" : 35, "ts" : 22, "td" : 9,
    "jc" : 49, "jh" : 36, "js" : 23, "jd" : 10,
    "qc" : 50, "qh" : 37, "qs" : 24, "qd" : 11,
    "kc" : 51, "kh" : 38, "ks" : 25, "kd" : 12
  };
    authData = root.getAuth();
    loggedinuserRef = usersRef.child(authData.uid);
    const cards = [];
    this.state = {uid: '', currentTable : '', currentRound : 10, deck : sortedDeck,
      player1cards : "", player2cards : "", player3cards : "", player4cards : "",
      player1bid : 0, player2bid : 0, player3bid : 0, player4bid : 0,
      player1cardPlayed: '', player2cardPlayed: '', player3cardPlayed: '', player4cardPlayed: '',
      currentDealer: 1, myCards : cards, myPlayerNumber : 1, playersTurn: 1,
      highestBid: 0, highestBidder: 1, biddingMode : true, currentBidder : 1,
      currentSuit: ''};
    this.dealNewHand = this.dealNewHand.bind(this, this.state.currentRound);
    this.getCardsForRound = this.getCardsForRound.bind(this, this.state.currentRound);
    this.shuffle = this.shuffle.bind(this);
    this.bidButtonClicked = this.bidButtonClicked.bind(this, this.state.currentRound);
    this.bidSum = this.bidSum.bind(this);
    this.suitIsInMyCards = this.suitIsInMyCards.bind(this);
  }

  componentDidMount(){
    var self = this;
    loggedinuserRef.on("value", function(snapshot){
      var userData = snapshot.val();
      var newState = self.state;
      newState.uid = snapshot.key();
      newState.currentTable = userData.currenttable;
      newState.username = userData.displayname;
      self.setState(newState);
      gamesInProgressRef.child(userData.currenttable).on("value", function(childsnapshot){
        var gameData = childsnapshot.val();
        var newState = self.state;
        newState.currentBidder  = gameData.currentBidder;
        newState.currentRound   = gameData.currentHand;
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
        newState.player1cardPlayed = gameData.players.player1.cardPlayed;
        newState.player2cardPlayed = gameData.players.player2.cardPlayed;
        newState.player3cardPlayed = gameData.players.player3.cardPlayed;
        newState.player4cardPlayed = gameData.players.player4.cardPlayed;
        newState.highestBidder  = gameData.highestBidder;
        newState.biddingMode    = gameData.biddingMode;
        newState.currentSuit    = gameData.currentSuit;

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
    // Skifta dealern ett steg. Först att buda är knappen + 1
    var newDealer = (this.state.currentDealer % 4 ) + 1;
    var newBidder = (newDealer % 4) + 1;
    console.log("newDealer: "+ newDealer);
    gamesInProgressRef.child(this.state.currentTable).child('currentDealer').set(newDealer);
    gamesInProgressRef.child(this.state.currentTable).child('currentBidder').set(newBidder);
    // Först ska man buda.
    gamesInProgressRef.child(this.state.currentTable).child('biddingMode').set(true);


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

  suitIsInMyCards(suit, cards){
    var butWasItReallyThere = false;
    for(var i = 0; i < cards.length; i += 2){
      if(suit == cards[i + 1]){
        butWasItReallyThere = true;
      }
    }
    return butWasItReallyThere;
  }

  // Här tar jag bort kortet man klickade på och uppdaterar db.
  cardClicked(card){
    if(this.state.playersTurn == this.state.myPlayerNumber && this.state.biddingMode == false){
      var validPlay = false;
      var curSuit = this.state.currentSuit;
      var myCards = "";
      if(this.state.myPlayerNumber == 1){
        myCards = this.state.player1cards;
      } else if(this.state.myPlayerNumber == 2){
        myCards = this.state.player2cards;
      } else if(this.state.myPlayerNumber == 3){
        myCards = this.state.player3cards;
      } else if(this.state.myPlayerNumber == 4){
        myCards = this.state.player4cards;
      } else {
        console.log("myPlayerNumber has an invalid value: "+ this.state.myPlayerNumber);
      }

      var firstOutToPlay = false;
      // kolla om man fick spela det kortet.
      if(curSuit == ""){
        // Detta betyder att man är först ut och alltså får lägga vad som helst.
        validPlay = true;
        firstOutToPlay = true;
      } else if(curSuit == card[1]){
        // kortet är av samma färg som det som spelades först.
        validPlay = true;
      } else if(!this.suitIsInMyCards(curSuit, myCards)){
        // Vi har inget sådant kort och får spela vad som helst
        validPlay = true;
      }

      // gör alla uppdateringar
      if(validPlay){
        myCards= updatedCards.replace(card, '');
        gamesInProgressRef.child(this.state.currentTable).child('players').child('player'+ (this.state.myPlayerNumber)).child('currentCards').set(myCards);
        gamesInProgressRef.child(this.state.currentTable).child('players').child('player'+ (this.state.myPlayerNumber)).child('cardPlayed').set(card);
        if(firstOutToPlay){
          gamesInProgressRef.child(this.state.currentTable).child('currentSuit').set(card[1]);
        }

        // Nästa spelares tur.
        var nextPlayer = (this.state.playersTurn % 4) + 1;
        gamesInProgressRef.child(this.state.currentTable).child("playersTurn").set(nextPlayer);
        if(nextPlayer == this.state.highestBidder){
          // Highest bidder började spelet, det betyder att alla nu lagt ett varsiitt kort.
          // nollställa bud,
          //
        } else {
          gamesInProgressRef.child(this.state.currentTable).child("playersTurn").set(nextPlayer);
        }
      }
    }
  }

  bidSum(){
    var tempSum = 0;
    tempSum += this.state.player1bid;
    tempSum += this.state.player2bid;
    tempSum += this.state.player3bid;
    tempSum += this.state.player4bid;
    console.log(tempSum);
    return  tempSum;
  }


  bidButtonClicked(currentRound){
    var bid = $("#bidInput").val();
    bid = bid * 1;
    if(isNaN(bid)  || bid < 0 || bid > currentRound || ((this.state.currentBidder == this.state.currentDealer) && (this.bidSum() + bid) == currentRound )){
      console.log("Felaktigt bud. bid: "+ bid );
    } else{
      console.log("sparar bud...");
      gamesInProgressRef.child(this.state.currentTable).child('players').child('player' + this.state.myPlayerNumber).child('currentBid').set(bid);

      // detta behävs fär att slippa async-problem
      var highest = false;
      // Detta bud är högst.
      if(bid > this.state.highestBid){
        highest = true;
        gamesInProgressRef.child(this.state.currentTable).child('highestBid').set(bid);
      }

      if(this.state.currentBidder == this.state.currentDealer){
        // budgivning ska avslutas
        console.log('sista budet.');
        gamesInProgressRef.child(this.state.currentTable).child('biddingMode').set(false);
        // spelarna ska kunna klicka på kort och spela. Man måste sätta vem som börjar.
        // highest bidder börjar...
        // Återigen, hade inte highest-variabeln använts så hade man kanske missat att man nyss uppdaterat highestBidder
        if(highest){
          gamesInProgressRef.child(this.state.currentTable).child('playersTurn').set(this.state.myPlayerNumber);
        } else {
          gamesInProgressRef.child(this.state.currentTable).child('playersTurn').set(this.state.highestBidder);
        }

      } else {
        // nästa budare ska sättas
        var newBidder = (this.state.currentBidder % 4) + 1;
        gamesInProgressRef.child(this.state.currentTable).child('currentBidder').set(newBidder);
      }
    }
  }

  render() {
    return (
      <div>
        <p>THIS IS THE GAME</p>
        <button onClick={this.debugKnapp.bind(this)}>Starta spelet</button>
        <p>Spelare1s kort: {this.state.player1cards}</p>
        <p>Spelare2s kort: {this.state.player2cards}</p>
        <p>Spelare3s kort: {this.state.player3cards}</p>
        <p>Spelare4s kort: {this.state.player4cards}</p>
        <p>biddingMode: {this.state.biddingMode ? "true" : "false"}</p>
        <p>playersTurn: {this.state.playersTurn}</p>
        <p>Dealer: {this.state.currentDealer}</p>
        <p>currentBidder: {this.state.currentBidder}</p>
        <p>currentSuit: {this.state.currentSuit}</p>
        <div className="biddingBox">
          <input id="bidInput" type="text" placeholder="Lägg ett bud" />
          <button onClick={this.bidButtonClicked.bind(this)}>Ok</button>
        </div>
        <p>Mina kort: </p>
        {this.state.myCards.map((card, index) => (
          <img key={index} className="cardImage" src={"./images/cards/minifiedcards/"+card+".png"} onClick={this.cardClicked.bind(this, card)}/>
        ))}
      </div>
    )
  }
}
export default Game;
