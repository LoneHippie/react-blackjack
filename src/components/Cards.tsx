import React from 'react';

import Hearts from '../images/hearts.svg';
import Diamonds from '../images/diamonds.svg';
import Spades from '../images/spades.svg';
import Clubs from '../images/clubs.svg';

import styles from './Cards.module.scss';

interface Props {
    cards: Array<any>;
    isDealer?: boolean;
    isPlayerAtStand?: boolean;
}

const Hand: React.FC<Props> = ({ cards, isDealer, isPlayerAtStand }) => {

    const displayCards = () => {
        if (!cards?.length) { return <></> };

        const getSuit = (suit: string) => {
            if (suit === 'Hearts') {
                return Hearts;
            } else if (suit === 'Diamonds') {
                return Diamonds;
            } else if (suit === 'Spades') {
                return Spades;
            } else if (suit === 'Clubs') {
                return Clubs;
            }
        };

        const hand = cards.map((el, index) => {
            if (isDealer && index === 1) { //hole card
                return (
                    <div 
                        className={styles.card}
                        style={{
                            transform: `translateX(${index * 2 * -1}rem)`,
                            zIndex: index
                        }} 
                        key={`card-${index}-${el.name}`}
                    >
                        {
                            isPlayerAtStand ? ( //revealed card
                                <>
                                    <div className={styles.valueTop}>{el.name === '10' ? el.name : el.name.charAt(0)}</div>
                                    <img 
                                        className={styles.suit}
                                        src={getSuit(el.suit)}
                                        aria-hidden="true"
                                        alt=""
                                    />
                                    <div className={styles.valueBottom}>{el.name === '10' ? el.name : el.name.charAt(0)}</div>
                                </>
                            ) : ( //flipped down card
                                <>
                                    <div className={styles.hidden_border}></div>
                                    <span className={styles.hidden_center}></span>
                                </>
                            )
                        }
                    </div>
                )
            } else { //normal card
                return (
                    <div 
                        className={styles.card}
                        style={{
                            transform: `translateX(${index * 2 * -1}rem)`,
                            zIndex: index
                        }} 
                        key={`card-${index}-${el.name}`}
                    >
                        <div className={styles.valueTop}>{el.name === '10' ? el.name : el.name.charAt(0)}</div>
                        <img 
                            className={styles.suit}
                            src={getSuit(el.suit)}
                            aria-hidden="true"
                            alt=""
                        />
                        <div className={styles.valueBottom}>{el.name === '10' ? el.name : el.name.charAt(0)}</div>
                    </div>
                )
            }
        });

        return hand;
    };

    return (
        <div className={styles.hand}>
            {displayCards()}
        </div>
    )
};

export default Hand;