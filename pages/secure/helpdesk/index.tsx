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
import {Helpdesk,HelpdeskQuery,HelpdeskKey, HelpdeskService } from '@services/Helpdesk';

import CustomFileUpload from '@layout/fileUpload';
import {UploadInfo} from '@services/UploadInfo';
import { Image } from 'primereact/image'; 
                

const HelpdeskPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'subject',type:validate.text,max:250,min:2,required:true},
{id:'details',type:validate.text,max:600,min:0,required:true}
    ]
let emptyHelpdesk:Helpdesk = {
    subject: ''
};
const [helpdesks, setHelpdesks] = useState<Helpdesk[]>([]);
const [backupHelpdesks, setBackupHelpdesks] =  useState<Helpdesk[]>([]);
const [loading,setLoading] = useState(false);
const [helpdeskDialog, setHelpdeskDialog] = useState(false);
const [deleteHelpdeskDialog, setDeleteHelpdeskDialog] = useState(false);
const [deleteHelpdesksDialog, setDeleteHelpdesksDialog] = useState(false);
const [helpdesk, setHelpdesk] = useState<Helpdesk>(emptyHelpdesk);
const [selectedHelpdesks, setSelectedHelpdesks] = useState<Helpdesk[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Helpdesk[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const helpdeskService = new HelpdeskService();
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
    let d=  await helpdeskService.getHelpdesk({limit:row});
    if(d.error==undefined ){
        setHelpdesks(d.docs);
        setBackupHelpdesks(d.docs);
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
details: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
createby: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
    });

};
    
    const documentBodyTemplate = (rowData:Helpdesk) => {  
    let imageURL= config.serverURI+"/"+rowData.document
    let fileURL= "/file_icon.png"
    let fileNoURL= "/file_icon_na.png"
    let contetnt;
    
    let acceptFile="application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png"
    if(rowData.document!=undefined && rowData.document!='' && rowData.document.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image  onError={(e:any)=>defaultImage(e)}  onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={imageURL}  alt="document"  preview downloadable width="250" /> ;
    }else if(rowData.document!=undefined && rowData.document!='' && !rowData.document.match(/.(jpg|jpeg|png|gif)$/i)){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')} onClick={()=>downloadFile(rowData,'document')}  src={fileURL}  alt="document"  width="250" /> ;
    }else if(rowData.document==undefined || rowData.document=='' ){
        contetnt =<Image    onMouseOver={(e:any)=>setCurrentImage(rowData.id??'')}  src={fileNoURL}  alt="document" width="250" /> ;
    }
    return (
    <>
        <div className="card flex justify-content-center">
        {contetnt}
        </div>
  
    {currentImage == rowData.id && (
    <Button  icon="pi pi-upload" severity="secondary"  onClick={(e) => showUploadDialog(rowData,'document',acceptFile)} aria-label="Bookmark" style={{
        position: "relative",
        top: "-105px",
        right: "-35px"
      }} /> 
    )}
    </>
    )
    };
              

    const downloadFile=(data:Helpdesk,dbColName:HelpdeskKey) => {

        let fileLink = config.serverURI+"/"+data[dbColName];
        var link:HTMLAnchorElement=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();
    
    }
    const updateFileName = (newUploadedFileName:string,colName:HelpdeskKey) => {
        let _helpdesk = {...helpdesk,[colName]:newUploadedFileName}
        let _helpdesks = [...helpdesks];
        const index = _helpdesks.findIndex(c => c.id === helpdesk.id)
        if (index !== -1) {
            _helpdesks[index] = _helpdesk;
        }
        setHelpdesk(_helpdesk);
        setHelpdesks(_helpdesks);
                
    };
    const showUploadDialog = (helpdesk:Helpdesk,dbColName:string,accept:string="images/*") => {
        setHelpdesk({ ...helpdesk });
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
    setHelpdesk(emptyHelpdesk);
    setSubmitted(false);
    setHelpdeskDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setHelpdeskDialog(false);
};

const hideDeleteHelpdeskDialog = () => {
    setDeleteHelpdeskDialog(false);
};

const hideDeleteHelpdesksDialog = () => {
    setDeleteHelpdesksDialog(false);
};

