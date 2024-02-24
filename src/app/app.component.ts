import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayingCardComponent } from './components/playing-card/playing-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PlayingCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'balatwo';
}
