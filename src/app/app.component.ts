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
  deckMap: Map<number, Card> = new Map();
  deck: Card[] = [];
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
      this.deckMap.set(cardIndex++, {
        rank: getRank(i),
        suit: getSuit(i),
        color: getColor(i),
      });
    }
  }

  setStartingHand(): void {
    this.deck = Array.from(this.deckMap.values());
    const deckArray = this.deck;
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
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    // Helper function to check for a straight
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
        this.currentHand = 'Royal Flush';
      } else {
        this.currentHand = 'Straight Flush';
      }
    } else if (isFlush) {
      // Check for Flush
      this.currentHand = 'Flush';
    } else if (isStraight) {
      // Check for Straight
      this.currentHand = 'Straight';
    } else if (Object.values(countRanks).some((count) => count === 4)) {
      // Check for Four of a Kind
      this.currentHand = 'Four of a Kind';
    } else if (
      Object.values(countRanks).filter((count) => count === 3).length === 1 &&
      Object.values(countRanks).filter((count) => count === 2).length === 1
    ) {
      // Check for Full House
      this.currentHand = 'Full House';
    } else if (Object.values(countRanks).some((count) => count === 3)) {
      // Check for Three of a Kind
      this.currentHand = 'Three of a Kind';
    } else if (
      Object.values(countRanks).filter((count) => count === 2).length === 2
    ) {
      // Check for Two Pair
      this.currentHand = 'Two Pair';
    } else if (Object.values(countRanks).some((count) => count === 2)) {
      // Check for One Pair
      this.currentHand = 'One Pair';
    } else {
      // High Card
      this.currentHand = 'High Card';
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
}
