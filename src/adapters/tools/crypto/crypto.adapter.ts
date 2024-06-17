import { CrypotInterface } from './crypto.adapter.interface'
import { randomUUID } from 'crypto'
import * as CryptoJS from 'crypto-js'

export class Cryptodapter implements CrypotInterface {
  generateUUID (): string {
    return randomUUID()
  }

  encrypt (input: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(input), process.env.ENCRYPT_KEY!).toString()
  }
}
