import React, { useState, useEffect } from 'react';

import DealerSide from './DealerSide';
import CenterBoard from './CenterBoard';
import PlayerSide from './PlayerSide';

import { Deck, Hand } from '../application/Deck';

import styles from './Gameboard.module.scss';

//isAtStand one state update behind. Maybe try useEffect to run isAtStand on handValue changes

const Gameboard: React.FC<{}> = () => {

    const [ totalMoney, setTotalMoney ] = useState<number>(200);
    const [ bet, setBet ] = useState<number>(0);

    const [ isFirstDeal, setIsFirstDeal ] = useState<boolean>(true);

    const [ dealerHand, setDealerHand ] = useState<any[]>([]);
    const [ dealerHandValue, setDealerHandValue ] = useState<number>(0);
    const [ isDealerAtStand, setIsDealerAtStand ] = useState<boolean>(false);

    const [ playerHand, setPlayerHand ] = useState<any[]>([]);
    const [ playerHandValue, setPlayerHandValue ] = useState<number>(0);
    const [ isPlayerAtStand, setIsPlayerAtStand ] = useState<boolean>(false);

    const [ gameMessage, setGameMessage ] = useState<string>('');

    const game = new Deck();
    const player = new Hand();
    const dealer = new Hand();

    game.initialize();

    const gameLogic = {
        globals: {
            playerStand: 21,
            dealerStand: 17
        },
        dealCard: (turn: any, ammount: number): void => { //updates hand
            if (turn === 'player') {
                player.draw(game.dealCards(ammount));

                setPlayerHand(prevState => {
                    return prevState.concat(player.hand);
                });
            }
            if (turn === 'dealer') {
                dealer.draw(game.dealCards(ammount));

                setDealerHand(prevState => {
                    return prevState.concat(dealer.hand);
                });
            }
        },
        calcHandValue: (turn: any): void => { //updates hand value
            if (turn === 'player') {
                setPlayerHandValue(prevState => {
                    let val: number = player.handValue + prevState; //current value post draw
        
                    const hasAce: boolean = player.hand.some(el => el.name === 'Ace');
        
                    if (hasAce && val > 21) { val = val - 10; }
        
                    return val;
                });
            }
            if (turn === 'dealer') {
                setDealerHandValue(prevState => {
                    let val: number = dealer.handValue + prevState; //current value post draw
        
                    const hasAce: boolean = dealer.hand.some(el => el.name === 'Ace');
        
                    if (hasAce && val > 21) { val = val - 10; }
        
                    return val;
                });
            }
        },
        isAtStand: (turn: any): boolean => { //checks hand value for stand
            if (turn === 'player' && playerHandValue >= gameLogic.globals.playerStand) {
                return true;
            }
            if (turn === 'dealer' && dealerHandValue >= gameLogic.globals.dealerStand) {
                return true;
            }
            return false;
        },
        setStand: (turn: any): void => {
            if (turn === 'player') {
                setIsPlayerAtStand(true);
            }
            if (turn === 'dealer') {
                setIsDealerAtStand(true);
            }
        },
        hit: async(turn: any, ammount: number) => {
            if (turn === 'player') {
                await gameLogic.wait(120);
                gameLogic.dealCard('player', ammount);
                gameLogic.calcHandValue('player');
            }
            if (turn === 'dealer') {
                await gameLogic.wait(120);
                gameLogic.dealCard('dealer', ammount);
                gameLogic.calcHandValue('dealer');
            }
        },
        doubleDown: (): void => {
            setBet(prevState => {
                return prevState * 2;
            });
            gameLogic.dealCard('player', 1);
            gameLogic.calcHandValue('player');
            gameLogic.setStand('player');
        },
        dealerHitToStand: (): any => {
            if (isDealerAtStand) { return }

            gameLogic.hit('dealer', 1);

            return gameLogic.dealerHitToStand();
        },
        checkWinner: (): any => {
            let dealerBust: boolean = dealerHandValue > 21 ? true : false;
            let playerBust: boolean = playerHandValue > 21 ? true : false;

            switch(true) {
                case dealerBust && playerBust:
                    if (dealerHandValue > playerHandValue) {
                        setGameMessage('Dealer bust, you win!');
                    } else if (dealerHandValue < playerHandValue) {
                        setGameMessage('Bust, you lose');
                    } else {
                        setGameMessage('Draw');
                    }
                    break;
                case dealerBust && !playerBust:
                    setGameMessage('Dealer bust, you win!');
                    break;
                case !dealerBust && playerBust:
                    setGameMessage('Bust, you lose');
                    break;
                case !dealerBust && !playerBust:
                    if (dealerHandValue < playerHandValue) {
                        setGameMessage('You win!');
                        break;
                    } else if (dealerHandValue > playerHandValue) {
                        setGameMessage('You lose');
                        break;
                    } else {
                        setGameMessage('Draw');
                        break;
                    }
                default:
                    setGameMessage('could not determine winner');
                    return;
            }
        },
        wait: async (ms: number) => new Promise(res => setTimeout(res, ms))
    };

    //initial deal
    useEffect(() => {
        gameLogic.hit('player', 2);
        gameLogic.hit('dealer', 2);
    }, []);

    //check on player hit for stand
    useEffect(() => {
        if (gameLogic.isAtStand('player')) {
            gameLogic.setStand('player');
        }
    }, [playerHandValue]);

    //recursive check on dealer hit till stand
    useEffect(() => {
        if (isPlayerAtStand) {
            if (gameLogic.isAtStand('dealer')) {
                gameLogic.setStand('dealer');
                return gameLogic.checkWinner();
            }
            gameLogic.hit('dealer', 1);
        }
    }, [dealerHandValue, isPlayerAtStand]);

    return (
        <div className={styles.board}>

            <DealerSide 
                dealerHand={dealerHand}
                dealerHandValue={dealerHandValue}
                isDealerAtStand={isDealerAtStand}
                isPlayerAtStand={isPlayerAtStand}
            />

            <CenterBoard 
                hit={gameLogic.hit}
                doubleDown={gameLogic.doubleDown}
                setStand={gameLogic.setStand}
                isPlayerAtStand={isPlayerAtStand}
                gameMessage={gameMessage}
            />

            <PlayerSide 
                playerHand={playerHand}
                playerHandValue={playerHandValue}
                isPlayerAtStand={isPlayerAtStand}
            />

        </div>
    )
};

export default Gameboard;