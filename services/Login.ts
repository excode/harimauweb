import { postLoginData } from '@lib/httpRequest';

export type LoginData = {
  email:String,
  password: String
};
export type UserData = {
  email:String,
  firstname?: String,
  lastname?: String,
  mobile?: String,
  userId?: String,
  image?: String,
  expireAt?:number,
  permissionLevel?:number,
  webAccess?:number,
  exp?:number,
  iat?:number
};

    export class LoginService {
      constructor() {
          
      }
    
      
       login (request:LoginData) {
        const response =  postLoginData('/auth',request);
        return response;
      }
      
      
   
    }