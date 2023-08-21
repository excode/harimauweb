import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Kyc = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any
  }

  export type KycQuery = Kyc & {
    
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type KycKey = keyof Kyc;
    
export class KycService {
     
  getKyc(request:KycQuery) {
      return getDatas<Kyc,KycQuery>( '/kyc',request)
  }
  getKycAll(request:KycQuery) {
    return getDataAll<Kyc,KycQuery>( '/kyc/all',request) 
  }
  getKycSuggestions(keyword:string) {
    return getDataSuggestions<Kyc>( '/kyc/suggestions',keyword) 
  }
  getKycDetails(id:string){
    return getData<Kyc>('/kyc/'+ id);
  }
  addKyc (request:Kyc) {
    return postData<Kyc>('/kyc',request);
    
  }
  updateKyc (request:Kyc) {
    const {id,...rest}  =request
    return   patchData<Kyc>( '/kyc/'+ id, rest );
  }
  deleteKyc (id:string) {
    return   deleteData<Kyc>( '/kyc/'+ id );
  }
}
   
    