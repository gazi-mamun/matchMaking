//------------------------
// PLAYER CLASS
//------------------------
class Player {
  constructor(id, elo, enteredMatchId = null) {
    this.id = id;
    this.elo = elo;
    this.enteredMatchId = enteredMatchId;
  }
}

//------------------------
// MATCH CLASS
//------------------------
class Match {
  constructor(matchId, teamA, teamB) {
    this.matchId = matchId;
    this.teamA = [];
    this.teamB = [];
    this.eloBound = 150;
    this.expansionTime = 180000;
    this.changeEloBound();
  }

  // CHANGE ELO BOUND METHOD
  changeEloBound() {
    setTimeout(() => {
      this.eloBound = this.eloBound + 100;
    }, this.expansionTime);
  }

  // ADD PLAYER TO MATCH METHOD
  addPlayer(player, enteredMatchId) {
    if (this.teamA.length >= 5 && this.teamB.length >= 5) return false;
    let lowElo;
    let highElo;

    //---------------- FOR TEAM-A ---------------
    // IF TEAM-A IS NOT EMPTY THAN CALCUTATE LOWEST AND HIGHEST ELO OF TEAM-A
    if (this.teamA.length > 0) {
      lowElo = this.teamA[0].elo;
      highElo = this.teamA[0].elo;
      // GETTING LOW ELO AND HIGH ELO
      this.teamA.map((p) => {
        if (p.elo < lowElo) {
          lowElo = p.elo;
        }
        if (p.elo > highElo) {
          highElo = p.elo;
        }
        return NaN;
      });
    }
    // IF TEAM-A IS LESS THAN 5
    if (this.teamA.length < 5) {
      // IF TEAM-A IS EMPTY
      if (this.teamA.length === 0) {
        this.teamA.push(player);
        player.enteredMatchId = enteredMatchId;
        return true;
      }
      // IF LENGTH OF TEAM-A IS LESS THAN 2
      if (this.teamA.length < 2) {
        if (
          player.elo >= lowElo - this.eloBound &&
          player.elo <= lowElo + this.eloBound
        ) {
          this.teamA.push(player);
          player.enteredMatchId = this.teamA[0].enteredMatchId;
          return true;
        }
      } else {
        // CHECKING THAT PUSHED PLAYER ELO IS IN THE ELO RANGE OF TEAM-A OR NOT
        if (
          (player.elo > highElo && player.elo <= lowElo + this.eloBound) ||
          (player.elo < lowElo && player.elo >= highElo - this.eloBound) ||
          (player.elo >= lowElo && player.elo <= highElo)
        ) {
          this.teamA.push(player);
          player.enteredMatchId = this.teamA[0].enteredMatchId;
          return true;
        }
      }
    }
    // FOR TEAM-A : IF LOWELO ~ HIGHELO < 150 THAN CHANGE THE LOW OR HIGHELO
    if (this.teamA.length === 5 && Math.abs(lowElo - highElo) < this.eloBound) {
      highElo = lowElo + this.eloBound;
    }
    //---------------- FOR TEAM-B ---------------
    // IF TEAM-B IS LESS THAN 5
    if (
      this.teamB.length < 5 &&
      player.elo <= highElo &&
      player.elo >= lowElo
    ) {
      // IF TEAM-B IS EMPTY
      if (this.teamB.length === 0) {
        this.teamB.push(player);
        player.enteredMatchId = this.teamA[0].enteredMatchId;
        return true;
      } else {
        this.teamB.map((p) => {
          return NaN;
        });

        this.teamB.push(player);
        player.enteredMatchId = this.teamA[0].enteredMatchId;
        // IF TEAM-B IS FULL WHICH MEANS 10 PALYER ADDED IN THE MATCH. NOW REMOVE THE MATCH FROM GAME QUEUE
        if (this.teamB.length === 5) {
          const allPlayer = this.teamA.concat(this.teamB);
          const dividedTeam = greedyPartitioning(allPlayer, 2);
          this.teamA = dividedTeam[0];
          this.teamB = dividedTeam[1];
          removeMatchFromQueue(this);
        }
        return true;
      }
    }
  }
}

