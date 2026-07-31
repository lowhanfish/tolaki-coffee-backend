import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {

  
  authRegister(){
      
  }
  authLogin(){

  }
  authRT(){

  }

  authProfile(){
    
  }
  
  findOne(email : string){
    return `Hy saya dari services, username saya adalah ${email}`
  }

}
