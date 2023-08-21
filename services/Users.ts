import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Users = {
  	usertype: number|any;
			lastname: string|any;
			emailotp?: string|any;
			firstname?: string|any;
			password?: string|any;
			email: string|any;
			mobile: string|any;
			id?: string|any;
			emailotpexpires?: number|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			referral: string|any
  }

  export type UsersQuery = Omit<Users, 'usertype'|'lastname'|'email'|'mobile'|'referral'> & {
    usertype?: number;
lastname?: string;
email?: string;
mobile?: string;
referral?: string
      usertype_mode?: string;
  lastname_mode?: string;
  emailotp_mode?: string;
  firstname_mode?: string;
  email_mode?: string;
  mobile_mode?: string;
  emailotpexpires_mode?: string;
  createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  referral_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type UsersKey = keyof Users;
    
export class UsersService {
     
  getUsers(request:UsersQuery) {
      return getDatas<Users,UsersQuery>( '/users',request)
  }
  getUsersAll(request:UsersQuery) {
    return getDataAll<Users,UsersQuery>( '/users/all',request) 
  }
  getUsersSuggestions(keyword:string) {
    return getDataSuggestions<Users>( '/users/suggestions',keyword) 
  }
  getUsersDetails(id:string){
    return getData<Users>('/users/'+ id);
  }
  addUsers (request:Users) {
    return postData<Users>('/users',request);
    
  }
  updateUsers (request:Users) {
    const {id,...rest}  =request
    return   patchData<Users>( '/users/'+ id, rest );
  }
  deleteUsers (id:string) {
    return   deleteData<Users>( '/users/'+ id );
  }
}
   
    