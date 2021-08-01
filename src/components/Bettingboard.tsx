import React from 'react';

import Arrow from '../images/arrow.svg';

import styles from './Bettingboard.module.scss';

interface Props {
    switchToGamePhase: () => void;
    bet: number;
    increaseBet: () => void;
    decreaseBet: () => void;
    totalMoney: number;
}

const Bettingboard: React.FC<Props> = ({ switchToGamePhase, bet, increaseBet, decreaseBet, totalMoney }) => {

    return (
        <div className={styles.betting_board}>

            <h1>React Blackjack</h1>

            <p>-Dealer stands at 17-</p>

            <div className={styles.money}>

                <h2>Your Total Money</h2>

                <div>{totalMoney}</div>

            </div>

            <div className={styles.betting}>

                <h2>Your bet</h2>

                <div className={styles.betting_ui}>

                    <div className={styles.bet_number}>
                        {bet}
                    </div>

                    <div className={styles.bet_input}>
                        <button
                            onClick={() => increaseBet()}
                        >
                            <img 
                                src={Arrow}
                                style={{
                                    transform: 'rotate(180deg)',
                                    opacity: bet === totalMoney ? '0.5' : '1',
                                    cursor: bet === totalMoney ? 'default' : 'pointer'
                                }}
                                aria-label="Increase bet"
                                alt="increase bet"
                            />
                        </button>

                        <button
                            onClick={() => decreaseBet()}
                        >
                            <img 
                                src={Arrow}
                                style={{
                                    transform: 'rotate(0deg)',
                                    opacity: bet <= 0 ? '0.5' : '1',
                                    cursor: bet <= 0 ? 'default' : 'pointer'
                                }}
                                aria-label="Decrease bet"
                                alt="decrease bet"
                            />
                        </button>
                    </div>

                </div>

            </div>

            <button 
                className={styles.start_button}
                style={{
                    opacity: bet <= 0 ? '0.5' : '1',
                    cursor: bet <= 0 ? 'default' : 'pointer'
                }}
                onClick={() => switchToGamePhase()}
            >
                Play
            </button>

        </div>
    )
};

export default Bettingboard;