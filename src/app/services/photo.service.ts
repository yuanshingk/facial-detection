import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photo: InMemoryPhoto;

  constructor(private http: HttpClient) {
  }

  public checkLiveness(): Observable<boolean> {
    return this.http
      .get('https://facial-detection-333313.as.r.appspot.com/liveness', { responseType : 'text' })
      .pipe(
        map(_ => true)
      );
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 30
    });

    this.photo = {
      webviewPath: capturedPhoto.webPath,
      faceCount: 'Processing...',
    };

    const base64Data = await this.readAsBase64(capturedPhoto);

    // Call Facial Detaction API
    this.http.post(
      'https://facial-detection-333313.as.r.appspot.com/images',
      {
        image: base64Data
      })
      .subscribe(data => {
        const castData = data as ApiResponse;
        this.photo.faceCount = `Total faces: ${castData.count}`;
      });
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
  faceCount: string;
}

export interface ApiResponse {
  count: string;
}
