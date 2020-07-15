import React, { Component } from 'react';
import axios from 'axios';

class PlayersHand extends Component {
    constructor() {
        super();
        this.state = {
            playersHand: [],
            playersTotal: 0,
            bust: false,
        }
        this.hit = this.hit.bind(this);
    }

    hit() {
        if (this.state.playersTotal < 21) {
            axios({
                url: 'https://deckofcardsapi.com/api/deck/' + this.props.deck_id + '/draw/?count=1',
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
                let newHand = [...this.state.playersHand];
                const newCard = response.data.cards[0];
                newHand.push(newCard)
                this.setState({
                    playersHand: newHand,
                    playersTotal: this.state.playersTotal + +response.data.cards[0].points
                })
                if (this.state.playersTotal > 21) {
                    let i;
                    for (i = 0; i < this.state.playersHand.length; i = i + 1) {
                        if (this.state.playersHand[i].value === 'ACE') {
                            let newValue = this.state.playersHand;
                            newValue[i].value = 'ACE(worth 1 point)'
                            this.setState({
                                playersHand: this.newValue,
                                playersTotal: this.state.playersTotal - 10,
                            })
                        }
                    }
                }
            }).then((response) => {
                if (this.state.playersTotal > 21) {
                    this.setState({
                        bust: true,
                    })
                }
                if (this.state.playersTotal === 21) {
                    this.stay();
                }
            })
        }
    }

    stay() {
        console.log('dealers turn')
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
                playersHand: response.data.cards,
            });
            let i;
            for (i = 0; i < this.state.playersHand.length; i = i + 1) {
                this.setState({
                    playersTotal: this.state.playersTotal + +this.state.playersHand[i].points
                })
                if (this.state.playersTotal > 21) {
                    let i;
                    for (i = 0; i < this.state.playersHand.length; i = i + 1) {
                        if (this.state.playersHand[i].points === '11') {
                            this.setState({
                                playersTotal: this.state.playersTotal - 10,
                            })
                        }
                        return;
                    }
                }
                if (this.state.playersTotal === 21) {
                    this.stay()
                }
            }
        });
    }

    render() {
        return (
            <div>
                <h1>Player's Hand</h1>

                <section className='game'>
                    <div id='playersPile'>

                        {this.state.playersHand.map((card, i) => {
                            return <img src={card.image} alt={`A ${card.value} of ${card.suit}`} key={card.code} />
                        })}
                        <h3>Points: {this.state.playersTotal}</h3>

                        <button onClick={this.hit}>HIT</button>
                        <button>STAY</button>

                        {this.state.bust ? <h4>YOU BUST!!!</h4> : null}

                    </div>
                </section>
            </div>
        );
    }
}

export default PlayersHand;
