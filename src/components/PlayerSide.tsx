import React from 'react';

import Cards from './Cards';

import styles from './PlayerSide.module.scss';

interface Props {
    playerHand: any[];
    playerHandValue: number;
    isPlayerAtStand: boolean;
}

const PlayerSide: React.FC<Props> = ({ playerHand, playerHandValue, isPlayerAtStand }) => {

    return (
        <section className={styles.playarea}>

            <div 
                className={styles.points}
                style={{
                    color: isPlayerAtStand ? 'red' : '#EEEEEE',
                    transition: 'color 500ms'
                }}
            >
                {playerHandValue > 0 ? playerHandValue : ''}
            </div>
            
            <Cards 
                cards={playerHand}
            />

        </section>
    )
};

export default PlayerSide;