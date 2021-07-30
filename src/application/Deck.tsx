interface DeckInterface {
    deck: object[];
    shuffle: () => void;
    initialize: () => void;
    dealCards: (ammount: number) => object[];
}

export class Deck implements DeckInterface {

    deck: object[];
    shuffle: () => void;
    initialize: () => void;
    dealCards: (ammount: number) => object[];

    constructor() {
        this.deck = [];

        this.shuffle = function() {
            const { deck } = this;

            for (var i = deck.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = deck[i];
                deck[i] = deck[j];
                deck[j] = temp;
            }
        }

        this.dealCards = function(ammount) {
            const { deck } = this;

            const dealtCards = [];

            for (let i = 0; i < ammount; i ++) {
                dealtCards.push(deck[i]);
                deck.splice(i, 1);
            }

            return dealtCards;
        }

        const suits: string[] = [
            'Hearts', 
            'Clubs', 
            'Diamonds', 
            'Spades'
        ];

        const values: any[] = [
            {name: '2', value: 2},
            {name: '3', value: 3},
            {name: '4', value: 4},
            {name: '5', value: 5},
            {name: '6', value: 6},
            {name: '7', value: 7},
            {name: '8', value: 8},
            {name: '9', value: 9},
            {name: '10', value: 10},
            {name: 'Jack', value: 10},
            {name: 'Queen', value: 10},
            {name: 'King', value: 10},
            {name: 'Ace', value: 11}
        ];

        this.initialize = function() {
            this.deck = [];

            type Card = {
                suit: string;
                name: string;
                card: string;
                value: number;
            }
            
            for (let suit in suits) {
                for (let i = 0; i < values.length; i++) {
                    const card: Card = {
                        suit:  suits[suit],
                        name: values[i].name,
                        card: `${values[i].name} of ${suits[suit]}`,
                        value: values[i].value
                    }
    
                    this.deck.push(card);
                }
            }

            this.shuffle();
        }
    }
};

interface HandInterface {
    hand: any[];
    initialize: () => void;
    draw: (cards: any[]) => void;
    handValue: number;
    calcHandValue: () => void;
}

export class Hand implements HandInterface {

    hand: any[];
    initialize: () => void;
    draw: (cards: any[]) => void;
    handValue: number;
    calcHandValue: () => void;

    constructor() {
        this.hand = [];

        this.initialize = function() {
            this.hand = [];
        }

        this.draw = function(cards) {
            this.hand = this.hand.concat(cards);
            this.calcHandValue();
        }

        this.handValue = 0;

        this.calcHandValue = function() {
            const { hand } = this;

            let pointTotal: number = hand.reduce((acc, el) => {
                return acc + el.value;
            }, 0);

            this.handValue = pointTotal;
        }
    }
};