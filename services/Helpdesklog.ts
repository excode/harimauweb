import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Helpdesklog = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			subject: string|any;
			comments?: string|any;
			documents?: string|any
  }

  export type HelpdesklogQuery = Omit<Helpdesklog, 'subject'> & {
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
  export type HelpdesklogKey = keyof Helpdesklog;
    
export class HelpdesklogService {
     
  getHelpdesklog(request:HelpdesklogQuery) {
      return getDatas<Helpdesklog,HelpdesklogQuery>( '/helpdesklog',request)
  }
  getHelpdesklogAll(request:HelpdesklogQuery) {
    return getDataAll<Helpdesklog,HelpdesklogQuery>( '/helpdesklog/all',request) 
  }
  getHelpdesklogSuggestions(keyword:string) {
    return getDataSuggestions<Helpdesklog>( '/helpdesklog/suggestions',keyword) 
  }
  getHelpdesklogDetails(id:string){
    return getData<Helpdesklog>('/helpdesklog/'+ id);
  }
  addHelpdesklog (request:Helpdesklog) {
    return postData<Helpdesklog>('/helpdesklog',request);
    
  }
  updateHelpdesklog (request:Helpdesklog) {
    const {id,...rest}  =request
    return   patchData<Helpdesklog>( '/helpdesklog/'+ id, rest );
  }
  deleteHelpdesklog (id:string) {
    return   deleteData<Helpdesklog>( '/helpdesklog/'+ id );
  }
}
   
    