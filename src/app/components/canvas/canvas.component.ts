import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { Rect } from 'fabric/fabric-impl';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit{
  

  @ViewChild('imageCanvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;
  imageObject!: fabric.Image;
  private isDrawingShape = false;
  private currentShape!: any;
  private startX = 0;
  private startY = 0;
  @Input() showtools:boolean=false;
  // History stacks for undo and redo
  undoStack: string[] = [];
  redoStack: string[] = [];

  // Current adjustment values
  currentBrightness: number = 0; // Range: -1 to 1 (default 0)
  currentContrast: number = 0;   // Range: -1 to 1 (default 0)
  currentRed: number = 1;        // Range: 0 to 2 (default 1)
  currentGreen: number = 1;      // Range: 0 to 2 (default 1)
  currentBlue: number = 1;       // Range: 0 to 2 (default 1)

  // ngAfterViewInit() {
  //   this.canvas = new fabric.Canvas(this.canvasElement.nativeElement);
  // }

  ngOnInit(): void {
     // Set initial canvas dimensions
    // this.canvas.width = 800;
    // this.canvas.height = 600;
  }
  
  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement);
  
    this.loadFromLocalStorage();
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
     // Save the initial state of the canvas
     this.saveState();

     // Listen for events that change the canvas state
     this.canvas.on('object:added', () => this.saveToLocalStorage());
     this.canvas.on('object:modified', () => this.saveToLocalStorage());
     this.canvas.on('object:removed', () => this.saveToLocalStorage());
  }
  
// Loads an image onto the canvas and resets adjustment values.
  loadImage(imageSrc: string) {
    fabric.Image.fromURL(imageSrc, (img) => {
      this.imageObject = img;
      // Reset adjustment values
      this.currentBrightness = 0;
      this.currentContrast = 0;
      this.currentRed = 1;
      this.currentGreen = 1;
      this.currentBlue = 1;
      // Clear existing canvas and add the new image
      this.canvas.clear();
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
    console.log("this.canvas==============> ",this.canvas.freeDrawingBrush);
    
    const state = JSON.stringify(this.canvas.freeDrawingBrush);
    // Only push if the new state is different from the last state
    if (this.undoStack.length === 0 || this.undoStack[this.undoStack.length - 1] !== state) {
      this.undoStack.push(state);
      this.saveToLocalStorage();
    }
    this.redoStack=[];
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
  
    if (this.currentShape=="Rect" || this.currentShape instanceof fabric.Rect) {
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
    } else if (this.currentShape =="Circle" || this.currentShape instanceof fabric.Circle) {
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
    const state = JSON.stringify(this.canvas.toJSON());
    console.log(this.canvas);
    
    // Only push if the new state is different from the last state
    if (this.undoStack.length === 0 || this.undoStack[this.undoStack.length - 1] !== state) {
      this.undoStack.push(state);
      this.saveToLocalStorage();
    }
    this.redoStack=[];
    console.log("this.undoStack====>",this.undoStack);
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

   // Capture the current state of the canvas as JSON
  saveState() {
    const state = JSON.stringify(this.canvas.toJSON());
    // Only push if the new state is different from the last state
    if (this.undoStack.length === 0 || this.undoStack[this.undoStack.length - 1] !== state) {
      this.undoStack.push(state);
    }
    // Clear the redo stack because new actions invalidate the redo history
    this.redoStack = [];
  }

  undo() {
    console.log("this.undoStack ",this.undoStack);
    
    if (this.undoStack.length > 1) {
      // Remove the current state and push it to the redo stack
      const currentState = this.undoStack.pop();
      if (currentState) {
        this.redoStack.push(currentState);
      }
      // Get the previous state from the top of the undo stack
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.loadFromState(previousState);
    }
  }

  redo() {
    console.log("this.redoStack ",this.redoStack);
    
    if (this.redoStack.length>0) {
      const state = this.redoStack.pop();
      if (state) {
        // Save the current state to the undo stack before applying redo
        const currentState = JSON.stringify(this.canvas.toJSON());
        this.undoStack.push(state);
        this.loadFromState(state);
      }
    }
  }

  loadFromState(state: string) {
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
    });
  }

  saveToLocalStorage() {
    const canvasState = JSON.stringify(this.canvas.toJSON());
    localStorage.setItem('canvasState', canvasState);
  }  
  
  loadFromLocalStorage() {
    const savedState = localStorage.getItem('canvasState');
    if (savedState) {
      this.canvas.loadFromJSON(savedState, () => {
        this.canvas.renderAll();
      });
    }
  }
  
  clearCanvas() {
    this.canvas.clear();
    localStorage.removeItem('canvasState'); // Clear saved data
  }  
  
  exportAsImage(type: 'png' | 'jpeg') {
    // Define the MIME type based on selection.
    const mimeType = type === 'png' ? 'image/png' : 'image/jpeg';
    
    // Generate the data URL for the current canvas content.
    const dataURL = this.canvas.toDataURL({ format: type, quality: 0.8 });
  
    // Create a temporary link element.
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `edited-image.${type}`;
    
    // Append to the document and trigger download.
    document.body.appendChild(link);
    link.click();
    
    // Clean up.
    document.body.removeChild(link);
  }
  
  exportAsPNG() {
    this.exportAsImage('png');
  }
  
  exportAsJPEG() {
    this.exportAsImage('jpeg');
  }
  
    // Called when the brightness slider is moved.
    adjustBrightness(event: any) {
      this.currentBrightness = parseFloat(event.target.value);
      this.updateFilters();
    }
  
    // Called when the contrast slider is moved.
    adjustContrast(event: any) {
      this.currentContrast = parseFloat(event.target.value);
      this.updateFilters();
    }
  
    // Called when any of the RGB sliders are moved.
    adjustRGB(color: 'red' | 'green' | 'blue', event: any) {
      const value = parseFloat(event.target.value);
      if (color === 'red') {
        this.currentRed = value;
      } else if (color === 'green') {
        this.currentGreen = value;
      } else if (color === 'blue') {
        this.currentBlue = value;
      }
      this.updateFilters();
    }
  
    // Combines all filters (brightness, contrast, and RGB adjustments) and applies them.
    updateFilters() {
      if (!this.imageObject) return;
      const filters = [];
  
      // Apply brightness filter if needed.
      if (this.currentBrightness !== 0) {
        filters.push(new fabric.Image.filters.Brightness({ brightness: this.currentBrightness }));
      }
  
      // Apply contrast filter if needed.
      if (this.currentContrast !== 0) {
        filters.push(new fabric.Image.filters.Contrast({ contrast: this.currentContrast }));
      }
  
      // Apply RGB adjustments if any channel is not at its default value.
      if (this.currentRed !== 1 || this.currentGreen !== 1 || this.currentBlue !== 1) {
        filters.push(new fabric.Image.filters.ColorMatrix({
          matrix: [
            this.currentRed, 0, 0, 0, 0,
            0, this.currentGreen, 0, 0, 0,
            0, 0, this.currentBlue, 0, 0,
            0, 0, 0, 1, 0
          ]
        }));
      }
    // Update filters on the image and render the canvas.
    this.imageObject.filters = filters;
    this.imageObject.applyFilters();
    this.canvas.renderAll();
  }

  // Resets all adjustments to their default values.
  resetAdjustments() {
    this.currentBrightness = 0;
    this.currentContrast = 0;
    this.currentRed = 1;
    this.currentGreen = 1;
    this.currentBlue = 1;
    this.updateFilters();
  }
}  
