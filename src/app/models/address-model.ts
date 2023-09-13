export class AddressModel {
  street_name: string = ''
  house_number: string = ''
  city: string = ''
  complement: string = ''
  cep_number: string = ''
  coords: { lat: number, lng: number } = { lat: 0, lng: 0 }
}
