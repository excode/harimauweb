import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Exchange = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			sourcewallet?: string|any;
			wallet?: string|any;
			amount: number|any;
			comments?: string|any;
			sourcewallettype?: string|any;
			wallettype?: string|any;
			status?: string|any
  }

  export type ExchangeQuery = Omit<Exchange, 'amount'> & {
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
  export type ExchangeKey = keyof Exchange;
    
export class ExchangeService {
     
  getExchange(request:ExchangeQuery) {
      return getDatas<Exchange,ExchangeQuery>( '/exchange',request)
  }
  getExchangeAll(request:ExchangeQuery) {
    return getDataAll<Exchange,ExchangeQuery>( '/exchange/all',request) 
  }
  getExchangeSuggestions(keyword:string) {
    return getDataSuggestions<Exchange>( '/exchange/suggestions',keyword) 
  }
  getExchangeDetails(id:string){
    return getData<Exchange>('/exchange/'+ id);
  }
  addExchange (request:Exchange) {
    return postData<Exchange>('/exchange',request);
    
  }
  updateExchange (request:Exchange) {
    const {id,...rest}  =request
    return   patchData<Exchange>( '/exchange/'+ id, rest );
  }
  deleteExchange (id:string) {
    return   deleteData<Exchange>( '/exchange/'+ id );
  }
}
   
    