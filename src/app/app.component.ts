import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeolocationService } from './_services/geolocation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  latitude: number | null = null;
  longitude: number | null = null;
  title="iThrive";
  
  constructor(private geolocationService: GeolocationService) {}

  ngOnInit() {
    this.geolocationService.getCurrentPosition().subscribe({
      next: (coords: GeolocationCoordinates) => {
        this.latitude = coords.latitude;
        this.longitude = coords.longitude;
      },
      error: (err: any) => {
        console.error('Error getting location:', err);
      }
    });
  }
}