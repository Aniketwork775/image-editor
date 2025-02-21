import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() showtools:boolean=false;
  @Output() rotateClicked = new EventEmitter();
  @Output() resizeClicked = new EventEmitter<number>();
  @Output() cropClicked = new EventEmitter();
  @Output() brightnessClicked = new EventEmitter();
  @Output() rbrightnessClicked = new EventEmitter();
  @Output() contrastClicked = new EventEmitter();
  @Output() grayscaleClicked = new EventEmitter();
  @Output() brushClicked = new EventEmitter();
  @Output() textClicked = new EventEmitter();
  @Output() rectangleClicked = new EventEmitter();
  @Output() circleClicked = new EventEmitter();
  @Output() lineClicked = new EventEmitter();
  @Output() undoClicked = new EventEmitter();
  @Output() redoClicked = new EventEmitter();
  @Output() exportPNGClicked = new EventEmitter<void>();
  @Output() exportJPEGClicked = new EventEmitter<void>();
  
  selectedTool = '';
  scalerFactor:number=1;
  @Output() clearCanvasClicked = new EventEmitter();
  clearCanvas() {
    this.clearCanvasClicked.emit();
  }
  
  rotate() {
    this.rotateClicked.emit();
  }

  zoomIn(){
    this.scalerFactor=this.scalerFactor+0.1;
    console.log("this.scalerFactor============",this.scalerFactor);
    this.resize(this.scalerFactor);
  }
  
  zoomOut(){
    this.scalerFactor=this.scalerFactor-0.1;
    console.log("this.scalerFactor============",this.scalerFactor);
    this.resize(this.scalerFactor);
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
  

  setBrush() {
    this.selectedTool = 'brush';
    this.brushClicked.emit();
  }
  
  addText() {
    this.selectedTool = 'text';
    this.textClicked.emit();
  }
  
  addRectangle() {
    this.selectedTool = 'rectangle';
    this.rectangleClicked.emit();
  }
  
  addCircle() {
    this.selectedTool = 'circle';
    this.circleClicked.emit();
  }
  
  addLine() {
    this.selectedTool = 'line';
    this.lineClicked.emit();
  }
  // setBrush() {
  //   this.brushClicked.emit();
  // }

  // addText() {
  //   this.textClicked.emit();
  // }

  // addRectangle() {
  //   this.rectangleClicked.emit();
  // }

  // addCircle() {
  //   this.circleClicked.emit();
  // }

  // addLine() {
  //   this.lineClicked.emit();
  // }

  undo() {
    this.undoClicked.emit();
  }

  redo() {
    this.redoClicked.emit();
  }

  exportAsPNG() {
    this.exportPNGClicked.emit();
  }

  exportAsJPEG() {
    this.exportJPEGClicked.emit();
  }
}
