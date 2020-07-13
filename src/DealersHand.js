import React, { Component } from 'react';
import axios from 'axios';

class DealersHand extends Component {
    constructor() {
        super();
        this.state = {
            dealersHand: [],
            dealersTotal: 0,
        }
    }

    componentDidMount() {
        axios({
            url: 'https://deckofcardsapi.com/api/deck/' + this.props.deck_id + '/draw/?count=2',
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
                dealersHand: response.data.cards,
            });
            let i;
            for (i = 0; i <this.state.dealersHand.length; i = i + 1) {
                this.setState ({
                    dealersTotal: this.state.dealersTotal + +this.state.dealersHand[i].points
                })
            }
        });
    }

    render() {
        return (
            <div>
                <h1>Dealer's Hand</h1>

                <section className='game'>
                    <div id='dealersPile'>
                        {this.state.dealersHand.map((card, i) => {
                            return <img src={card.image} alt={`A ${card.value} of ${card.suit}`} key={card.code} />
                        })}
                        <h3>Points: {this.state.dealersTotal}</h3>
                    </div>
                </section>
            </div>
        );
    }
}

export default DealersHand;
