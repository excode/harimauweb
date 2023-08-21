import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Transaction = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			wallettype: string|any;
			walletid: string|any;
			amount: number|any;
			balance: number|any
  }

  export type TransactionQuery = Omit<Transaction, 'wallettype'|'walletid'|'amount'|'balance'> & {
    wallettype?: string;
walletid?: string;
amount?: number;
balance?: number
      createby_mode?: string;
  createat_mode?: string;
  wallettype_mode?: string;
  walletid_mode?: string;
  amount_mode?: string;
  balance_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type TransactionKey = keyof Transaction;
    
export class TransactionService {
     
  getTransaction(request:TransactionQuery) {
      return getDatas<Transaction,TransactionQuery>( '/transaction',request)
  }
  getTransactionAll(request:TransactionQuery) {
    return getDataAll<Transaction,TransactionQuery>( '/transaction/all',request) 
  }
  getTransactionSuggestions(keyword:string) {
    return getDataSuggestions<Transaction>( '/transaction/suggestions',keyword) 
  }
  getTransactionDetails(id:string){
    return getData<Transaction>('/transaction/'+ id);
  }
  addTransaction (request:Transaction) {
    return postData<Transaction>('/transaction',request);
    
  }
  updateTransaction (request:Transaction) {
    const {id,...rest}  =request
    return   patchData<Transaction>( '/transaction/'+ id, rest );
  }
  deleteTransaction (id:string) {
    return   deleteData<Transaction>( '/transaction/'+ id );
  }
}
   
    