import React, { Component } from 'react';

class GameStart extends Component {
    render() {
        return (
            <div>
                <div className='flex'>
                    <div id='dealersPile' className='piles'>
                        {this.props.dealersHand.map((card, i) => {
                            return <img src={card.image} alt={`A ${card.value} of ${card.suit}`} key={card.code} />
                        })}
                        <h3>Points: {this.props.dealersTotal}</h3>
                    </div>
                    <div id='playersPile' className='piles'>
                        {this.props.playersHand.map((card, i) => {
                            return <img src={card.image} alt={`A ${card.value} of ${card.suit}`} key={card.code} />
                        })}
                        <h3>Points: {this.props.playersTotal}</h3>
                    </div>
                </div>

                <button onClick={() => { this.props.hit(this.props.deck_id);
                // this.props.addCardtoHand(this.props.newCard);
                }}>HIT</button>
                <button>STAY</button>
            </div>
        );
    }
}
export default GameStart