const assert = require("chai").assert;
const matchMaking = require("../matchMaking");

// A FULL MATCH CREATION AND PUSHED IT INSIDE PLAYING MATCHES. BESIDES, TESTING FOR ELO AND AVERAGE CONDITION TOO.
describe("A full match creation", () => {
  // CREATING A NEW QUEUE
  const newQueue = new matchMaking.Queue();

  // CREATING PLAYERS FOR TEST
  const player1 = new matchMaking.Player("mamun", 1000);
  const player2 = new matchMaking.Player("salam", 3000);
  const player3 = new matchMaking.Player("babu", 1050);
  const player4 = new matchMaking.Player("rafi", 3100);
  const player5 = new matchMaking.Player("apurbo", 900);
  const player6 = new matchMaking.Player("sarowar", 2000);
  const player7 = new matchMaking.Player("jobbar", 925);
  const player8 = new matchMaking.Player("arfin", 1000);
  const player9 = new matchMaking.Player("gittu", 1000);
  const player10 = new matchMaking.Player("ifty", 930);
  const player11 = new matchMaking.Player("siddique", 1010);
  const player12 = new matchMaking.Player("parvez", 925);
  const player13 = new matchMaking.Player("raihan", 1000);

  // ADD PLAYER IN THE QUEUE THAN AUTOMATICALLY TO A MATCH
  newQueue.addToMatch(player1);
  newQueue.addToMatch(player2);
  newQueue.addToMatch(player3);
  newQueue.addToMatch(player4);
  newQueue.addToMatch(player5);
  newQueue.addToMatch(player6);
  newQueue.addToMatch(player7);
  newQueue.addToMatch(player8);
  newQueue.addToMatch(player9);
  newQueue.addToMatch(player10);
  newQueue.addToMatch(player11);
  newQueue.addToMatch(player12);
  newQueue.addToMatch(player13);

  const enteredMatchId = newQueue.matches[0].matchId;
  const match = {
    matchId: enteredMatchId,
    teamA: [
      {
        id: "babu",
        elo: 1050,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "arfin",
        elo: 1000,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "raihan",
        elo: 1000,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "jobbar",
        elo: 925,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "apurbo",
        elo: 900,
        enteredMatchId: enteredMatchId,
      },
    ],
    teamB: [
      {
        id: "siddique",
        elo: 1010,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "mamun",
        elo: 1000,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "gittu",
        elo: 1000,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "ifty",
        elo: 930,
        enteredMatchId: enteredMatchId,
      },
      {
        id: "parvez",
        elo: 925,
        enteredMatchId: enteredMatchId,
      },
    ],
    eloBound: 150,
    expansionTime: 180000,
  };

  // IT
  it("adding 13 players to the queue and 10 of them should have started a match", () => {
    assert.deepEqual(matchMaking.playingMatches, [match]);
  });

  it("where elo difference between players can not be more than 150 and the difference of elo average between two teams should as low as possible which is 10 in this test case", () => {
    // CHECKING HIGHEST ELO DIFFERENCE BETWEEN PLAYERS OF A SINGLE MATCH

    let teamATotalElo = 0;
    let teamBTotalElo = 0;
    let teamALowest = matchMaking.playingMatches[0].teamA[0].elo;
    matchMaking.playingMatches[0].teamA.map((p) => {
      teamATotalElo += p.elo;
      if (p.elo < teamALowest) {
        teamALowest = p.elo;
      }
    });
    let teamAHighest = matchMaking.playingMatches[0].teamA[0].elo;
    matchMaking.playingMatches[0].teamA.map((p) => {
      if (p.elo > teamAHighest) teamAHighest = p.elo;
    });
    let teamBLowest = matchMaking.playingMatches[0].teamB[0].elo;
    matchMaking.playingMatches[0].teamB.map((p) => {
      teamBTotalElo += p.elo;
      if (p.elo < teamBLowest) {
        teamBLowest = p.elo;
      }
    });
    let teamADiff = teamAHighest - teamALowest;
    let teamBHighest = matchMaking.playingMatches[0].teamB[0].elo;
    matchMaking.playingMatches[0].teamB.map((p) => {
      if (p.elo > teamBHighest) teamBHighest = p.elo;
    });
    let teamBDiff = teamBHighest - teamBLowest;

    let teamAAvgElo = teamATotalElo / 5;
    let teamBAvgElo = teamBTotalElo / 5;

    eloAvgDiff = Math.abs(teamAAvgElo - teamBAvgElo);

    assert.isBelow(teamADiff, 151);
    assert.isBelow(teamBDiff, 151);
    assert.isBelow(eloAvgDiff, 11);
  });
});

