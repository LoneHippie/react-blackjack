import React from 'react';

import styles from './CenterBoard.module.scss';

interface Props {
    hit: (turn: any, ammount: number) => void;
    doubleDown: () => void;
    setStand: (turn: any) => void;
    isPlayerAtStand: boolean;
    gameMessage: string;
}

const CenterBoard: React.FC<Props> = ({ hit, doubleDown, setStand, isPlayerAtStand, gameMessage }) => {

    return (
        <section className={styles.playarea}>
            
            <div className={styles.deck}>
                <div></div>
                <span></span>
            </div>

            <div 
                className={styles.buttons}
                style={{
                    opacity: isPlayerAtStand ? '0' : '1',
                    transform: isPlayerAtStand ? 'translate(-20rem, -50%)' : 'translate(0, -50%)',
                    transition: 'all 200ms'
                }}
            >
                <button
                    onClick={() => hit('player', 1)}
                >Hit</button>

                <button
                    onClick={() => setStand('player')}
                >Stand</button>

                <button
                    onClick={() => doubleDown()}
                >Double Down</button>
            </div>

            {
                gameMessage.length ? (
                    <div className={styles.message}>
                        {gameMessage}
                    </div>
                ) : null
            }

        </section>
    )
};

export default CenterBoard;