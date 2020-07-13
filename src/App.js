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
            // cardsInPlay: [],
            // deal: [],
            // playerNum: 2,
            // drawnCards: [],
            // remaining: 0,
            // shuffled: null,
            // turn: 0,
            // dealersHand: [],
            // playersHand: [],
            // dealersTotal: 0,
            // playersTotal: 0,
            // newCard: []
        }
        this.hideNow = this.hideNow.bind(this);
        // this.hit = this.hit.bind(this);
        // this.updatePlayersHand = this.updatePlayersHand.bind(this);
    }

    hideNow() {
        this.setState({
            hide: false,
            show: true,
        })
    }

    componentDidMount() {
        axios({
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            method: 'GET',
            responseType: 'JSON',
        }).then((cards) => {
            this.setState({
                cards: cards.data,
                deck_id: cards.data.deck_id
            });
        });
    }

    render() {
        return (
            <div className="App">

                {this.state.hide ? <Main changeComponent={this.changeComponent} /> : null}

                {this.state.hide ? (<button onClick={this.hideNow}>START GAME!</button>) : null}

                {this.state.show ? <GameStart deck_id={this.state.deck_id}/> : null}


            </div>
        );
    }
}

export default App;
