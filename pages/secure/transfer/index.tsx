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
import {Transfer,TransferQuery,TransferKey, TransferService } from '@services/Transfer';
import {WalletType, WalletTypeService } from '@services/WalletType';
import {Ewallets, EwalletsService } from '@services/Ewallets';

const TransferPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'wallettype',type:validate.text,required:true},
{id:'wallet',type:validate.text,required:true},
{id:'sourcewallet',type:validate.text,required:true},
{id:'status',type:validate.text,required:true},
{id:'comments',type:validate.text,max:300,min:0,required:true}
    ]
let emptyTransfer:Transfer = {
    amount: 0,
sourcewallet: '',
status: ''
};
const [transfers, setTransfers] = useState<Transfer[]>([]);
const [backupTransfers, setBackupTransfers] =  useState<Transfer[]>([]);
const [loading,setLoading] = useState(false);
const [transferDialog, setTransferDialog] = useState(false);
const [deleteTransferDialog, setDeleteTransferDialog] = useState(false);
const [deleteTransfersDialog, setDeleteTransfersDialog] = useState(false);
const [transfer, setTransfer] = useState<Transfer>(emptyTransfer);
const [selectedTransfers, setSelectedTransfers] = useState<Transfer[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Transfer[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const transferService = new TransferService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const wallettypeService = new WalletTypeService();
    const [datawalletTypes, setDataWalletTypes] = useState<WalletType[]>([]);
    const ewalletsService = new EwalletsService();
    const [dataewalletss, setDataEwalletss] = useState<Ewallets[]>([]);

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await transferService.getTransfer({limit:row});
    if(d.error==undefined ){
        setTransfers(d.docs);
        setBackupTransfers(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
                 
    let dataWalletTypes_=  await wallettypeService.getWalletTypeAll({});
    setDataWalletTypes(dataWalletTypes_.data);
              
         
    let dataEwalletss_=  await ewalletsService.getEwalletsAll({});
    setDataEwalletss(dataEwalletss_.data);
              
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
sourcewallet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
wallet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        
    });

};

    const datastatuss =[
	{value:"Pending",name:"Pending"},
	{value:"Confirmed",name:"Confirmed"},
	{value:"Declined",name:"Declined"}
]
                

const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const amountFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
    const wallettypeFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Wallettype Picker</div>
                <Dropdown value={options.value} options={datawalletTypes}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="code" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
    const walletFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Wallet Picker</div>
                <Dropdown value={options.value} options={dataewalletss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="id" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
    const sourcewalletFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Sourcewallet Picker</div>
                <Dropdown value={options.value} options={dataewalletss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="id" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
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
    setTransfer(emptyTransfer);
    setSubmitted(false);
    setTransferDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setTransferDialog(false);
};

const hideDeleteTransferDialog = () => {
    setDeleteTransferDialog(false);
};

const hideDeleteTransfersDialog = () => {
    setDeleteTransfersDialog(false);
};

const saveTransfer = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(transfer,validation)
        if (validationErrors.length==0) {
        let _transfers:Transfer[] = [...transfers];
        let _transfer:Transfer = { ...transfer };
        if (transfer.id) {
        
            let d=  await transferService.updateTransfer(_transfer);
                if(d.error==undefined){
                    
                    const index = _transfers.findIndex(c => c.id === transfer.id)
                    if (index !== -1) {
                        _transfers[index] = {..._transfer};
                       // _transfers[index] = _transfer;
                        //_transfers.splice(index, 1, {..._transfer,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Transfer Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await transferService.addTransfer(_transfer);
            if(d.error==undefined){
                var newID= d.id
               // _transfers.unshift({..._transfer,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Transfer Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setTransfers(_transfers);
        setBackupTransfers(_transfers);
        setTransferDialog(false);
        setTransfer(emptyTransfer);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editTransfer = (transfer:Transfer) => {
    setTransfer({ ...transfer });
    setTransferDialog(true);
};

const confirmDeleteTransfer = (transfer:Transfer) => {
    setTransfer(transfer);
    setDeleteTransferDialog(true);
};

const deleteTransfer = async() => {

    let d=  await transferService.deleteTransfer(transfer.id??'');
    if(d.error==undefined){
        let _transfers = transfers.filter((val) => val.id !== transfer.id);
        setTransfers(_transfers);
        setBackupTransfers(_transfers);
        setDeleteTransferDialog(false);
        setTransfer(emptyTransfer);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Transfer Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Transfer Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteTransfersDialog(true);
};

const deleteSelectedTransfers = () => {
    let _transfers = transfers.filter((val) => !selectedTransfers.includes(val));
    setTransfers(_transfers);
    setDeleteTransfersDialog(false);
    setSelectedTransfers([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Transfers Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:TransferKey) => {
    let val = (e.target && e.target.value) || '';
    let _transfer:Transfer = { ...transfer };
    _transfer[name] = val;
    setTransfer(_transfer);
};
const onInputBooleanChange=(e:any, name:TransferKey)=>{
    let val =  e.target.value;
    let _transfer:Transfer = { ...transfer };
    _transfer[name] = val;

    setTransfer(_transfer);
}

const onInputChange = (e:any, name:TransferKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=transfer[name];	
           	
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
    
    
    let _transfer:Transfer = { ...transfer };
    _transfer[name] = val;

    setTransfer(_transfer);
};

const onInputNumberChange = (e: any, name:TransferKey) => {
    let val = e.value || 0;
    let _transfer = { ...transfer };
    _transfer[name] = val;

    setTransfer(_transfer);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:TransferQuery={}
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
        
        let d=  await transferService.getTransfer(searchObj);
        if(d.error==undefined ){
            
            setTransfers(d.docs);
            setBackupTransfers(d.docs);
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
        let _transfers =[...transfers];
        let filtered = _transfers.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setTransfers(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setTransfers(backupTransfers);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedTransfers || !selectedTransfers.length} />
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



const actionBodyTemplate = (rowData:Transfer) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editTransfer(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTransfer(rowData)} />
        
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
        <h5 className="m-0">Manage Transfers</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const transferDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveTransfer} />
    </>
);
const deleteTransferDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTransferDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteTransfer} />
    </>
);
const deleteTransfersDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTransfersDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedTransfers} />
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
                    value={transfers}
                    selection={selectedTransfers}
                    onSelectionChange={(e) => setSelectedTransfers(e.value as Transfer[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Transfers"
                    emptyMessage="No Transfers found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="wallettype" header="Wallettype" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallettype"   filter filterElement={wallettypeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="sourcewallet" header="Source wallet" sortable  headerStyle={{ minWidth: '10rem' }} filterField="sourcewallet"   filter filterElement={sourcewalletFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="wallet" header="Wallet" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallet"   filter filterElement={walletFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="amount" header="Amount" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={amountFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="comments" header="Comments" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by comments" ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status"   filter filterElement={statusFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={transferDialog} style={{ width: '450px' }} header="Transfer Details" modal className="p-fluid" footer={transferDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" value={transfer.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')}  />
    </div>
            

    <div className="field">
        <label htmlFor="wallettype">Wallettype</label>
         <Dropdown   id="wallettype"  optionLabel="name" optionValue="code"  value={transfer.wallettype} options={datawalletTypes} onChange={(e) => onInputChange(e, 'wallettype')}  />
    </div>
            

    <div className="field">
        <label htmlFor="wallet">Wallet</label>
         <Dropdown   id="wallet"  optionLabel="name" optionValue="id"  value={transfer.wallet} options={dataewalletss} onChange={(e) => onInputChange(e, 'wallet')}  />
    </div>
            

    <div className="field">
        <label htmlFor="sourcewallet">Source wallet</label>
         <Dropdown   id="sourcewallet"  optionLabel="name" optionValue="id"  value={transfer.sourcewallet} options={dataewalletss} onChange={(e) => onInputChange(e, 'sourcewallet')}  />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name"  value={transfer.status} options={datastatuss} onChange={(e) => onInputChange(e, 'status')}  />
    </div>
            

    <div className="field">
        <label htmlFor="comments">Comments</label>
         <InputTextarea id="comments" value={transfer.comments} onChange={(e) => onInputChange(e, 'comments')} rows={5} cols={30}    required className={classNames({ 'p-invalid': submitted && !transfer.comments })} />
    </div>
            
                </Dialog>

                <Dialog visible={deleteTransferDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransferDialogFooter} onHide={hideDeleteTransferDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {transfer && (
                            <span>
                                Are you sure you want to delete <b>Transfer record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteTransfersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransfersDialogFooter} onHide={hideDeleteTransfersDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {transfer && <span>Are you sure you want to delete the selected Transfer?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default TransferPage;
        
       
        