// Initial mock data for Brightloop Software Subscription Management System

export const INITIAL_USERS = [
  {
    id: 'usr-admin-1',
    email: 'admin@brightloop.io',
    name: 'Eleanor Vance',
    role: 'admin',
    passwordHash: 'Admin@2026!',
    company: 'Brightloop Software Headquarters',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-11-01'
  },
  {
    id: 'usr-staff-1',
    email: 'sarah.ops@brightloop.io',
    name: 'Sarah Chen',
    role: 'staff',
    passwordHash: 'Staff#2026',
    company: 'Brightloop Software Operations',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-11-15'
  },
  {
    id: 'usr-staff-2',
    email: 'marcus.sales@brightloop.io',
    name: 'Marcus Brody',
    role: 'staff',
    passwordHash: 'Sales#2026',
    company: 'Brightloop Software Sales Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-12-01'
  },
  {
    id: 'usr-cust-1',
    email: 'david@acmecorp.com',
    name: 'David Miller',
    role: 'customer',
    passwordHash: 'Customer@123',
    company: 'Acme Enterprise Solutions',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10'
  },
  {
    id: 'usr-cust-2',
    email: 'elena@novatech.co',
    name: 'Elena Rostova',
    role: 'customer',
    passwordHash: 'NovaTech@2026',
    company: 'NovaTech Global AI',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-01-14'
  },
  {
    id: 'usr-cust-3',
    email: 'karl@greenleaf.shop',
    name: 'Karl Lindqvist',
    role: 'customer',
    passwordHash: 'GreenLeaf#99',
    company: 'GreenLeaf Retail Chain',
    phone: '+1 (555) 432-1098',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Brightloop ERP Core Engine',
    type: 'software',
    salesPrice: 299,
    costPrice: 65,
    notes: 'Complete business management backbone with real-time financial ledger and inventory sync.',
    active: true,
    variants: [
      { id: 'var-std', name: 'Standard Edition', priceDelta: 0 },
      { id: 'var-odoo', name: 'Odoo Enterprise Brand Integration', priceDelta: 560 }, // Matches challenge explicitly!
      { id: 'var-custom', name: 'Dedicated Multi-Tenant Cloud', priceDelta: 850 }
    ]
  },
  {
    id: 'prod-2',
    name: 'CRM Pro & Pipeline Manager',
    type: 'software',
    salesPrice: 89,
    costPrice: 18,
    notes: 'Multi-stage lead tracking, automated email sequences, and customer engagement tracking.',
    active: true,
    variants: [
      { id: 'var-crm-std', name: 'Standard Edition (Up to 10 Reps)', priceDelta: 0 },
      { id: 'var-crm-odoo', name: 'Odoo CRM Sync Engine', priceDelta: 560 },
      { id: 'var-crm-ent', name: 'Unlimited Reps & Custom Workflows', priceDelta: 320 }
    ]
  },
  {
    id: 'prod-3',
    name: 'HR & Automated Payroll Suite',
    type: 'software',
    salesPrice: 149,
    costPrice: 30,
    notes: 'Time tracking, shift planning, statutory tax compliance, and automated direct payroll.',
    active: true,
    variants: [
      { id: 'var-hr-std', name: 'Single Legal Entity', priceDelta: 0 },
      { id: 'var-hr-multi', name: 'Multi-Country Global Entity', priceDelta: 280 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Secure Cloud Vault & Encrypted Backup',
    type: 'add-on',
    salesPrice: 49,
    costPrice: 9,
    notes: 'Automated off-site hourly database snapshots with point-in-time recovery.',
    active: true,
    variants: [
      { id: 'var-vault-1tb', name: '1 TB High-Speed NVMe', priceDelta: 0 },
      { id: 'var-vault-5tb', name: '5 TB High-Speed NVMe', priceDelta: 120 },
      { id: 'var-vault-10tb', name: '10 TB Dedicated Cold Storage', priceDelta: 240 }
    ]
  },
  {
    id: 'prod-5',
    name: 'AI Business Insights & Copilot',
    type: 'add-on',
    salesPrice: 199,
    costPrice: 45,
    notes: 'Predictive forecasting, automated invoice OCR parsing, and smart churn detection.',
    active: true,
    variants: [
      { id: 'var-ai-std', name: 'Standard 50k Tokens/mo', priceDelta: 0 },
      { id: 'var-ai-turbo', name: 'Unlimited Enterprise LLM Cluster', priceDelta: 220 }
    ]
  },
  {
    id: 'prod-6',
    name: '24/7 Priority SLA & Dedicated Solutions Architect',
    type: 'service',
    salesPrice: 250,
    costPrice: 85,
    notes: '15-minute guaranteed response time with designated technical account manager.',
    active: true,
    variants: [
      { id: 'var-sla-biz', name: 'Business Hours SLA (8x5)', priceDelta: 0 },
      { id: 'var-sla-247', name: 'Global 24/7/365 Mission Critical', priceDelta: 250 }
    ]
  }
];

export const INITIAL_PLANS = [
  {
    id: 'plan-monthly-growth',
    name: 'Monthly Growth Plan',
    cost: 299,
    billingFrequency: 'monthly', // daily, weekly, monthly, yearly
    minQuantity: 1,
    availableFrom: '2026-01-01',
    availableTo: '2028-12-31',
    policies: {
      autoCloseOnEnd: false,
      allowEarlyClose: true,
      allowPause: true,
      allowRenew: true
    },
    description: 'Perfect for agile expanding teams wanting monthly flexibility.'
  },
  {
    id: 'plan-annual-enterprise',
    name: 'Annual Enterprise Agreement',
    cost: 2990,
    billingFrequency: 'yearly',
    minQuantity: 5,
    availableFrom: '2026-01-01',
    availableTo: '2029-12-31',
    policies: {
      autoCloseOnEnd: true,
      allowEarlyClose: false,
      allowPause: false,
      allowRenew: true
    },
    description: 'Annual commitment with guaranteed SLAs and locked-in pricing.'
  },
  {
    id: 'plan-weekly-pilot',
    name: 'Weekly Agile Pilot',
    cost: 79,
    billingFrequency: 'weekly',
    minQuantity: 1,
    availableFrom: '2026-01-01',
    availableTo: '2026-12-31',
    policies: {
      autoCloseOnEnd: true,
      allowEarlyClose: true,
      allowPause: true,
      allowRenew: true
    },
    description: 'Short-cycle weekly pilot for teams evaluating new software rollouts.'
  },
  {
    id: 'plan-daily-flex',
    name: 'Daily Flex On-Demand',
    cost: 15,
    billingFrequency: 'daily',
    minQuantity: 1,
    availableFrom: '2026-01-01',
    availableTo: '2026-06-30',
    policies: {
      autoCloseOnEnd: true,
      allowEarlyClose: true,
      allowPause: false,
      allowRenew: false
    },
    description: 'Temporary surge capacity for seasonal events and audits.'
  }
];

export const INITIAL_QUOTATION_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Standard SaaS Operations Bundle',
    planId: 'plan-monthly-growth',
    validDays: 30,
    description: 'Core ERP software paired with CRM and automated daily cloud vault.',
    lines: [
      { productId: 'prod-1', variantId: 'var-std', quantity: 1 },
      { productId: 'prod-2', variantId: 'var-crm-std', quantity: 5 },
      { productId: 'prod-4', variantId: 'var-vault-1tb', quantity: 1 }
    ]
  },
  {
    id: 'tpl-2',
    name: 'Enterprise Odoo Integration Suite',
    planId: 'plan-annual-enterprise',
    validDays: 45,
    description: 'Turnkey Enterprise package featuring Odoo brand variant and dedicated SLA.',
    lines: [
      { productId: 'prod-1', variantId: 'var-odoo', quantity: 1 }, // Odoo brand variant
      { productId: 'prod-3', variantId: 'var-hr-multi', quantity: 1 },
      { productId: 'prod-5', variantId: 'var-ai-turbo', quantity: 1 },
      { productId: 'prod-6', variantId: 'var-sla-247', quantity: 1 }
    ]
  },
  {
    id: 'tpl-3',
    name: 'Startup Quick-Launch Starter',
    planId: 'plan-weekly-pilot',
    validDays: 14,
    description: 'Low commitment weekly setup for small shops testing digital workflows.',
    lines: [
      { productId: 'prod-2', variantId: 'var-crm-std', quantity: 2 },
      { productId: 'prod-4', variantId: 'var-vault-1tb', quantity: 1 }
    ]
  }
];

