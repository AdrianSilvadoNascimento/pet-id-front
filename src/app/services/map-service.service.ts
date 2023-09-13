import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

import { Map, tileLayer, marker } from 'leaflet'
import * as L from 'leaflet-control-geocoder'
import { AddressModel } from '../models/address-model'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: any
  private address: any
  private addressSubject = new Subject<any>()
  private coords: { lat: number, lng: number } = { lat: 0, lng: 0 }
  private geocoderControl: any
  private maxZoom: number = 13
  private readonly mapUrl = environment.mapUrl
  private readonly mapAttribution = environment.mapAttribution

  /**
   * To initialize a map in the application.
   * 
   * @param elementId - The map div element.
   */
  initializeMap(elementId: string): void {
    if (!elementId) return

    this.getCurrentPosition()
    this.map = new Map(elementId, {
      maxZoom: 4,
      minZoom: 4,
    }).setView(this.coords, this.maxZoom)

    tileLayer(this.mapUrl, {
      maxZoom: 20,
      attribution: this.mapAttribution,
    }).addTo(this.map)
  }

  /**
   * Emit the address.
   * 
   * @param address Address
   */
  private emitAddress(address: any): void {
    this.addressSubject.next(address)
  }

  /**
   * To get the address value behind components.
   * 
   * @returns The address.
   */
  getAddress(): Observable<any> {
    return this.addressSubject.asObservable()
  }

  /**
   * Geocode the provided address to get coordinates.
   * 
   * @param address The address to geocode.
   * @returns Coordinates { lat: number, lng: number } of the address.
   */
  async geocodeAddress(address: AddressModel): Promise<{ lat: number, lng: number }> {
    return new Promise((resolve, reject) => {
      const geocoder = L.geocoders.nominatim()

      geocoder.geocode(
        address.street_name + ' ' + address.house_number + ', ' + address.city,
        (results: any) => {
          if (results && results.length > 0) {
            const { lat, lng } = results[0].center
            resolve({ lat, lng })
          } else {
            reject('Address not found.')
          }
        },
        () => {
          reject('Geocoding request failed.')
        }
      )
    })
  }

  /**
   * Add a autocomplete for search places.
   */
  addSearchControl(): void {
    this.geocoderControl = L.geocoder({
      defaultMarkGeocode: true,
      position: 'topright',
      placeholder: 'Pesquisar Endereço...',
      geocoder: L.geocoders.nominatim(),
    }).on('markgeocode', (event: any) => {
      const { center, properties } = event.geocode
      this.coords.lat = center.lat
      this.coords.lng = center.lng
      this.address = properties.address
      this.emitAddress(this.address)
      this.findMyPosition()
    })
    
    this.geocoderControl.addTo(this.map)
  }

  searchControlForAddressAndCoords(): void {
    this.geocoderControl = L.geocoder({
      defaultMarkGeocode: true,
      position: 'topright',
      placeholder: 'Pesquisar Endereço...',
      geocoder: L.geocoders.nominatim(),
    }).on('markgeocode', (event: any) => {
      const { center, properties } = event.geocode
      this.map.flyTo(center, this.maxZoom)
      this.coords.lat = center.lat
      this.coords.lng = center.lng
      this.address = properties.address

      const completeAddress = [this.address, this.coords]
      this.emitAddress(completeAddress)
    })

    this.geocoderControl.addTo(this.map)
  }

  /**
   * Fly to the current user position.
   */
  findMyPosition(): void {
    this.map?.flyTo([this.coords?.lat, this.coords?.lng], this.maxZoom)
    marker([this.coords.lat, this.coords.lng]).addTo(this.map)
  }

  /**
   * To get the current coords.
   * 
   * @returns Coords
   */
  getCurrentCoords(): { lat: number, lng: number } {
    return this.coords
  }

  /**
   * Get the current user position.
   */
  getCurrentPosition(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.coords.lat = coords.latitude
        this.coords.lng = coords.longitude
      })
    }
  }
}
