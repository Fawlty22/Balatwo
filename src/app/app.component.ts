import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayingCardComponent } from './components/playing-card/playing-card.component';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Card {
  rank: string;
  value:number;
  suit: string;
  color: string;
}

enum PokerHandEnum {
  HIGH_CARD = "High Card",
  ONE_PAIR = "One Pair",
  TWO_PAIR = "Two Pair",
  THREE_OF_A_KIND = "Three of a Kind",
  STRAIGHT = "Straight",
  FLUSH = "Flush",
  FULL_HOUSE = "Full House",
  FOUR_OF_A_KIND = "Four of a Kind",
  STRAIGHT_FLUSH = "Straight Flush",
  ROYAL_FLUSH = "Royal Flush"
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PlayingCardComponent, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'balatwo';
  score:number = 0;
  handSize: number = 7;
  deckSize: number = 52;
  selectedCards: Card[] = [];
  hand: Card[] = [];
  currentHand: string = 'nothing';
  deckMap: Map<number, Card> = new Map();
  deck: Card[] = [];
  discardPile: Card[] = [];
  multiplierDictionary: { [key: string]: number } = {
    "High Card": 1,
    "One Pair": 2,
    "Two Pair": 3,
    "Three of a Kind": 4,
    "Straight": 6,
    "Flush": 7,
    "Full House": 9,
    "Four of a Kind": 11,
    "Straight Flush": 12,
    "Royal Flush": 14
};


  ngOnInit(): void {
    this.populateDeck();
    this.setStartingHand();
  }

  populateDeck(): void {
    const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
    const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
    const values = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    const getRank = (i: number): string => ranks[i % 13];
    const getValue = (i: number): number => values[i % 13];
    const getSuit = (i: number): string => suits[(i / 13) | 0];
    const getColor = (i: number): string =>
      ((i / 13) | 0) % 2 ? 'red' : 'black';

    let cardIndex = 1;
    for (let i = 0; i < this.deckSize; i++) {
      this.deckMap.set(cardIndex++, {
        rank: getRank(i),
        suit: getSuit(i),
        value: getValue(i),
        color: getColor(i),
      });
    }
    this.deck = this.shuffle(Array.from(this.deckMap.values()));
  }

  setStartingHand(): void {
    const drawnCards = this.deck.splice(-this.handSize);
    this.hand.push(...drawnCards);
  }

  onSelect(card: Card) {
    const alreadySelected = this.selectedCards.findIndex(
      (c) => c.rank === card.rank && c.suit === card.suit
    );
    if (alreadySelected > -1) {
      this.selectedCards.splice(alreadySelected, 1);
    } else if( this.selectedCards.length <= 4) {
      this.selectedCards.push(card);
    } 
    this.setCurrentBestHand()
  }

  selected(card: Card): boolean {
    return this.selectedCards.some(
      (c) => c.rank === card.rank && c.suit === card.suit
    );
  }

  setCurrentBestHand(): void {
    const cards = this.selectedCards;
    if (cards.length === 0) {
      this.currentHand = 'No cards provided';
      return;
    }

    // count occurrences of each rank
    const countRanks: { [key: string]: number } = {};
    cards.forEach((card) => {
      countRanks[card.rank] = (countRanks[card.rank] || 0) + 1;
    });

    // count occurrences of each suit
    const countSuits: { [key: string]: number } = {};
    cards.forEach((card) => {
      countSuits[card.suit] = (countSuits[card.suit] || 0) + 1;
    });

    // check for a flush
    const isFlush = Object.values(countSuits).some((count) => count === 5);
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    // check for a straight
    const sortedRanks = Object.keys(countRanks).sort((a, b) => {
      
      return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    let isStraight = false;
    if (sortedRanks.length >= 5) {
      // Check for Ace-low straight (A-5-4-3-2)
      if (sortedRanks.includes('A') && sortedRanks.includes('2') && sortedRanks.includes('3') && sortedRanks.includes('4') && sortedRanks.includes('5')) {
        isStraight = true;
      }
      // Check for other straights
      for (let i = 0; i <= sortedRanks.length - 5; i++) {
        const startRankIndex = rankOrder.indexOf(sortedRanks[i]);
        const endRankIndex = rankOrder.indexOf(sortedRanks[i + 4]);
        if (endRankIndex - startRankIndex === 4) {
          isStraight = true;
          break;
        }
      }
    }

    // Check for different poker hands
    if (isFlush && isStraight) {
      // Check for Royal Flush
      const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
      const royalFlush = royalRanks.every(rank => countRanks[rank]);
      if (royalFlush) {
        this.currentHand = PokerHandEnum.ROYAL_FLUSH;
      } else {
        this.currentHand = PokerHandEnum.STRAIGHT_FLUSH;
      }
    } else if (isFlush) {
      // Check for Flush
      this.currentHand = PokerHandEnum.FLUSH;
    } else if (isStraight) {
      // Check for Straight
      this.currentHand = PokerHandEnum.STRAIGHT;
    } else if (Object.values(countRanks).some((count) => count === 4)) {
      // Check for Four of a Kind
      this.currentHand = PokerHandEnum.FOUR_OF_A_KIND;
    } else if (
      Object.values(countRanks).filter((count) => count === 3).length === 1 &&
      Object.values(countRanks).filter((count) => count === 2).length === 1
    ) {
      // Check for Full House
      this.currentHand = PokerHandEnum.FULL_HOUSE;
    } else if (Object.values(countRanks).some((count) => count === 3)) {
      // Check for Three of a Kind
      this.currentHand = PokerHandEnum.THREE_OF_A_KIND;
    } else if (
      Object.values(countRanks).filter((count) => count === 2).length === 2
    ) {
      // Check for Two Pair
      this.currentHand = PokerHandEnum.TWO_PAIR;
    } else if (Object.values(countRanks).some((count) => count === 2)) {
      // Check for One Pair
      this.currentHand = PokerHandEnum.ONE_PAIR;
    } else {
      // High Card
      this.currentHand = PokerHandEnum.HIGH_CARD;
    }
}


  discard() {
    const discardAmount = this.selectedCards.length;
    // Iterate over selected cards and remove them from the hand array
    for (const selectedCard of this.selectedCards) {
        const index = this.hand.findIndex(card => card.rank === selectedCard.rank && card.suit === selectedCard.suit);
        if (index !== -1) {
            const removedCards = this.hand.splice(index, 1);
            // Push the removed card into the discard pile
            this.discardPile.push(...removedCards);
        }
    }
    // Clear the selected cards array
    this.selectedCards = [];
    this.draw(discardAmount);
}

draw(drawAmount: number){
  if (this.deck.length > 0 && this.deck.length >= drawAmount) {
    const drawnCards = this.deck.splice(-drawAmount);
    this.hand.push(...drawnCards);
}
  this.setCurrentBestHand();
}

onSubmit(){
  let cardTotals = 0;
  this.selectedCards.forEach(card => cardTotals += +card.value);

  let score = cardTotals * this.multiplierDictionary[this.currentHand];
  
  this.addToScore(score);
  this.discard();
}

addToScore(score:number){
  this.score += score;
}

shuffle = (cards: Card[]) => {
  for (let i = 0; i < cards.length; i++) {
    const rnd = Math.random() * i | 0;
    const tmp = cards[i];
    cards[i] = cards[rnd];
    cards[rnd] = tmp;
  }
  return cards;
};

}