const saveHelpdesk = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(helpdesk,validation)
        if (validationErrors.length==0) {
        let _helpdesks:Helpdesk[] = [...helpdesks];
        let _helpdesk:Helpdesk = { ...helpdesk };
        if (helpdesk.id) {
        
            let d=  await helpdeskService.updateHelpdesk(_helpdesk);
                if(d.error==undefined){
                    
                    const index = _helpdesks.findIndex(c => c.id === helpdesk.id)
                    if (index !== -1) {
                        _helpdesks[index] = {..._helpdesk};
                       // _helpdesks[index] = _helpdesk;
                        //_helpdesks.splice(index, 1, {..._helpdesk,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Helpdesk Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await helpdeskService.addHelpdesk(_helpdesk);
            if(d.error==undefined){
                var newID= d.id
               // _helpdesks.unshift({..._helpdesk,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Helpdesk Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setHelpdesks(_helpdesks);
        setBackupHelpdesks(_helpdesks);
        setHelpdeskDialog(false);
        setHelpdesk(emptyHelpdesk);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editHelpdesk = (helpdesk:Helpdesk) => {
    setHelpdesk({ ...helpdesk });
    setHelpdeskDialog(true);
};

const confirmDeleteHelpdesk = (helpdesk:Helpdesk) => {
    setHelpdesk(helpdesk);
    setDeleteHelpdeskDialog(true);
};

const deleteHelpdesk = async() => {

    let d=  await helpdeskService.deleteHelpdesk(helpdesk.id??'');
    if(d.error==undefined){
        let _helpdesks = helpdesks.filter((val) => val.id !== helpdesk.id);
        setHelpdesks(_helpdesks);
        setBackupHelpdesks(_helpdesks);
        setDeleteHelpdeskDialog(false);
        setHelpdesk(emptyHelpdesk);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Helpdesk Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Helpdesk Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteHelpdesksDialog(true);
};

const deleteSelectedHelpdesks = () => {
    let _helpdesks = helpdesks.filter((val) => !selectedHelpdesks.includes(val));
    setHelpdesks(_helpdesks);
    setDeleteHelpdesksDialog(false);
    setSelectedHelpdesks([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Helpdesks Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:HelpdeskKey) => {
    let val = (e.target && e.target.value) || '';
    let _helpdesk:Helpdesk = { ...helpdesk };
    _helpdesk[name] = val;
    setHelpdesk(_helpdesk);
};
const onInputBooleanChange=(e:any, name:HelpdeskKey)=>{
    let val =  e.target.value;
    let _helpdesk:Helpdesk = { ...helpdesk };
    _helpdesk[name] = val;

    setHelpdesk(_helpdesk);
}

const onInputChange = (e:any, name:HelpdeskKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=helpdesk[name];	
           	
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
    
    
    let _helpdesk:Helpdesk = { ...helpdesk };
    _helpdesk[name] = val;

    setHelpdesk(_helpdesk);
};

const onInputNumberChange = (e: any, name:HelpdeskKey) => {
    let val = e.value || 0;
    let _helpdesk = { ...helpdesk };
    _helpdesk[name] = val;

    setHelpdesk(_helpdesk);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:HelpdeskQuery={}
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
        
        let d=  await helpdeskService.getHelpdesk(searchObj);
        if(d.error==undefined ){
            
            setHelpdesks(d.docs);
            setBackupHelpdesks(d.docs);
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
        let _helpdesks =[...helpdesks];
        let filtered = _helpdesks.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setHelpdesks(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setHelpdesks(backupHelpdesks);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedHelpdesks || !selectedHelpdesks.length} />
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



const actionBodyTemplate = (rowData:Helpdesk) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editHelpdesk(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteHelpdesk(rowData)} />
        
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
        <h5 className="m-0">Manage Helpdesks</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const helpdeskDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveHelpdesk} />
    </>
);
const deleteHelpdeskDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteHelpdeskDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteHelpdesk} />
    </>
);
const deleteHelpdesksDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteHelpdesksDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedHelpdesks} />
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
                    value={helpdesks}
                    selection={selectedHelpdesks}
                    onSelectionChange={(e) => setSelectedHelpdesks(e.value as Helpdesk[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Helpdesks"
                    emptyMessage="No Helpdesks found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="subject" header="Subject" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by subject" ></Column>
            

    <Column showAddButton={false}  field="details" header="Details" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by details" ></Column>
            

    <Column showAddButton={false}  field="document" header="Document" sortable  headerStyle={{ minWidth: '10rem' }}  body={documentBodyTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createat" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createat" dataType="date" filter filterElement={createatFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createby" header="Created By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by createby" ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={helpdeskDialog} style={{ width: '450px' }} header="Helpdesk Details" modal className="p-fluid" footer={helpdeskDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="subject">Subject</label>
         <InputText id="subject" value={helpdesk.subject} onChange={(e) => onInputChange(e, 'subject')}    required className={classNames({ 'p-invalid': submitted && !helpdesk.subject })} />
    </div>
            

    <div className="field">
        <label htmlFor="details">Details</label>
         <InputTextarea id="details" value={helpdesk.details} onChange={(e) => onInputChange(e, 'details')} rows={5} cols={30}    required className={classNames({ 'p-invalid': submitted && !helpdesk.details })} />
    </div>
            

                </Dialog>

                <Dialog visible={deleteHelpdeskDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHelpdeskDialogFooter} onHide={hideDeleteHelpdeskDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {helpdesk && (
                            <span>
                                Are you sure you want to delete <b>Helpdesk record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteHelpdesksDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHelpdesksDialogFooter} onHide={hideDeleteHelpdesksDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {helpdesk && <span>Are you sure you want to delete the selected Helpdesk?</span>}
                    </div>
                </Dialog>

                
                
    <Dialog visible={uploadDialog} style={{ width: '450px' }} header={`Upload ${uploadInfo?.dbColName}`} modal  onHide={hideUploadDialog}>
        <div className="flex align-items-center justify-content-center">
        <CustomFileUpload onUpload={(e)=>updateFileName(e,uploadInfo?.dbColName as keyof Helpdesk)} url={uploadInfo?.url} table="helpdesk" tableId={helpdesk.id } maxFileSize={1000000} accept={uploadInfo?.accept} fieldName="uploadFile" dbColName={uploadInfo?.dbColName} />
        </div>
    </Dialog>  
            
            </div>
        </div>
    </div>
);
};

export default HelpdeskPage;
        
       
        