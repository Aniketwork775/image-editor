import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent {
  imageChangedEvent: any = '';
  croppedImage: string = '';

  @Output() cropped = new EventEmitter<string>();

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }

  applyCrop() {
    this.cropped.emit(this.croppedImage);
  }
}
