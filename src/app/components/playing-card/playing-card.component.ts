import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playing-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './playing-card.component.html',
  styleUrl: './playing-card.component.scss'
})
export class PlayingCardComponent {
  @Input() suit: string = '';
  @Input() value: string = '';

  isRed():boolean {
    return this.suit === '♥︎' || this.suit === '♦︎';
  }
}
