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
    console.log("loggedinuserRef.uid: " + loggedinuserRef);
    const cards = [];
    const tableCards = [];
    this.state = {uid: '', currentTable : '', currentRound : 10, deck : sortedDeck,
      player1cards : "", player2cards : "", player3cards : "", player4cards : "",
      player1uid: '', player2uid: '', player3uid: '', player4uid: '',
      player1bid : 0, player2bid : 0, player3bid : 0, player4bid : 0,
      player1score: 0, player2score: 0, player3score: 0, player4score: 0,
      player1cardPlayed: '', player2cardPlayed: '', player3cardPlayed: '', player4cardPlayed: '',
      player1tricksTaken: 0, player2tricksTaken: 0, player3tricksTaken: 0, player4tricksTaken: 0,
      currentDealer: 1, myCards : cards, myPlayerNumber : 1, playersTurn: 1,
      highestBid: 0, highestBidder: 1, biddingMode : true, currentBidder : 1,
      currentSuit: '', myTrickCount: 0, myBid: 0, cardsOnTable: tableCards, currentTableAsString: ""};
    this.dealNewHand = this.dealNewHand.bind(this);
    this.getCardsForRound = this.getCardsForRound.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.bidButtonClicked = this.bidButtonClicked.bind(this);
    this.bidSum = this.bidSum.bind(this);
    this.suitIsInMyCards = this.suitIsInMyCards.bind(this);
    this.trickOver = this.trickOver.bind(this);
    this.trickWinner = this.trickWinner.bind(this);
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
        newState.currentTableAsString = gameData.cardsOnTable;
        newState.biddingMode    = gameData.biddingMode;
        newState.currentBidder  = gameData.currentBidder;
        newState.currentDealer  = gameData.currentDealer;
        newState.currentRound   = gameData.currentHand;
        newState.currentSuit    = gameData.currentSuit;
        newState.highestBid     = gameData.highestBid;
        newState.highestBidder  = gameData.highestBidder;
        newState.playersTurn    = gameData.playersTurn;
        newState.player1bid     = gameData.players.player1.currentBid;
        newState.player2bid     = gameData.players.player2.currentBid;
        newState.player3bid     = gameData.players.player3.currentBid;
        newState.player4bid     = gameData.players.player4.currentBid;
        newState.player1cardPlayed = gameData.players.player1.cardPlayed;
        newState.player2cardPlayed = gameData.players.player2.cardPlayed;
        newState.player3cardPlayed = gameData.players.player3.cardPlayed;
        newState.player4cardPlayed = gameData.players.player4.cardPlayed;
        newState.player1cards   = gameData.players.player1.currentCards;
        newState.player2cards   = gameData.players.player2.currentCards;
        newState.player3cards   = gameData.players.player3.currentCards;
        newState.player4cards   = gameData.players.player4.currentCards;
        newState.player1score   = gameData.players.player1.score;
        newState.player2score   = gameData.players.player2.score;
        newState.player3score   = gameData.players.player3.score;
        newState.player4score   = gameData.players.player4.score;
        newState.player1tricksTaken = gameData.players.player1.tricksTaken;
        newState.player2tricksTaken = gameData.players.player2.tricksTaken;
        newState.player3tricksTaken = gameData.players.player3.tricksTaken;
        newState.player4tricksTaken = gameData.players.player4.tricksTaken;
        newState.player1uid = gameData.players.player1.uid;
        newState.player2uid = gameData.players.player2.uid;
        newState.player3uid = gameData.players.player3.uid;
        newState.player4uid = gameData.players.player4.uid;

        var tempCards = "";
        var tempCardArray = [];
        if(self.state.uid == gameData.players.player1.uid){
          newState.myPlayerNumber = 1;
          newState.myBid = gameData.players.player1.currentBid;
          newState.myTrickCount = gameData.players.player1.tricksTaken;
          tempCards = gameData.players.player1.currentCards;
        } else if(self.state.uid == gameData.players.player2.uid){
          newState.myPlayerNumber = 2;
          newState.myBid = gameData.players.player2.currentBid;
          newState.myTrickCount = gameData.players.player2.tricksTaken;
          tempCards = gameData.players.player2.currentCards;
        } else if(self.state.uid == gameData.players.player3.uid){
          newState.myPlayerNumber = 3;
          newState.myBid = gameData.players.player3.currentBid;
          newState.myTrickCount = gameData.players.player3.tricksTaken;
          tempCards = gameData.players.player3.currentCards;
        } else if(self.state.uid == gameData.players.player4.uid){
          newState.myPlayerNumber = 4;
          newState.myBid = gameData.players.player4.currentBid;
          newState.myTrickCount = gameData.players.player4.tricksTaken;
          tempCards = gameData.players.player4.currentCards;
        }


        for(var i = 0; i < tempCards.length; i += 2){
          tempCardArray.push(tempCards.substring(i, i+2));
        }
        tempCardArray = tempCardArray.sort(function(left, right) {
                          return ranks[right] - ranks[left]; // descending order
                        });
        newState.myCards = tempCardArray;

        var tempCurrentTableArray = [];
        var tempC = gameData.cardsOnTable;
        for(var j = 0; j < tempC.length; j += 2){
          tempCurrentTableArray.push(tempC.substring(j, j+2));
        }
        newState.cardsOnTable = tempCurrentTableArray;

        $("#biddingBox").hide();
        // Om det är spelarens tur att buda så ska biddingBox visas
        if(newState.biddingMode == true && newState.currentBidder == newState.myPlayerNumber){
          $("#bidInput").val("");
          $("#biddingBox").show();
        } else{
          $("#biddingBox").hide();
        }

        self.setState(newState);
      });
    });
  }

  // det sista som händer är att man ändrar dealer och cards, annars skiter det sig med det asynchrona.
  dealNewHand(cardsCount){
    var allCardsForThisRound = this.getCardsForRound(cardsCount);
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
    gamesInProgressRef.child(this.state.currentTable).child('currentDealer').set(newDealer);
    gamesInProgressRef.child(this.state.currentTable).child('currentBidder').set(newBidder);
    // Detta krävs för att det helt säkert ska bli han om alla väljer 0.
    gamesInProgressRef.child(this.state.currentTable).child('highestBidder').set(newBidder);
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
    console.log("getCardsForRound.cardsPerPerson: " + cardsPerPerson);
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
    this.dealNewHand(10);
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
    if(this.state.playersTurn == this.state.myPlayerNumber && this.state.biddingMode == false && this.state.cardsOnTable.length < 4){
      console.log("Går in i cardClicked");
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
        myCards = myCards.replace(card, '');
        gamesInProgressRef.child(this.state.currentTable).child('players').child('player'+ (this.state.myPlayerNumber)).child('currentCards').set(myCards);
        gamesInProgressRef.child(this.state.currentTable).child('players').child('player'+ (this.state.myPlayerNumber)).child('cardPlayed').set(card);

        // Lägg till kortet till bordet
        var curCardsOnTable = this.state.currentTableAsString;
        console.log("curCardsOnTable är nu: " + curCardsOnTable);
        curCardsOnTable += card;
        console.log("Lägger till följande kort till bordet: " + card);
        console.log("nu däremot är curCardsOnTable: " + curCardsOnTable);
        gamesInProgressRef.child(this.state.currentTable).child('cardsOnTable').set(curCardsOnTable);

        if(firstOutToPlay){
          gamesInProgressRef.child(this.state.currentTable).child('currentSuit').set(card[1]);
        }
        // Nästa spelares tur.
        var myNumber = this.state.myPlayerNumber;
        if(this.trickOver(myNumber)){
          // kolla vem som fick sticket.
          var winnerOfTrick;

          var p1card = this.state.player1cardPlayed;
          var p2card = this.state.player2cardPlayed;
          var p3card = this.state.player3cardPlayed;
          var p4card = this.state.player4cardPlayed;

          if(this.state.myPlayerNumber == 1){
            winnerOfTrick = this.trickWinner(curSuit, card, p2card, p3card, p4card);
          } else if(this.state.myPlayerNumber == 2){
            winnerOfTrick = this.trickWinner(curSuit, p1card, card, p3card, p4card);
          } else if(this.state.myPlayerNumber == 3){
            winnerOfTrick = this.trickWinner(curSuit, p1card, p2card, card, p4card);
          } else if(this.state.myPlayerNumber == 4){
            winnerOfTrick = this.trickWinner(curSuit, p1card, p2card, p3card, card);
          }

          // räkna upp den spelarens stickräknare.
          var newTrickCount = 1;
          if(winnerOfTrick == 1){
            newTrickCount += this.state.player1tricksTaken;
          } else if(winnerOfTrick == 2){
            newTrickCount += this.state.player2tricksTaken;
          } else if(winnerOfTrick == 3){
            newTrickCount += this.state.player3tricksTaken;
          } else if(winnerOfTrick == 4){
            newTrickCount += this.state.player4tricksTaken;
          } else {
            console.log("Error setting new trick count: winnerOfTrick: " + winnerOfTrick);
          }
          // Kolla om hela rundan är slut
          if(myCards == ""){
            // Kolla vem som klarade sig och ge dem poäng
            // måste hantera winnerOfTrick separat eftersom hen inte har uppdaterat sin data än, eller iaf kan man inte räkna med det.
            // kolla om player1 klarade sig
            if(winnerOfTrick == 1){
              if(this.state.player1bid == newTrickCount){
                // plussa på med 10 / 100 plus bid
                var pointsEarned = this.state.player1bid;
                if(this.state.player1bid == 10){
                  pointsEarned = pointsEarned * 11;
                } else {
                  pointsEarned += 10;
                }
                var newScore = this.state.player1score;
                newScore += pointsEarned;
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player1").child("score").set(newScore);
              }
            } else if(this.state.player1bid == this.state.player1tricksTaken){
                // måste även kolla för 0
                var newScore = this.state.player1score
                if(this.state.player1bid == 0){
                  newScore += 5;
                } else {
                  newScore += (10 + this.state.player1bid);
                }
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player1").child("score").set(newScore);
            } else {
                console.log("klarade sig inte");
            }


            if(winnerOfTrick == 2){
              if(this.state.player2bid == newTrickCount){
                // plussa på med 10 / 100 plus bid
                var pointsEarned = this.state.player2bid;
                if(this.state.player2bid == 10){
                  pointsEarned = pointsEarned * 11;
                } else {
                  pointsEarned += 10;
                }
                var newScore = this.state.player2score;
                newScore += pointsEarned;
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player2").child("score").set(newScore);
              } else {
                console.log("klarade sig inte");
              }
            } else {
              if(this.state.player2bid == this.state.player2tricksTaken){
                // måste även kolla för 0
                var newScore = this.state.player2score
                if(this.state.player2bid == 0){
                  newScore += 5;
                } else {
                  newScore += (10 + this.state.player2bid);
                }
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player2").child("score").set(newScore);
              }
            }

            if(winnerOfTrick == 3){
              if(this.state.player3bid == newTrickCount){
                // plussa på med 10 / 100 plus bid
                var pointsEarned = this.state.player3bid;
                if(this.state.player3bid == 10){
                  pointsEarned = pointsEarned * 11;
                } else {
                  pointsEarned += 10;
                }
                var newScore = this.state.player3score;
                newScore += pointsEarned;
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player3").child("score").set(newScore);
              }
            } else {
              if(this.state.player3bid == this.state.player3tricksTaken){
                // måste även kolla för 0
                var newScore = this.state.player3score
                if(this.state.player3bid == 0){
                  newScore += 5;
                } else {
                  newScore += (10 + this.state.player3bid);
                }
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player3").child("score").set(newScore);
              }
            }

            if(winnerOfTrick == 4){
              if(this.state.player4bid == newTrickCount){
                // plussa på med 10 / 100 plus bid
                var pointsEarned = this.state.player4bid;
                if(this.state.player4bid == 10){
                  pointsEarned = pointsEarned * 11;
                } else {
                  pointsEarned += 10;
                }
                var newScore = this.state.player4score;
                newScore += pointsEarned;
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player4").child("score").set(newScore);
              }
            } else {
              if(this.state.player4bid == this.state.player4tricksTaken){
                // måste även kolla för 0
                var newScore = this.state.player4score
                if(this.state.player4bid == 0){
                  newScore += 5;
                } else {
                  newScore += (10 + this.state.player4bid);
                }
                gamesInProgressRef.child(this.state.currentTable).child("players").child("player4").child("score").set(newScore);
              }
            }


            // Dela ut nya kort.
            // Flytta dealerknappen
            // Påbörja ny budrunda
            // kör dealNewHand();
            if(this.state.currentRound == 2){
              // Spelet slut.
              // Ge spelarna sina poäng.
              var playerPointsArray = [];
              playerPointsArray.push({uid: this.state.player1uid, score: this.state.player1score});
              playerPointsArray.push({uid: this.state.player2uid, score: this.state.player2score});
              playerPointsArray.push({uid: this.state.player3uid, score: this.state.player3score});
              playerPointsArray.push({uid: this.state.player4uid, score: this.state.player4score});

              playerPointsArray.sort(function(a, b){
                return a.score - b.score;
              });

              var winnerOldScore = 0;
              var secondPlaceOldScore = 0;
              var thirdPlaceOldScore = 0;
              var loserOldScore = 0;
              // Uppdatera spelarnas score.
              usersRef.child(playerPointsArray[0].uid).once("value", function(snapshot){
                var userData = snapshot.val();
                loserOldScore = userData.totalscore;
                var loserNewScore = loserOldScore - 20;
                if(loserNewScore < 0){
                  // Man ska inte kunna ligga på minus bestämmer jag här och nu
                  loserNewScore = 0;
                }
                usersRef.child(playerPointsArray[0].uid).child("totalscore").set(loserNewScore);
              });
              usersRef.child(playerPointsArray[1].uid).once("value", function(snapshot){
                // har med denna ifall jag senare bestämmer mig för att ge 3an poäng som är skilt från 0
                var userData = snapshot.val();
                thirdPlaceOldScore = userData.totalscore;
                var thirdPlaceNewScore = thirdPlaceOldScore;
                // onödigt att göra updaten nu obviously
                //usersRef.child(playerPointsArray[1].uid).child("totalscore").set(thirdPlaceNewScore);
              });
              usersRef.child(playerPointsArray[2].uid).once("value", function(snapshot){
                var userData = snapshot.val();
                secondPlaceOldScore = userData.totalscore;
                var secondPlaceMewScore = secondPlaceOldScore + 20;
                usersRef.child(playerPointsArray[2].uid).child("totalscore").set(secondPlaceMewScore);
              });
              usersRef.child(playerPointsArray[3].uid).once("value", function(snapshot){
                var userData = snapshot.val();
                winnerOldScore = userData.totalscore;
                var winnerNewScore = winnerOldScore + 50;
                usersRef.child(playerPointsArray[3].uid).child("totalscore").set(winnerNewScore);
              });

            } else {
              var newRound = this.state.currentRound - 1;
              gamesInProgressRef.child(this.state.currentTable).child("currentHand").set(newRound);
              gamesInProgressRef.child(this.state.currentTable).child('highestBid').set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player1").child("currentBid").set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player2").child("currentBid").set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player3").child("currentBid").set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player4").child("currentBid").set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player1").child("tricksTaken").set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player2").child("tricksTaken").set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player3").child("tricksTaken").set(0);
              gamesInProgressRef.child(this.state.currentTable).child("players").child("player4").child("tricksTaken").set(0);
              this.dealNewHand(newRound);
            }
          } else{
            // rundan är inte slut (men sticket är slut)
            gamesInProgressRef.child(this.state.currentTable).child('players').child('player' + winnerOfTrick).child('tricksTaken').set(newTrickCount);
            gamesInProgressRef.child(this.state.currentTable).child('playersTurn').set(winnerOfTrick);
            // Låter korten vara kvar på bordet i 3 sekunder och tömmder det sedan
            var self = this;
            setTimeout(function(){gamesInProgressRef.child(self.state.currentTable).child("cardsOnTable").set("");},2200);
          }
          // ska göras oavsett
          gamesInProgressRef.child(this.state.currentTable).child("players").child("player1").child("cardPlayed").set("");
          gamesInProgressRef.child(this.state.currentTable).child("players").child("player2").child("cardPlayed").set("");
          gamesInProgressRef.child(this.state.currentTable).child("players").child("player3").child("cardPlayed").set("");
          gamesInProgressRef.child(this.state.currentTable).child("players").child("player4").child("cardPlayed").set("");
          gamesInProgressRef.child(this.state.currentTable).child('currentSuit').set("");
        } else {
          // sticket är inte slut
          var nextPlayer = (this.state.playersTurn % 4) + 1;
          gamesInProgressRef.child(this.state.currentTable).child("playersTurn").set(nextPlayer);
        }
      } else {
        console.log("Not valid play");
      }
    }
  }

  trickWinner(suit, player1card, player2card, player3card, player4card){
    console.log("går in i trickWinner");
    console.log("player1card: " + player1card);
    console.log("player2card: " + player2card);
    console.log("player3card: " + player3card);
    console.log("player4card: " + player4card);
    var check1 = player1card[1] == suit ? true : false;
    var check2 = player2card[1] == suit ? true : false;
    var check3 = player3card[1] == suit ? true : false;
    var check4 = player4card[1] == suit ? true : false;

    // det här suger
    // kolla efter A
    if(check1 && player1card[0] == 'a'){ return 1;}
    if(check2 && player2card[0] == 'a'){ return 2;}
    if(check3 && player3card[0] == 'a'){ return 3;}
    if(check4 && player4card[0] == 'a'){ return 4;}
    // kolla efter k
    if(check1 && player1card[0] == 'k'){ return 1;}
    if(check2 && player2card[0] == 'k'){ return 2;}
    if(check3 && player3card[0] == 'k'){ return 3;}
    if(check4 && player4card[0] == 'k'){ return 4;}
    if(check1 && player1card[0] == 'q'){ return 1;}
    if(check2 && player2card[0] == 'q'){ return 2;}
    if(check3 && player3card[0] == 'q'){ return 3;}
    if(check4 && player4card[0] == 'q'){ return 4;}
    if(check1 && player1card[0] == 'j'){ return 1;}
    if(check2 && player2card[0] == 'j'){ return 2;}
    if(check3 && player3card[0] == 'j'){ return 3;}
    if(check4 && player4card[0] == 'j'){ return 4;}
    if(check1 && player1card[0] == 't'){ return 1;}
    if(check2 && player2card[0] == 't'){ return 2;}
    if(check3 && player3card[0] == 't'){ return 3;}
    if(check4 && player4card[0] == 't'){ return 4;}
    if(check1 && player1card[0] == '9'){ return 1;}
    if(check2 && player2card[0] == '9'){ return 2;}
    if(check3 && player3card[0] == '9'){ return 3;}
    if(check4 && player4card[0] == '9'){ return 4;}
    if(check1 && player1card[0] == '8'){ return 1;}
    if(check2 && player2card[0] == '8'){ return 2;}
    if(check3 && player3card[0] == '8'){ return 3;}
    if(check4 && player4card[0] == '8'){ return 4;}
    if(check1 && player1card[0] == '7'){ return 1;}
    if(check2 && player2card[0] == '7'){ return 2;}
    if(check3 && player3card[0] == '7'){ return 3;}
    if(check4 && player4card[0] == '7'){ return 4;}
    if(check1 && player1card[0] == '6'){ return 1;}
    if(check2 && player2card[0] == '6'){ return 2;}
    if(check3 && player3card[0] == '6'){ return 3;}
    if(check4 && player4card[0] == '6'){ return 4;}
    if(check1 && player1card[0] == '5'){ return 1;}
    if(check2 && player2card[0] == '5'){ return 2;}
    if(check3 && player3card[0] == '5'){ return 3;}
    if(check4 && player4card[0] == '5'){ return 4;}
    if(check1 && player1card[0] == '4'){ return 1;}
    if(check2 && player2card[0] == '4'){ return 2;}
    if(check3 && player3card[0] == '4'){ return 3;}
    if(check4 && player4card[0] == '4'){ return 4;}
    if(check1 && player1card[0] == '3'){ return 1;}
    if(check2 && player2card[0] == '3'){ return 2;}
    if(check3 && player3card[0] == '3'){ return 3;}
    if(check4 && player4card[0] == '3'){ return 4;}
    if(check1 && player1card[0] == '2'){ return 1;}
    if(check2 && player2card[0] == '2'){ return 2;}
    if(check3 && player3card[0] == '2'){ return 3;}
    if(check4 && player4card[0] == '2'){ return 4;}
  }

  firstIsHigher(card1, card2){

  }

  trickOver(myNumber){
    if(myNumber == 1){
      if(this.state.player2cardPlayed != "" && this.state.player3cardPlayed != ""
        && this.state.player4cardPlayed != ""){
          return true;
      } else {
        return false;
      }
    } else if(myNumber == 2){
      if(this.state.player1cardPlayed != "" && this.state.player3cardPlayed != ""
        && this.state.player4cardPlayed != ""){
          return true;
      } else {
        return false;
      }
    } else if(myNumber == 3){
      if(this.state.player1cardPlayed != "" && this.state.player2cardPlayed != ""
        && this.state.player4cardPlayed != ""){
          return true;
      } else {
        return false;
      }
    } else if(myNumber == 4){
      if(this.state.player1cardPlayed != "" && this.state.player2cardPlayed != ""
        && this.state.player3cardPlayed != ""){
          return true;
      } else {
        return false;
      }
    } else {
      console.log("trickOver is broken, myNumber: " + myNumber);
    }
  }

  bidSum(){
    var tempSum = 0;
    tempSum += this.state.player1bid;
    tempSum += this.state.player2bid;
    tempSum += this.state.player3bid;
    tempSum += this.state.player4bid;
    console.log("bidSum returns: " + tempSum);
    return  tempSum;
  }

  bidButtonClicked(){
    var currentRound = this.state.currentRound;
    if(this.state.currentBidder == this.state.myPlayerNumber){
      var bid = $("#bidInput").val();
      bid = bid * 1;
      if(isNaN(bid)  || bid < 0 || bid > currentRound || ((this.state.currentBidder == this.state.currentDealer) && (this.bidSum() + bid) == currentRound )){
        console.log("Felaktigt bud. bid: "+ bid );
      } else{
        // Budet var giltigt. Sparar ner det, gör olika checkar för att se vilket state man är i osv.
        console.log("sparar bud...");
        gamesInProgressRef.child(this.state.currentTable).child('players').child('player' + this.state.myPlayerNumber).child('currentBid').set(bid);

        // detta behävs fär att slippa async-problem
        var highest = false;
        // Detta bud är högst.
        if(bid > this.state.highestBid){
          highest = true;
          // gamesInProgressRef.child(this.state.currentTable).child('playersTurn').set(this.state.myPlayerNumber);
          gamesInProgressRef.child(this.state.currentTable).child('playersTurn').set(this.state.myPlayerNumber);
          gamesInProgressRef.child(this.state.currentTable).child('highestBidder').set(this.state.myPlayerNumber);
          gamesInProgressRef.child(this.state.currentTable).child('highestBid').set(bid);
        }

        if(this.state.currentBidder == this.state.currentDealer){
          // budgivning ska avslutas
          console.log('sista budet.');
          gamesInProgressRef.child(this.state.currentTable).child('biddingMode').set(false);
          // spelarna ska kunna klicka på kort och spela. Man måste sätta vem som börjar.
          // highest bidder börjar...
          // Återigen, hade inte highest-variabeln använts så hade man kanske missat att man nyss uppdaterat highestBidder

        } else {
          // nästa budare ska sättas
          var newBidder = (this.state.currentBidder % 4) + 1;
          gamesInProgressRef.child(this.state.currentTable).child('currentBidder').set(newBidder);
        }
      }
    } else {
      console.log("Det är inte din tur");
    }
  }

  render() {
    return (
      <div>
        <p>THIS IS THE GAME</p>
        <button onClick={this.debugKnapp.bind(this)}>Starta spelet</button>
        <p>{this.state.playersTurn == this.state.myPlayerNumber ? "Min tur" : "Någon annans tur"}</p>
        <p>Mitt bud: {this.state.myBid}</p>
        <p>Antal stick jag tagit: {this.state.myTrickCount}</p>
        <div id="biddingBox">
          <input id="bidInput" type="text" placeholder="Lägg ett bud" />
          <button onClick={this.bidButtonClicked.bind(this)}>Ok</button>
        </div>
        <p>cardsOnTable: {this.state.cardsOnTable}</p>
        <div id="tableDiv">
          {this.state.cardsOnTable.map((card, index) => (
            <img key={index} src={"./images/cards/minifiedcards/"+card+".png"} />
          ))}
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
