import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Ewallets = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			wallettype: string|any;
			balance: number|any;
			hold: number|any;
			status?: boolean|any;
			blocked?: boolean|any;
			name: string|any
  }

  export type EwalletsQuery = Omit<Ewallets, 'wallettype'|'balance'|'hold'|'status'|'blocked'|'name'> & {
    wallettype?: string;
balance?: number;
hold?: number;
status?: boolean;
blocked?: boolean;
name?: string
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  wallettype_mode?: string;
  balance_mode?: string;
  hold_mode?: string;
  name_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type EwalletsKey = keyof Ewallets;
    
export class EwalletsService {
     
  getEwallets(request:EwalletsQuery) {
      return getDatas<Ewallets,EwalletsQuery>( '/ewallets',request)
  }
  getEwalletsAll(request:EwalletsQuery) {
    return getDataAll<Ewallets,EwalletsQuery>( '/ewallets/all',request) 
  }
  getEwalletsSuggestions(keyword:string) {
    return getDataSuggestions<Ewallets>( '/ewallets/suggestions',keyword) 
  }
  getEwalletsDetails(id:string){
    return getData<Ewallets>('/ewallets/'+ id);
  }
  addEwallets (request:Ewallets) {
    return postData<Ewallets>('/ewallets',request);
    
  }
  updateEwallets (request:Ewallets) {
    const {id,...rest}  =request
    return   patchData<Ewallets>( '/ewallets/'+ id, rest );
  }
  deleteEwallets (id:string) {
    return   deleteData<Ewallets>( '/ewallets/'+ id );
  }
}
   
    