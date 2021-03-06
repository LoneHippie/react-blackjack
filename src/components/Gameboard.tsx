import React, { useState, useEffect } from 'react';

import DealerSide from './DealerSide';
import CenterBoard from './CenterBoard';
import PlayerSide from './PlayerSide';

import { Deck, Hand } from '../application/Deck';

// import styles from './Gameboard.module.scss';

interface Props {
    switchToBettingPhase: () => void;
    totalMoney: number;
    setTotalMoney: (money: number) => any;
    bet: number;
    setBet: (money: number) => any;
    doubleBet: () => void;
}

const Gameboard: React.FC<Props> = ({ switchToBettingPhase, setTotalMoney, totalMoney, setBet, bet, doubleBet }) => {

    const [ dealerHand, setDealerHand ] = useState<any[]>([]);
    const [ dealerHandValue, setDealerHandValue ] = useState<number>(0);
    const [ isDealerAtStand, setIsDealerAtStand ] = useState<boolean>(false);

    const [ playerHand, setPlayerHand ] = useState<any[]>([]);
    const [ playerHandValue, setPlayerHandValue ] = useState<number>(0);
    const [ isPlayerAtStand, setIsPlayerAtStand ] = useState<boolean>(false);

    const [ gameMessage, setGameMessage ] = useState<string>('');

    let game = new Deck();
    let player = new Hand();
    let dealer = new Hand();

    game.initialize();

    //all different win condition affects on totalMoney state
    enum Results {
        Win = totalMoney + bet,
        BlackJack = totalMoney + (bet * 1.5),
        Lose = totalMoney - bet,
        Draw = totalMoney
    };

    //initial deal
    useEffect(() => {
        gameLogic.hit('player', 2);
        gameLogic.hit('dealer', 2);
    }, []);

    //logic for game during start phase
    const gameLogic = {
        globals: {
            playerStand: 21,
            dealerStand: 17
        },
        dealCard: (turn: string, ammount: number): void => { //updates hand
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
        calcHandValue: (turn: string): void => { //updates hand value
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
        isAtStand: (turn: string): boolean => { //checks hand value for stand
            if (turn === 'player' && playerHandValue >= gameLogic.globals.playerStand) {
                return true;
            }
            if (turn === 'dealer' && dealerHandValue >= gameLogic.globals.dealerStand) {
                return true;
            }
            return false;
        },
        setStand: (turn: string): void => {
            if (turn === 'player') {
                setIsPlayerAtStand(true);
            }
            if (turn === 'dealer') {
                setIsDealerAtStand(true);
            }
        },
        hit: async(turn: string, ammount: number) => {
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
            doubleBet();
            gameLogic.dealCard('player', 1);
            gameLogic.calcHandValue('player');
            gameLogic.setStand('player');
        },
        dealerHitToStand: (): any => {
            if (isDealerAtStand) { return }

            gameLogic.hit('dealer', 1);

            return gameLogic.dealerHitToStand();
        },
        checkWinner: (): void => {
            let dealerBust: boolean = dealerHandValue > 21 ? true : false;
            let playerBust: boolean = playerHandValue > 21 ? true : false;

            switch(true) {
                case dealerBust && playerBust:
                    if (dealerHandValue > playerHandValue) {
                        setTotalMoney(Results.Win);
                        setGameMessage('Bust - you win');
                        break;
                    } else if (dealerHandValue < playerHandValue) {
                        setTotalMoney(Results.Lose);
                        setGameMessage('Bust - you lose');
                        break;
                    } else {
                        setTotalMoney(Results.Draw);
                        setGameMessage('Draw');
                        break;
                    }
                case dealerBust && !playerBust:
                    setTotalMoney(Results.Win);
                    setGameMessage('Bust - you win');
                    break;
                case !dealerBust && playerBust:
                    setTotalMoney(Results.Lose);
                    setGameMessage('Bust - you lose');
                    break;
                case !dealerBust && !playerBust:
                    if (dealerHandValue < playerHandValue) {
                        setTotalMoney(Results.Win);
                        setGameMessage('You win');
                        break;
                    } else if (dealerHandValue > playerHandValue) {
                        setTotalMoney(Results.Lose);
                        setGameMessage('You lose');
                        break;
                    } else {
                        setTotalMoney(Results.Draw);
                        setGameMessage('Draw');
                        break;
                    }
                default:
                    setGameMessage('could not determine winner');
                    return;
            }
            //reset betting
            setBet(0);
        },
        wait: async (ms: number) => new Promise(res => setTimeout(res, ms))
    };

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
        <>

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
                switchToBettingPhase={switchToBettingPhase}
            />  

            <PlayerSide 
                playerHand={playerHand}
                playerHandValue={playerHandValue}
                isPlayerAtStand={isPlayerAtStand}
                totalMoney={totalMoney}
                bet={bet}
            />

        </>
    )
};

export default Gameboard;