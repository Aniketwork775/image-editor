import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from './components/canvas/canvas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-editor';
  @ViewChild('canvasComponent') canvasComponent!: CanvasComponent;

  onImageSelected(imageSrc: string) {
    this.canvasComponent.loadImage(imageSrc);
  }
}
