import React, { useState } from 'react';

import Gameboard from '../components/Gameboard';
import Bettingboard from '../components/Bettingboard';

import '../styles/app.scss';

const App: React.FC<{}> = () => {

    enum Phase {
        Betting,
        Game
    };

    const [ totalMoney, setTotalMoney ] = useState<number>(200);
    const [ bet, setBet ] = useState<number>(50);

    const [ gameState, setGameState ] = useState<Phase>(Phase.Game);

    const menuLogic = {
        toBettingPhase: (): void => {
            setGameState(Phase.Betting);
        },
        toGamePhase: (): void => {
            if (bet === 0) { return }
            setGameState(Phase.Game);
        },
        updateTotalMoney: (money: number): void => {
            setTotalMoney(money)
        },
        updateBet: (money: number): void => {
            setBet(money);
        },
        doubleBet: (): void => {
            setBet(prevState => {
                return prevState * 2;
            })
        },
        increaseBet: (): void => {
            if ((bet + 10) > totalMoney) { return }

            setBet(prevState => {
                return prevState + 10;
            });
        },
        decreaseBet: (): void => {
            if (bet === 0) { return }

            setBet(prevState => {
                return prevState - 10;
            });
        }
    };

    const phaseRender = () => {
        if (gameState === Phase.Game) {
            return (
                <Gameboard 
                    switchToBettingPhase={menuLogic.toBettingPhase}
                    totalMoney={totalMoney}
                    setTotalMoney={menuLogic.updateTotalMoney}
                    bet={bet}
                    setBet={menuLogic.updateBet}
                    doubleBet={menuLogic.doubleBet}
                />
            )
        }
        if (gameState === Phase.Betting) {
            return (
                <Bettingboard 
                    switchToGamePhase={menuLogic.toGamePhase}
                    bet={bet}
                    increaseBet={menuLogic.increaseBet}
                    decreaseBet={menuLogic.decreaseBet}
                    totalMoney={totalMoney}
                />
            )
        }
    };

    return (
        <main>
            {phaseRender()}
        </main>
    )
};

export default App;