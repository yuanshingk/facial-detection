import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  healthy = false;

  constructor(public photoService: PhotoService) { }

  ngOnInit() {
    this.photoService.checkLiveness().subscribe(healthy => {
      this.healthy = healthy;
    });
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
