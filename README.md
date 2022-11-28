# Match-Making Module

### Suported Features :

1. Dynamic match creation.
2. Add a player to a match based on their elo (between the range of 150).
3. If a player could not find a match based on their elo, this module will automatically create a new match with him.
4. Average elo difference between two teams of a match could not be more than 50 elo.
5. If a match gets populated with 10 players, the match will automatically be removed from a queue and will be added to the playing match array.
6. If A player dequeues, he will be removed from the match where he was added..

### For Test :

#### Install The Test Library :

```javascript
npm install mocha chai -D
```

#### Run Test:

```javascript
npm run test
```
