import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
declare var YT: any;
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [],
  templateUrl: './youtube-player.component.html',
  styleUrl: './youtube-player.component.css'
})
export class YoutubePlayerComponent implements OnInit, OnChanges{
    @Input() videoId!: string;
  player: any;
  playerId = 'youtube-player-' + Math.floor(Math.random() * 100000);

    ngOnInit() {
      if (window.YT && window.YT.Player) {
        this.initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = () => this.initPlayer();
      }
    }

  ngOnChanges(changes: SimpleChanges) {
    if (this.player && changes['videoId'] && !changes['videoId'].isFirstChange()) {
      this.player.loadVideoById(this.videoId);
    }
  }

  initPlayer() {
    this.player = new YT.Player(this.playerId, {
      height: '360',
      width: '640',
      videoId: this.videoId,
      events: {
        onReady: () => console.log('Player carregado'),
      },
    });
  }

  playVideo() {
    this.player?.playVideo();
  }

  pauseVideo() {
    this.player?.pauseVideo();
  }

  setVolume(volume: number) {
    this.player?.setVolume(volume);
  }
}
