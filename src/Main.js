import React, { Component } from 'react';

class Main extends Component {
    render() {
        return (
            <div>
                <h1>Let's Play some BLACKJACK</h1>
                <h2>RULES</h2>
                <p className='rules'>
                    1. Whomever gets closer to 21 points without going over wins the game. <br></br>
                    2. Face cards are worth 10 points, Ace can be either 1 point or 11 points as per player's preference, numbered cards are worth their number. <br></br>
                    3. If you win you get money equivalent to how much you bet.
                </p>
            </div>
        );
    }
}

export default Main