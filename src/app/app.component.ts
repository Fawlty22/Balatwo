import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayingCardComponent } from './components/playing-card/playing-card.component';
import { OnInit } from '@angular/core'

interface Card {
  value: string;
  suit: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PlayingCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'balatwo';
  numCards:number = 7;
  hand: Card[] = []
  deck: Map<number, Card> = new Map();

  ngOnInit(): void {
    this.populateDeck();
    this.setStartingHand();
  }

  populateDeck(): void {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    let cardIndex = 1;
    for (const suit of suits) {
      for (const value of values) {
        this.deck.set(cardIndex++, { value, suit });
      }
    }
  }

  setStartingHand(): void {
    const deckArray = Array.from(this.deck.values()); // Convert deck map to array for easier manipulation
    for (let i = 0; i < this.numCards; i++) {
      const randomIndex = Math.floor(Math.random() * deckArray.length); // Generate a random index
      const randomCard = deckArray.splice(randomIndex, 1)[0]; // Remove the randomly selected card from the deck and get it
      this.hand.push(randomCard); // Add the randomly selected card to the hand
    }
  }
}
