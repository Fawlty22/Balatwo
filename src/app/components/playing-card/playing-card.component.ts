import { Component, Input, ViewChild,ElementRef, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Card {
  rank: string;
  value:number;
  suit: string;
  color: string;
}

@Component({
  selector: 'app-playing-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './playing-card.component.html',
  styleUrl: './playing-card.component.scss'
})
export class PlayingCardComponent implements OnInit{
  @ViewChild('card', { static: true }) card!: ElementRef<HTMLDivElement>;
  @Input() suit: string = '';
  @Input() rank: string = '';
  @Input() color: string = '';
  @Input() value: number = 0;

  suitHTML: string = '';
  suitPositions = [
    [[0, 0]],
    [
      [0, -1],
      [0, 1, true],
    ],
    [
      [0, -1],
      [0, 0],
      [0, 1, true],
    ],
    [
      [-1, -1],
      [1, -1],
      [-1, 1, true],
      [1, 1, true],
    ],
    [
      [-1, -1],
      [1, -1],
      [0, 0],
      [-1, 1, true],
      [1, 1, true],
    ],
    [
      [-1, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1, true],
      [1, 1, true],
    ],
    [
      [-1, -1],
      [1, -1],
      [0, -0.5],
      [-1, 0],
      [1, 0],
      [-1, 1, true],
      [1, 1, true],
    ],
    [
      [-1, -1],
      [1, -1],
      [0, -0.5],
      [-1, 0],
      [1, 0],
      [0, 0.5, true],
      [-1, 1, true],
      [1, 1, true],
    ],
    [
      [-1, -1],
      [1, -1],
      [-1, -1 / 3],
      [1, -1 / 3],
      [0, 0],
      [-1, 1 / 3, true],
      [1, 1 / 3, true],
      [-1, 1, true],
      [1, 1, true],
    ],
    [
      [-1, -1],
      [1, -1],
      [0, -2 / 3],
      [-1, -1 / 3],
      [1, -1 / 3],
      [-1, 1 / 3, true],
      [1, 1 / 3, true],
      [0, 2 / 3, true],
      [-1, 1, true],
      [1, 1, true],
    ],
    [[0, 0]],
    [[0, 0]],
    [[0, 0]],
  ];

  ngOnInit(): void {
    console.log(this.color)
    this.start()
  }

  start(){
    const el = (tagName: string, attributes: any, children: any) => {
      const element = document.createElement(tagName);
      if (attributes) {
        for (const attrName in attributes) {
          element.setAttribute(attrName, attributes[attrName]);
        }
      }
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else {
            element.appendChild(child);
          }
        }
      }
      return element;
    };
    const div = (a: any, c: any) => el('div', a, c);

    const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
    const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
    const getRank = (i: any) => ranks[i % 13];
    const getSuit = (i: any) => suits[(i / 13) | 0];
    const getColor = (i: any) => (((i / 13) | 0) % 2 ? 'red' : 'black');
    const createSuit = (suit: any) => (pos: any) => {
      const [x, y, mirrored] = pos;
      const mirroredClass = mirrored ? ' mirrored' : '';
      return div(
        {
          class: 'card-suit' + mirroredClass,
          style: `left: ${x * 100}%; top: ${y * 100}%;`,
        },
        [suit]
      );
    };
    const createCard = (card: Partial<Card>) => {
      const rank = card.rank;
      const suit = card.suit;
      const colorClass = 'card ' + card.color;
      console.log(colorClass)
      return div({ class: colorClass }, [
        div(
          { class: 'card-suits' },
          this.suitPositions[card.value!-1 % 13].map(createSuit(suit))
        ),
        div({ class: 'card-topleft' }, [
          div({ class: 'card-corner-rank' }, [rank]),
          div({ class: 'card-corner-suit' }, [suit]),
        ]),
        div({ class: 'card-bottomright' }, [
          div({ class: 'card-corner-rank' }, [rank]),
          div({ class: 'card-corner-suit' }, [suit]),
        ]),
      ]);
    };
    
    const customElement = createCard({rank:this.rank, suit:this.suit, value:this.value, color:this.color});
    this.card.nativeElement.appendChild(customElement);
  }
}
