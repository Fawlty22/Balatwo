import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayingCardComponent } from './components/playing-card/playing-card.component';
import { OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import {MatButtonModule } from '@angular/material/button';

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
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'balatwo';
  handSize: number = 7;
  deckSize: number = 52;
  selectedCards: Card[] = [];
  hand: Card[] = []
  currentHand: string = 'nothing';
  deck: Map<number, Card> = new Map();

  ngOnInit(): void {
    this.populateDeck();
    this.setStartingHand();
  }

  populateDeck(): void {
    const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
    const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
    const getRank = (i: number):string => ranks[i % 13];
    const getSuit = (i: number):string => suits[(i / 13) | 0];
    const getColor = (i: number):string => (((i / 13) | 0) % 2 ? 'red' : 'black');

    let cardIndex = 1;
      for (let i = 0; i < this.deckSize; i++) {
          this.deck.set(cardIndex++, { rank:getRank(i), suit:getSuit(i), color:getColor(i) });
      }
  }

  setStartingHand(): void {
    const deckArray = Array.from(this.deck.values()); 
    console.log(deckArray)
    for (let i = 0; i < this.handSize; i++) {
      const randomIndex = Math.floor(Math.random() * deckArray.length); 
      const randomCard = deckArray.splice(randomIndex, 1)[0]; 
      this.hand.push(randomCard); 
    }
  }

  onSelect(card: Card){
    const alreadySelected = this.selectedCards.findIndex(c => c.rank === card.rank && c.suit === card.suit)
    if(alreadySelected > -1) {
      this.selectedCards.splice(alreadySelected, 1)
    } else {
      this.selectedCards.push(card)
    }
    // this.selectedCards.push(card);
    console.log(this.selectedCards)
  }

  selected(card: Card): boolean {
    return this.selectedCards.some(c => c.rank === card.rank && c.suit === card.suit)
  }
}
