import { inject, Injectable } from '@angular/core';
import { SocketManagerService } from '../../socket/services/socket-manager.service';
import { CallPayloadType } from '../../../common/enums/call-payload-type.enum';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private reconnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private connection!: RTCPeerConnection;
  private localStream!: MediaStream;

  private socketManagerService = inject(SocketManagerService);

  async initLocalStream(localVideo: HTMLVideoElement) {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = this.localStream;
    localVideo.muted = true;
  }

  createConnection(remoteVideo: HTMLVideoElement, callId: string) {
    this.connection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
      iceCandidatePoolSize: 10,
    });

    this.localStream.getTracks().forEach((track) => {
      this.connection.addTrack(track, this.localStream!);
    });

    this.getStreams(remoteVideo);

    this.registerEvents(remoteVideo, callId);
  }

  private registerEvents(remoteVideo: HTMLVideoElement, callId: string) {
    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketManagerService.emitCall({
          callId,
          type: CallPayloadType.CANDIDATE,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    this.connection.oniceconnectionstatechange = () => {
      if (
        this.connection.iceConnectionState === 'disconnected' ||
        this.connection.iceConnectionState === 'failed'
      ) {
        console.log('Peer disconnected');
        this.tryReconnect(remoteVideo, callId);
      }
    };
  }

  async makeCall(remoteVideo: HTMLVideoElement, callId: string) {
    await this.makeOffer(remoteVideo, callId);
  }

  private async makeOffer(remoteVideo: HTMLVideoElement, callId: string) {
    this.createConnection(remoteVideo, callId);

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    this.socketManagerService.emitCall({ callId, type: CallPayloadType.OFFER, offer });
  }

  async handleOffer(
    offer: RTCSessionDescriptionInit,
    remoteVideo: HTMLVideoElement,
    callId: string,
  ) {
    this.createConnection(remoteVideo, callId);

    await this.connection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);

    this.socketManagerService.emitCall({ callId, type: CallPayloadType.ANSWER, answer });
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.connection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async tryReconnect(remoteVideo: HTMLVideoElement, callId: string) {
    if (this.reconnecting) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached.');
      return;
    }

    this.reconnecting = true;
    this.reconnectAttempts++;

    console.log('Reconnect attempts:', this.reconnectAttempts);

    this.connection?.close();

    setTimeout(async () => {
      try {
        await this.makeOffer(remoteVideo, callId);
      } catch (error) {
        console.error('Reconnect failed:', error);
        this.tryReconnect(remoteVideo, callId);
      } finally {
        this.reconnecting = false;
      }
    }, 2000);
  }

  public async handleCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (candidate) {
      await this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private async getStreams(remoteVideo: HTMLVideoElement): Promise<void> {
    const remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;

    this.connection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
  }

  freezeRemoteVideo(remoteVideo: HTMLVideoElement) {
    if (remoteVideo.srcObject instanceof MediaStream) {
      const video = remoteVideo;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      remoteVideo.srcObject = null;
      remoteVideo.src = canvas.toDataURL();
    }
  }

  public endCall() {
    this.connection?.close();
    this.localStream?.getTracks().forEach((track) => track.stop());
  }
}
