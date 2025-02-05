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

  setBrush() {
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = 'black';
    this.canvas.freeDrawingBrush.width = 5;
  }

  addText() {
    const text = new fabric.Textbox('Enter text', {
      left: 50,
      top: 50,
      fontSize: 20,
      fill: 'black',
    });
    this.canvas.add(text);
  }

  addRectangle() {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      width: 100,
      height: 100,
    });
    this.canvas.add(rect);
  }

  addCircle() {
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      radius: 50,
    });
    this.canvas.add(circle);
  }

  addLine() {
    const line = new fabric.Line([50, 50, 200, 200], {
      stroke: 'black',
      strokeWidth: 2,
    });
    this.canvas.add(line);
  }
}
