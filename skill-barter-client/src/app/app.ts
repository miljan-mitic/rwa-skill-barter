import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/components/header/header';
import { ToastModule } from 'primeng/toast';
import { Footer } from './layout/components/footer/footer';
import { CallService } from './call.service';
import { SignalingService } from './signaling.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ToastModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('skill-barter-client');

  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(
    private readonly callService: CallService,
    private readonly signalingService: SignalingService
  ) {}

  ngOnInit(): void {
    this.signalingService.getMessages().subscribe((payload) => this._handleMessage(payload));
  }

  public async makeCall(): Promise<void> {
    await this.callService.makeCall(this.remoteVideo);
  }

  private async _handleMessage(data: any): Promise<void> {
    switch (data.type) {
      case 'offer':
        await this.callService.handleOffer(data.offer, this.remoteVideo);
        break;

      case 'answer':
        await this.callService.handleAnswer(data.answer);
        break;

      case 'candidate':
        this.callService.handleCandidate(data.candidate);
        break;

      default:
        break;
    }
  }
}
