import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [CardModule, ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly userName = 'Miljan';
}
