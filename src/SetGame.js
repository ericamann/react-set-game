import React from "react";
import "./SetGame.scss";
import * as _ from "lodash";

import cards from "./cards.json";

function SetCard(props) {
  let shapes = Array(props.value.count).fill(null);
  const shapeDom = shapes.map((index, value) => {
    return (
      // TODO need key
      <div className="card-item" />
    );
  });

  let selectedClassName = props.value.selected ? "selected" : "";

  return (
    <div
      className={`card ${selectedClassName} ${props.value.color} ${
        props.value.shape
      } ${props.value.fill}`}
      onClick={props.onClick}
    >
      {shapeDom}
    </div>
  );
}

class SetBoard extends React.Component {
  renderCard(i) {
    return (
      <SetCard
        value={this.props.cards[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderCard(0)}
          {this.renderCard(1)}
          {this.renderCard(2)}
        </div>
        <div className="board-row">
          {this.renderCard(3)}
          {this.renderCard(4)}
          {this.renderCard(5)}
        </div>
        <div className="board-row">
          {this.renderCard(6)}
          {this.renderCard(7)}
          {this.renderCard(8)}
        </div>
        <div className="board-row">
          {this.renderCard(9)}
          {this.renderCard(10)}
          {this.renderCard(11)}
        </div>
      </div>
    );
  }
}

class SetGame extends React.Component {
  constructor(props) {
    super(props);

    let board = [];
    let deck = this.drawCards(12, board, cards);
    this.state = {
      deck: deck,
      board: board,
      completedSets: 0
    };
  }

  _getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  drawCards(count, board, initialDeck) {
    let newDeck = [...initialDeck];
    for (let i = 0; i < count; i++) {
      let randomIndex = this._getRandomNumber(0, newDeck.length - 1);
      board.push({ ...newDeck[randomIndex], selected: false });
      newDeck.splice(randomIndex, 1);
    }
    return newDeck;
  }

  handleClick(i) {
    let newBoard = this.state.board;
    newBoard[i].selected = !newBoard[i].selected;
    this.setState({
      board: newBoard
    });

    let selectedCards = _.filter(this.state.board, "selected");
    if (selectedCards.length === 3) {
      if (this.checkSet(selectedCards)) {
        this.setState({
          completedSets: this.state.completedSets + 1
        });

        // Remove selected cards
        let newBoard = this.state.board;
        _.remove(newBoard, (card) => card.selected);

        // Draw three more cards
        let newDeck = this.drawCards(3, newBoard, this.state.deck);
        this.setState({
          board: newBoard,
          deck: newDeck
        });
      } else {
        let newBoard = this.state.board;
        newBoard.forEach(card => (card.selected = false));
        this.setState({
          board: newBoard
        });
      }
      this.setState({
        selectedCards: []
      });
    } else {
    }
  }

  _allEqual(values) {
    if (
      values[0] === values[1] &&
      values[1] === values[2] &&
      values[0] === values[2]
    ) {
      return true;
    }
    return false;
  }

  _allUnequal(values) {
    if (
      values[0] !== values[1] &&
      values[1] !== values[2] &&
      values[0] !== values[2]
    ) {
      return true;
    }
    return false;
  }

  checkSet(selectedCards) {
    // Color
    let colors = _.map(selectedCards, "color");
    if (!(this._allEqual(colors) || this._allUnequal(colors))) {
      return false;
    }

    // Shape
    let shapes = _.map(selectedCards, "shape");
    if (!(this._allEqual(shapes) || this._allUnequal(shapes))) {
      return false;
    }

    // Fill
    let fills = _.map(selectedCards, "fill");
    if (!(this._allEqual(fills) || this._allUnequal(fills))) {
      return false;
    }

    // Count
    let counts = _.map(selectedCards, "count");
    if (!(this._allEqual(counts) || this._allUnequal(counts))) {
      return false;
    }

    return true;
  }

  shuffleCards() {
    // Put the board back into the deck
    let fullDeck = this.state.deck.concat(this.state.board);
    let board = [];

    // Draw 12 new cards
    fullDeck = this.drawCards(12, board, fullDeck);
    this.setState({
      deck: fullDeck,
      board: board,
      completedSets: 0
    });
  }

  render() {
    return (
      <div className="game">
        <div>
          <span>Sets Found: {this.state.completedSets}</span>
          <span>Cards Left: {this.state.deck.length}</span>
          <span><button onClick={() => this.shuffleCards()}>Shuffle Cards</button></span>
        </div>
        <SetBoard cards={this.state.board} onClick={i => this.handleClick(i)} />
      </div>
    );
  }
}

export default SetGame;
