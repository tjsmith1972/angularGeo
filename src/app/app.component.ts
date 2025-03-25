import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeolocationService } from './_services/geolocation.service';
import { LocationService } from './_services/location.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  latitude: number | null = null;
  longitude: number | null = null;
  lat1: number | null = null;
  lon1: number | null = null;
  lat2: number | null = null;
  lon2: number | null = null;

  title="iThrive";
  distance: any;
  
  constructor(private geolocationService: GeolocationService, private locationService: LocationService) {}

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
    this.locationService.getCoordinatesFromAddress('2908 Lake Louise Dr, Powhatan, VA').subscribe({
      next: (coords: { lat: any; lng: any } | null) => {
        if (coords) {
          this.lat1 = coords.lat;
          this.lon1 = coords.lng;
        }
      },
      error: (err: any) => {
        console.error('Error getting coordinates from address:', err);
      },
      complete: () => {
        
          this.locationService.getCoordinatesFromAddress('411 Walnut St, Green Cove Springs, FL').subscribe({
            next: (coords: { lat: any; lng: any } | null) => {
              if (coords) {
                this.lat2 = coords.lat;
                this.lon2 = coords.lng;
                // Calculate distance between the two coordinates
                if (this.lat1 !== null && this.lon1 !== null && this.lat2 !== null && this.lon2 !== null) {
                  this.distance = this.locationService.calculateDistance(this.lat1, this.lon1, this.lat2, this.lon2);
                   console.log(`Distance between the two locations: ${this.distance} km`);
                }
              }
            },
            error: (err: any) => {
              console.error('Error getting coordinates from address:', err);
            }
          });
      }
    });
  }
}