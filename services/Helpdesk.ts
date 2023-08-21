import {getDatas, postData,patchData,deleteData,getDataAll,getDataSuggestions,getData} from '@lib/httpRequest'

  export type Helpdesk = {
  	id?: string|any;
			createby?: string|any;
			createat?: Date|any;
			updateby?: string|any;
			updateat?: Date|any;
			subject: string|any;
			details?: string|any;
			document?: string|any
  }

  export type HelpdeskQuery = Omit<Helpdesk, 'subject'> & {
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
  export type HelpdeskKey = keyof Helpdesk;
    
export class HelpdeskService {
     
  getHelpdesk(request:HelpdeskQuery) {
      return getDatas<Helpdesk,HelpdeskQuery>( '/helpdesk',request)
  }
  getHelpdeskAll(request:HelpdeskQuery) {
    return getDataAll<Helpdesk,HelpdeskQuery>( '/helpdesk/all',request) 
  }
  getHelpdeskSuggestions(keyword:string) {
    return getDataSuggestions<Helpdesk>( '/helpdesk/suggestions',keyword) 
  }
  getHelpdeskDetails(id:string){
    return getData<Helpdesk>('/helpdesk/'+ id);
  }
  addHelpdesk (request:Helpdesk) {
    return postData<Helpdesk>('/helpdesk',request);
    
  }
  updateHelpdesk (request:Helpdesk) {
    const {id,...rest}  =request
    return   patchData<Helpdesk>( '/helpdesk/'+ id, rest );
  }
  deleteHelpdesk (id:string) {
    return   deleteData<Helpdesk>( '/helpdesk/'+ id );
  }
}
   
    