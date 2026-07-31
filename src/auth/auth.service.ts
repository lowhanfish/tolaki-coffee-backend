import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';


@Injectable()
export class AuthService {

  
  authRegister(){
    // 1. Cek Akun (email/password) apakah sudah ada atau belum.
    // 2. Kalau sudah ada kembalikan Bad Request Exception.
    // 3. Hasing password dari dto menggunakan bcrypt.
    // 4. Store dto ke dalam database  dengan prisma, termasuk password yang telah di hasing.
    // 5. Tangkap id dan username/email dari data yang baru saja kita masukkan ke database.
    // 6. Generate token (Access Token (AT): 15 menit, Refresh Token (RT) : 7 Hari) berdasarkan (id, username/email) dari data yang kita tangkap sebelumnya.
    // 7. Hasing RT yang baru saja di generate. 
    // 8. Update tabel akun yang bersangkutan dengan mengubah RT hasil hashing.
    // 9. Set refreshToken ke dalam header HTTP Response sebagai HTTP-Only Cookie.
    // 10. Return accessToken (dan data user ringkas) di JSON Body response.

      
  }
  authLogin(){

    // 1. Cek Keberadaan User: Cari user di DB via Prisma berdasarkan email. Jika tidak ketemu = Throw UnauthorizedException('Invalid credentials').
    // 2. Verifikasi Password: Bandingkan password dari DTO dengan password (hash) di DB menggunakan bcrypt.compare(). Jika tidak cocok = Throw UnauthorizedException('Invalid credentials').
    // 3. Generate JWT Tokens: Buat accessToken (misal exp: 15m) dan refreshToken (misal exp: 7d).
    // 4. Hash Refresh Token: Lakukan bcrypt.hash(refreshToken, 10).
    // 5. Update DB via Prisma: Simpan Hash Refresh Token ke field hashedRefreshToken milik user tersebut di database.
    // 6. Set refreshToken ke dalam header HTTP Response sebagai HTTP-Only Cookie.
    // 7. Return accessToken (dan data user ringkas) di JSON Body response.

  }
  authRT(){

  }

  authProfile(){

  }
  
  findOne(email : string){
    return `Hy saya dari services, username saya adalah ${email}`
  }

}
