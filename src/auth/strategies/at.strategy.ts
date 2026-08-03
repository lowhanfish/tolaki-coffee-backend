import {Injectable} from "@nestjs/common"
import {PassportStrategy} from "@nestjs/passport"
import {ExtractJwt, Strategy} from "passport-jwt"


export type payload = {
  sub : string,
  email : string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  // 1. Konfigurasi Aturan Token (Super Class):
  constructor(){
    super({
      //    * Sumber Token: Tangkap string JWT dari Header Request Authorization: Bearer <token>.
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      //    * Cek Kadaluarsa (ignoreExpiration: false): Beri instruksi ke Passport agar token yang sudah lewati batas waktu ($15\text{m}$) langsung ditolak (Throw 401 Unauthorized).
      ignoreExpiration : false,
      //    * Verifikasi Signature: Gunakan JWT_ACCESS_SECRET untuk memastikan token tidak diubah/dipalsukan oleh hacker.
      secretOrKey : process.env.JWT_ACCESS_SECRET || "my-JWT_ACCESS_SECRET"
    })
  }

// 2. Eksekusi Validasi (validate):
//    * Jika token lolos uji (asli & belum expired), Passport mengekstrak isi payload-nya (sub dan username).
validate(payload:payload){
  // 3. Attach ke Request Context:
  //    * Return payload tersebut agar otomatis ditempelkan NestJS ke dalam req.user (sehingga ID & Username user yang login bisa dipakai di Controller manapun).
  return payload
}


}