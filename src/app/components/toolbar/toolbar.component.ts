import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() rotateClicked = new EventEmitter();
  @Output() resizeClicked = new EventEmitter<number>();
  @Output() cropClicked = new EventEmitter();
  @Output() brightnessClicked = new EventEmitter();
  @Output() rbrightnessClicked = new EventEmitter();
  @Output() contrastClicked = new EventEmitter();
  @Output() grayscaleClicked = new EventEmitter();
  rotate() {
    this.rotateClicked.emit();
  }

  resize(scaleFactor: number) {
    this.resizeClicked.emit(scaleFactor);
  }

  openCropper() {
    this.cropClicked.emit();
  }

  applyBrightness() {
    this.brightnessClicked.emit();
  }

  reduceBrightness() {
    this.rbrightnessClicked.emit();
  }

  applyContrast() {
    this.contrastClicked.emit();
  }

  applyGrayscale() {
    this.grayscaleClicked.emit();
  }
}