export const INITIAL_TAX_RULES = [
  { id: 'tax-vat-18', name: 'Standard VAT (EU/India)', rate: 18, isDefault: true, code: 'VAT18' },
  { id: 'tax-us-8', name: 'US State Sales Tax', rate: 8.25, isDefault: false, code: 'US_SALES' },
  { id: 'tax-tech-10', name: 'Digital Services Tax', rate: 10, isDefault: false, code: 'DST10' },
  { id: 'tax-zero', name: 'Zero-Rated / Tax Exempt', rate: 0, isDefault: false, code: 'EXEMPT' }
];

export const INITIAL_DISCOUNT_RULES = [
  {
    id: 'disc-bulk-seats',
    code: 'BULKSEATS20',
    description: '20% discount for teams provisioning 5 or more seats',
    type: 'percentage', // percentage or fixed
    value: 20,
    minPurchase: 0,
    minQuantity: 5,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 50,
    timesUsed: 12,
    appliesTo: 'all', // all or specific_products
    productIds: [],
    active: true
  },
  {
    id: 'disc-odoo-promo',
    code: 'ODOOPROMO500',
    description: 'Flat $500 off high-tier enterprise software deployments over $1,500',
    type: 'fixed',
    value: 500,
    minPurchase: 1500,
    minQuantity: 1,
    startDate: '2026-01-01',
    endDate: '2026-11-30',
    usageLimit: 20,
    timesUsed: 6,
    appliesTo: 'all',
    productIds: [],
    active: true
  },
  {
    id: 'disc-addon-15',
    code: 'ADDONBOOST15',
    description: '15% discount on cloud storage and AI copilot add-ons',
    type: 'percentage',
    value: 15,
    minPurchase: 0,
    minQuantity: 1,
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    usageLimit: 100,
    timesUsed: 28,
    appliesTo: 'specific_products',
    productIds: ['prod-4', 'prod-5'],
    active: true
  },
  {
    id: 'disc-expired-demo',
    code: 'EXPIREDWINTER',
    description: 'Expired test discount demonstrating automated cutoff',
    type: 'percentage',
    value: 30,
    minPurchase: 0,
    minQuantity: 1,
    startDate: '2025-11-01',
    endDate: '2026-01-15', // Expired
    usageLimit: 10,
    timesUsed: 10, // Maxed out
    appliesTo: 'all',
    productIds: [],
    active: true
  }
];

