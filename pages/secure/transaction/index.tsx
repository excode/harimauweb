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
import {Transaction,TransactionQuery,TransactionKey, TransactionService } from '@services/Transaction';
import {WalletType, WalletTypeService } from '@services/WalletType';

const TransactionPage = () => {
const { asPath } = useRouter();
const validation=[
    {id:'wallettype',type:validate.text,required:true},
{id:'walletid',type:validate.text,max:0,min:0,required:true},
{id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'balance',type:validate.number,max:0,min:0,required:true}
    ]
let emptyTransaction:Transaction = {
    wallettype: '',
walletid: '',
amount: 0,
balance: 0
};
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [backupTransactions, setBackupTransactions] =  useState<Transaction[]>([]);
const [loading,setLoading] = useState(false);
const [transactionDialog, setTransactionDialog] = useState(false);
const [deleteTransactionDialog, setDeleteTransactionDialog] = useState(false);
const [deleteTransactionsDialog, setDeleteTransactionsDialog] = useState(false);
const [transaction, setTransaction] = useState<Transaction>(emptyTransaction);
const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
const [submitted, setSubmitted] = useState(false);
const [sortOrders, setSortOrders] = useState<SortType>({});
const [globalFilter, setGlobalFilter] = useState('');
const [row, setRow] = useState<number>(10);
const [totalRecords, setTotalRecords] = useState<number>(0);
const toast = useRef<Toast>(null);
const dt = useRef<DataTable<Transaction[]>>(null);
const contextPath = getConfig().publicRuntimeConfig.contextPath;
const transactionService = new TransactionService();
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
    let d=  await transactionService.getTransaction({limit:row});
    if(d.error==undefined ){
        setTransactions(d.docs);
        setBackupTransactions(d.docs);
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
walletid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
createat: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
        
    });

};


const createatFilterTemplate = (options:any) => {
return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} showTime hourFormat="12" />;
            };
            
    const wallettypeFilterTemplate = (options:any) => {
    return (
            <>
                <div className="mb-3 text-bold">Wallettype Picker</div>
                <Dropdown value={options.value} options={datawalletTypes}  onChange={(e) => options.filterCallback(e.value)} optionLabel="code" optionValue="code" placeholder="Any" className="p-column-filter" />
            </>
        );
    }
const amountFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const balanceFilterTemplate = (options:any) => {
    return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} />;
                };
const defaultImage=(e:any)=>{
    e.target.src ="/photo_na.png"
}
const openNew = () => {
    setTransaction(emptyTransaction);
    setSubmitted(false);
    setTransactionDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setTransactionDialog(false);
};

const hideDeleteTransactionDialog = () => {
    setDeleteTransactionDialog(false);
};

const hideDeleteTransactionsDialog = () => {
    setDeleteTransactionsDialog(false);
};

const saveTransaction = async () => {
    setSubmitted(true);
    const validationErrors:string[]=validateForm(transaction,validation)
        if (validationErrors.length==0) {
        let _transactions:Transaction[] = [...transactions];
        let _transaction:Transaction = { ...transaction };
        if (transaction.id) {
        
            let d=  await transactionService.updateTransaction(_transaction);
                if(d.error==undefined){
                    
                    const index = _transactions.findIndex(c => c.id === transaction.id)
                    if (index !== -1) {
                        _transactions[index] = {..._transaction};
                       // _transactions[index] = _transaction;
                        //_transactions.splice(index, 1, {..._transaction,id:id});
                    }
                    toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Transaction Updated', life: 3000 });
                }else{
                    
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
                }
           
        } else {
            let d=  await transactionService.addTransaction(_transaction);
            if(d.error==undefined){
                var newID= d.id
               // _transactions.unshift({..._transaction,id:newID})
                
               toast.current?.show({ severity: 'success', summary: 'Loaded', detail: 'Transaction Updated', life: 3000 });
               // TRIGGER REFRESH
               setRefreshFlag(Date.now());
            }else{
                
                toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
            }
            
           
        }

        setTransactions(_transactions);
        setBackupTransactions(_transactions);
        setTransactionDialog(false);
        setTransaction(emptyTransaction);
    
}else{
    toast.current?.show({ severity: 'error', summary: 'Error', detail: validationErrors.join(","), life: 3000 });
}
};

const editTransaction = (transaction:Transaction) => {
    setTransaction({ ...transaction });
    setTransactionDialog(true);
};

const confirmDeleteTransaction = (transaction:Transaction) => {
    setTransaction(transaction);
    setDeleteTransactionDialog(true);
};

const deleteTransaction = async() => {

    let d=  await transactionService.deleteTransaction(transaction.id??'');
    if(d.error==undefined){
        let _transactions = transactions.filter((val) => val.id !== transaction.id);
        setTransactions(_transactions);
        setBackupTransactions(_transactions);
        setDeleteTransactionDialog(false);
        setTransaction(emptyTransaction);
        toast.current?.show({ severity: 'warn', summary: 'Deleted', detail: 'Transaction Deleted', life: 3000 });
    }else{
        
        toast.current?.show({ severity: 'error', summary: 'Error', detail: d.error, life: 3000 });
    }
    
    
    //toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Transaction Deleted', life: 3000 });
};




const exportCSV = () => {
    dt.current?.exportCSV();
};

const confirmDeleteSelected = () => {
    setDeleteTransactionsDialog(true);
};

