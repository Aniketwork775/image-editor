import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './components/upload/upload.component';
import { EditorComponent } from './components/editor/editor.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropperComponent } from './components/cropper/cropper.component';
import { BackgroundRemoverComponent } from './background-remover/background-remover.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    EditorComponent,
    ToolbarComponent,
    CanvasComponent,
    SidebarComponent,
    CropperComponent,
    BackgroundRemoverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
