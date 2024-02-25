import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayingCardComponent } from './components/playing-card/playing-card.component';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Card {
  rank: string;
  suit: string;
  color: string;
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
  handSize: number = 7;
  deckSize: number = 52;
  selectedCards: Card[] = [];
  hand: Card[] = [];
  currentHand: string = 'nothing';
  deck: Map<number, Card> = new Map();
  discardPile: Card[] = [];

  ngOnInit(): void {
    this.populateDeck();
    this.setStartingHand();
  }

  populateDeck(): void {
    const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
    const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
    const getRank = (i: number): string => ranks[i % 13];
    const getSuit = (i: number): string => suits[(i / 13) | 0];
    const getColor = (i: number): string =>
      ((i / 13) | 0) % 2 ? 'red' : 'black';

    let cardIndex = 1;
    for (let i = 0; i < this.deckSize; i++) {
      this.deck.set(cardIndex++, {
        rank: getRank(i),
        suit: getSuit(i),
        color: getColor(i),
      });
    }
  }

  setStartingHand(): void {
    const deckArray = Array.from(this.deck.values());
    console.log(deckArray);
    for (let i = 0; i < this.handSize; i++) {
      const randomIndex = Math.floor(Math.random() * deckArray.length);
      const randomCard = deckArray.splice(randomIndex, 1)[0];
      this.hand.push(randomCard);
    }
  }

  onSelect(card: Card) {
    const alreadySelected = this.selectedCards.findIndex(
      (c) => c.rank === card.rank && c.suit === card.suit
    );
    if (alreadySelected > -1) {
      this.selectedCards.splice(alreadySelected, 1);
    } else {
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
    }

    // Helper function to count occurrences of each rank
    const countRanks: { [key: string]: number } = {};
    cards.forEach((card) => {
      countRanks[card.rank] = (countRanks[card.rank] || 0) + 1;
    });

    // Helper function to count occurrences of each suit
    const countSuits: { [key: string]: number } = {};
    cards.forEach((card) => {
      countSuits[card.suit] = (countSuits[card.suit] || 0) + 1;
    });

    // Helper function to check for a flush
    const isFlush = Object.values(countSuits).some((count) => count === 5);

    // Helper function to check for a straight
    const ranks = Object.keys(countRanks).sort((a, b) => {
      const rankOrder = [
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K',
        'A',
      ];
      return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });
    const numericRanks = ranks.map((rank) => parseInt(rank, 10));
    const isStraight =
      numericRanks.length === 5 && numericRanks[4] - numericRanks[0] === 4;

    // Check for different poker hands
    if (isFlush && isStraight) {
      this.currentHand = 'Straight Flush';
    } else if (isFlush) {
      this.currentHand = 'Flush';
    } else if (isStraight) {
      this.currentHand = 'Straight';
    } else if (Object.values(countRanks).some((count) => count === 4)) {
      this.currentHand = 'Four of a Kind';
    } else if (
      Object.values(countRanks).filter((count) => count === 3).length === 1 &&
      Object.values(countRanks).filter((count) => count === 2).length === 1
    ) {
      this.currentHand = 'Full House';
    } else if (Object.values(countRanks).some((count) => count === 3)) {
      this.currentHand = 'Three of a Kind';
    } else if (
      Object.values(countRanks).filter((count) => count === 2).length === 2
    ) {
      this.currentHand = 'Two Pair';
    } else if (Object.values(countRanks).some((count) => count === 2)) {
      this.currentHand = 'One Pair';
    } else {
      this.currentHand = 'High Card';
    }
  }

  discard(){
    this.discardPile.push(...this.selectedCards);
    this.selectedCards = [];
  }
}
