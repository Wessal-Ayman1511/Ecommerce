import * as bcrypt from 'bcrypt'
import { config } from 'dotenv'


config()

export const hash = (text:string, saltRound: number =Number(process.env.SALT_ROUND)) => {
    return bcrypt.hashSync(text, saltRound)

}

export const compareHash = (text:string, hashedText:string) => {
    return bcrypt.compareSync(text, hashedText)
}