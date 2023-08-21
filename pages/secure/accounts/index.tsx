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
import {Accounts,AccountsQuery,AccountsKey, AccountsService } from '@services/Accounts';


const AccountsPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'owner',type:validate.email,max:0,min:0,required:true},
{id:'accounttype',type:validate.text,required:true},
{id:'quantity',type:validate.number,max:0,min:0,required:true},
{id:'unitprice',type:validate.number,max:0,min:0,required:true},
{id:'total',type:validate.number,max:0,min:0,required:true},
{id:'maturedate',type:validate.date,max:0,min:0,required:true},
{id:'termscount',type:validate.int,max:0,min:0,required:true},
{id:'monthcount',type:validate.int,max:0,min:0,required:true},
{id:'status',type:validate.text,required:true},
{id:'block',type:validate.boolean,required:true}
    ]
let emptyAccounts:Accounts = {
    accounttype: '',
quantity: 0,
unitprice: 0,
total: 0,
maturedate: new Date(),
termscount: 0,
monthcount: 0,
status: '',
block: false,
owner: ''
};
const [accountss, setAccountss] = useState<Accounts[]>([]);
const [backupAccountss, setBackupAccountss] =  useState<Accounts[]>([]);
const [loading,setLoading] = useState(false);
const [accountsDialog, setAccountsDialog] = useState(false);
const [deleteAccountsDialog, setDeleteAccountsDialog] = useState(false);
const [deleteAccountssDialog, setDeleteAccountssDialog] = useState(false);
const [accounts, setAccounts] = useState<Accounts>(emptyAccounts);
const [selectedAccountss, setSelectedAccountss] = useState<Accounts[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Accounts[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const accountsService = new AccountsService();
const [refreshFlag, setRefreshFlag] = useState<number>(Date.now());



const [filters1, setFilters1] = useState<DataTableFilterMeta|undefined>({});
const clearFilter1 = () => {
    initFilters1();
};
useEffect(() => {
    setLoading(true);
    (async() => {
    let d=  await accountsService.getAccounts({limit:row});
    if(d.error==undefined ){
        setAccountss(d.docs);
        setBackupAccountss(d.docs);
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
        owner: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
accounttype: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
quantity: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
unitprice: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
maturedate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
block: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
createat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
termscount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
monthcount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        
    });

};

    const dataaccounttypes =[
	{value:"DGSA",name:"DGSA"},
	{value:"DGCA",name:"DGCA"}
]
                

    const datastatuss =[
	{value:"Pending",name:"Pending"},
	{value:"Active",name:"Active"},
	{value:"Matured",name:"Matured"},
	{value:"Re-Active",name:"Re-Active"}
]
                

const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
const updateatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
    const accounttypeFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Accounttype Picker</div>
                <Dropdown value={options.value} options={dataaccounttypes}  onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="value" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const quantityFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const unitpriceFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const totalFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const maturedateFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
            };
            
const termscountFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const monthcountFilterTemplate = (options:any) => {
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
const blockFilterTemplate = (options:any) => {
    return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
            };
            
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setAccounts(emptyAccounts);
    setSubmitted(false);
    setAccountsDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setAccountsDialog(false);
};

const hideDeleteAccountsDialog = () => {
    setDeleteAccountsDialog(false);
};

const hideDeleteAccountssDialog = () => {
    setDeleteAccountssDialog(false);
};

const saveAccounts = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(accounts,validation)
        if (validationErrors.length==0) {
        let _accountss:Accounts[] = [...accountss];
        let _accounts:Accounts = { ...accounts };
        if (accounts.id) {
        
            let d=  await accountsService.updateAccounts(_accounts);
                if(d.error==undefined){
                    
                    const index = _accountss.findIndex(c => c.id === accounts.id)
                    if (index !== -1) {
                        _accountss[index] = {..._accounts,maturedate:_accounts.maturedate.toString()};
                       // _accountss[index] = _accounts;
                        //_accountss.splice(index, 1, {..._accounts,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Accounts Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await accountsService.addAccounts(_accounts);
            if(d.error==undefined){
                var newID= d.id
               // _accountss.unshift({..._accounts,id:newID,maturedate:_accounts.maturedate.toString()})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Accounts Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setAccountss(_accountss);
        setBackupAccountss(_accountss);
        setAccountsDialog(false);
        setAccounts(emptyAccounts);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editAccounts = (accounts:Accounts) => {
    setAccounts({ ...accounts });
    setAccountsDialog(true);
};

const confirmDeleteAccounts = (accounts:Accounts) => {
    setAccounts(accounts);
    setDeleteAccountsDialog(true);
};

const deleteAccounts = async() => {

    let d=  await accountsService.deleteAccounts(accounts.id??'');
    if(d.error==undefined){
        let _accountss = accountss.filter((val) => val.id !== accounts.id);
        setAccountss(_accountss);
        setBackupAccountss(_accountss);
        setDeleteAccountsDialog(false);
        setAccounts(emptyAccounts);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Accounts Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Accounts Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteAccountssDialog(true);
};

const deleteSelectedAccountss = () => {
    let _accountss = accountss.filter((val) => !selectedAccountss.includes(val));
    setAccountss(_accountss);
    setDeleteAccountssDialog(false);
    setSelectedAccountss([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Accountss Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:AccountsKey) => {
    let val = (e.target && e.target.value) || '';
    let _accounts:Accounts = { ...accounts };
    _accounts[name] = val;
    setAccounts(_accounts);
};
const onInputBooleanChange=(e:any, name:AccountsKey)=>{
    let val =  e.target.value;
    let _accounts:Accounts = { ...accounts };
    _accounts[name] = val;

    setAccounts(_accounts);
}

const onInputChange = (e:any, name:AccountsKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=accounts[name];	
           	
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
    
    
    let _accounts:Accounts = { ...accounts };
    _accounts[name] = val;

    setAccounts(_accounts);
};

const onInputNumberChange = (e: any, name:AccountsKey) => {
    let val = e.value || 0;
    let _accounts = { ...accounts };
    _accounts[name] = val;

    setAccounts(_accounts);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:AccountsQuery={}
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
        
        let d=  await accountsService.getAccounts(searchObj);
        if(d.error==undefined ){
            
            setAccountss(d.docs);
            setBackupAccountss(d.docs);
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
        let _accountss =[...accountss];
        let filtered = _accountss.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setAccountss(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setAccountss(backupAccountss);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedAccountss || !selectedAccountss.length} />
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



const actionBodyTemplate = (rowData:Accounts) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editAccounts(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteAccounts(rowData)} />
        
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
        <h5 className="m-0">Manage Accountss</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const accountsDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAccounts} />
    </>
);
const deleteAccountsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAccountsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteAccounts} />
    </>
);
const deleteAccountssDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAccountssDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedAccountss} />
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
                    value={accountss}
                    selection={selectedAccountss}
                    onSelectionChange={(e) => setSelectedAccountss(e.value as Accounts[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Accountss"
                    emptyMessage="No Accountss found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="owner" header="Owner" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by owner" ></Column>
            

    <Column showAddButton={false}  field="accounttype" header="Account type" sortable  headerStyle={{ minWidth: '10rem' }} filterField="accounttype"   filter filterElement={accounttypeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="quantity" header="Quantity" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={quantityFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="unitprice" header="Unit price" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={unitpriceFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="total" header="Total" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={totalFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="maturedate" header="Mature date" sortable  headerStyle={{ minWidth: '10rem' }} filterField="maturedate" dataType="date" filter filterElement={maturedateFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="status" header="Status" sortable  headerStyle={{ minWidth: '10rem' }} filterField="status"   filter filterElement={statusFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="block" header="Block" sortable  headerStyle={{ minWidth: '10rem' }} filterField="block" dataType="boolean"  filter filterElement={blockFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="createat" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createat" dataType="date" filter filterElement={createatFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="termscount" header="Terms count" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={termscountFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="monthcount" header="Month count" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={monthcountFilterTemplate} ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={accountsDialog} style={{ width: '450px' }} header="Accounts Details" modal className="p-fluid" footer={accountsDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="owner">Owner</label>
         <InputText id="owner" value={accounts.owner} onChange={(e) => onInputChange(e, 'owner')}    required className={classNames({ 'p-invalid': submitted && !accounts.owner })} />
    </div>
            

    <div className="field">
        <label htmlFor="accounttype">Account type</label>
         <Dropdown   id="accounttype" optionLabel="name"  value={accounts.accounttype} options={dataaccounttypes} onChange={(e) => onInputChange(e, 'accounttype')}  />
    </div>
            

    <div className="field">
        <label htmlFor="quantity">Quantity</label>
         <InputNumber id="quantity" value={accounts.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')}  />
    </div>
            

    <div className="field">
        <label htmlFor="unitprice">Unit price</label>
         <InputNumber id="unitprice" value={accounts.unitprice} onValueChange={(e) => onInputNumberChange(e, 'unitprice')}  />
    </div>
            

    <div className="field">
        <label htmlFor="total">Total</label>
         <InputNumber id="total" value={accounts.total} onValueChange={(e) => onInputNumberChange(e, 'total')}  />
    </div>
            

    <div className="field">
        <label htmlFor="maturedate">Mature date</label>
         <Calendar id="maturedate" value={accounts.maturedate?new Date(accounts.maturedate):null }  onChange={(e) => onInputChange(e, 'maturedate')} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999"     required className={classNames({ 'p-invalid': submitted && !accounts.maturedate })} />
    </div>
            

    <div className="field">
        <label htmlFor="termscount">Terms count</label>
         <InputNumber id="termscount" value={accounts.termscount} onValueChange={(e) => onInputNumberChange(e, 'termscount')}  />
    </div>
            

    <div className="field">
        <label htmlFor="monthcount">Month count</label>
         <InputNumber id="monthcount" value={accounts.monthcount} onValueChange={(e) => onInputNumberChange(e, 'monthcount')}  />
    </div>
            

    <div className="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name"  value={accounts.status} options={datastatuss} onChange={(e) => onInputChange(e, 'status')}  />
    </div>
            

    <div className="field">
        <label htmlFor="block">Block</label>
         <TriStateCheckbox  name="block"  id="block" value={accounts.block} onChange={(e) => onInputBooleanChange(e, 'block')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteAccountsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAccountsDialogFooter} onHide={hideDeleteAccountsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {accounts && (
                            <span>
                                Are you sure you want to delete <b>Accounts record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteAccountssDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAccountssDialogFooter} onHide={hideDeleteAccountssDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {accounts && <span>Are you sure you want to delete the selected Accounts?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default AccountsPage;
        
       
        