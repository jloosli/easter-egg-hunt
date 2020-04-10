import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import jsQR from 'jsqr';

@Component({
  selector: 'app-picture-snapper',
  templateUrl: './picture-snapper.component.html',
  styleUrls: ['./picture-snapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureSnapperComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('myVideo') videoEl: ElementRef<HTMLVideoElement>;
  canvas: CanvasRenderingContext2D;
  video: HTMLVideoElement;

  loadingMessage = '';
  showLoading = true;
  outputData = 'No Data Detected';

  stream: MediaStream;
  usingCamera = false;
  @Output() eggFound = new EventEmitter<string>();

  @Input()
  set stopCamera(val: any) {
    console.log(val);
    if (this.usingCamera) {
      this.stop();
    }
  };

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasEl.nativeElement.getContext('2d');
    this.video = this.videoEl.nativeElement;
    this.canvasEl.nativeElement.height = this.video.videoHeight;
    this.canvasEl.nativeElement.width = this.video.videoWidth;

    this.drawBunny();
  }

  drawLine(begin, end, color) {
    this.canvas.beginPath();
    this.canvas.moveTo(begin.x, begin.y);
    this.canvas.lineTo(end.x, end.y);
    this.canvas.lineWidth = 4;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
  }

  tick() {
    if (!this.usingCamera) return;
    this.loadingMessage = '⌛ Loading video...🎥';
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.showLoading = false;

      this.canvasEl.nativeElement.height = this.video.videoHeight;
      this.canvasEl.nativeElement.width = this.video.videoWidth;
      this.canvas.drawImage(this.video, 0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
      const imageData = this.canvas.getImageData(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code) {
        this.drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
        this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
        this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
        this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
        this.outputData = code.data;
        this.eggFound.emit(code.data);
        this.cdr.detectChanges();
      } else {
        this.outputData = 'No data detected';
        this.cdr.detectChanges();
      }
    }
    requestAnimationFrame(() => this.tick());
  }

  start() {
    this.usingCamera = true;
    navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: 'environment'}}})
      .then((stream) => {
        this.stream = stream;
        this.video.srcObject = stream;
        this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
        this.video.play();
        this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => this.tick()));
      });

  }

  stop() {
    this.usingCamera = false;
    this.stream?.getTracks().forEach(track => track.stop());
    this.drawBunny();
  }

  drawBunny() {
    this.canvas.beginPath();
    this.canvas.rect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
    this.canvas.fillStyle = 'white';
    this.canvas.fill();

    const bunnyImage = new Image();
    bunnyImage.src = '/assets/easter_bunny.png';
    bunnyImage.onload = () => this.canvas.drawImage(bunnyImage, 0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
  }

}