export const INITIAL_SUBSCRIPTIONS = [
  {
    id: 'SUB-2026-001',
    customerId: 'usr-cust-1',
    customerName: 'David Miller',
    customerCompany: 'Acme Enterprise Solutions',
    customerEmail: 'david@acmecorp.com',
    planId: 'plan-monthly-growth',
    planName: 'Monthly Growth Plan',
    billingFrequency: 'monthly',
    startDate: '2026-01-15',
    expiryDate: '2027-01-15',
    nextBillingDate: '2026-11-01', // Due today/soon!
    lastBilledDate: '2026-10-01',
    paymentTerms: 'Net 30',
    status: 'Active', // Draft, Quotation, Confirmed, Active, Paused, Closed
    taxRuleId: 'tax-vat-18',
    appliedDiscountCode: 'BULKSEATS20',
    lines: [
      {
        id: 'line-1',
        productId: 'prod-1',
        productName: 'Brightloop ERP Core Engine',
        variantId: 'var-odoo',
        variantName: 'Odoo Enterprise Brand Integration',
        variantDelta: 560,
        unitPrice: 859, // 299 + 560
        quantity: 5,
        taxRate: 18,
        discountPercent: 20
      },
      {
        id: 'line-2',
        productId: 'prod-4',
        variantId: 'var-vault-5tb',
        variantName: '5 TB High-Speed NVMe',
        variantDelta: 120,
        unitPrice: 169, // 49 + 120
        quantity: 2,
        taxRate: 18,
        discountPercent: 20
      }
    ],
    history: [
      { date: '2026-01-10 09:30', actor: 'Marcus Brody (Sales)', action: 'Quotation Created', note: 'Initial proposal sent to David Miller' },
      { date: '2026-01-12 14:15', actor: 'David Miller (Customer)', action: 'Quote Confirmed', note: 'Customer accepted terms and payment schedule' },
      { date: '2026-01-15 00:00', actor: 'System Billing Engine', action: 'Subscription Activated', note: 'First cycle launched successfully' }
    ]
  },
  {
    id: 'SUB-2026-002',
    customerId: 'usr-cust-2',
    customerName: 'Elena Rostova',
    customerCompany: 'NovaTech Global AI',
    customerEmail: 'elena@novatech.co',
    planId: 'plan-annual-enterprise',
    planName: 'Annual Enterprise Agreement',
    billingFrequency: 'yearly',
    startDate: '2026-02-01',
    expiryDate: '2027-02-01',
    nextBillingDate: '2027-02-01',
    lastBilledDate: '2026-02-01',
    paymentTerms: 'Net 30',
    status: 'Active',
    taxRuleId: 'tax-us-8',
    appliedDiscountCode: 'ODOOPROMO500',
    lines: [
      {
        id: 'line-3',
        productId: 'prod-1',
        productName: 'Brightloop ERP Core Engine',
        variantId: 'var-odoo',
        variantName: 'Odoo Enterprise Brand Integration',
        variantDelta: 560,
        unitPrice: 859,
        quantity: 10,
        taxRate: 8.25,
        discountPercent: 0
      },
      {
        id: 'line-4',
        productId: 'prod-5',
        variantId: 'var-ai-turbo',
        variantName: 'Unlimited Enterprise LLM Cluster',
        variantDelta: 220,
        unitPrice: 419,
        quantity: 5,
        taxRate: 8.25,
        discountPercent: 0
      }
    ],
    history: [
      { date: '2026-01-20 11:00', actor: 'Sarah Chen (Ops)', action: 'Enterprise Contract Drafted', note: 'Tailored pricing for NovaTech' },
      { date: '2026-02-01 10:00', actor: 'Eleanor Vance (Admin)', action: 'Subscription Activated', note: 'Annual wire transfer agreement approved' }
    ]
  },
  {
    id: 'SUB-2026-003',
    customerId: 'usr-cust-3',
    customerName: 'Karl Lindqvist',
    customerCompany: 'GreenLeaf Retail Chain',
    customerEmail: 'karl@greenleaf.shop',
    planId: 'plan-weekly-pilot',
    planName: 'Weekly Agile Pilot',
    billingFrequency: 'weekly',
    startDate: '2026-10-15',
    expiryDate: '2026-11-30',
    nextBillingDate: '2026-10-29', // Due now for billing run!
    lastBilledDate: '2026-10-22',
    paymentTerms: 'Due on Receipt',
    status: 'Active',
    taxRuleId: 'tax-vat-18',
    appliedDiscountCode: '',
    lines: [
      {
        id: 'line-5',
        productId: 'prod-2',
        productName: 'CRM Pro & Pipeline Manager',
        variantId: 'var-crm-std',
        variantName: 'Standard Edition (Up to 10 Reps)',
        variantDelta: 0,
        unitPrice: 89,
        quantity: 3,
        taxRate: 18,
        discountPercent: 0
      }
    ],
    history: [
      { date: '2026-10-15 16:20', actor: 'Marcus Brody (Sales)', action: 'Weekly Pilot Started', note: 'GreenLeaf evaluating retail store CRM' }
    ]
  },
  {
    id: 'SUB-2026-004',
    customerId: 'usr-cust-1',
    customerName: 'David Miller',
    customerCompany: 'Acme Enterprise Solutions',
    customerEmail: 'david@acmecorp.com',
    planId: 'plan-monthly-growth',
    planName: 'Monthly Growth Plan',
    billingFrequency: 'monthly',
    startDate: '2026-11-01',
    expiryDate: '2027-11-01',
    nextBillingDate: '2026-11-01',
    lastBilledDate: '',
    paymentTerms: 'Net 15',
    status: 'Quotation', // Quote stage
    taxRuleId: 'tax-vat-18',
    appliedDiscountCode: '',
    lines: [
      {
        id: 'line-6',
        productId: 'prod-3',
        productName: 'HR & Automated Payroll Suite',
        variantId: 'var-hr-multi',
        variantName: 'Multi-Country Global Entity',
        variantDelta: 280,
        unitPrice: 429,
        quantity: 2,
        taxRate: 18,
        discountPercent: 0
      }
    ],
    history: [
      { date: '2026-10-28 10:00', actor: 'Sarah Chen (Ops)', action: 'Quotation Generated', note: 'Sent expansion offer to Acme Corp' }
    ]
  },
  {
    id: 'SUB-2026-005',
    customerId: 'usr-cust-2',
    customerName: 'Elena Rostova',
    customerCompany: 'NovaTech Global AI',
    customerEmail: 'elena@novatech.co',
    planId: 'plan-monthly-growth',
    planName: 'Monthly Growth Plan',
    billingFrequency: 'monthly',
    startDate: '2026-06-01',
    expiryDate: '2027-06-01',
    nextBillingDate: '2026-11-01',
    lastBilledDate: '2026-10-01',
    paymentTerms: 'Net 30',
    status: 'Paused', // Paused plan policy test
    taxRuleId: 'tax-us-8',
    appliedDiscountCode: '',
    lines: [
      {
        id: 'line-7',
        productId: 'prod-6',
        productName: '24/7 Priority SLA & Dedicated Solutions Architect',
        variantId: 'var-sla-247',
        variantName: 'Global 24/7/365 Mission Critical',
        variantDelta: 250,
        unitPrice: 500,
        quantity: 1,
        taxRate: 8.25,
        discountPercent: 0
      }
    ],
    history: [
      { date: '2026-06-01 09:00', actor: 'Eleanor Vance (Admin)', action: 'Activated', note: 'Temporary SLA boost' },
      { date: '2026-10-05 14:00', actor: 'Elena Rostova (Customer)', action: 'Subscription Paused', note: 'Paused pending Q4 system audit' }
    ]
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-001',
    subscriptionId: 'SUB-2026-001',
    customerId: 'usr-cust-1',
    customerName: 'David Miller',
    customerCompany: 'Acme Enterprise Solutions',
    customerEmail: 'david@acmecorp.com',
    issueDate: '2026-09-01',
    dueDate: '2026-10-01',
    status: 'Paid', // Draft, Confirmed, Paid, Overdue, Cancelled
    paymentTerms: 'Net 30',
    subtotal: 4633,
    discountTotal: 926.60,
    taxTotal: 667.15,
    grandTotal: 4373.55,
    amountPaid: 4373.55,
    balanceDue: 0,
    billingPeriod: '2026-09-01 to 2026-09-30',
    lines: [
      { description: 'Brightloop ERP Core Engine (Odoo Enterprise Brand Integration) x5', amount: 4295, tax: 618.48 },
      { description: 'Secure Cloud Vault & Encrypted Backup (5 TB High-Speed NVMe) x2', amount: 338, tax: 48.67 }
    ]
  },
  {
    id: 'INV-2026-002',
    subscriptionId: 'SUB-2026-001',
    customerId: 'usr-cust-1',
    customerName: 'David Miller',
    customerCompany: 'Acme Enterprise Solutions',
    customerEmail: 'david@acmecorp.com',
    issueDate: '2026-10-01',
    dueDate: '2026-10-25', // Overdue!
    status: 'Overdue',
    paymentTerms: 'Net 15',
    subtotal: 4633,
    discountTotal: 926.60,
    taxTotal: 667.15,
    grandTotal: 4373.55,
    amountPaid: 1500.00, // Partial payment
    balanceDue: 2873.55,
    billingPeriod: '2026-10-01 to 2026-10-31',
    lines: [
      { description: 'Brightloop ERP Core Engine (Odoo Enterprise Brand Integration) x5', amount: 4295, tax: 618.48 },
      { description: 'Secure Cloud Vault & Encrypted Backup (5 TB High-Speed NVMe) x2', amount: 338, tax: 48.67 }
    ]
  },
  {
    id: 'INV-2026-003',
    subscriptionId: 'SUB-2026-003',
    customerId: 'usr-cust-3',
    customerName: 'Karl Lindqvist',
    customerCompany: 'GreenLeaf Retail Chain',
    customerEmail: 'karl@greenleaf.shop',
    issueDate: '2026-10-22',
    dueDate: '2026-10-22',
    status: 'Confirmed', // Pending payment
    paymentTerms: 'Due on Receipt',
    subtotal: 267,
    discountTotal: 0,
    taxTotal: 48.06,
    grandTotal: 315.06,
    amountPaid: 0,
    balanceDue: 315.06,
    billingPeriod: '2026-10-22 to 2026-10-29',
    lines: [
      { description: 'CRM Pro & Pipeline Manager (Standard Edition) x3', amount: 267, tax: 48.06 }
    ]
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-2026-001',
    invoiceId: 'INV-2026-001',
    customerName: 'David Miller',
    amount: 4373.55,
    paymentDate: '2026-09-18',
    method: 'Bank Wire / NEFT', // Credit Card, Bank Wire / NEFT, Stripe, UPI / Digital, Cheque, Cash
    reference: 'WIRE-ACME-884920',
    notes: 'Full payment received and reconciled with September bank ledger.'
  },
  {
    id: 'PAY-2026-002',
    invoiceId: 'INV-2026-002',
    customerName: 'David Miller',
    amount: 1500.00,
    paymentDate: '2026-10-15',
    method: 'Credit Card (Visa)',
    reference: 'AUTH-V-4928174',
    notes: 'Initial tranche received on card. Remaining balance of $2,873.55 pending chase.'
  }
];
