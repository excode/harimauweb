import getConfig from 'next/config';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable,DataTableFilterMeta,DataTableFilterEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Checkbox } from 'primereact/checkbox';
import {MultiSelect} from 'primereact/multiselect';
import { AutoComplete } from 'primereact/autocomplete';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import {validateForm,validate} from '@lib/validation'
import {ListType,SortType} from '@services/CommonTypes'
import { useRouter } from 'next/router'
import Link from 'next/link';
import config from "@config/index"; 
import {Helpdesklog,HelpdesklogQuery,HelpdesklogKey, HelpdesklogService } from '@services/Helpdesklog';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Image } from 'primereact/image'; 
                

const HelpdesklogPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'subject',type:validate.text,max:150,min:2,required:true}
    ]
let emptyHelpdesklog:Helpdesklog = {
    subject: ''
};
const [helpdesklogs, setHelpdesklogs] = useState<Helpdesklog[]>([]);
const [backupHelpdesklogs, setBackupHelpdesklogs] =  useState<Helpdesklog[]>([]);
const [loading,setLoading] = useState(false);
const [helpdesklogDialog, setHelpdesklogDialog] = useState(false);
const [deleteHelpdesklogDialog, setDeleteHelpdesklogDialog] = useState(false);
const [deleteHelpdesklogsDialog, setDeleteHelpdesklogsDialog] = useState(false);
const [helpdesklog, setHelpdesklog] = useState<Helpdesklog>(emptyHelpdesklog);
const [selectedHelpdesklogs, setSelectedHelpdesklogs] = useState<Helpdesklog[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Helpdesklog[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const helpdesklogService = new HelpdesklogService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const [uploadDialog,setUploadDialog] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({});
    const [currentImage, setCurrentImage] = useState('');

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await helpdesklogService.getHelpdesklog({limit:row});
    if(d.error==undefined ){
        setHelpdesklogs(d.docs);
        setBackupHelpdesklogs(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
        
            toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data Loaded', life: 3000 });
        }else{
            setLoading(false)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
   })()
    initFilters1();
    
}, [refreshFlag]);
const initFilters1 = () => {
    setFilters1({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        subject: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createby: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        
    });

};
    
    const commentsBodyTemplate = (rowData:Helpdesklog) => {  
    let imageURL= config.serverURI+"/"+rowData.comments
    let fileURL= "/file_icon.png"
    let fileNoURL= "/file_icon_na.png"
    let contetnt;
    
    let acceptFile="application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png"
    if(rowData.comments!=undefined && rowData.comments!='' && rowData.comments.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={imageURL}  alt="comments"  preview downloadable width="250" /> ;
    }else if(rowData.comments!=undefined && rowData.comments!='' && !rowData.comments.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')} onClick={()=>downloadFile(rowData,'comments')}  src={fileURL}  alt="comments"  width="250" /> ;
    }else if(rowData.comments==undefined || rowData.comments=='' ){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={fileNoURL}  alt="comments" width="250" /> ;
    }
    return (
    <>
        <div className="card flex justify-content-center">
        {contetnt}
        </div>
  
    {currentImage == rowData.id && (
    <Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(rowData,'comments',acceptFile)} aria-label="Bookmark" style={{
        position: "relative",
        top: "-105px",
        right: "-35px"
      }} /> 
    )}
    </>
    )
    };
              
    
    const documentsBodyTemplate = (rowData:Helpdesklog) => {  
    let imageURL= config.serverURI+"/"+rowData.documents
    let fileURL= "/file_icon.png"
    let fileNoURL= "/file_icon_na.png"
    let contetnt;
    
    let acceptFile="application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png"
    if(rowData.documents!=undefined && rowData.documents!='' && rowData.documents.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={imageURL}  alt="documents"  preview downloadable width="250" /> ;
    }else if(rowData.documents!=undefined && rowData.documents!='' && !rowData.documents.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')} onClick={()=>downloadFile(rowData,'documents')}  src={fileURL}  alt="documents"  width="250" /> ;
    }else if(rowData.documents==undefined || rowData.documents=='' ){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={fileNoURL}  alt="documents" width="250" /> ;
    }
    return (
    <>
        <div className="card flex justify-content-center">
        {contetnt}
        </div>
  
    {currentImage == rowData.id && (
    <Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(rowData,'documents',acceptFile)} aria-label="Bookmark" style={{
        position: "relative",
        top: "-105px",
        right: "-35px"
      }} /> 
    )}
    </>
    )
    };
              

    const downloadFile=(data:Helpdesklog,dbColName:HelpdesklogKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:HelpdesklogKey) => {
        let _helpdesklog = {...helpdesklog,[colName]:newUploadedFileName}
        let _helpdesklogs = [...helpdesklogs];
        const index = _helpdesklogs.findIndex(c => c.id === helpdesklog.id)
        if (index !== -1) {
            _helpdesklogs[index] = _helpdesklog;
        }
        setHelpdesklog(_helpdesklog);
        setHelpdesklogs(_helpdesklogs);
                
    };
    const showUploadDialog = (helpdesklog:Helpdesklog,dbColName:string,accept:string="images/*") => {
        setHelpdesklog({ ...helpdesklog });
        setUploadDialog(true);
        let data =  {url:config.serverURI??"",dbColName:dbColName??"",accept:accept}
        setUploadInfo(data);
        
    };
    const hideUploadDialog = () => {
        setUploadDialog(false);
    };            
                
