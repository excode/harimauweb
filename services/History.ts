import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type History = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			subject: string|any;
			comments?: string|any;
			status?: string|any
  }

  export type HistoryQuery = Omit<History, 'subject'> & {
    subject?: string
      createby_mode?: string;
  createat_mode?: string;
  updateby_mode?: string;
  updateat_mode?: string;
  subject_mode?: string
    page?:number;
    limit?: number;
    totalPages?:number;
    sortBy?:string;
    sortDirection?:number;
  }
  export type HistoryKey = keyof History;
    
export class HistoryService {
     
  getHistory(request:HistoryQuery) {
      return getDatas<History,HistoryQuery>( '/history',request)
  }
  getHistoryAll(request:HistoryQuery) {
    return getDataAll<History,HistoryQuery>( '/history/all',request) 
  }
  getHistorySuggestions(keyword:string) {
    return getDataSuggestions<History>( '/history/suggestions',keyword) 
  }
  getHistoryDetails(id:string){
    return getData<History>('/history/'+ id);
  }
  addHistory (request:History) {
    return postData<History>('/history',request);
    
  }
  updateHistory (request:History) {
    const {id,...rest}  =request
    return   patchData<History>( '/history/'+ id, rest );
  }
  deleteHistory (id:string) {
    return   deleteData<History>( '/history/'+ id );
  }
}
   
    