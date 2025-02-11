import { Component, ElementRef, ViewChild } from '@angular/core';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

@Component({
  selector: 'app-background-remover',
  templateUrl: './background-remover.component.html',
  styleUrls: ['./background-remover.component.scss']
})
export class BackgroundRemoverComponent {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;
  imageSrc: string | null = null;
  loading = false;

  async onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.processImage();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async processImage() {
    if (!this.imageSrc || !this.canvas) return;
    this.loading = true;
    
    const img = new Image();
    img.src = this.imageSrc;
    img.onload = async () => {
      const canvasElement = this.canvas.nativeElement;
      const ctx = canvasElement.getContext('2d');
      if (!ctx) return;
      
      canvasElement.width = img.width;
      canvasElement.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const net = await bodyPix.load();
      const segmentation = await net.segmentPerson(canvasElement);
      
      const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const pixelData = imageData.data;
      
      for (let i = 0; i < pixelData.length; i += 4) {
        if (segmentation.data[i / 4] === 0) {
          pixelData[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      this.loading = false;
    };
  }
}
