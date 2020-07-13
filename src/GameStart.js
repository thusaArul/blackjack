import React, { Component } from 'react';
import PlayersHand from './PlayersHand';
import DealersHand from './DealersHand';

class GameStart extends Component {
    constructor() {
        super();
        this.state = {
            playersHand: [],
        }
    }

    render() {
        return (
            <div>
                <section className='flex'>
                    <DealersHand deck_id={this.props.deck_id}/>
                    <PlayersHand deck_id={this.props.deck_id} playersHand={this.state.playersHand}/>
                </section>
            </div>
        );
    }
}
export default GameStart