import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Referral = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			email: string|any;
			amount: number|any;
			status?: string|any
  }

  export type ReferralQuery = Omit<Referral, 'email'|'amount'> & {
    email?: string;
amount?: number
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  email_mode?: string;
  amount_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type ReferralKey = keyof Referral;
    
export class ReferralService {
     
  getReferral(request:ReferralQuery) {
      return getDatas<Referral,ReferralQuery>( '/referral',request)
  }
  getReferralAll(request:ReferralQuery) {
    return getDataAll<Referral,ReferralQuery>( '/referral/all',request) 
  }
  getReferralSuggestions(keyword:string) {
    return getDataSuggestions<Referral>( '/referral/suggestions',keyword) 
  }
  getReferralDetails(id:string){
    return getData<Referral>('/referral/'+ id);
  }
  addReferral (request:Referral) {
    return postData<Referral>('/referral',request);
    
  }
  updateReferral (request:Referral) {
    const {id,...rest}  =request
    return   patchData<Referral>( '/referral/'+ id, rest );
  }
  deleteReferral (id:string) {
    return   deleteData<Referral>( '/referral/'+ id );
  }
}
   
    