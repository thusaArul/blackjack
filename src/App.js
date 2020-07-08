import React, { Component } from 'react';
import Main from './Main';
import GameStart from './GameStart';
import axios from 'axios';
import './App.css';

class App extends Component {

    constructor() {
        super();

        this.state = {
            hide: true,
            show: false,
            deck_id: '',
            cardsInPlay: [],
            deal: [],
            playerNum: 2,
            drawnCards: [],
            remaining: 0,
            shuffled: null,
            turn: 0,
            dealersHand: [],
            playersHand: [],
            dealersTotal: 0,
            playersTotal: 0,
            newCard: []
        }
        this.hit = this.hit.bind(this);
        // this.updatePlayersHand = this.updatePlayersHand.bind(this);
    }

    componentDidMount() {
        // axios call
        axios({
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            method: 'GET',
            responseType: 'JSON',
        }).then((cards) => {
            this.setState({
                cards: cards.data,
                deck_id: cards.data.deck_id
            });
            console.log(this.state.deck_id);
        });
    }

    changeComponent(name) {
        switch (name) {
            case 'hide': this.setState({ hide: this.setState.hide });
                break;
            case 'show': this.setState({ show: !this.setState.show });
                break;
            default: ;
        }
    }

    draw() {
        let numCards = this.state.playerNum * 2;

        axios({
            url: 'https://deckofcardsapi.com/api/deck/' + this.state.deck_id + '/draw/?count=' + numCards,
            method: 'GET',
            responseType: 'JSON',
        }).then((response) => {
            response.data.cards.forEach(card => {
                if (
                    card.value === 'JACK' ||
                    card.value === 'QUEEN' ||
                    card.value === 'KING'
                ) {
                    card.points = '10';
                } else if (card.value === 'ACE') {
                    card.points = '11';
                } else (
                    card.points = card.value
                )
            });
            this.setState({
                drawnCards: response.data.cards,
            });

            this.setState(this.setHands);
            this.totalValues();
        });
    }

    setHands(state) {
        return { ...state, dealersHand: [this.state.drawnCards[0], this.state.drawnCards[1]], playersHand: [this.state.drawnCards[2], this.state.drawnCards[3]] }
    }

    totalValues() {
        let i = 0;

        for (i = 0; i < this.state.dealersHand.length; i = i + 1) {
            this.state.dealersHand[i].points = +this.state.dealersHand[i].points;
            this.state.dealersTotal = this.state.dealersTotal + this.state.dealersHand[i].points;
        }
        console.log(this.state.dealersTotal)

        for (i = 0; i < this.state.playersHand.length; i = i + 1) {
            this.state.playersHand[i].points = +this.state.playersHand[i].points;
            this.state.playersTotal = this.state.playersTotal + this.state.playersHand[i].points;
        }
        console.log(this.state.playersTotal)

        this.setState(this.updateValues);

        if(this.state.dealersTotal === 21) {
            alert('You Lose!')
        } else if(this.state.playersTotal === 21) {
            alert('You Win!')
        } 
        // else {
        //     alert("Shame we can't go on")
        // }
    }

    updateValues(state) {
        return { ...state, playersTotal: this.state.playersTotal, dealersTotal: this.state.dealersTotal }
    }

    hit(deck_id, e) {
        // console.log(this.deck_id)
        // const oldHand = this.props.playersHand;
        axios({
            url: 'https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=1',
            method: 'GET',
            responseType: 'JSON',
        }).then((response) => {
            response.data.cards.forEach(card => {
                if (
                    card.value === 'JACK' ||
                    card.value === 'QUEEN' ||
                    card.value === 'KING'
                ) {
                    card.points = '10';
                } else if (card.value === 'ACE') {
                    card.points = '11';
                } else (
                    card.points = card.value
                )
            });
            this.newCard = response.data.cards[0];
            console.log(this.newCard);
            // this.addCardToHand(this.newCard)
        });
    }

    addCardToHand(card) {
        this.setState(({ playersHand }) => ({ playersHand: { ...playersHand, card } }));
    }

    render() {
        const { hide, show } = this.state;
        return (
            <div className="App">
                {/* on page load display title, rules, and start button */}
                {hide && <Main changeComponent={this.changeComponent} />}

                {hide && <button onClick={() => {
                    this.changeComponent('hide');
                    this.changeComponent('show');
                    this.draw();
                }}>
                    START GAME!
                    </button>}

                {show && <GameStart changeComponent={this.changeComponent} dealersHand={this.state.dealersHand} playersHand={this.state.playersHand} dealersTotal={this.state.dealersTotal} playersTotal={this.state.playersTotal} hit={this.hit} deck_id={this.state.deck_id} updatePlayersHand={this.updatePlayersHand} addCardToHand={this.addCardToHand}/>}

            </div>
        );
    }
}

export default App;