const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setHelpdesklog(emptyHelpdesklog);
    setSubmitted(false);
    setHelpdesklogDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setHelpdesklogDialog(false);
};

const hideDeleteHelpdesklogDialog = () => {
    setDeleteHelpdesklogDialog(false);
};

const hideDeleteHelpdesklogsDialog = () => {
    setDeleteHelpdesklogsDialog(false);
};

const saveHelpdesklog = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(helpdesklog,validation)
        if (validationErrors.length==0) {
        let _helpdesklogs:Helpdesklog[] = [...helpdesklogs];
        let _helpdesklog:Helpdesklog = { ...helpdesklog };
        if (helpdesklog.id) {
        
            let d=  await helpdesklogService.updateHelpdesklog(_helpdesklog);
                if(d.error==undefined){
                    
                    const index = _helpdesklogs.findIndex(c => c.id === helpdesklog.id)
                    if (index !== -1) {
                        _helpdesklogs[index] = {..._helpdesklog};
                       // _helpdesklogs[index] = _helpdesklog;
                        //_helpdesklogs.splice(index, 1, {..._helpdesklog,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Helpdesklog Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await helpdesklogService.addHelpdesklog(_helpdesklog);
            if(d.error==undefined){
                var newID= d.id
               // _helpdesklogs.unshift({..._helpdesklog,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Helpdesklog Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setHelpdesklogs(_helpdesklogs);
        setBackupHelpdesklogs(_helpdesklogs);
        setHelpdesklogDialog(false);
        setHelpdesklog(emptyHelpdesklog);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editHelpdesklog = (helpdesklog:Helpdesklog) => {
    setHelpdesklog({ ...helpdesklog });
    setHelpdesklogDialog(true);
};

const confirmDeleteHelpdesklog = (helpdesklog:Helpdesklog) => {
    setHelpdesklog(helpdesklog);
    setDeleteHelpdesklogDialog(true);
};

const deleteHelpdesklog = async() => {

    let d=  await helpdesklogService.deleteHelpdesklog(helpdesklog.id??'');
    if(d.error==undefined){
        let _helpdesklogs = helpdesklogs.filter((val) => val.id !== helpdesklog.id);
        setHelpdesklogs(_helpdesklogs);
        setBackupHelpdesklogs(_helpdesklogs);
        setDeleteHelpdesklogDialog(false);
        setHelpdesklog(emptyHelpdesklog);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Helpdesklog Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Helpdesklog Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteHelpdesklogsDialog(true);
};

const deleteSelectedHelpdesklogs = () => {
    let _helpdesklogs = helpdesklogs.filter((val) => !selectedHelpdesklogs.includes(val));
    setHelpdesklogs(_helpdesklogs);
    setDeleteHelpdesklogsDialog(false);
    setSelectedHelpdesklogs([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Helpdesklogs Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:HelpdesklogKey) => {
    let val = (e.target && e.target.value) || '';
    let _helpdesklog:Helpdesklog = { ...helpdesklog };
    _helpdesklog[name] = val;
    setHelpdesklog(_helpdesklog);
};
const onInputBooleanChange=(e:any, name:HelpdesklogKey)=>{
    let val =  e.target.value;
    let _helpdesklog:Helpdesklog = { ...helpdesklog };
    _helpdesklog[name] = val;

    setHelpdesklog(_helpdesklog);
}

const onInputChange = (e:any, name:HelpdesklogKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=helpdesklog[name];	
           	
            if(ctrlType=="radio"){	
                aVal = val.value;	
            }else if(ctrlType=="checkbox"){	
            	
                if (e.checked){	
                    aVal.push(val.value);	
                }else{	
                    aVal = aVal.filter((d:any) => d !== e.target.value.value);	
                }	
            }	
            val = aVal;	
        }else{	
            val= val[name]?val[name]:val	
        }	
        	
    }	
    
    
    let _helpdesklog:Helpdesklog = { ...helpdesklog };
    _helpdesklog[name] = val;

    setHelpdesklog(_helpdesklog);
};

const onInputNumberChange = (e: any, name:HelpdesklogKey) => {
    let val = e.value || 0;
    let _helpdesklog = { ...helpdesklog };
    _helpdesklog[name] = val;

    setHelpdesklog(_helpdesklog);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:HelpdesklogQuery={}
    for (const key in e.filters) {  
    
        if(e.filters[key].constraints){
            if(e.filters[key].constraints[0].value){
                searchObj={...searchObj,[key]:e.filters[key].constraints[0].value,[key+'_mode']:e.filters[key].constraints[0].matchMode}
            }
        }
        }
        if(type==0){ // FILTER Data and start with page 0
        searchObj={...searchObj,page:0,limit:row}
        }else if(type==1){ // Change page number
        searchObj={...searchObj,page:e.page,limit:row}
        }else if(type==2){ // Change page number
        let sort:SortType={}
        if(sortOrders){
            let currentSortOrder = sortOrders[e.sortField]==1?-1:1
            sort={...sortOrders,[e.sortField]:currentSortOrder}
        
        }else{
            sort={[e.sortField]:1}
        }
        
        setSortOrders(sort);

        searchObj={...searchObj,page:e.page,limit:row,sortBy:e.sortField,sortDirection:sortOrders[e.sortField]}
        }
        if(e.rows!==row){
        setRow(e.rows)
        searchObj={...searchObj,page:0,limit:e.rows}
        }
        
        let d=  await helpdesklogService.getHelpdesklog(searchObj);
        if(d.error==undefined ){
            
            setHelpdesklogs(d.docs);
            setBackupHelpdesklogs(d.docs);
            setLoading(false)
            setTotalRecords(d.count)
            toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Data retrived', life: 3000 });
        }else{
            setLoading(false)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
        }
}
const filterAction=async(e:DataTableFilterEvent)=>{
    await getNewData(e,0)
}
const changePage =async(e:DataTableFilterEvent)=>{
    await getNewData(e,1)
}
const sortData=async(e:DataTableFilterEvent)=>{

    await getNewData(e,2)
}

const localFilter=(val:string)=>{
    
    if(val.length>1){
        let _helpdesklogs =[...helpdesklogs];
        let filtered = _helpdesklogs.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setHelpdesklogs(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setHelpdesklogs(backupHelpdesklogs);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedHelpdesklogs || !selectedHelpdesklogs.length} />
            </div>
        </React.Fragment>
    );
};

const rightToolbarTemplate = () => {
    return (
        <React.Fragment>
            
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    );
};



const actionBodyTemplate = (rowData:Helpdesklog) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editHelpdesklog(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteHelpdesklog(rowData)} />
        
            <Link 
                href={{
                pathname: asPath+"/"+rowData.id
                }}

            >
            <Button icon="pi pi-book" className="p-button-rounded p-button-success" />
            </Link>

        </>
    );
};

const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Manage Helpdesklogs</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const helpdesklogDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveHelpdesklog} />
    </>
);
const deleteHelpdesklogDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteHelpdesklogDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteHelpdesklog} />
    </>
);
const deleteHelpdesklogsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteHelpdesklogsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedHelpdesklogs} />
    </>
);

