import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Profit = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			account?: string|any;
			level: number|any;
			username: string|any;
			status?: string|any
  }

  export type ProfitQuery = Omit<Profit, 'level'|'username'> & {
    level?: number;
username?: string
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  level_mode?: string;
  username_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type ProfitKey = keyof Profit;
    
export class ProfitService {
     
  getProfit(request:ProfitQuery) {
      return getDatas<Profit,ProfitQuery>( '/profit',request)
  }
  getProfitAll(request:ProfitQuery) {
    return getDataAll<Profit,ProfitQuery>( '/profit/all',request) 
  }
  getProfitSuggestions(keyword:string) {
    return getDataSuggestions<Profit>( '/profit/suggestions',keyword) 
  }
  getProfitDetails(id:string){
    return getData<Profit>('/profit/'+ id);
  }
  addProfit (request:Profit) {
    return postData<Profit>('/profit',request);
    
  }
  updateProfit (request:Profit) {
    const {id,...rest}  =request
    return   patchData<Profit>( '/profit/'+ id, rest );
  }
  deleteProfit (id:string) {
    return   deleteData<Profit>( '/profit/'+ id );
  }
}
   
    