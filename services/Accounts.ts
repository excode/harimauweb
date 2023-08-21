import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Accounts = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			accounttype: string|any;
			quantity: number|any;
			unitprice: number|any;
			total: number|any;
			maturedate?: Date|any;
			termscount: number|any;
			monthcount: number|any;
			status: string|any;
			block?: boolean|any;
			owner: string|any
  }

  export type AccountsQuery = Omit<Accounts, 'accounttype'|'quantity'|'unitprice'|'total'|'maturedate'|'termscount'|'monthcount'|'status'|'block'|'owner'> & {
    accounttype?: string;
quantity?: number;
unitprice?: number;
total?: number;
maturedate?: Date;
termscount?: number;
monthcount?: number;
status?: string;
block?: boolean;
owner?: string
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  accounttype_mode?: string;
  quantity_mode?: string;
  unitprice_mode?: string;
  total_mode?: string;
  maturedate_mode?: string;
  termscount_mode?: string;
  monthcount_mode?: string;
  status_mode?: string;
  owner_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type AccountsKey = keyof Accounts;
    
export class AccountsService {
     
  getAccounts(request:AccountsQuery) {
      return getDatas<Accounts,AccountsQuery>( '/accounts',request)
  }
  getAccountsAll(request:AccountsQuery) {
    return getDataAll<Accounts,AccountsQuery>( '/accounts/all',request) 
  }
  getAccountsSuggestions(keyword:string) {
    return getDataSuggestions<Accounts>( '/accounts/suggestions',keyword) 
  }
  getAccountsDetails(id:string){
    return getData<Accounts>('/accounts/'+ id);
  }
  addAccounts (request:Accounts) {
    return postData<Accounts>('/accounts',request);
    
  }
  updateAccounts (request:Accounts) {
    const {id,...rest}  =request
    return   patchData<Accounts>( '/accounts/'+ id, rest );
  }
  deleteAccounts (id:string) {
    return   deleteData<Accounts>( '/accounts/'+ id );
  }
}
   
    