//------------------------
// QUEUE CLASS
//------------------------
class Queue {
  constructor() {
    this.matches = [];
  }

  //------------------------
  // ADD PLAYER TO THE MATCH
  //------------------------
  addToMatch(player) {
    // IF QUEUE IS EMPTY
    if (this.matches.length === 0) {
      const newMatchId = createMatchId();
      const newMatch = new Match(newMatchId);
      newMatch.addPlayer(player, newMatchId);
      this.matches.push(newMatch);
    } else {
      let foundMatch = false;
      // CHECK ALL MATCHES WHERE PUSHED PALYER IS BELONGS TO
      for (var i = 0; i < this.matches.length; i++) {
        const added = this.matches[i].addPlayer(player);
        if (added) {
          foundMatch = true;
          break;
        }
      }
      // IF PUSHED PLAYER DOES NOT BELONG TO ANY MATCHES THAN CREATE A NEW MATCH FOR THIS PLAYER
      if (!foundMatch) {
        let newMatchId = checkDuplicateId(this.matches);
        const newMatch = new Match(newMatchId);
        newMatch.addPlayer(player, newMatchId);
        this.matches.push(newMatch);
      }
    }
  }

  //------------------------
  // REMOVE PLAYER FROM THE MATCH
  //------------------------
  removeFromMatch(player) {
    if (this.matches.length === 0) return false;
    // CHECK ALL THE MATCHES WHERE PLAYER IS ADDED AND REMOVE HIM FROM THAT MATCH
    for (var i = 0; i < this.matches.length; i++) {
      if (this.matches[i].matchId === player.enteredMatchId) {
        this.matches[i].teamA = this.matches[i].teamA.filter(
          (p) => p.id !== player.id
        );
        this.matches[i].teamB = this.matches[i].teamB.filter(
          (p) => p.id !== player.id
        );

        break;
      }
    }
  }
}

//------------------------
// FUNCTION FOR CREATE RANDOM ID FOR MATCHES
//------------------------
function createMatchId() {
  return Math.floor(100000 + Math.random() * 9000000000);
}

//------------------------
// FUNCTION TO RESTRICT DUPLICATE MATCH ID
//------------------------
function checkDuplicateId(matches) {
  let matchId = createMatchId();
  for (var i = 0; i < matches.length; i++) {
    if (matches[i].matchId === matchId) {
      checkDuplicateId(matches);
    }
  }
  return matchId;
}

//------------------------
// CREATING A NEW QUEUE WHEN GAME START
//------------------------
const newQueue = new Queue();

//------------------------
// CURRENTLY PLAYING MATCHES
//------------------------
let playingMatches = [];

//------------------------
// FUNCTION TO REMOVE MATCH FROM QUEUE WHEN A CURRENT MATCH IS BEING FULLED
//------------------------
function removeMatchFromQueue(match) {
  let matches = newQueue.matches.filter((m) => m.matchId !== match.matchId);
  newQueue.matches = matches;
  playingMatches.push(match);
}

//------------------------
// FUNCTION TO DIVIDE A ARRAY INTO TWO SUB-ARRAY SUCH THAT DIFFERENCE OF THEIR ELEMENTS SUM IS MINIMUM
//------------------------
function greedyPartitioning(array, numberOfSubsets) {
  const sorted = array.sort((a, b) => b.elo - a.elo); // sort descending

  const out = [...Array(numberOfSubsets)].map((x) => {
    return {
      sum: 0,
      elements: [],
    };
  });

  for (const elem of sorted) {
    const chosenSubset = out.sort((a, b) => a.sum - b.sum)[0];
    chosenSubset.elements.push(elem);
    chosenSubset.sum += elem.elo;
  }

  return out.map((subset) => subset.elements);
}

module.exports = {
  Player,
  Match,
  Queue,
  playingMatches,
};
