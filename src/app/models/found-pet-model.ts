export class PetFoundModel {
  id: string = ''
  gender: string = ''
  age: number = 0
  geo: string = ''
  petImage!: ArrayBuffer | BlobPart | Blob
}
