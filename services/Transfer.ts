import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Transfer = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			amount: number|any;
			wallettype?: string|any;
			wallet?: string|any;
			sourcewallet: string|any;
			status: string|any;
			comments?: string|any
  }

  export type TransferQuery = Omit<Transfer, 'amount'|'sourcewallet'|'status'> & {
    amount?: number;
sourcewallet?: string;
status?: string
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  amount_mode?: string;
  sourcewallet_mode?: string;
  status_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type TransferKey = keyof Transfer;
    
export class TransferService {
     
  getTransfer(request:TransferQuery) {
      return getDatas<Transfer,TransferQuery>( '/transfer',request)
  }
  getTransferAll(request:TransferQuery) {
    return getDataAll<Transfer,TransferQuery>( '/transfer/all',request) 
  }
  getTransferSuggestions(keyword:string) {
    return getDataSuggestions<Transfer>( '/transfer/suggestions',keyword) 
  }
  getTransferDetails(id:string){
    return getData<Transfer>('/transfer/'+ id);
  }
  addTransfer (request:Transfer) {
    return postData<Transfer>('/transfer',request);
    
  }
  updateTransfer (request:Transfer) {
    const {id,...rest}  =request
    return   patchData<Transfer>( '/transfer/'+ id, rest );
  }
  deleteTransfer (id:string) {
    return   deleteData<Transfer>( '/transfer/'+ id );
  }
}
   
    