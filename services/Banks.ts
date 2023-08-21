import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Banks = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			bankname: string|any;
			swiftcode: string|any;
			bankaddress: string|any;
			city: string|any;
			state: string|any;
			postcode: string|any;
			accountname: string|any;
			accountnumber: string|any;
			document?: string|any;
			active?: boolean|any
  }

  export type BanksQuery = Omit<Banks, 'bankname'|'swiftcode'|'bankaddress'|'city'|'state'|'postcode'|'accountname'|'accountnumber'|'active'> & {
    bankname?: string;
swiftcode?: string;
bankaddress?: string;
city?: string;
state?: string;
postcode?: string;
accountname?: string;
accountnumber?: string;
active?: boolean
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  bankname_mode?: string;
  swiftcode_mode?: string;
  bankaddress_mode?: string;
  city_mode?: string;
  state_mode?: string;
  postcode_mode?: string;
  accountname_mode?: string;
  accountnumber_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type BanksKey = keyof Banks;
    
export class BanksService {
     
  getBanks(request:BanksQuery) {
      return getDatas<Banks,BanksQuery>( '/banks',request)
  }
  getBanksAll(request:BanksQuery) {
    return getDataAll<Banks,BanksQuery>( '/banks/all',request) 
  }
  getBanksSuggestions(keyword:string) {
    return getDataSuggestions<Banks>( '/banks/suggestions',keyword) 
  }
  getBanksDetails(id:string){
    return getData<Banks>('/banks/'+ id);
  }
  addBanks (request:Banks) {
    return postData<Banks>('/banks',request);
    
  }
  updateBanks (request:Banks) {
    const {id,...rest}  =request
    return   patchData<Banks>( '/banks/'+ id, rest );
  }
  deleteBanks (id:string) {
    return   deleteData<Banks>( '/banks/'+ id );
  }
}
   
    