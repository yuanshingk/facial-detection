import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photo: InMemoryPhoto;

  constructor() {
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const base64Data = await this.readAsBase64(capturedPhoto);
    console.log(base64Data);
    this.photo = {
      webviewPath: capturedPhoto.webPath,
      base64Data
    };
  }

  private async readAsBase64(cameraPhoto: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    const base64FullString = await this.convertBlobToBase64(blob) as string;
    return base64FullString.split('base64,')[1];
  }

  private convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}

export interface InMemoryPhoto {
  webviewPath: string;
  base64Data: string;
}
