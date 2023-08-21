import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Deposit = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			wallettype?: string|any;
			wallet?: string|any;
			amount: number|any;
			document?: string|any;
			method: string|any;
			comments?: string|any;
			status?: string|any
  }

  export type DepositQuery = Omit<Deposit, 'amount'|'method'> & {
    amount?: number;
method?: string
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  amount_mode?: string;
  method_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type DepositKey = keyof Deposit;
    
export class DepositService {
     
  getDeposit(request:DepositQuery) {
      return getDatas<Deposit,DepositQuery>( '/deposit',request)
  }
  getDepositAll(request:DepositQuery) {
    return getDataAll<Deposit,DepositQuery>( '/deposit/all',request) 
  }
  getDepositSuggestions(keyword:string) {
    return getDataSuggestions<Deposit>( '/deposit/suggestions',keyword) 
  }
  getDepositDetails(id:string){
    return getData<Deposit>('/deposit/'+ id);
  }
  addDeposit (request:Deposit) {
    return postData<Deposit>('/deposit',request);
    
  }
  updateDeposit (request:Deposit) {
    const {id,...rest}  =request
    return   patchData<Deposit>( '/deposit/'+ id, rest );
  }
  deleteDeposit (id:string) {
    return   deleteData<Deposit>( '/deposit/'+ id );
  }
}
   
    