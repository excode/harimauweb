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
import {Kyc,KycQuery,KycKey, KycService } from '@services/Kyc';


const KycPage = () => {
const { asPath } = useRouter();
const validation=[
    
    ]
let emptyKyc:Kyc = {
    
};
const [kycs, setKycs] = useState<Kyc[]>([]);
const [backupKycs, setBackupKycs] =  useState<Kyc[]>([]);
const [loading,setLoading] = useState(false);
const [kycDialog, setKycDialog] = useState(false);
const [deleteKycDialog, setDeleteKycDialog] = useState(false);
const [deleteKycsDialog, setDeleteKycsDialog] = useState(false);
const [kyc, setKyc] = useState<Kyc>(emptyKyc);
const [selectedKycs, setSelectedKycs] = useState<Kyc[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Kyc[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const kycService = new KycService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());



const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await kycService.getKyc({limit:row});
    if(d.error==undefined ){
        setKycs(d.docs);
        setBackupKycs(d.docs);
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
        
        
    });

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
    setKyc(emptyKyc);
    setSubmitted(false);
    setKycDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setKycDialog(false);
};

const hideDeleteKycDialog = () => {
    setDeleteKycDialog(false);
};

const hideDeleteKycsDialog = () => {
    setDeleteKycsDialog(false);
};

const saveKyc = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(kyc,validation)
        if (validationErrors.length==0) {
        let _kycs:Kyc[] = [...kycs];
        let _kyc:Kyc = { ...kyc };
        if (kyc.id) {
        
            let d=  await kycService.updateKyc(_kyc);
                if(d.error==undefined){
                    
                    const index = _kycs.findIndex(c => c.id === kyc.id)
                    if (index !== -1) {
                        _kycs[index] = {..._kyc};
                       // _kycs[index] = _kyc;
                        //_kycs.splice(index, 1, {..._kyc,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Kyc Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await kycService.addKyc(_kyc);
            if(d.error==undefined){
                var newID= d.id
               // _kycs.unshift({..._kyc,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Kyc Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setKycs(_kycs);
        setBackupKycs(_kycs);
        setKycDialog(false);
        setKyc(emptyKyc);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editKyc = (kyc:Kyc) => {
    setKyc({ ...kyc });
    setKycDialog(true);
};

const confirmDeleteKyc = (kyc:Kyc) => {
    setKyc(kyc);
    setDeleteKycDialog(true);
};

const deleteKyc = async() => {

    let d=  await kycService.deleteKyc(kyc.id??'');
    if(d.error==undefined){
        let _kycs = kycs.filter((val) => val.id !== kyc.id);
        setKycs(_kycs);
        setBackupKycs(_kycs);
        setDeleteKycDialog(false);
        setKyc(emptyKyc);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Kyc Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Kyc Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteKycsDialog(true);
};

const deleteSelectedKycs = () => {
    let _kycs = kycs.filter((val) => !selectedKycs.includes(val));
    setKycs(_kycs);
    setDeleteKycsDialog(false);
    setSelectedKycs([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Kycs Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:KycKey) => {
    let val = (e.target && e.target.value) || '';
    let _kyc:Kyc = { ...kyc };
    _kyc[name] = val;
    setKyc(_kyc);
};
const onInputBooleanChange=(e:any, name:KycKey)=>{
    let val =  e.target.value;
    let _kyc:Kyc = { ...kyc };
    _kyc[name] = val;

    setKyc(_kyc);
}

const onInputChange = (e:any, name:KycKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=kyc[name];	
           	
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
    
    
    let _kyc:Kyc = { ...kyc };
    _kyc[name] = val;

    setKyc(_kyc);
};

const onInputNumberChange = (e: any, name:KycKey) => {
    let val = e.value || 0;
    let _kyc = { ...kyc };
    _kyc[name] = val;

    setKyc(_kyc);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:KycQuery={}
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
        
        let d=  await kycService.getKyc(searchObj);
        if(d.error==undefined ){
            
            setKycs(d.docs);
            setBackupKycs(d.docs);
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
        let _kycs =[...kycs];
        let filtered = _kycs.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setKycs(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setKycs(backupKycs);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedKycs || !selectedKycs.length} />
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



const actionBodyTemplate = (rowData:Kyc) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editKyc(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteKyc(rowData)} />
        
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
        <h5 className="m-0">Manage Kycs</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const kycDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveKyc} />
    </>
);
const deleteKycDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteKycDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteKyc} />
    </>
);
const deleteKycsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteKycsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedKycs} />
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
                    value={kycs}
                    selection={selectedKycs}
                    onSelectionChange={(e) => setSelectedKycs(e.value as Kyc[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Kycs"
                    emptyMessage="No Kycs found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={kycDialog} style={{ width: '450px' }} header="Kyc Details" modal className="p-fluid" footer={kycDialogFooter} onHide={hideDialog}>
                    
                
                </Dialog>

                <Dialog visible={deleteKycDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteKycDialogFooter} onHide={hideDeleteKycDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {kyc && (
                            <span>
                                Are you sure you want to delete <b>Kyc record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteKycsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteKycsDialogFooter} onHide={hideDeleteKycsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {kyc && <span>Are you sure you want to delete the selected Kyc?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default KycPage;
        
       
        