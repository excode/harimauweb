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
import {History,HistoryQuery,HistoryKey, HistoryService } from '@services/History';


const HistoryPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'subject',type:validate.text,max:50,min:0,required:true},
{id:'comments',type:validate.text,max:0,min:0,required:true},
{id:'status',type:validate.text,required:true}
    ]
let emptyHistory:History = {
    subject: ''
};
const [historys, setHistorys] = useState<History[]>([]);
const [backupHistorys, setBackupHistorys] =  useState<History[]>([]);
const [loading,setLoading] = useState(false);
const [historyDialog, setHistoryDialog] = useState(false);
const [deleteHistoryDialog, setDeleteHistoryDialog] = useState(false);
const [deleteHistorysDialog, setDeleteHistorysDialog] = useState(false);
const [history, setHistory] = useState<History>(emptyHistory);
const [selectedHistorys, setSelectedHistorys] = useState<History[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<History[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const historyService = new HistoryService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());



const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await historyService.getHistory({limit:row});
    if(d.error==undefined ){
        setHistorys(d.docs);
        setBackupHistorys(d.docs);
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
comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
createat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
createby: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
    });

};

    const datastatuss =[
	{value:"pending",name:"pending"},
	{value:"confirmed",name:"confirmed"},
	{value:"declined",name:"declined"}
]
                

const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
    const statusFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Status Picker</div>
                <Dropdown value={options.value} options={datastatuss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="value" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setHistory(emptyHistory);
    setSubmitted(false);
    setHistoryDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setHistoryDialog(false);
};

const hideDeleteHistoryDialog = () => {
    setDeleteHistoryDialog(false);
};

const hideDeleteHistorysDialog = () => {
    setDeleteHistorysDialog(false);
};

const saveHistory = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(history,validation)
        if (validationErrors.length==0) {
        let _historys:History[] = [...historys];
        let _history:History = { ...history };
        if (history.id) {
        
            let d=  await historyService.updateHistory(_history);
                if(d.error==undefined){
                    
                    const index = _historys.findIndex(c => c.id === history.id)
                    if (index !== -1) {
                        _historys[index] = {..._history};
                       // _historys[index] = _history;
                        //_historys.splice(index, 1, {..._history,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'History Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await historyService.addHistory(_history);
            if(d.error==undefined){
                var newID= d.id
               // _historys.unshift({..._history,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'History Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setHistorys(_historys);
        setBackupHistorys(_historys);
        setHistoryDialog(false);
        setHistory(emptyHistory);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editHistory = (history:History) => {
    setHistory({ ...history });
    setHistoryDialog(true);
};

const confirmDeleteHistory = (history:History) => {
    setHistory(history);
    setDeleteHistoryDialog(true);
};

const deleteHistory = async() => {

    let d=  await historyService.deleteHistory(history.id??'');
    if(d.error==undefined){
        let _historys = historys.filter((val) => val.id !== history.id);
        setHistorys(_historys);
        setBackupHistorys(_historys);
        setDeleteHistoryDialog(false);
        setHistory(emptyHistory);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'History Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'History Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteHistorysDialog(true);
};

const deleteSelectedHistorys = () => {
    let _historys = historys.filter((val) => !selectedHistorys.includes(val));
    setHistorys(_historys);
    setDeleteHistorysDialog(false);
    setSelectedHistorys([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Historys Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:HistoryKey) => {
    let val = (e.target && e.target.value) || '';
    let _history:History = { ...history };
    _history[name] = val;
    setHistory(_history);
};
const onInputBooleanChange=(e:any, name:HistoryKey)=>{
    let val =  e.target.value;
    let _history:History = { ...history };
    _history[name] = val;

    setHistory(_history);
}

const onInputChange = (e:any, name:HistoryKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=history[name];	
           	
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
    
    
    let _history:History = { ...history };
    _history[name] = val;

    setHistory(_history);
};

const onInputNumberChange = (e: any, name:HistoryKey) => {
    let val = e.value || 0;
    let _history = { ...history };
    _history[name] = val;

    setHistory(_history);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:HistoryQuery={}
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
        
        let d=  await historyService.getHistory(searchObj);
        if(d.error==undefined ){
            
            setHistorys(d.docs);
            setBackupHistorys(d.docs);
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
        let _historys =[...historys];
        let filtered = _historys.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setHistorys(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setHistorys(backupHistorys);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedHistorys || !selectedHistorys.length} />
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



const actionBodyTemplate = (rowData:History) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editHistory(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteHistory(rowData)} />
        
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
        <h5 className="m-0">Manage Historys</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const historyDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveHistory} />
    </>
);
const deleteHistoryDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteHistoryDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteHistory} />
    </>
);
const deleteHistorysDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteHistorysDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedHistorys} />
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
                    value={historys}
                    selection={selectedHistorys}
                    onSelectionChange={(e) => setSelectedHistorys(e.value as History[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Historys"
                    emptyMessage="No Historys found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="subject" header="Subject" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by subject" ></Column>
            

    <Column showAddButton={false}  field="comments" header="Comments" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by comments" ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status"   filter filterElement={statusFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createat" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createat" dataType="date" filter filterElement={createatFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createby" header="Created By" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by createby" ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={historyDialog} style={{ width: '450px' }} header="History Details" modal className="p-fluid" footer={historyDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="subject">Subject</label>
         <InputText id="subject" value={history.subject} onChange={(e) => onInputChange(e, 'subject')}    required className={classNames({ 'p-invalid': submitted && !history.subject })} />
    </div>
            

    <div className="field">
        <label htmlFor="comments">Comments</label>
         <InputTextarea id="comments" value={history.comments} onChange={(e) => onInputChange(e, 'comments')} rows={5} cols={30}    required className={classNames({ 'p-invalid': submitted && !history.comments })} />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name"  value={history.status} options={datastatuss} onChange={(e) => onInputChange(e, 'status')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteHistoryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHistoryDialogFooter} onHide={hideDeleteHistoryDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {history && (
                            <span>
                                Are you sure you want to delete <b>History record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteHistorysDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHistorysDialogFooter} onHide={hideDeleteHistorysDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {history && <span>Are you sure you want to delete the selected History?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default HistoryPage;
        
       
        