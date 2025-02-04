import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  @ViewChild('imageCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  loadImage(imageSrc: string) {
    const ctx = this.canvas.nativeElement.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      console.log("img.width",img.width);
      
      this.canvas.nativeElement.width = img.width;
      this.canvas.nativeElement.height = img.height;
      ctx?.drawImage(img, 0, 0);
    };
  }
}
