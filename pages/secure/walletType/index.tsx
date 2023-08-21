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
import {WalletType,WalletTypeQuery,WalletTypeKey, WalletTypeService } from '@services/WalletType';


const WalletTypePage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'name',type:validate.text,max:20,min:0,required:true},
{id:'code',type:validate.text,max:5,min:0,required:true},
{id:'decimalposition',type:validate.int,max:9,min:0,required:true},
{id:'maxtransfer',type:validate.number,max:0,min:0,required:true},
{id:'active',type:validate.boolean,required:true}
    ]
let emptyWalletType:WalletType = {
    name: '',
code: '',
decimalposition: 0,
maxtransfer: 0,
active: false
};
const [walletTypes, setWalletTypes] = useState<WalletType[]>([]);
const [backupWalletTypes, setBackupWalletTypes] =  useState<WalletType[]>([]);
const [loading,setLoading] = useState(false);
const [walletTypeDialog, setWalletTypeDialog] = useState(false);
const [deleteWalletTypeDialog, setDeleteWalletTypeDialog] = useState(false);
const [deleteWalletTypesDialog, setDeleteWalletTypesDialog] = useState(false);
const [walletType, setWalletType] = useState<WalletType>(emptyWalletType);
const [selectedWalletTypes, setSelectedWalletTypes] = useState<WalletType[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<WalletType[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const wallettypeService = new WalletTypeService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());



const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await wallettypeService.getWalletType({limit:row});
    if(d.error==undefined ){
        setWalletTypes(d.docs);
        setBackupWalletTypes(d.docs);
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
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
code: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
decimalposition: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
maxtransfer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
active: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        
    });

};


const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const decimalpositionFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const maxtransferFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const activeFilterTemplate = (options:any) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setWalletType(emptyWalletType);
    setSubmitted(false);
    setWalletTypeDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setWalletTypeDialog(false);
};

const hideDeleteWalletTypeDialog = () => {
    setDeleteWalletTypeDialog(false);
};

const hideDeleteWalletTypesDialog = () => {
    setDeleteWalletTypesDialog(false);
};

