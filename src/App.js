import { Component } from 'react';
import './App.css';

import shuffle from 'lodash.shuffle'

import Card from './Card';
import GuessCount from './GuessCount';
import HallOfFame, { FAKE_HOF } from './HallOfFame';
import HighScoreInput from './HighScoreInput'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS= 750

class App extends Component {
  // ETAT LOCAL
  state = {
    cards : this.generateCards(),
    currentPair: [],
    guesses: 0,
    matchedCardIndices: [],
    hallOfFame: null,
  }

  //binding this  MAJ
  displayHallOfFame = hallOfFame =>{
    this.setState({hallOfFame})
  }

  cards = this.generateCards()

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    // maj du state avec un maj avancé NEWPAIR NEWGUESSES
    this.setState({ currentPair: newPair, guesses: newGuesses })
    if (matched) {

      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }

  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }
  
    // Arrow fx for binding
  handleCardClick = index => {
    const { currentPair } = this.state

    if (currentPair.length === 2) {
      return
    }

    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)
  
    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }
  
    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }
  
    return indexMatched ? 'visible' : 'hidden'
  }


  render() {

    const { cards, guesses, hallOfFame, matchedCardIndices} = this.state
    //const won = matchedCardIndices.length === cards.length
    //pour les test win avec 2 paire
    const won = matchedCardIndices.length === 2

    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        
        {cards.map((card, index)=>(
          <Card card={card} 
                feedback={ this.getFeedbackForCard(index)} 
                onClick={ this.handleCardClick} 
                index = {index}
                key={index}
                />
        ))}

        {won && (hallOfFame ? <HallOfFame  entries={hallOfFame} />:
        <HighScoreInput 
          guesses={guesses} 
          onStored={this.displayHallOfFame}/>
         )   }
        
        
      </div>
    )
  }
}

export default App;
