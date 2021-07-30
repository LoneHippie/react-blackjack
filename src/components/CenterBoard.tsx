import React from 'react';

import styles from './CenterBoard.module.scss';

interface Props {
    hit: (turn: any, ammount: number) => void;
    doubleDown: () => void;
    setStand: (turn: any) => void;
    isPlayerAtStand: boolean;
    gameMessage: string;
    switchToBettingPhase: () => void;
}

const CenterBoard: React.FC<Props> = ({ hit, doubleDown, setStand, isPlayerAtStand, gameMessage, switchToBettingPhase }) => {

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
                    aria-label="Hit for another card"
                    onClick={() => hit('player', 1)}
                >
                    Hit
                </button>

                <button
                    aria-label="Stand with current cards"
                    onClick={() => setStand('player')}
                >
                    Stand
                </button>

                <button
                    aria-label="Double down"
                    onClick={() => doubleDown()}
                >
                    Double Down
                </button>
            </div>

            {
                gameMessage.length ? (
                    <div className={styles.endgame}>

                        <div className={styles.message}>
                            {gameMessage}
                        </div>
                        
                        <button 
                            className={styles.play_again_prompt}
                            onClick={() => switchToBettingPhase()}
                        >
                            Play Again
                        </button>

                    </div>
                ) : null
            }

        </section>
    )
};

export default CenterBoard;