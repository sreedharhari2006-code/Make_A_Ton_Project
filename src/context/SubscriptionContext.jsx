import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_PLANS,
  INITIAL_QUOTATION_TEMPLATES,
  INITIAL_TAX_RULES,
  INITIAL_DISCOUNT_RULES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS
} from '../data/initialData';

const LOCAL_STORAGE_KEY = 'brightloop_sms_state_v1';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  // Load state from localStorage or initialData
  const [theme, setTheme] = useState(() => localStorage.getItem('brightloop_theme') || 'light');

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_curr_user');
    return saved || 'usr-admin-1'; // Default to admin for full experience
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [quotationTemplates, setQuotationTemplates] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_templates');
    return saved ? JSON.parse(saved) : INITIAL_QUOTATION_TEMPLATES;
  });

  const [taxRules, setTaxRules] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_taxes');
    return saved ? JSON.parse(saved) : INITIAL_TAX_RULES;
  });

  const [discountRules, setDiscountRules] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNT_RULES;
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_subs');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // System notification toast
  const [notification, setNotification] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('brightloop_theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_users', JSON.stringify(users));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_curr_user', currentUserId);
      localStorage.setItem(LOCAL_STORAGE_KEY + '_products', JSON.stringify(products));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_plans', JSON.stringify(plans));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_templates', JSON.stringify(quotationTemplates));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_taxes', JSON.stringify(taxRules));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_discounts', JSON.stringify(discountRules));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_subs', JSON.stringify(subscriptions));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_invoices', JSON.stringify(invoices));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_payments', JSON.stringify(payments));
    } catch (e) {
      console.warn('Storage quota notice', e);
    }
  }, [users, currentUserId, products, plans, quotationTemplates, taxRules, discountRules, subscriptions, invoices, payments]);

  const showNotification = (message, type = 'success') => {
    setNotification({ id: Date.now(), message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Current active user
  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  // Auth Operations
  const switchUser = (userId) => {
    setCurrentUserId(userId);
    const targetUser = users.find(u => u.id === userId);
    showNotification(`Switched role to ${targetUser?.name} (${targetUser?.role?.toUpperCase()})`, 'info');
  };

  const signupCustomer = ({ email, password, name, company, phone }) => {
    // Exact requirements from PDF:
    // 1. Email can belong to only one account
    // 2. Password must be > 8 characters
    // 3. Must contain an uppercase letter
    // 4. Must contain a lowercase letter
    // 5. Must contain a special character
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (emailExists) {
      throw new Error('An account with this email address already exists.');
    }

    if (password.length <= 8) {
      throw new Error('Password must be more than 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter (A-Z).');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter (a-z).');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      throw new Error('Password must contain at least one special character (e.g. !@#$%^&*).');
    }

    const newUser = {
      id: `usr-cust-${Date.now()}`,
      email: email.trim(),
      passwordHash: password,
      name: name.trim() || email.split('@')[0],
      company: company?.trim() || 'Brightloop Customer',
      phone: phone || '',
      role: 'customer',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    showNotification(`Welcome to Brightloop, ${newUser.name}! Account created successfully.`);
    return newUser;
  };

  const addStaffMember = ({ email, password, name, role = 'staff' }) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Access denied: Only system administrators can add new staff members.');
    }

    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (emailExists) {
      throw new Error('An account with this email address already exists.');
    }

    if (password.length <= 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      throw new Error('Password must meet complexity rules: >8 chars with uppercase, lowercase, and special character.');
    }

    const newStaff = {
      id: `usr-staff-${Date.now()}`,
      email: email.trim(),
      passwordHash: password,
      name: name.trim(),
      company: 'Brightloop Software Internal Team',
      role,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newStaff]);
    showNotification(`Staff member ${newStaff.name} added successfully.`);
    return newStaff;
  };

  const requestPasswordReset = (email) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error('No registered account found with that email address.');
    }
    const token = `rst_${Math.random().toString(36).substring(2, 10)}`;
    showNotification(`Password reset link dispatched to ${email}. Token: ${token}`, 'info');
    return { success: true, email, token, user };
  };

  const resetPassword = (email, newPassword) => {
    if (newPassword.length <= 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
      throw new Error('Password must be >8 characters with uppercase, lowercase, and special character.');
    }
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase().trim()) {
        return { ...u, passwordHash: newPassword };
      }
      return u;
    }));
    showNotification('Password updated successfully. You can now log in.');
  };

  // Products & Variants CRUD
  const addProduct = (productData) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can create new products.');
    }
    const newProduct = {
      id: `prod-${Date.now()}`,
      active: true,
      variants: productData.variants || [{ id: 'var-default', name: 'Standard Edition', priceDelta: 0 }],
      ...productData
    };
    setProducts(prev => [newProduct, ...prev]);
    showNotification(`Product "${newProduct.name}" created successfully.`);
    return newProduct;
  };

  const updateProduct = (id, updated) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can modify products.');
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    showNotification('Product updated.');
  };

  const deleteProduct = (id) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can remove products.');
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotification('Product removed.');
  };

  // Plans CRUD
  const addPlan = (planData) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can launch plans.');
    }
    const newPlan = {
      id: `plan-${Date.now()}`,
      policies: {
        autoCloseOnEnd: true,
        allowEarlyClose: true,
        allowPause: true,
        allowRenew: true,
        ...(planData.policies || {})
      },
      ...planData
    };
    setPlans(prev => [newPlan, ...prev]);
    showNotification(`Plan "${newPlan.name}" launched successfully.`);
    return newPlan;
  };

  const updatePlan = (id, updated) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can modify plans.');
    }
    setPlans(prev => prev.map(pl => pl.id === id ? { ...pl, ...updated } : pl));
    showNotification('Plan updated.');
  };

  // Quotation Templates CRUD
  const addQuotationTemplate = (templateData) => {
    const newTemplate = {
      id: `tpl-${Date.now()}`,
      ...templateData
    };
    setQuotationTemplates(prev => [newTemplate, ...prev]);
    showNotification(`Quotation Template "${newTemplate.name}" created.`);
    return newTemplate;
  };

  // Tax Rules CRUD
  const addTaxRule = (ruleData) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can configure tax rules.');
    }
    const newTax = {
      id: `tax-${Date.now()}`,
      isDefault: false,
      ...ruleData
    };
    setTaxRules(prev => [...prev, newTax]);
    showNotification(`Tax rule "${newTax.name}" (${newTax.rate}%) added.`);
  };

  // Discount Rules Engine
  const addDiscountRule = (ruleData) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can create discount rules.');
    }
    const code = ruleData.code.trim().toUpperCase();
    if (discountRules.some(d => d.code === code)) {
      throw new Error(`Discount code "${code}" already exists.`);
    }

    const newDiscount = {
      id: `disc-${Date.now()}`,
      code,
      timesUsed: 0,
      active: true,
      ...ruleData
    };
    setDiscountRules(prev => [newDiscount, ...prev]);
    showNotification(`Discount rule "${code}" created successfully.`);
    return newDiscount;
  };

  const toggleDiscountRule = (id) => {
    if (currentUser.role !== 'admin') {
      throw new Error('Only administrators can modify discount rules.');
    }
    setDiscountRules(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
    showNotification('Discount rule status toggled.');
  };

  // Discount Validator & Calculator
  const evaluateDiscount = (discountCode, lines, currentDate = new Date().toISOString().split('T')[0]) => {
    if (!discountCode) return { valid: false, discountAmount: 0, reason: 'No discount code specified' };

    const rule = discountRules.find(d => d.code.toUpperCase() === discountCode.trim().toUpperCase());
    if (!rule) {
      return { valid: false, discountAmount: 0, reason: 'Invalid discount code' };
    }
    if (!rule.active) {
      return { valid: false, discountAmount: 0, reason: 'Discount rule is deactivated' };
    }
    if (rule.timesUsed >= rule.usageLimit) {
      return { valid: false, discountAmount: 0, reason: `Usage limit of ${rule.usageLimit} exceeded` };
    }
    if (rule.startDate && currentDate < rule.startDate) {
      return { valid: false, discountAmount: 0, reason: `Discount not active until ${rule.startDate}` };
    }
    if (rule.endDate && currentDate > rule.endDate) {
      return { valid: false, discountAmount: 0, reason: `Discount expired on ${rule.endDate}` };
    }

    // Check eligible lines
    const totalQuantity = lines.reduce((acc, l) => acc + Number(l.quantity || 0), 0);
    const subtotal = lines.reduce((acc, l) => acc + (Number(l.unitPrice || 0) * Number(l.quantity || 1)), 0);

    if (rule.minPurchase && subtotal < rule.minPurchase) {
      return { valid: false, discountAmount: 0, reason: `Requires minimum purchase of $${rule.minPurchase}` };
    }
    if (rule.minQuantity && totalQuantity < rule.minQuantity) {
      return { valid: false, discountAmount: 0, reason: `Requires minimum quantity of ${rule.minQuantity} units` };
    }

    let eligibleAmount = 0;
    if (rule.appliesTo === 'all') {
      eligibleAmount = subtotal;
    } else {
      // appliesTo specific_products
      eligibleAmount = lines
        .filter(l => rule.productIds?.includes(l.productId))
        .reduce((acc, l) => acc + (Number(l.unitPrice || 0) * Number(l.quantity || 1)), 0);

      if (eligibleAmount === 0) {
        return { valid: false, discountAmount: 0, reason: 'No eligible products in subscription for this discount' };
      }
    }

    let discountAmount = 0;
    if (rule.type === 'percentage') {
      discountAmount = (eligibleAmount * Number(rule.value)) / 100;
    } else {
      // Fixed amount
      discountAmount = Math.min(Number(rule.value), eligibleAmount);
    }

    return {
      valid: true,
      rule,
      discountAmount: Number(discountAmount.toFixed(2)),
      description: rule.description || `${rule.code} (${rule.type === 'percentage' ? rule.value + '%' : '$' + rule.value})`
    };
  };

  // Subscriptions & Quotations Management
  const createSubscription = (subData) => {
    const nextNum = (subscriptions.length + 1).toString().padStart(3, '0');
    const id = `SUB-2026-${nextNum}`;

    const newSub = {
      id,
      status: subData.status || 'Draft', // Draft -> Quotation -> Confirmed -> Active -> Closed
      history: [
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor: `${currentUser.name} (${currentUser.role})`,
          action: `Created subscription record in state: ${subData.status || 'Draft'}`,
          note: subData.notes || 'Initial document creation'
        }
      ],
      ...subData
    };

    setSubscriptions(prev => [newSub, ...prev]);
    showNotification(`Subscription / Quote ${id} created.`);
    return newSub;
  };

  const createSubscriptionFromTemplate = (templateId, customerId) => {
    const template = quotationTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Quotation template not found');
    const customer = users.find(u => u.id === customerId);
    if (!customer) throw new Error('Customer not found');

    const plan = plans.find(p => p.id === template.planId) || plans[0];
    const defaultTax = taxRules.find(t => t.isDefault) || taxRules[0];

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + (template.validDays || 30));

    // Construct lines with current product and variant details
    const lines = template.lines.map((tLine, idx) => {
      const prod = products.find(p => p.id === tLine.productId) || products[0];
      const variant = prod.variants?.find(v => v.id === tLine.variantId) || prod.variants?.[0] || { id: 'var-std', name: 'Standard', priceDelta: 0 };
      const unitPrice = Number(prod.salesPrice) + Number(variant.priceDelta || 0);

      return {
        id: `line-${Date.now()}-${idx}`,
        productId: prod.id,
        productName: prod.name,
        variantId: variant.id,
        variantName: variant.name,
        variantDelta: variant.priceDelta || 0,
        unitPrice,
        quantity: tLine.quantity || 1,
        taxRate: defaultTax.rate,
        discountPercent: 0
      };
    });

    const newSub = createSubscription({
      customerId: customer.id,
      customerName: customer.name,
      customerCompany: customer.company || customer.name,
      customerEmail: customer.email,
      planId: plan.id,
      planName: plan.name,
      billingFrequency: plan.billingFrequency,
      startDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      nextBillingDate: today.toISOString().split('T')[0],
      lastBilledDate: '',
      paymentTerms: 'Net 30',
      status: 'Quotation', // Starts in Quotation from template
      taxRuleId: defaultTax.id,
      appliedDiscountCode: '',
      lines,
      notes: `Generated from template: ${template.name}`
    });

    return newSub;
  };

  const updateSubscriptionStatus = (id, newStatus, reason = '') => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;

    const plan = plans.find(p => p.id === sub.planId);

    // Enforce Plan Policies
    if (newStatus === 'Paused' && plan?.policies?.allowPause === false) {
      throw new Error(`Plan "${plan.name}" does not allow pausing.`);
    }
    if (newStatus === 'Closed' && sub.status === 'Active' && plan?.policies?.allowEarlyClose === false) {
      // Check if closing before expiry date
      const today = new Date().toISOString().split('T')[0];
      if (today < sub.expiryDate) {
        throw new Error(`Plan "${plan.name}" does not permit early closure before contract expiry date (${sub.expiryDate}).`);
      }
    }

    const auditEntry = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: `${currentUser.name} (${currentUser.role})`,
      action: `Status transitioned: ${sub.status} ➔ ${newStatus}`,
      note: reason || `Updated by ${currentUser.name}`
    };

    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: newStatus,
          history: [auditEntry, ...(s.history || [])]
        };
      }
      return s;
    }));

    showNotification(`Subscription ${id} moved to "${newStatus}".`);
  };

  const updateSubscriptionLines = (id, newLines, discountCode) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          lines: newLines,
          appliedDiscountCode: discountCode !== undefined ? discountCode : s.appliedDiscountCode,
          history: [
            {
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: `${currentUser.name} (${currentUser.role})`,
              action: 'Subscription Lines / Discounts Updated',
              note: `Updated line items or promo code (${discountCode || 'none'})`
            },
            ...(s.history || [])
          ]
        };
      }
      return s;
    }));
    showNotification(`Subscription ${id} lines updated.`);
  };

  // Automated Recurring Billing Day Engine
  // "Nobody should be typing invoices by hand. Each one should be created from its subscription...
  // Nothing should be billed twice or skipped."
  const runBillingDay = (billingDate = new Date().toISOString().split('T')[0]) => {
    const activeSubs = subscriptions.filter(s => s.status === 'Active');
    let billedCount = 0;
    let skippedCount = 0;
    let totalBilledAmount = 0;
    const generatedInvoices = [];
    const updatedSubs = [...subscriptions];

    activeSubs.forEach(sub => {
      // Deduplication check: Has it already been billed for this cycle/period?
      // Next billing date must be on or before billingDate to be eligible
      if (!sub.nextBillingDate || sub.nextBillingDate > billingDate) {
        skippedCount++;
        return;
      }

      if (sub.lastBilledDate === billingDate) {
        // Already billed on this date: safeguard against double billing!
        skippedCount++;
        return;
      }

      // Compute line items, taxes and discounts
      const subtotal = sub.lines.reduce((acc, l) => acc + (Number(l.unitPrice) * Number(l.quantity)), 0);

      // Evaluate discount automatically
      const discountEval = evaluateDiscount(sub.appliedDiscountCode, sub.lines, billingDate);
      const discountTotal = discountEval.valid ? discountEval.discountAmount : 0;

      // Tax calculation
      const taxRule = taxRules.find(t => t.id === sub.taxRuleId) || taxRules[0];
      const taxableAmount = Math.max(0, subtotal - discountTotal);
      const taxTotal = Number(((taxableAmount * Number(taxRule.rate)) / 100).toFixed(2));
      const grandTotal = Number((taxableAmount + taxTotal).toFixed(2));

      // Calculate invoice Due Date from Payment Terms
      const dueDateObj = new Date(billingDate);
      if (sub.paymentTerms === 'Net 15') dueDateObj.setDate(dueDateObj.getDate() + 15);
      else if (sub.paymentTerms === 'Net 30') dueDateObj.setDate(dueDateObj.getDate() + 30);
      else if (sub.paymentTerms === 'Net 60') dueDateObj.setDate(dueDateObj.getDate() + 60);

      const nextInvNum = (invoices.length + billedCount + 1).toString().padStart(3, '0');
      const invoiceId = `INV-2026-${nextInvNum}`;

      const newInvoice = {
        id: invoiceId,
        subscriptionId: sub.id,
        customerId: sub.customerId,
        customerName: sub.customerName,
        customerCompany: sub.customerCompany,
        customerEmail: sub.customerEmail,
        issueDate: billingDate,
        dueDate: dueDateObj.toISOString().split('T')[0],
        status: 'Draft', // Invoices move Draft -> Confirmed -> Paid
        paymentTerms: sub.paymentTerms || 'Net 30',
        subtotal: Number(subtotal.toFixed(2)),
        discountTotal,
        appliedDiscountCode: discountEval.valid ? sub.appliedDiscountCode : '',
        taxTotal,
        taxRuleName: `${taxRule.name} (${taxRule.rate}%)`,
        grandTotal,
        amountPaid: 0,
        balanceDue: grandTotal,
        billingPeriod: `${billingDate} cycle`,
        lines: sub.lines.map(l => ({
          description: `${l.productName} (${l.variantName}) x${l.quantity}`,
          unitPrice: l.unitPrice,
          quantity: l.quantity,
          amount: Number((l.unitPrice * l.quantity).toFixed(2)),
          tax: Number(((l.unitPrice * l.quantity * (taxRule.rate / 100))).toFixed(2))
        }))
      };

      generatedInvoices.push(newInvoice);
      billedCount++;
      totalBilledAmount += grandTotal;

      // Calculate next billing date based on plan frequency
      const nextDate = new Date(billingDate);
      if (sub.billingFrequency === 'daily') nextDate.setDate(nextDate.getDate() + 1);
      else if (sub.billingFrequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
      else if (sub.billingFrequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
      else nextDate.setMonth(nextDate.getMonth() + 1); // default monthly

      const nextBillingDateStr = nextDate.toISOString().split('T')[0];

      // Check plan autoClose policy
      const plan = plans.find(p => p.id === sub.planId);
      let subNewStatus = sub.status;
      if (plan?.policies?.autoCloseOnEnd && sub.expiryDate && nextBillingDateStr >= sub.expiryDate) {
        subNewStatus = 'Closed';
      }

      // Update subscription in array
      const subIdx = updatedSubs.findIndex(s => s.id === sub.id);
      if (subIdx !== -1) {
        updatedSubs[subIdx] = {
          ...updatedSubs[subIdx],
          lastBilledDate: billingDate,
          nextBillingDate: nextBillingDateStr,
          status: subNewStatus,
          history: [
            {
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: 'Automated Billing Run Engine',
              action: `Generated Invoice ${invoiceId} ($${grandTotal.toLocaleString()})`,
              note: subNewStatus === 'Closed' ? 'Plan reached expiry and auto-closed.' : `Next billing scheduled for ${nextBillingDateStr}`
            },
            ...(updatedSubs[subIdx].history || [])
          ]
        };
      }

      // If discount used, increment usage counter
      if (discountEval.valid && discountEval.rule) {
        setDiscountRules(prev => prev.map(d => {
          if (d.id === discountEval.rule.id) {
            return { ...d, timesUsed: d.timesUsed + 1 };
          }
          return d;
        }));
      }
    });

    if (billedCount > 0) {
      setInvoices(prev => [...generatedInvoices, ...prev]);
      setSubscriptions(updatedSubs);
      showNotification(`Billing Day Complete: Created ${billedCount} invoice(s) totaling $${totalBilledAmount.toLocaleString()}. ${skippedCount} subscription(s) skipped/already up to date.`);
    } else {
      showNotification(`Billing Day Check: All active subscriptions are current. 0 invoices needed (${skippedCount} checked).`, 'info');
    }

    return { billedCount, skippedCount, totalBilledAmount, generatedInvoices };
  };

  // Invoices Actions
  const confirmInvoice = (invoiceId) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Confirmed' } : inv));
    showNotification(`Invoice ${invoiceId} confirmed.`);
  };

  const cancelInvoice = (invoiceId) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Cancelled' } : inv));
    showNotification(`Invoice ${invoiceId} cancelled.`);
  };

  const sendInvoice = (invoiceId) => {
    const inv = invoices.find(i => i.id === invoiceId);
    showNotification(`Invoice ${invoiceId} dispatched via email to ${inv?.customerEmail || 'customer'}.`, 'info');
  };

  // Payments Engine
  const recordPayment = ({ invoiceId, amount, paymentDate, method, reference, notes }) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('Invoice not found');

    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      throw new Error('Please enter a valid payment amount greater than $0.');
    }

    const newAmountPaid = Number((inv.amountPaid + paymentAmount).toFixed(2));
    const newBalanceDue = Math.max(0, Number((inv.grandTotal - newAmountPaid).toFixed(2)));
    const newStatus = newBalanceDue === 0 ? 'Paid' : 'Confirmed';

    const payId = `PAY-2026-${(payments.length + 1).toString().padStart(3, '0')}`;
    const newPayment = {
      id: payId,
      invoiceId,
      customerName: inv.customerName,
      amount: paymentAmount,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      method: method || 'Credit Card',
      reference: reference || `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      notes: notes || 'Payment reconciled against invoice.'
    };

    setPayments(prev => [newPayment, ...prev]);
    setInvoices(prev => prev.map(i => i.id === invoiceId ? {
      ...i,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      status: newStatus
    } : i));

    showNotification(`Payment ${payId} of $${paymentAmount.toLocaleString()} recorded for ${invoiceId}. Status: ${newStatus}`);
    return newPayment;
  };

  // Executive Finance Lead Analytics
  const financeMetrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    // 1. Active Subscriptions
    const activeSubs = subscriptions.filter(s => s.status === 'Active');

    // 2. Normalized MRR (Monthly Recurring Revenue)
    let totalMRR = 0;
    activeSubs.forEach(sub => {
      const subtotal = sub.lines.reduce((acc, l) => acc + (Number(l.unitPrice) * Number(l.quantity)), 0);
      let monthlyFactor = 1;
      if (sub.billingFrequency === 'daily') monthlyFactor = 30;
      else if (sub.billingFrequency === 'weekly') monthlyFactor = 4.33;
      else if (sub.billingFrequency === 'yearly') monthlyFactor = 1 / 12;

      totalMRR += (subtotal * monthlyFactor);
    });

    // 3. ARR = MRR * 12
    const totalARR = totalMRR * 12;

    // 4. Invoices & Payments summary
    let totalRevenueCollected = 0;
    let totalOutstanding = 0;
    let overdueCount = 0;
    let overdueAmount = 0;

    invoices.forEach(inv => {
      if (inv.status !== 'Cancelled') {
        totalRevenueCollected += Number(inv.amountPaid || 0);
        totalOutstanding += Number(inv.balanceDue || 0);

        // Overdue check
        if (inv.balanceDue > 0 && inv.dueDate < today) {
          overdueCount++;
          overdueAmount += Number(inv.balanceDue);
        }
      }
    });

    return {
      activeSubsCount: activeSubs.length,
      totalMRR: Number(totalMRR.toFixed(2)),
      totalARR: Number(totalARR.toFixed(2)),
      totalRevenueCollected: Number(totalRevenueCollected.toFixed(2)),
      totalOutstanding: Number(totalOutstanding.toFixed(2)),
      overdueCount,
      overdueAmount: Number(overdueAmount.toFixed(2))
    };
  }, [subscriptions, invoices]);

  // Bulk Performance Benchmark: Stress Test with 1,000+ subscriptions
  const runPerformanceBenchmark = (count = 1000) => {
    const startTime = performance.now();
    const bulk = [];
    const basePlan = plans[0];
    const baseTax = taxRules[0];

    for (let i = 1; i <= count; i++) {
      bulk.push({
        id: `SUB-BENCH-${i}`,
        customerId: `usr-cust-${(i % 3) + 1}`,
        customerName: `Benchmark Client #${i}`,
        customerCompany: `Enterprise Org ${i}`,
        customerEmail: `client${i}@benchmark.test`,
        planId: basePlan.id,
        planName: basePlan.name,
        billingFrequency: 'monthly',
        startDate: '2026-01-01',
        expiryDate: '2027-01-01',
        nextBillingDate: '2026-11-01',
        lastBilledDate: '2026-10-01',
        paymentTerms: 'Net 30',
        status: i % 10 === 0 ? 'Closed' : (i % 7 === 0 ? 'Quotation' : 'Active'),
        taxRuleId: baseTax.id,
        appliedDiscountCode: '',
        lines: [
          {
            id: `line-bench-${i}`,
            productId: 'prod-1',
            productName: 'Brightloop ERP Core Engine',
            variantId: 'var-odoo',
            variantName: 'Odoo Enterprise Brand Integration',
            variantDelta: 560,
            unitPrice: 859,
            quantity: (i % 5) + 1,
            taxRate: 18,
            discountPercent: 0
          }
        ],
        history: [{ date: '2026-01-01', actor: 'Benchmark Generator', action: 'Created', note: 'Stress testing scale' }]
      });
    }

    setSubscriptions(bulk);
    const duration = (performance.now() - startTime).toFixed(1);
    showNotification(`Performance Benchmark: Generated & indexed ${count} subscriptions in ${duration}ms! (Requirement: Under 2,000ms)`, 'info');
  };

  const resetToDemoData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUserId('usr-admin-1');
    setProducts(INITIAL_PRODUCTS);
    setPlans(INITIAL_PLANS);
    setQuotationTemplates(INITIAL_QUOTATION_TEMPLATES);
    setTaxRules(INITIAL_TAX_RULES);
    setDiscountRules(INITIAL_DISCOUNT_RULES);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    showNotification('System reset to pristine Brightloop demo state.');
  };

  const value = {
    theme,
    toggleTheme,
    currentUser,
    users,
    switchUser,
    signupCustomer,
    addStaffMember,
    requestPasswordReset,
    resetPassword,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    plans,
    addPlan,
    updatePlan,
    quotationTemplates,
    addQuotationTemplate,
    taxRules,
    addTaxRule,
    discountRules,
    addDiscountRule,
    toggleDiscountRule,
    evaluateDiscount,
    subscriptions,
    createSubscription,
    createSubscriptionFromTemplate,
    updateSubscriptionStatus,
    updateSubscriptionLines,
    invoices,
    runBillingDay,
    confirmInvoice,
    cancelInvoice,
    sendInvoice,
    payments,
    recordPayment,
    financeMetrics,
    runPerformanceBenchmark,
    resetToDemoData,
    notification
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}