const saveWalletType = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(walletType,validation)
        if (validationErrors.length==0) {
        let _walletTypes:WalletType[] = [...walletTypes];
        let _walletType:WalletType = { ...walletType };
        if (walletType.id) {
        
            let d=  await wallettypeService.updateWalletType(_walletType);
                if(d.error==undefined){
                    
                    const index = _walletTypes.findIndex(c => c.id === walletType.id)
                    if (index !== -1) {
                        _walletTypes[index] = {..._walletType};
                       // _walletTypes[index] = _walletType;
                        //_walletTypes.splice(index, 1, {..._walletType,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'WalletType Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await wallettypeService.addWalletType(_walletType);
            if(d.error==undefined){
                var newID= d.id
               // _walletTypes.unshift({..._walletType,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'WalletType Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setWalletTypes(_walletTypes);
        setBackupWalletTypes(_walletTypes);
        setWalletTypeDialog(false);
        setWalletType(emptyWalletType);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editWalletType = (walletType:WalletType) => {
    setWalletType({ ...walletType });
    setWalletTypeDialog(true);
};

const confirmDeleteWalletType = (walletType:WalletType) => {
    setWalletType(walletType);
    setDeleteWalletTypeDialog(true);
};

const deleteWalletType = async() => {

    let d=  await wallettypeService.deleteWalletType(walletType.id??'');
    if(d.error==undefined){
        let _walletTypes = walletTypes.filter((val) => val.id !== walletType.id);
        setWalletTypes(_walletTypes);
        setBackupWalletTypes(_walletTypes);
        setDeleteWalletTypeDialog(false);
        setWalletType(emptyWalletType);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'WalletType Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'WalletType Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteWalletTypesDialog(true);
};

const deleteSelectedWalletTypes = () => {
    let _walletTypes = walletTypes.filter((val) => !selectedWalletTypes.includes(val));
    setWalletTypes(_walletTypes);
    setDeleteWalletTypesDialog(false);
    setSelectedWalletTypes([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'WalletTypes Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:WalletTypeKey) => {
    let val = (e.target && e.target.value) || '';
    let _walletType:WalletType = { ...walletType };
    _walletType[name] = val;
    setWalletType(_walletType);
};
const onInputBooleanChange=(e:any, name:WalletTypeKey)=>{
    let val =  e.target.value;
    let _walletType:WalletType = { ...walletType };
    _walletType[name] = val;

    setWalletType(_walletType);
}

const onInputChange = (e:any, name:WalletTypeKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=walletType[name];	
           	
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
    
    
    let _walletType:WalletType = { ...walletType };
    _walletType[name] = val;

    setWalletType(_walletType);
};

const onInputNumberChange = (e: any, name:WalletTypeKey) => {
    let val = e.value || 0;
    let _walletType = { ...walletType };
    _walletType[name] = val;

    setWalletType(_walletType);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:WalletTypeQuery={}
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
        
        let d=  await wallettypeService.getWalletType(searchObj);
        if(d.error==undefined ){
            
            setWalletTypes(d.docs);
            setBackupWalletTypes(d.docs);
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
        let _walletTypes =[...walletTypes];
        let filtered = _walletTypes.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setWalletTypes(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setWalletTypes(backupWalletTypes);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedWalletTypes || !selectedWalletTypes.length} />
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



const actionBodyTemplate = (rowData:WalletType) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editWalletType(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteWalletType(rowData)} />
        
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
        <h5 className="m-0">Manage WalletTypes</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const walletTypeDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveWalletType} />
    </>
);
const deleteWalletTypeDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteWalletTypeDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteWalletType} />
    </>
);
const deleteWalletTypesDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteWalletTypesDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedWalletTypes} />
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
                    value={walletTypes}
                    selection={selectedWalletTypes}
                    onSelectionChange={(e) => setSelectedWalletTypes(e.value as WalletType[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} WalletTypes"
                    emptyMessage="No WalletTypes found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="name" header="Name" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by name" ></Column>
            

    <Column showAddButton={false}  field="code" header="Code" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by code" ></Column>
            

    <Column showAddButton={false}  field="decimalposition" header="Decimal Position" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={decimalpositionFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="maxtransfer" header="Max Transfer" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={maxtransferFilterTemplate} ></Column>
            


    <Column showAddButton={false}  field="active" header="Active" sortable  headerStyle={{ minWidth: '10rem' }} filterField="active" dataType="boolean"  filter filterElement={activeFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={walletTypeDialog} style={{ width: '450px' }} header="WalletType Details" modal className="p-fluid" footer={walletTypeDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="name">Name</label>
         <InputText id="name" value={walletType.name} onChange={(e) => onInputChange(e, 'name')}    required className={classNames({ 'p-invalid': submitted && !walletType.name })} />
    </div>
            

    <div className="field">
        <label htmlFor="code">Code</label>
         <InputText id="code" value={walletType.code} onChange={(e) => onInputChange(e, 'code')}    required className={classNames({ 'p-invalid': submitted && !walletType.code })} />
    </div>
            

    <div className="field">
        <label htmlFor="decimalposition">Decimal Position</label>
         <InputNumber id="decimalposition" value={walletType.decimalposition} onValueChange={(e) => onInputNumberChange(e, 'decimalposition')}  />
    </div>
            

    <div className="field">
        <label htmlFor="maxtransfer">Max Transfer</label>
         <InputNumber id="maxtransfer" value={walletType.maxtransfer} onValueChange={(e) => onInputNumberChange(e, 'maxtransfer')}  />
    </div>
            

    <div className="field">
        <label htmlFor="active">Active</label>
         <TriStateCheckbox  name="active"  id="active" value={walletType.active} onChange={(e) => onInputBooleanChange(e, 'active')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteWalletTypeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWalletTypeDialogFooter} onHide={hideDeleteWalletTypeDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {walletType && (
                            <span>
                                Are you sure you want to delete <b>WalletType record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteWalletTypesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWalletTypesDialogFooter} onHide={hideDeleteWalletTypesDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {walletType && <span>Are you sure you want to delete the selected WalletType?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default WalletTypePage;
        
       
        