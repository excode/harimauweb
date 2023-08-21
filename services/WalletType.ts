import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type WalletType = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			name: string|any;
			code: string|any;
			decimalposition: number|any;
			maxtransfer: number|any;
			active?: boolean|any
  }

  export type WalletTypeQuery = Omit<WalletType, 'name'|'code'|'decimalposition'|'maxtransfer'|'active'> & {
    name?: string;
code?: string;
decimalposition?: number;
maxtransfer?: number;
active?: boolean
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  name_mode?: string;
  code_mode?: string;
  decimalposition_mode?: string;
  maxtransfer_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type WalletTypeKey = keyof WalletType;
    
export class WalletTypeService {
     
  getWalletType(request:WalletTypeQuery) {
      return getDatas<WalletType,WalletTypeQuery>( '/walletType',request)
  }
  getWalletTypeAll(request:WalletTypeQuery) {
    return getDataAll<WalletType,WalletTypeQuery>( '/walletType/all',request) 
  }
  getWalletTypeSuggestions(keyword:string) {
    return getDataSuggestions<WalletType>( '/walletType/suggestions',keyword) 
  }
  getWalletTypeDetails(id:string){
    return getData<WalletType>('/walletType/'+ id);
  }
  addWalletType (request:WalletType) {
    return postData<WalletType>('/walletType',request);
    
  }
  updateWalletType (request:WalletType) {
    const {id,...rest}  =request
    return   patchData<WalletType>( '/walletType/'+ id, rest );
  }
  deleteWalletType (id:string) {
    return   deleteData<WalletType>( '/walletType/'+ id );
  }
}
   
    