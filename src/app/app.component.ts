import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from './components/canvas/canvas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('canvasComponent') canvasComponent!: CanvasComponent;
  showCropper = false;
  showtools:boolean=false;
  onImageSelected(imageSrc: string) {
    this.canvasComponent.loadImage(imageSrc);
    this.showtools=true;
  }

  onImageCropped(imageSrc: string) {
    this.showCropper = false;
    this.canvasComponent.loadImage(imageSrc);
  }
}
