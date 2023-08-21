import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type UserDetails = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			address: string|any;
			icpassport: string|any;
			photo?: string|any;
			icdocument?: string|any
  }

  export type UserDetailsQuery = Omit<UserDetails, 'address'|'icpassport'> & {
    address?: string;
icpassport?: string
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  address_mode?: string;
  icpassport_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type UserDetailsKey = keyof UserDetails;
    
export class UserDetailsService {
     
  getUserDetails(request:UserDetailsQuery) {
      return getDatas<UserDetails,UserDetailsQuery>( '/userDetails',request)
  }
  getUserDetailsAll(request:UserDetailsQuery) {
    return getDataAll<UserDetails,UserDetailsQuery>( '/userDetails/all',request) 
  }
  getUserDetailsSuggestions(keyword:string) {
    return getDataSuggestions<UserDetails>( '/userDetails/suggestions',keyword) 
  }
  getUserDetailsDetails(id:string){
    return getData<UserDetails>('/userDetails/'+ id);
  }
  addUserDetails (request:UserDetails) {
    return postData<UserDetails>('/userDetails',request);
    
  }
  updateUserDetails (request:UserDetails) {
    const {id,...rest}  =request
    return   patchData<UserDetails>( '/userDetails/'+ id, rest );
  }
  deleteUserDetails (id:string) {
    return   deleteData<UserDetails>( '/userDetails/'+ id );
  }
}
   
    