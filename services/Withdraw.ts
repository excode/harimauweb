import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Withdraw = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			wallettype?: string|any;
			wallet?: string|any;
			amount: number|any;
			status?: string|any;
			comment?: string|any
  }

  export type WithdrawQuery = Omit<Withdraw, 'amount'> & {
    amount?: number
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  amount_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type WithdrawKey = keyof Withdraw;
    
export class WithdrawService {
     
  getWithdraw(request:WithdrawQuery) {
      return getDatas<Withdraw,WithdrawQuery>( '/withdraw',request)
  }
  getWithdrawAll(request:WithdrawQuery) {
    return getDataAll<Withdraw,WithdrawQuery>( '/withdraw/all',request) 
  }
  getWithdrawSuggestions(keyword:string) {
    return getDataSuggestions<Withdraw>( '/withdraw/suggestions',keyword) 
  }
  getWithdrawDetails(id:string){
    return getData<Withdraw>('/withdraw/'+ id);
  }
  addWithdraw (request:Withdraw) {
    return postData<Withdraw>('/withdraw',request);
    
  }
  updateWithdraw (request:Withdraw) {
    const {id,...rest}  =request
    return   patchData<Withdraw>( '/withdraw/'+ id, rest );
  }
  deleteWithdraw (id:string) {
    return   deleteData<Withdraw>( '/withdraw/'+ id );
  }
}
   
    