return (
    <div className="grid crud-demo">
        <div className="col-12">
            <div className="card">
                <Toast ref={toast} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable
                    ref={dt}
                    value={helpdesklogs}
                    selection={selectedHelpdesklogs}
                    onSelectionChange={(e) => setSelectedHelpdesklogs(e.value as Helpdesklog[])}
                    dataKey="id"
                    loading={loading}
                    filters={filters1}
                    showGridlines
                    filterDisplay="menu"
                    onFilter={filterAction}
                    paginator
                    totalRecords={totalRecords}
                    rows={row}
                    lazy={true}
                    onSort={sortData}
                    onPage={changePage}
                    rowsPerPageOptions={[1,5, 10, 25,50]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Helpdesklogs"
                    emptyMessage="No Helpdesklogs found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="subject" header="subject" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by subject" ></Column>
            

    <Column showAddButton={false}  field="comments" header="Comments" sortable  headerStyle={{ minWidth: '10rem' }}  body={commentsBodyTemplate}  ></Column>
            

    <Column showAddButton={false}  field="documents" header="Documents" sortable  headerStyle={{ minWidth: '10rem' }}  body={documentsBodyTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createby" header="Created By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by createby" ></Column>
            

    <Column showAddButton={false}  field="createat" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createat" dataType="date" filter filterElement={createatFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={helpdesklogDialog} style={{ width: '450px' }} header="Helpdesklog Details" modal className="p-fluid" footer={helpdesklogDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="subject">subject</label>
         <InputText id="subject" value={helpdesklog.subject} onChange={(e) => onInputChange(e, 'subject')}    required className={classNames({ 'p-invalid': submitted && !helpdesklog.subject })} />
    </div>
            


                </Dialog>

                <Dialog visible={deleteHelpdesklogDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHelpdesklogDialogFooter} onHide={hideDeleteHelpdesklogDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {helpdesklog && (
                            <span>
                                Are you sure you want to delete <b>Helpdesklog record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteHelpdesklogsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHelpdesklogsDialogFooter} onHide={hideDeleteHelpdesklogsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {helpdesklog && <span>Are you sure you want to delete the selected Helpdesklog?</span>}
                    </div>
                </Dialog>

                
                
    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof Helpdesklog)} url={uploadInfo?.url} table="helpdesklog" tableId={helpdesklog.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
            
            </div>
        </div>
    </div>
);
};

export default HelpdesklogPage;
        
       
        