import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ImageConversionService {
  constructor() { }

  /**
   * To convert image to base64
   * 
   * @param data - The image.
   * @returns {string} - base64
   */
  convertToBase64(data: ArrayBuffer | BlobPart | Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event: any) => {
        resolve(event.target.result)
      }
      reader.onerror = (event: any) => {
        reject(event.target.error)
      }

      if (data instanceof ArrayBuffer) {
        reader.readAsDataURL(new Blob([data]))
      } else if (data instanceof Blob) {
        reader.readAsDataURL(data)
      } else {
        reject('Invalid data type')
      }
    })
  }
}
