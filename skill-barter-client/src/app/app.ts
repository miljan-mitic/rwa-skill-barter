import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/components/header/header';
import { ToastModule } from 'primeng/toast';
import { Footer } from './layout/components/footer/footer';
import { ConfirmDialog } from './shared/confirm-dialog/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ToastModule, Footer, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
