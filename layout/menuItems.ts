
    import { AppMenuItem } from "../types/layout";
    const menus={
        label: "Admin Dashboard",
        items: [
             { label: 'usersTable', icon: 'pi pi-fw pi-id-card', to: '/secure/users' },
 { label: 'E-Wallets', icon: 'pi pi-fw pi-id-card', to: '/secure/ewallets' },
 { label: 'Wallet Type', icon: 'pi pi-fw pi-id-card', to: '/secure/walletType' },
 { label: 'Banks', icon: 'pi pi-fw pi-id-card', to: '/secure/banks' },
 { label: 'User Details', icon: 'pi pi-fw pi-id-card', to: '/secure/userDetails' },
 { label: 'User Details(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/userDetails/dataview' },
 { label: 'Kyc', icon: 'pi pi-fw pi-id-card', to: '/secure/kyc' },
 { label: 'Transaction', icon: 'pi pi-fw pi-id-card', to: '/secure/transaction' },
 { label: 'Accounts', icon: 'pi pi-fw pi-id-card', to: '/secure/accounts' },
 { label: 'Deposit', icon: 'pi pi-fw pi-id-card', to: '/secure/deposit' },
 { label: 'Transfer', icon: 'pi pi-fw pi-id-card', to: '/secure/transfer' },
 { label: 'Exchange', icon: 'pi pi-fw pi-id-card', to: '/secure/exchange' },
 { label: 'Withdraw', icon: 'pi pi-fw pi-id-card', to: '/secure/withdraw' },
 { label: 'Referral', icon: 'pi pi-fw pi-id-card', to: '/secure/referral' },
 { label: 'Profit', icon: 'pi pi-fw pi-id-card', to: '/secure/profit' },
 { label: 'History', icon: 'pi pi-fw pi-id-card', to: '/secure/history' },
 { label: 'Helpdesk', icon: 'pi pi-fw pi-id-card', to: '/secure/helpdesk' },
 { label: 'Help desk log', icon: 'pi pi-fw pi-id-card', to: '/secure/helpdesklog' }
        ],
    };
    
    export default menus;
            