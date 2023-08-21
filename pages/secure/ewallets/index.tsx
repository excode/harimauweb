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
import {Ewallets,EwalletsQuery,EwalletsKey, EwalletsService } from '@services/Ewallets';
import {WalletType, WalletTypeService } from '@services/WalletType';

const EwalletsPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'wallettype',type:validate.text,required:true},
{id:'blocked',type:validate.boolean,required:true},
{id:'status',type:validate.boolean,required:true},
{id:'balance',type:validate.number,max:0,min:0,required:true},
{id:'hold',type:validate.number,max:0,min:0,required:true},
{id:'name',type:validate.text,max:25,min:2,required:true}
    ]
let emptyEwallets:Ewallets = {
    wallettype: '',
balance: 0,
hold: 0,
status: false,
blocked: false,
name: ''
};
const [ewalletss, setEwalletss] = useState<Ewallets[]>([]);
const [backupEwalletss, setBackupEwalletss] =  useState<Ewallets[]>([]);
const [loading,setLoading] = useState(false);
const [ewalletsDialog, setEwalletsDialog] = useState(false);
const [deleteEwalletsDialog, setDeleteEwalletsDialog] = useState(false);
const [deleteEwalletssDialog, setDeleteEwalletssDialog] = useState(false);
const [ewallets, setEwallets] = useState<Ewallets>(emptyEwallets);
const [selectedEwalletss, setSelectedEwalletss] = useState<Ewallets[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Ewallets[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const ewalletsService = new EwalletsService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const wallettypeService = new WalletTypeService();
    const [datawalletTypes, setDataWalletTypes] = useState<WalletType[]>([]);

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await ewalletsService.getEwallets({limit:row});
    if(d.error==undefined ){
        setEwalletss(d.docs);
        setBackupEwalletss(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
                 
    let dataWalletTypes_=  await wallettypeService.getWalletTypeAll({});
    setDataWalletTypes(dataWalletTypes_.data);
              
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
        wallettype: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
hold: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
blocked: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
    });

};


const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
    const wallettypeFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Wallettype Picker</div>
                <Dropdown value={options.value} options={datawalletTypes}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="code" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const balanceFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const holdFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const statusFilterTemplate = (options:any) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
            };
            
const blockedFilterTemplate = (options:any) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setEwallets(emptyEwallets);
    setSubmitted(false);
    setEwalletsDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setEwalletsDialog(false);
};

const hideDeleteEwalletsDialog = () => {
    setDeleteEwalletsDialog(false);
};

const hideDeleteEwalletssDialog = () => {
    setDeleteEwalletssDialog(false);
};

