import { Component, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  @ViewChild('imageCanvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;
  imageObject!: fabric.Image;

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement);
  }

  loadImage(imageSrc: string) {
    fabric.Image.fromURL(imageSrc, (img:any) => {
      this.imageObject = img;
      img.scaleToWidth(500);
      this.canvas.setWidth(img.width || 500);
      this.canvas.setHeight(img.height || 500);
      this.canvas.add(img);
      this.canvas.renderAll();
    });
  }

  rotateImage() {
    if (this.imageObject) {
      this.imageObject.rotate((this.imageObject.angle || 0) + 90);
      this.canvas.renderAll();
    }
  }

  resizeImage(scaleFactor: number) {
    if (this.imageObject) {
      this.imageObject.scale(scaleFactor);
      this.canvas.renderAll();
    }
  }
  
  applyBrightness() {
    if (this.imageObject) {
      this.imageObject.filters?.push(new fabric.Image.filters.Brightness({ brightness: 0.1 }));
      this.imageObject.applyFilters();
      this.canvas.renderAll();
    }
  }

  reduceBrightness() {
    if (this.imageObject) {
      this.imageObject.filters?.push(new fabric.Image.filters.Brightness({ brightness: -0.1 }));
      this.imageObject.applyFilters();
      this.canvas.renderAll();
    }
  }

  applyContrast() {
    if (this.imageObject) {
      this.imageObject.filters?.push(new fabric.Image.filters.Contrast({ contrast: 0.1 }));
      this.imageObject.applyFilters();
      this.canvas.renderAll();
    }
  }

  applyGrayscale() {
    if (this.imageObject) {
      this.imageObject.filters?.push(new fabric.Image.filters.Grayscale());
      this.imageObject.applyFilters();
      this.canvas.renderAll();
    }
  }
}
