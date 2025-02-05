import { Component, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { Rect } from 'fabric/fabric-impl';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  @ViewChild('imageCanvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;
  imageObject!: fabric.Image;
  private isDrawingShape = false;
  private currentShape!: any;
  private startX = 0;
  private startY = 0;
  
  // ngAfterViewInit() {
  //   this.canvas = new fabric.Canvas(this.canvasElement.nativeElement);
  // }
  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement);
  
    this.canvas.on('mouse:down', (event) => this.onMouseDown(event));
    this.canvas.on('mouse:move', (event) => this.onMouseMove(event));
    this.canvas.on('mouse:up', () => this.onMouseUp());

    this.canvas.on('mouse:down', (event) => {
      if (this.currentShape === 'text') {
        this.addTextAtPosition(event);
      }
    });

    this.canvas.on('mouse:dblclick', (event) => {
      if (event.target && event.target instanceof fabric.Textbox) {
        const newText = prompt("Edit text:", event.target.text);
        if (newText !== null) {
          event.target.set({ text: newText });
          this.canvas.renderAll();
        }
      }
    });
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

  // addText() {
  //   const text = new fabric.Textbox('Enter text', {
  //     left: 50,
  //     top: 50,
  //     fontSize: 20,
  //     fill: 'black',
  //   });
  //   this.canvas.add(text);
  // }

  // addText() {
  //   const userText = prompt("Enter text:");
  //   if (userText) {
  //     const text = new fabric.Textbox(userText, {
  //       left: 50,
  //       top: 50,
  //       fontSize: 20,
  //       fill: 'black',
  //     });
  //     this.canvas.add(text);
  //   }
  // }
  addText() {
    this.isDrawingShape = false; // Disable shape drawing
    this.canvas.isDrawingMode = false; // Disable free drawing
    this.currentShape = 'text'; // Track selected tool
  }

  addTextAtPosition(event: fabric.IEvent) {
    const pointer = this.canvas.getPointer(event.e);
    const userText = prompt("Enter text:");
  
    if (userText) {
      const text = new fabric.Textbox(userText, {
        left: pointer.x,
        top: pointer.y,
        fontSize: 20,
        fill: 'black',
        editable: true,
      });
  
      this.canvas.add(text);
    }
  }
  

  // addRectangle() {
  //   const rect = new fabric.Rect({
  //     left: 100,
  //     top: 100,
  //     fill: 'transparent',
  //     stroke: 'black',
  //     strokeWidth: 2,
  //     width: 100,
  //     height: 100,
  //   });
  //   this.canvas.add(rect);
  // }

  // addCircle() {
  //   const circle = new fabric.Circle({
  //     left: 150,
  //     top: 150,
  //     fill: 'transparent',
  //     stroke: 'black',
  //     strokeWidth: 2,
  //     radius: 50,
  //   });
  //   this.canvas.add(circle);
  // }

  // addLine() {
  //   const line = new fabric.Line([50, 50, 200, 200], {
  //     stroke: 'black',
  //     strokeWidth: 2,
  //   });
  //   this.canvas.add(line);
  // }
  addRectangle() {
    this.isDrawingShape = true;
    this.canvas.isDrawingMode = false; // Disable free drawing
    this.canvas.selection = false; // Disable object selection
    this.currentShape = "Rect";
  }
  
  addCircle() {
    this.isDrawingShape = true;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.currentShape = "Circle";
  }
  
  addLine() {
    this.isDrawingShape = true;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.currentShape = "Line";
  }
  
  onMouseDown(event: fabric.IEvent) {
    if (!this.isDrawingShape) return;
  
    const pointer = this.canvas.getPointer(event.e);
    this.startX = pointer.x;
    this.startY = pointer.y;
  
    if (this.currentShape=="Rect") {
      console.log("recangle",this.currentShape);
      this.currentShape = new fabric.Rect({
        left: this.startX,
        top: this.startY,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        width: this.startY,
        height: this.startX,
      });
    } else if (this.currentShape =="Circle") {
      console.log("circle",this.currentShape);
      this.currentShape = new fabric.Circle({
        left: this.startX,
        top: this.startY,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        radius: (this.startX+this.startY)/2,
      });
    } else {
      console.log("line",this.currentShape);
      this.currentShape = new fabric.Line([this.startX, this.startY, this.startX, this.startY], {
        stroke: 'black',
        strokeWidth: 2,
      });
    }
  
    this.canvas.add(this.currentShape);
  }
  
  onMouseMove(event: fabric.IEvent) {
    if (!this.isDrawingShape || !this.currentShape) return;
  
    const pointer = this.canvas.getPointer(event.e);
  
    if (this.currentShape instanceof fabric.Rect) {
      this.currentShape.set({
        width: Math.abs(pointer.x - this.startX),
        height: Math.abs(pointer.y - this.startY),
      });
    } else if (this.currentShape instanceof fabric.Circle) {
      const radius = Math.sqrt(
        Math.pow(pointer.x - this.startX, 2) + Math.pow(pointer.y - this.startY, 2)
      );
      this.currentShape.set({ radius });
    } else if (this.currentShape instanceof fabric.Line) {
      this.currentShape.set({
        x2: pointer.x,
        y2: pointer.y,
      });
    }
  
    this.canvas.renderAll();
  }
  
  onMouseUp() {
    this.isDrawingShape = false;
    this.currentShape = null;
  }
  
}