const saveEwallets = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(ewallets,validation)
        if (validationErrors.length==0) {
        let _ewalletss:Ewallets[] = [...ewalletss];
        let _ewallets:Ewallets = { ...ewallets };
        if (ewallets.id) {
        
            let d=  await ewalletsService.updateEwallets(_ewallets);
                if(d.error==undefined){
                    
                    const index = _ewalletss.findIndex(c => c.id === ewallets.id)
                    if (index !== -1) {
                        _ewalletss[index] = {..._ewallets};
                       // _ewalletss[index] = _ewallets;
                        //_ewalletss.splice(index, 1, {..._ewallets,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Ewallets Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await ewalletsService.addEwallets(_ewallets);
            if(d.error==undefined){
                var newID= d.id
               // _ewalletss.unshift({..._ewallets,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Ewallets Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setEwalletss(_ewalletss);
        setBackupEwalletss(_ewalletss);
        setEwalletsDialog(false);
        setEwallets(emptyEwallets);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editEwallets = (ewallets:Ewallets) => {
    setEwallets({ ...ewallets });
    setEwalletsDialog(true);
};

const confirmDeleteEwallets = (ewallets:Ewallets) => {
    setEwallets(ewallets);
    setDeleteEwalletsDialog(true);
};

const deleteEwallets = async() => {

    let d=  await ewalletsService.deleteEwallets(ewallets.id??'');
    if(d.error==undefined){
        let _ewalletss = ewalletss.filter((val) => val.id !== ewallets.id);
        setEwalletss(_ewalletss);
        setBackupEwalletss(_ewalletss);
        setDeleteEwalletsDialog(false);
        setEwallets(emptyEwallets);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Ewallets Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ewallets Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteEwalletssDialog(true);
};

const deleteSelectedEwalletss = () => {
    let _ewalletss = ewalletss.filter((val) => !selectedEwalletss.includes(val));
    setEwalletss(_ewalletss);
    setDeleteEwalletssDialog(false);
    setSelectedEwalletss([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Ewalletss Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:EwalletsKey) => {
    let val = (e.target && e.target.value) || '';
    let _ewallets:Ewallets = { ...ewallets };
    _ewallets[name] = val;
    setEwallets(_ewallets);
};
const onInputBooleanChange=(e:any, name:EwalletsKey)=>{
    let val =  e.target.value;
    let _ewallets:Ewallets = { ...ewallets };
    _ewallets[name] = val;

    setEwallets(_ewallets);
}

const onInputChange = (e:any, name:EwalletsKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=ewallets[name];	
           	
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
    
    
    let _ewallets:Ewallets = { ...ewallets };
    _ewallets[name] = val;

    setEwallets(_ewallets);
};

const onInputNumberChange = (e: any, name:EwalletsKey) => {
    let val = e.value || 0;
    let _ewallets = { ...ewallets };
    _ewallets[name] = val;

    setEwallets(_ewallets);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:EwalletsQuery={}
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
        
        let d=  await ewalletsService.getEwallets(searchObj);
        if(d.error==undefined ){
            
            setEwalletss(d.docs);
            setBackupEwalletss(d.docs);
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
        let _ewalletss =[...ewalletss];
        let filtered = _ewalletss.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setEwalletss(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setEwalletss(backupEwalletss);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedEwalletss || !selectedEwalletss.length} />
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



const actionBodyTemplate = (rowData:Ewallets) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editEwallets(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEwallets(rowData)} />
        
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
        <h5 className="m-0">Manage Ewalletss</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const ewalletsDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEwallets} />
    </>
);
const deleteEwalletsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEwalletsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteEwallets} />
    </>
);
const deleteEwalletssDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEwalletssDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEwalletss} />
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
                    value={ewalletss}
                    selection={selectedEwalletss}
                    onSelectionChange={(e) => setSelectedEwalletss(e.value as Ewallets[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Ewalletss"
                    emptyMessage="No Ewalletss found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="wallettype" header="Wallet Type" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallettype"   filter filterElement={wallettypeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="balance" header="Balance" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={balanceFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="hold" header="Hold" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={holdFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status" dataType="boolean"  filter filterElement={statusFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="blocked" header="Blocked" sortable  headerStyle={{ minWidth: '10rem' }} filterField="blocked" dataType="boolean"  filter filterElement={blockedFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="name" header="Name" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by name" ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={ewalletsDialog} style={{ width: '450px' }} header="Ewallets Details" modal className="p-fluid" footer={ewalletsDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="wallettype">Wallet Type</label>
         <Dropdown   id="wallettype"  optionLabel="name" optionValue="code"  value={ewallets.wallettype} options={datawalletTypes} onChange={(e) => onInputChange(e, 'wallettype')}  />
    </div>
            

    <div className="field">
        <label htmlFor="blocked">Blocked</label>
         <TriStateCheckbox  name="blocked"  id="blocked" value={ewallets.blocked} onChange={(e) => onInputBooleanChange(e, 'blocked')}  />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <TriStateCheckbox  name="status"  id="status" value={ewallets.status} onChange={(e) => onInputBooleanChange(e, 'status')}  />
    </div>
            

    <div className="field">
        <label htmlFor="balance">Balance</label>
         <InputNumber id="balance" value={ewallets.balance} onValueChange={(e) => onInputNumberChange(e, 'balance')}  />
    </div>
            

    <div className="field">
        <label htmlFor="hold">Hold</label>
         <InputNumber id="hold" value={ewallets.hold} onValueChange={(e) => onInputNumberChange(e, 'hold')}  />
    </div>
            

    <div className="field">
        <label htmlFor="name">Name</label>
         <InputText id="name" value={ewallets.name} onChange={(e) => onInputChange(e, 'name')}    required className={classNames({ 'p-invalid': submitted && !ewallets.name })} />
    </div>
            
                </Dialog>

                <Dialog visible={deleteEwalletsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEwalletsDialogFooter} onHide={hideDeleteEwalletsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {ewallets && (
                            <span>
                                Are you sure you want to delete <b>Ewallets record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteEwalletssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEwalletssDialogFooter} onHide={hideDeleteEwalletssDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {ewallets && <span>Are you sure you want to delete the selected Ewallets?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default EwalletsPage;
        
       
        