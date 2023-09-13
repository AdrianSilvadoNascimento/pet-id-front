export class PetModel {
  id: string = ''
  name: string = ''
  breed: string = ''
  gender: string = ''
  age: number = 0
  isDocile: string = ''
  isInHome: string = ''
  petImage!: ArrayBuffer | BlobPart | Blob
  petImageDistant!: ArrayBuffer | BlobPart | Blob
  userId: string = ''
}