const deleteSelectedTransactions = () => {
    let _transactions = transactions.filter((val) => !selectedTransactions.includes(val));
    setTransactions(_transactions);
    setDeleteTransactionsDialog(false);
    setSelectedTransactions([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Transactions Deleted', life: 3000 });
};

const onCategoryChange = (e: any,name:TransactionKey) => {
    let val = (e.target && e.target.value) || '';
    let _transaction:Transaction = { ...transaction };
    _transaction[name] = val;
    setTransaction(_transaction);
};
const onInputBooleanChange=(e:any, name:TransactionKey)=>{
    let val =  e.target.value;
    let _transaction:Transaction = { ...transaction };
    _transaction[name] = val;

    setTransaction(_transaction);
}

const onInputChange = (e:any, name:TransactionKey) => {
    let val = (e.target && e.target.value) || undefined;
    const ctrlType = e.target.type;	
    if(typeof val === 'object'){	
        if ( val instanceof Date &&isFinite(val.getTime()) ) {	
            val=val;	
      	
        }else if("value" in val){	
            let aVal=transaction[name];	
           	
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
    
    
    let _transaction:Transaction = { ...transaction };
    _transaction[name] = val;

    setTransaction(_transaction);
};

const onInputNumberChange = (e: any, name:TransactionKey) => {
    let val = e.value || 0;
    let _transaction = { ...transaction };
    _transaction[name] = val;

    setTransaction(_transaction);
};
const getNewData =async(e:any,type:number=0)=>{
    setLoading(true)
    let searchObj:TransactionQuery={}
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
        
        let d=  await transactionService.getTransaction(searchObj);
        if(d.error==undefined ){
            
            setTransactions(d.docs);
            setBackupTransactions(d.docs);
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
        let _transactions =[...transactions];
        let filtered = _transactions.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
        setTransactions(filtered);
    }else if(val.length==0){
        // RETRIVE FROM BACKUP
        setTransactions(backupTransactions);
    }
}
const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="my-2">
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedTransactions || !selectedTransactions.length} />
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



const actionBodyTemplate = (rowData:Transaction) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editTransaction(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTransaction(rowData)} />
        
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
        <h5 className="m-0">Manage Transactions</h5>
        <span className="block mt-2 md:mt-0 p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e:any) => localFilter(e.target.value)} placeholder="Local Search..." />
        </span>
    </div>
);

const transactionDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveTransaction} />
    </>
);
const deleteTransactionDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTransactionDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteTransaction} />
    </>
);
const deleteTransactionsDialogFooter = (
    <>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTransactionsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedTransactions} />
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
                    value={transactions}
                    selection={selectedTransactions}
                    onSelectionChange={(e) => setSelectedTransactions(e.value as Transaction[])}
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Transactions"
                    emptyMessage="No Transactions found."
                    header={header}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}  ></Column>
                    
    <Column showAddButton={false}  field="wallettype" header="Wallet Type" sortable  headerStyle={{ minWidth: '10rem' }} filterField="wallettype"   filter filterElement={wallettypeFilterTemplate}  ></Column>
            

    <Column showAddButton={false}  field="walletid" header="Wallet ID" sortable  headerStyle={{ minWidth: '10rem' }} filter filterPlaceholder="Search by walletid" ></Column>
            

    <Column showAddButton={false}  field="amount" header="Amount" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={amountFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="balance" header="Balance" sortable  headerStyle={{ minWidth: '10rem' }} dataType="numeric"  filter filterElement={balanceFilterTemplate} ></Column>
            

    <Column showAddButton={false}  field="createat" header="Created At" sortable  headerStyle={{ minWidth: '10rem' }} filterField="createat" dataType="date" filter filterElement={createatFilterTemplate}  ></Column>
            
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>

                <Dialog visible={transactionDialog} style={{ width: '450px' }} header="Transaction Details" modal className="p-fluid" footer={transactionDialogFooter} onHide={hideDialog}>
                    
                
    <div className="field">
        <label htmlFor="wallettype">Wallet Type</label>
         <Dropdown   id="wallettype"  optionLabel="code" optionValue="code"  value={transaction.wallettype} options={datawalletTypes} onChange={(e) => onInputChange(e, 'wallettype')}  />
    </div>
            

    <div className="field">
        <label htmlFor="walletid">Wallet ID</label>
         <InputText id="walletid" value={transaction.walletid} onChange={(e) => onInputChange(e, 'walletid')}    required className={classNames({ 'p-invalid': submitted && !transaction.walletid })} />
    </div>
            

    <div className="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" value={transaction.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')}  />
    </div>
            

    <div className="field">
        <label htmlFor="balance">Balance</label>
         <InputNumber id="balance" value={transaction.balance} onValueChange={(e) => onInputNumberChange(e, 'balance')}  />
    </div>
            
                </Dialog>

                <Dialog visible={deleteTransactionDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransactionDialogFooter} onHide={hideDeleteTransactionDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {transaction && (
                            <span>
                                Are you sure you want to delete <b>Transaction record</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteTransactionsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransactionsDialogFooter} onHide={hideDeleteTransactionsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {transaction && <span>Are you sure you want to delete the selected Transaction?</span>}
                    </div>
                </Dialog>

                
                
            </div>
        </div>
    </div>
);
};

export default TransactionPage;
        
       
        