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
import {Exchange,ExchangeQuery,ExchangeKey, ExchangeService } from '@services/Exchange';
import {Ewallets, EwalletsService } from '@services/Ewallets';
import {WalletType, WalletTypeService } from '@services/WalletType';

const ExchangePage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'sourcewallet',type:validate.text,required:true},
{id:'wallet',type:validate.text,required:true},
{id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'comments',type:validate.text,max:300,min:0,required:true},
{id:'sourcewallettype',type:validate.text,required:true},
{id:'wallettype',type:validate.text,required:true},
{id:'status',type:validate.text,required:true}
    ]
let emptyExchange:Exchange = {
    amount: 0
};
const [exchanges, setExchanges] = useState<Exchange[]>([]);
const [backupExchanges, setBackupExchanges] =  useState<Exchange[]>([]);
const [loading,setLoading] = useState(false);
const [exchangeDialog, setExchangeDialog] = useState(false);
const [deleteExchangeDialog, setDeleteExchangeDialog] = useState(false);
const [deleteExchangesDialog, setDeleteExchangesDialog] = useState(false);
const [exchange, setExchange] = useState<Exchange>(emptyExchange);
const [selectedExchanges, setSelectedExchanges] = useState<Exchange[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Exchange[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const exchangeService = new ExchangeService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const ewalletsService = new EwalletsService();
    const [dataewalletss, setDataEwalletss] = useState<Ewallets[]>([]);
    const wallettypeService = new WalletTypeService();
    const [datawalletTypes, setDataWalletTypes] = useState<WalletType[]>([]);

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await exchangeService.getExchange({limit:row});
    if(d.error==undefined ){
        setExchanges(d.docs);
        setBackupExchanges(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
                 
    let dataEwalletss_=  await ewalletsService.getEwalletsAll({});
    setDataEwalletss(dataEwalletss_.data);
              
         
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
        sourcewallettype: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
wallettype: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
sourcewallet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
wallet: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        
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
            
    const sourcewalletFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Sourcewallet Picker</div>
                <Dropdown value={options.value} options={dataewalletss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="id" placeholder="Any" className="p-column-filter" />
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
const amountFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
    const sourcewallettypeFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Sourcewallettype Picker</div>
                <Dropdown value={options.value} options={datawalletTypes}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="code" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
    const wallettypeFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Wallettype Picker</div>
                <Dropdown value={options.value} options={datawalletTypes}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="name" placeholder="Any" className="p-column-filter" />
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
    setExchange(emptyExchange);
    setSubmitted(false);
    setExchangeDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setExchangeDialog(false);
};

const hideDeleteExchangeDialog = () => {
    setDeleteExchangeDialog(false);
};

const hideDeleteExchangesDialog = () => {
    setDeleteExchangesDialog(false);
};

const saveExchange = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(exchange,validation)
        if (validationErrors.length==0) {
        let _exchanges:Exchange[] = [...exchanges];
        let _exchange:Exchange = { ...exchange };
        if (exchange.id) {
        
            let d=  await exchangeService.updateExchange(_exchange);
                if(d.error==undefined){
                    
                    const index = _exchanges.findIndex(c => c.id === exchange.id)
                    if (index !== -1) {
                        _exchanges[index] = {..._exchange};
                       // _exchanges[index] = _exchange;
                        //_exchanges.splice(index, 1, {..._exchange,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Exchange Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await exchangeService.addExchange(_exchange);
            if(d.error==undefined){
                var newID= d.id
               // _exchanges.unshift({..._exchange,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Exchange Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setExchanges(_exchanges);
        setBackupExchanges(_exchanges);
        setExchangeDialog(false);
        setExchange(emptyExchange);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editExchange = (exchange:Exchange) => {
    setExchange({ ...exchange });
    setExchangeDialog(true);
};

const confirmDeleteExchange = (exchange:Exchange) => {
    setExchange(exchange);
    setDeleteExchangeDialog(true);
};

const deleteExchange = async() => {

    let d=  await exchangeService.deleteExchange(exchange.id??'');
    if(d.error==undefined){
        let _exchanges = exchanges.filter((val) => val.id !== exchange.id);
        setExchanges(_exchanges);
        setBackupExchanges(_exchanges);
        setDeleteExchangeDialog(false);
        setExchange(emptyExchange);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Exchange Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Exchange Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteExchangesDialog(true);
};

const deleteSelectedExchanges = () => {
    let _exchanges = exchanges.filter((val) => !selectedExchanges.includes(val));
    setExchanges(_exchanges);
    setDeleteExchangesDialog(false);
    setSelectedExchanges([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Exchanges Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:ExchangeKey) => {
    let val = (e.target && e.target.value) || '';
    let _exchange:Exchange = { ...exchange };
    _exchange[name] = val;
    setExchange(_exchange);
};
const onInputBooleanChange=(e:any, name:ExchangeKey)=>{
    let val =  e.target.value;
    let _exchange:Exchange = { ...exchange };
    _exchange[name] = val;

    setExchange(_exchange);
}

const onInputChange = (e:any, name:ExchangeKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=exchange[name];	
           	
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
    
    
    let _exchange:Exchange = { ...exchange };
    _exchange[name] = val;

    setExchange(_exchange);
};

const onInputNumberChange = (e: any, name:ExchangeKey) => {
    let val = e.value || 0;
    let _exchange = { ...exchange };
    _exchange[name] = val;

    setExchange(_exchange);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:ExchangeQuery={}
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
        
        let d=  await exchangeService.getExchange(searchObj);
        if(d.error==undefined ){
            
            setExchanges(d.docs);
            setBackupExchanges(d.docs);
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
        let _exchanges =[...exchanges];
        let filtered = _exchanges.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setExchanges(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setExchanges(backupExchanges);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedExchanges || !selectedExchanges.length} />
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



const actionBodyTemplate = (rowData:Exchange) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editExchange(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteExchange(rowData)} />
        
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
        <h5 className="m-0">Manage Exchanges</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const exchangeDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveExchange} />
    </>
);
const deleteExchangeDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteExchangeDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteExchange} />
    </>
);
const deleteExchangesDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteExchangesDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedExchanges} />
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
                    value={exchanges}
                    selection={selectedExchanges}
                    onSelectionChange={(e) => setSelectedExchanges(e.value as Exchange[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Exchanges"
                    emptyMessage="No Exchanges found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="sourcewallettype" header="Source wallet type" sortable  headerStyle={{ minWidth: '10rem' }} filterField="sourcewallettype"   filter filterElement={sourcewallettypeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="wallettype" header="Wallet type" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallettype"   filter filterElement={wallettypeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="sourcewallet" header="Source wallet" sortable  headerStyle={{ minWidth: '10rem' }} filterField="sourcewallet"   filter filterElement={sourcewalletFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="wallet" header="Wallet" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallet"   filter filterElement={walletFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="amount" header="Amount" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={amountFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status"   filter filterElement={statusFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="comments" header="Comments" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by comments" ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={exchangeDialog} style={{ width: '450px' }} header="Exchange Details" modal className="p-fluid" footer={exchangeDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="sourcewallet">Source wallet</label>
         <Dropdown   id="sourcewallet"  optionLabel="name" optionValue="id"  value={exchange.sourcewallet} options={dataewalletss} onChange={(e) => onInputChange(e, 'sourcewallet')}  />
    </div>
            

    <div className="field">
        <label htmlFor="wallet">Wallet</label>
         <Dropdown   id="wallet"  optionLabel="name" optionValue="id"  value={exchange.wallet} options={dataewalletss} onChange={(e) => onInputChange(e, 'wallet')}  />
    </div>
            

    <div className="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" value={exchange.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')}  />
    </div>
            

    <div className="field">
        <label htmlFor="comments">Comments</label>
         <InputTextarea id="comments" value={exchange.comments} onChange={(e) => onInputChange(e, 'comments')} rows={5} cols={30}    required className={classNames({ 'p-invalid': submitted && !exchange.comments })} />
    </div>
            

    <div className="field">
        <label htmlFor="sourcewallettype">Source wallet type</label>
         <Dropdown   id="sourcewallettype"  optionLabel="name" optionValue="code"  value={exchange.sourcewallettype} options={datawalletTypes} onChange={(e) => onInputChange(e, 'sourcewallettype')}  />
    </div>
            

    <div className="field">
        <label htmlFor="wallettype">Wallet type</label>
         <Dropdown   id="wallettype"  optionLabel="name" optionValue="name"  value={exchange.wallettype} options={datawalletTypes} onChange={(e) => onInputChange(e, 'wallettype')}  />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name"  value={exchange.status} options={datastatuss} onChange={(e) => onInputChange(e, 'status')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteExchangeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteExchangeDialogFooter} onHide={hideDeleteExchangeDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {exchange && (
                            <span>
                                Are you sure you want to delete <b>Exchange record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteExchangesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteExchangesDialogFooter} onHide={hideDeleteExchangesDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {exchange && <span>Are you sure you want to delete the selected Exchange?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default ExchangePage;
        
       
        