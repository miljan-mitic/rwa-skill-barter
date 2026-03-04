import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  model,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SocketManagerService } from '../../socket/services/socket-manager.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SocketState } from '../../socket/store/socket.state';
import { selectSocketInitialzed } from '../../socket/store/socket.selector';
import { filter, switchMap, take } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CallService } from '../services/call.service';
import { CallData } from '../../../common/types/call-payload.types';
import { CallPayloadType } from '../../../common/enums/call-payload-type.enum';

@Component({
  selector: 'app-video-call',
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatIconModule, FlexLayoutModule],
  templateUrl: './video-call.html',
  styleUrl: './video-call.scss',
})
export class VideoCall implements OnInit, AfterViewInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private dialogRef = inject(MatDialogRef<VideoCall>);
  private data = inject<{ barterId: number }>(MAT_DIALOG_DATA);
  barterId = model(this.data.barterId);

  private destroyRef = inject(DestroyRef);
  private store = inject(Store<SocketState>);
  private callService = inject(CallService);
  private socketManagerService = inject(SocketManagerService);

  ngOnInit(): void {
    this.listenSocketMessages();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initLocalStream();
  }

  close() {
    this.callService.endCall();
    this.dialogRef.close();
  }

  async initLocalStream() {
    await this.callService.initLocalStream(this.localVideo.nativeElement);
  }

  private listenSocketMessages() {
    this.store
      .select(selectSocketInitialzed)
      .pipe(
        filter(Boolean),
        take(1),
        switchMap(() => this.socketManagerService.onCall()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((payload) => this.handleMessage(payload));
  }

  private async handleMessage(data: CallData): Promise<void> {
    switch (data.type) {
      case CallPayloadType.OFFER: {
        const callId = this.barterId().toString();
        await this.callService.handleOffer(data.offer, this.remoteVideo.nativeElement, callId);
        break;
      }

      case CallPayloadType.ANSWER: {
        await this.callService.handleAnswer(data.answer);
        break;
      }

      case CallPayloadType.CANDIDATE: {
        this.callService.handleCandidate(data.candidate);
        break;
      }

      case CallPayloadType.PEER_DISCONNECTED: {
        this.callService.freezeRemoteVideo(this.remoteVideo.nativeElement);
        break;
      }

      default:
        break;
    }
  }

  toggleFullScreen() {
    const wrapper = document.querySelector('.video-wrapper') as HTMLElement;

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
      return;
    }
    document.exitFullscreen();
  }

  async startCall(): Promise<void> {
    const callId = this.barterId().toString();
    this.socketManagerService.joinCallRoom(callId);
    await this.callService.makeCall(this.remoteVideo.nativeElement, callId);
  }
}
