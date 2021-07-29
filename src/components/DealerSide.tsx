import React from 'react';

import Cards from './Cards';

import styles from './DealerSide.module.scss';

interface Props {
    dealerHand: any[];
    dealerHandValue: number;
    isDealerAtStand: boolean;
    isPlayerAtStand: boolean;
}

const DealerSide: React.FC<Props> = ({ dealerHand, dealerHandValue, isDealerAtStand, isPlayerAtStand }) => {

    return (
        <section className={styles.playarea}>
            
            <div 
                className={styles.points}
                style={{
                    color: isDealerAtStand ? 'red' : '#EEEEEE',
                    transition: 'color 500ms'
                }}
            >
                {isPlayerAtStand ? dealerHandValue : ''}
            </div>

            <Cards 
                cards={dealerHand}
                isDealer={true}
                isPlayerAtStand={isPlayerAtStand}
            />

        </section>
    )
};

export default DealerSide;