describe("matchMaking start", () => {
  // TEST FOR NEW PLAYER CREATION
  it("player should have a id and elo points value when a player being created", () => {
    const player1 = new matchMaking.Player("manual", 1000);
    const expectedPlayer = {
      id: "manual",
      elo: 1000,
      enteredMatchId: null,
    };

    assert.deepEqual(player1, expectedPlayer);
  });

  // TEST FOR NEW QUEUE CREATION
  it("a new queue should and only have a empty matches array", () => {
    const newQueue = new matchMaking.Queue();

    assert.deepEqual(newQueue, { matches: [] });
  });

  // TEST FOR ADDING PLAYER TO THE EMPTY QUEUE
  it("after adding a player with addToMatch the matches of Queue should have created a new entry", () => {
    const newQueue = new matchMaking.Queue();
    const player1 = new matchMaking.Player("manual", 1000);
    newQueue.addToMatch(player1);
    const enteredMatchId = newQueue.matches[0].matchId;

    assert.deepEqual(newQueue, {
      matches: [
        {
          matchId: enteredMatchId,
          teamA: [{ id: "manual", elo: 1000, enteredMatchId: enteredMatchId }],
          teamB: [],
          eloBound: 150,
          expansionTime: 180000,
        },
      ],
    });

    // ADDING 2ND PLAYER
    // -----------------
    describe("adding 2nd player in queue", () => {
      // TEST FOR ADDING PLAYER TO AN EXISTING MATCH BASED ON ELO
      it("after adding player2 - if player2 elo is inside the range of 150 from player1, it should ended up with a match where player1 exist", () => {
        const player1 = new matchMaking.Player("manual-2", 1050);
        newQueue.addToMatch(player1);

        assert.deepEqual(newQueue, {
          matches: [
            {
              matchId: enteredMatchId,
              teamA: [
                { id: "manual", elo: 1000, enteredMatchId: enteredMatchId },
                { id: "manual-2", elo: 1050, enteredMatchId: enteredMatchId },
              ],
              teamB: [],
              eloBound: 150,
              expansionTime: 180000,
            },
          ],
        });

        // ADDING 3RD PLAYER
        // -----------------
        describe("adding 3rd player in queue", () => {
          it("after adding player3 - if player3 elo is more than the range of 150 from match1 elo than it should ended up with a new match", () => {
            const player3 = new matchMaking.Player("manual-3", 3000);
            newQueue.addToMatch(player3);
            const enteredMatch2Id = newQueue.matches[1].matchId;

            assert.deepEqual(newQueue, {
              matches: [
                {
                  matchId: enteredMatchId,
                  teamA: [
                    { id: "manual", elo: 1000, enteredMatchId: enteredMatchId },
                    {
                      id: "manual-2",
                      elo: 1050,
                      enteredMatchId: enteredMatchId,
                    },
                  ],
                  teamB: [],
                  eloBound: 150,
                  expansionTime: 180000,
                },
                {
                  matchId: enteredMatch2Id,
                  teamA: [
                    {
                      id: "manual-3",
                      elo: 3000,
                      enteredMatchId: enteredMatch2Id,
                    },
                  ],
                  teamB: [],
                  eloBound: 150,
                  expansionTime: 180000,
                },
              ],
            });

            // ADDING 4TH, 5TH, 6TH, 7TH, 8TH AND 9TH PLAYER
            // ----------------------------------------------
            describe("adding 4th, 5th, 6th, 7th , 8th and 9th player in queue", () => {
              it("after adding player 4th, 5th, 6th, 7th , 8th and 9th - if players elos are inside the range of a specific match, it should ended up with a match and add player to teamA and then teamB", () => {
                const player4 = new matchMaking.Player("manual-4", 925);
                const player5 = new matchMaking.Player("manual-5", 980);
                const player6 = new matchMaking.Player("manual-6", 1075);
                const player7 = new matchMaking.Player("manual-7", 1025);
                const player8 = new matchMaking.Player("manual-8", 1200);
                const player9 = new matchMaking.Player("manual-9", 1010);
                newQueue.addToMatch(player4);
                newQueue.addToMatch(player5);
                newQueue.addToMatch(player6);
                newQueue.addToMatch(player7);
                newQueue.addToMatch(player8);
                newQueue.addToMatch(player9);
                const enteredMatchId = newQueue.matches[0].matchId;
                const enteredMatch3Id = newQueue.matches[2].matchId;

                assert.deepEqual(newQueue, {
                  matches: [
                    {
                      matchId: enteredMatchId,
                      teamA: [
                        {
                          id: "manual",
                          elo: 1000,
                          enteredMatchId: enteredMatchId,
                        },
                        {
                          id: "manual-2",
                          elo: 1050,
                          enteredMatchId: enteredMatchId,
                        },
                        {
                          id: "manual-4",
                          elo: 925,
                          enteredMatchId: enteredMatchId,
                        },
                        {
                          id: "manual-5",
                          elo: 980,
                          enteredMatchId: enteredMatchId,
                        },
                        {
                          id: "manual-6",
                          elo: 1075,
                          enteredMatchId: enteredMatchId,
                        },
                      ],
                      teamB: [
                        {
                          id: "manual-7",
                          elo: 1025,
                          enteredMatchId: enteredMatchId,
                        },
                        {
                          id: "manual-9",
                          elo: 1010,
                          enteredMatchId: enteredMatchId,
                        },
                      ],
                      eloBound: 150,
                      expansionTime: 180000,
                    },
                    {
                      matchId: enteredMatch2Id,
                      teamA: [
                        {
                          id: "manual-3",
                          elo: 3000,
                          enteredMatchId: enteredMatch2Id,
                        },
                      ],
                      teamB: [],
                      eloBound: 150,
                      expansionTime: 180000,
                    },
                    {
                      matchId: enteredMatch3Id,
                      teamA: [
                        {
                          id: "manual-8",
                          elo: 1200,
                          enteredMatchId: enteredMatch3Id,
                        },
                      ],
                      teamB: [],
                      eloBound: 150,
                      expansionTime: 180000,
                    },
                  ],
                });
              });
            });
            // ELO CHANGING TEST
            eloChangeTest();
          });
        });
      });
    });
  });
});

// elo changing test
function eloChangeTest() {
  describe("changing elo blound after three minutes", () => {
    before(function (done) {
      this.timeout(180100); // A very long environment setup.
      setTimeout(done, 180000);
    });
    const newQueue = new matchMaking.Queue();
    const player1 = new matchMaking.Player("manual", 1000);
    newQueue.addToMatch(player1);
    const enteredMatchId = newQueue.matches[0].matchId;
    it("after a match creation, if it did not become full with players it should have change the elo bound to current elo +- 100", (done) => {
      assert.deepEqual(newQueue, {
        matches: [
          {
            matchId: enteredMatchId,
            teamA: [
              { id: "manual", elo: 1000, enteredMatchId: enteredMatchId },
            ],
            teamB: [],
            eloBound: 250,
            expansionTime: 180000,
          },
        ],
      });
      done();
    });
  });
}
