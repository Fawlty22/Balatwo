import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-playing-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './playing-card.component.html',
  styleUrl: './playing-card.component.scss'
})
export class PlayingCardComponent {
  @Input() suit: string = '';
  @Input() value: string = '';
}
