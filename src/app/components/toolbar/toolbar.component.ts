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

  rotate() {
    this.rotateClicked.emit();
  }

  resize(scaleFactor: number) {
    this.resizeClicked.emit(scaleFactor);
  }

  openCropper() {
    this.cropClicked.emit();
  }
}
