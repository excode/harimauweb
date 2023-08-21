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
import {Profit,ProfitQuery,ProfitKey, ProfitService } from '@services/Profit';
import {Accounts, AccountsService } from '@services/Accounts';

const ProfitPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'account',type:validate.text,required:true},
{id:'level',type:validate.int,max:0,min:0,required:true},
{id:'username',type:validate.text,max:0,min:0,required:true},
{id:'status',type:validate.text,required:true}
    ]
let emptyProfit:Profit = {
    level: 0,
username: ''
};
const [profits, setProfits] = useState<Profit[]>([]);
const [backupProfits, setBackupProfits] =  useState<Profit[]>([]);
const [loading,setLoading] = useState(false);
const [profitDialog, setProfitDialog] = useState(false);
const [deleteProfitDialog, setDeleteProfitDialog] = useState(false);
const [deleteProfitsDialog, setDeleteProfitsDialog] = useState(false);
const [profit, setProfit] = useState<Profit>(emptyProfit);
const [selectedProfits, setSelectedProfits] = useState<Profit[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Profit[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const profitService = new ProfitService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());


    const accountsService = new AccountsService();
    const [dataaccountss, setDataAccountss] = useState<Accounts[]>([]);

const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await profitService.getProfit({limit:row});
    if(d.error==undefined ){
        setProfits(d.docs);
        setBackupProfits(d.docs);
        setLoading(false)
        setTotalRecords(d.count)
                 
    let dataAccountss_=  await accountsService.getAccountsAll({});
    setDataAccountss(dataAccountss_.data);
              
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
        account: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
level: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
createat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        
    });

};

    const datastatuss =[
	{value:"pending",name:"pending"},
	{value:"confirm",name:"confirm"},
	{value:"declined",name:"declined"}
]
                

const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
    const accountFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Account Picker</div>
                <Dropdown value={options.value} options={dataaccountss}  onChange={(e) => options.filterCallback(e.value)} optionLabel="accounttype" optionValue="id" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const levelFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
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
    setProfit(emptyProfit);
    setSubmitted(false);
    setProfitDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setProfitDialog(false);
};

const hideDeleteProfitDialog = () => {
    setDeleteProfitDialog(false);
};

const hideDeleteProfitsDialog = () => {
    setDeleteProfitsDialog(false);
};

const saveProfit = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(profit,validation)
        if (validationErrors.length==0) {
        let _profits:Profit[] = [...profits];
        let _profit:Profit = { ...profit };
        if (profit.id) {
        
            let d=  await profitService.updateProfit(_profit);
                if(d.error==undefined){
                    
                    const index = _profits.findIndex(c => c.id === profit.id)
                    if (index !== -1) {
                        _profits[index] = {..._profit};
                       // _profits[index] = _profit;
                        //_profits.splice(index, 1, {..._profit,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Profit Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await profitService.addProfit(_profit);
            if(d.error==undefined){
                var newID= d.id
               // _profits.unshift({..._profit,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Profit Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setProfits(_profits);
        setBackupProfits(_profits);
        setProfitDialog(false);
        setProfit(emptyProfit);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editProfit = (profit:Profit) => {
    setProfit({ ...profit });
    setProfitDialog(true);
};

const confirmDeleteProfit = (profit:Profit) => {
    setProfit(profit);
    setDeleteProfitDialog(true);
};

const deleteProfit = async() => {

    let d=  await profitService.deleteProfit(profit.id??'');
    if(d.error==undefined){
        let _profits = profits.filter((val) => val.id !== profit.id);
        setProfits(_profits);
        setBackupProfits(_profits);
        setDeleteProfitDialog(false);
        setProfit(emptyProfit);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Profit Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profit Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteProfitsDialog(true);
};

const deleteSelectedProfits = () => {
    let _profits = profits.filter((val) => !selectedProfits.includes(val));
    setProfits(_profits);
    setDeleteProfitsDialog(false);
    setSelectedProfits([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Profits Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:ProfitKey) => {
    let val = (e.target && e.target.value) || '';
    let _profit:Profit = { ...profit };
    _profit[name] = val;
    setProfit(_profit);
};
const onInputBooleanChange=(e:any, name:ProfitKey)=>{
    let val =  e.target.value;
    let _profit:Profit = { ...profit };
    _profit[name] = val;

    setProfit(_profit);
}

const onInputChange = (e:any, name:ProfitKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=profit[name];	
           	
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
    
    
    let _profit:Profit = { ...profit };
    _profit[name] = val;

    setProfit(_profit);
};

const onInputNumberChange = (e: any, name:ProfitKey) => {
    let val = e.value || 0;
    let _profit = { ...profit };
    _profit[name] = val;

    setProfit(_profit);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:ProfitQuery={}
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
        
        let d=  await profitService.getProfit(searchObj);
        if(d.error==undefined ){
            
            setProfits(d.docs);
            setBackupProfits(d.docs);
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
        let _profits =[...profits];
        let filtered = _profits.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setProfits(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setProfits(backupProfits);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProfits || !selectedProfits.length} />
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



const actionBodyTemplate = (rowData:Profit) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProfit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProfit(rowData)} />
        
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
        <h5 className="m-0">Manage Profits</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const profitDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProfit} />
    </>
);
const deleteProfitDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfitDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProfit} />
    </>
);
const deleteProfitsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfitsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProfits} />
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
                    value={profits}
                    selection={selectedProfits}
                    onSelectionChange={(e) => setSelectedProfits(e.value as Profit[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Profits"
                    emptyMessage="No Profits found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="account" header="Account" sortable  headerStyle={{ minWidth: '10rem' }} filterField="account"   filter filterElement={accountFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="username" header="Username" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by username" ></Column>
            

    <Column showAddButton={false}  field="level" header="Level" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={levelFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status"   filter filterElement={statusFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createat" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createat" dataType="date" filter filterElement={createatFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={profitDialog} style={{ width: '450px' }} header="Profit Details" modal className="p-fluid" footer={profitDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="account">Account</label>
         <Dropdown   id="account"  optionLabel="accounttype" optionValue="id"  value={profit.account} options={dataaccountss} onChange={(e) => onInputChange(e, 'account')}  />
    </div>
            

    <div className="field">
        <label htmlFor="level">Level</label>
         <InputNumber id="level" value={profit.level} onValueChange={(e) => onInputNumberChange(e, 'level')}  />
    </div>
            

    <div className="field">
        <label htmlFor="username">Username</label>
         <InputText id="username" value={profit.username} onChange={(e) => onInputChange(e, 'username')}    required className={classNames({ 'p-invalid': submitted && !profit.username })} />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name"  value={profit.status} options={datastatuss} onChange={(e) => onInputChange(e, 'status')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteProfitDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfitDialogFooter} onHide={hideDeleteProfitDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {profit && (
                            <span>
                                Are you sure you want to delete <b>Profit record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteProfitsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfitsDialogFooter} onHide={hideDeleteProfitsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {profit && <span>Are you sure you want to delete the selected Profit?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default ProfitPage;
        
       
        