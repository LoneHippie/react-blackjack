import React from 'react';

import Cards from './Cards';

import styles from './PlayerSide.module.scss';

interface Props {
    playerHand: any[];
    playerHandValue: number;
    isPlayerAtStand: boolean;
    totalMoney: number;
    bet: number;
}

const PlayerSide: React.FC<Props> = ({ playerHand, playerHandValue, isPlayerAtStand, totalMoney, bet }) => {

    return (
        <section className={styles.playarea}>

            <div 
                className={styles.points}
                style={{
                    color: isPlayerAtStand ? '#000000' : '#EEEEEE',
                    transition: 'color 500ms'
                }}
            >
                {playerHandValue > 0 ? playerHandValue : ''}
            </div>
            
            <Cards 
                cards={playerHand}
            />

            <div className={styles.money_info}>
                <div>Your Bet</div>
                <span>{bet}</span>
                <div>Your Total</div>
                <span>{totalMoney}</span>
            </div>

        </section>
    )
};

export default PlayerSide;