import React, { Component } from 'react';
import axios from 'axios';

class GameStart extends Component {
    constructor() {
        super();
        this.state = {
            playersHand: [],
            playersTotal: 0,
            dealersHand: [],
            dealersTotal: 0,
            dealersHiddenTotal: 0,
            dealersHiddenCard: [],
            roundOver: '',
            newGame: false,
        }
        this.hit = this.hit.bind(this);
        this.stay = this.stay.bind(this);
        this.newGame = this.newGame.bind(this);
        this.results = this.results.bind(this);
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
                        card.value = 'ACE (worth 11 points)'
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
                        if (this.state.playersHand[i].value === 'ACE (worth 11 points)') {
                            let newValue = this.state.playersHand;
                            newValue[i].value = 'ACE (worth 1 point)'
                            this.setState({
                                playersHand: newValue,
                                playersTotal: this.state.playersTotal - 10,
                            })
                        }
                    }
                }
            }).then((response) => {
                if (this.state.playersTotal > 21) {
                    this.setState({
                        roundOver: 'BUST!',
                        newGame: true,
                    })
                }
                if (this.state.playersTotal === 21) {
                    this.stay();
                }
            })
        }
    }

    stay() {
        if (this.state.roundOver !== 'BUST!') {
            if (this.state.dealersHiddenValue < 17 && this.state.playersTotal < 22) {
                if (this.state.dealersHand[0].points === 0) {
                    let revealedHand = [...this.state.dealersHand];
                    revealedHand[0].image = this.state.dealersHiddenCard;
                    revealedHand[0].points = +this.state.dealersHiddenValue;
                    this.setState({
                        dealersTotal: +this.state.dealersTotal + +this.state.dealersHiddenValue,
                    })
                }
                if (this.state.dealersHiddenTotal < 17) {
                    this.dealNewCard();
                } else {
                    let stayingHand = [...this.state.dealersHand];
                    this.setState({
                        dealersHand: stayingHand,
                    })
                    this.results();
                }
            }
        }
    }

    dealNewCard() {
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
                    card.value = 'ACE (worth 11 points)'
                } else (
                    card.points = card.value
                )
            });
            let newHand = [...this.state.dealersHand];
            const newCard = response.data.cards[0];
            newHand.push(newCard);
            this.setState({
                dealersHand: newHand,
                dealersTotal: this.state.dealersTotal + +response.data.cards[0].points,
            })
            if (this.state.dealersTotal > 21) {
                let i;
                for (i = 0; i < this.state.dealersHand.length; i = i + 1) {
                    if (this.state.dealersHand[i].value === 'ACE (worth 11 points)') {
                        let newValue = this.state.dealersHand;
                        newValue[i].value = 'ACE (worth 1 point)'
                        this.setState({
                            dealersHand: newValue,
                            dealersTotal: this.state.dealersTotal - 10,
                        })
                    }
                }
            }
        }).then((response) => {
            this.results();
        })
    }

    results() {
        if (this.state.dealersTotal < 17) {
            this.dealNewCard();
        } else if (this.state.dealersTotal > 21) {
            console.log('win')
            this.setState({
                roundOver: 'WIN!!!',
                newGame: true,
            })
        } else if (this.state.dealersTotal >= 17) {
            if (this.state.playersTotal > this.state.dealersTotal) {
                console.log('win')
                this.setState({
                    roundOver: 'WIN!!!',
                    newGame: true,
                })
            } else if (this.state.playersTotal < this.state.dealersTotal) {
                console.log('lose')
                this.setState({
                    roundOver: 'LOSE...',
                    newGame: true,
                })
            } else if (this.state.playersTotal === this.state.dealersTotal) {
                console.log('tie')
                this.setState({
                    roundOver: 'TIED.',
                    newGame: true,
                })
            }
        }
    }

    newGame() {
        this.setState({
            playersHand: [],
            playersTotal: 0,
            dealersHand: [],
            dealersTotal: 0,
            dealersHiddenTotal: 0,
            dealersHiddenCard: '',
            dealersHiddenValue: 0,
            roundOver: '',
            newGame: false,
        })

        axios({
            url: 'https://deckofcardsapi.com/api/deck/' + this.props.deck_id + '/draw/?count=4',
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
                dealersHiddenCard: response.data.cards[0].image,
                dealersHiddenValue: response.data.cards[0].points,
                dealersHiddenTotal: +response.data.cards[0].points + +response.data.cards[2].points
            })
            console.log(this.state.dealersHiddenValue)
            let playersStartingHand = [...this.state.playersHand];
            let dealersStartingHand = [...this.state.dealersHand];
            let firstCard = response.data.cards[0];
            firstCard.image = 'https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_1024x1024.png?v=1462119328';
            firstCard.points = 0;
            const secondCard = response.data.cards[1];
            const thirdCard = response.data.cards[2];
            const fourthCard = response.data.cards[3];
            dealersStartingHand.push(firstCard, thirdCard);
            playersStartingHand.push(secondCard, fourthCard);

            this.setState({ 
                playersHand: playersStartingHand,
                dealersHand: dealersStartingHand,
            });

            let i = 0;
            for (i = 0; i < this.state.playersHand.length; i = i + 1) {
                this.setState({
                    dealersTotal: response.data.cards[2].points,
                })
                this.setState({
                    playersTotal: this.state.playersTotal + +this.state.playersHand[i].points,
                })
                if (this.state.playersTotal > 21) {
                    let i;
                    for (i = 0; i < this.state.playersHand.length; i = i + 1) {
                        if (this.state.playersHand[i].points === '11') {
                            let newValue = this.state.playersHand;
                            newValue[i].value = 'ACE (worth 1 point)'
                            this.setState({
                                playersHand: newValue,
                                playersTotal: this.state.playersTotal - 10,
                            })
                        }
                        return;
                    }
                }
                if (this.state.dealersTotal > 21) {
                    let i;
                    for (i = 0; i < this.state.dealersHand.length; i = i + 1) {
                        if (this.state.dealersHand[i].points === '11') {
                            let newValue = this.state.dealersHand;
                            newValue[i].value = 'ACE (worth 1 point)'
                            this.setState({
                                dealersHand: newValue,
                                dealersTotal: this.state.dealersTotal - 10,
                            })
                        }
                        return;
                    }
                }
                if (this.state.playersTotal === 21) {
                    this.stay();
                }
            }
        });
    }

    componentDidMount() {
        this.newGame();
    }

    render() {
        return (
            <div>

                <section className='flex'>

                    <div>
                        <h2>Dealer's Hand</h2>

                        <section className='game'>
                            <div id='dealersPile'>
                                {this.state.dealersHand.map((card, i) => {
                                    return <img src={card.image} alt={`A ${card.value} of ${card.suit}`} key={card.code} />
                                })}
                                <h3>Points: {this.state.dealersTotal}</h3>
                            </div>
                        </section>
                    </div>


                    <div>
                        <h2>Player's Hand</h2>

                        <section className='game'>
                            <div id='playersPile'>

                                {this.state.playersHand.map((card, i) => {
                                    return <img src={card.image} alt={`A ${card.value} of ${card.suit}`} key={card.code} />
                                })}
                                <h3>Points: {this.state.playersTotal}</h3>

                                <button onClick={this.hit}>HIT</button>
                                <button onClick={this.stay}>STAY</button>

                            </div>
                        </section>
                    </div>

                </section>

                {this.state.newGame ? (<h1>YOU {this.state.roundOver}</h1>) : null}

                {this.state.newGame ? (<button onClick={this.newGame}>NEW GAME?</button>) : null}

            </div>
        );
    }
}
export default GameStart