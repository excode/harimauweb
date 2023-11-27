const menus = {
  label: "Admin Dashboard",
  items: [
    { label: "Users Table", icon: "pi pi-fw pi-users", to: "/secure/users" },
    { label: "E-Wallets", icon: "pi pi-fw pi-wallet", to: "/secure/ewallets" },
    {
      label: "Investments",
      icon: "pi pi-fw pi-user",
      to: "/secure/accounts",
    },
    {
      label: "Wallet Type",
      icon: "pi pi-fw pi-sitemap",
      to: "/secure/walletType",
    },
    { label: "Banks", icon: "pi pi-fw pi-building", to: "/secure/banks" },
    {
      label: "User Details",
      icon: "pi pi-fw pi-id-card",
      to: "/secure/userDetails",
    },
    {
      label: "User Details(Gallery)",
      icon: "pi pi-fw pi-images",
      to: "/secure/userDetails/dataview",
    },
    { label: "KYC", icon: "pi pi-fw pi-check-square", to: "/secure/kyc" },
    {
      label: "Transaction",
      icon: "pi pi-fw pi-arrow-right-arrow-left",
      to: "/secure/transaction",
    },
    
    { label: "Deposit", icon: "pi pi-fw pi-flag", to: "/secure/deposit" },
    { label: "Transfer", icon: "pi pi-fw pi-send", to: "/secure/transfer" },
    { label: "Exchange", icon: "pi pi-fw pi-sync", to: "/secure/exchange" },
    {
      label: "Withdraw",
      icon: "pi pi-fw pi-credit-card",
      to: "/secure/withdraw",
    },
    { label: "Referral", icon: "pi pi-fw pi-id-card", to: "/secure/referral" },
    { label: "Profit", icon: "pi pi-fw pi-ticket", to: "/secure/profit" },
    { label: "History", icon: "pi pi-fw pi-history", to: "/secure/history" },
    { label: "Help Desk", icon: "pi pi-fw pi-phone", to: "/secure/helpdesk" },
    {
      label: "Help desk log",
      icon: "pi pi-fw pi-book",
      to: "/secure/helpdesklog",
    },
  ],
};

export default menus;
