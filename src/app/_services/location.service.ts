import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiKey = 'AIzaSyD4UWVzo5WwYgqheYY4_yXE5ROBWs1DT14';

  constructor(private http: HttpClient) {}

  getCoordinatesFromAddress(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response.results && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        }
        return null;
      })
    );
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  findClosestLocation(address: string, locations: { name: string; lat: number; lng: number }[]) {
    return this.getCoordinatesFromAddress(address).pipe(
      map(addressCoords => {
        if (!addressCoords) {
          return null;
        }

        let closestLocation = null;
        let shortestDistance = Infinity;

        locations.forEach(location => {
          const distance = this.calculateDistance(addressCoords.lat, addressCoords.lng, location.lat, location.lng);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            closestLocation = location;
          }
        });
        return closestLocation;
      })
    );
  }
}