export const businessTypeOptions = [
  { value: 'LLC', label: 'LLC' },
  { value: 'SOLE_PROPRIETOR', label: 'Sole Proprietor' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'PRIVATE_CORPORATION', label: 'Private Corporation' },
  { value: 'PUBLIC_CORPORATION', label: 'Public Corporation' },
  { value: 'NON_PROFIT', label: 'Non-Profit' },
]

export const usStates = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
  'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
  'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV',
  'WI','WY','DC',
]

export const initialMerchant = {
  business: {
    legalName: 'Brightside Coffee Co.',
    doingBusinessAs: 'Brightside Coffee',
    businessType: 'LLC',
    taxIdType: 'EIN',
    taxId: '82-1847821',
    establishmentDate: '2019-06-01',
    address: {
      street: '2145 Mission St',
      street2: '',
      city: 'San Francisco',
      state: 'CA',
      zip: '94110',
      country: 'US',
    },
    phone: '+14155552207',
    email: 'hello@brightsidecoffee.com',
    mcc: '5814',
    annualProcessingVolume: 650000,
    averageTransactionValue: 14,
    statementDescriptor: 'BRIGHTSIDE COFFEE',
    websiteUrl: 'https://brightsidecoffee.com',
  },
  applicant: {
    firstName: 'Maya',
    middleName: '',
    lastName: 'Chen',
    title: 'Owner',
    birthdayDate: '1988-04-15',
    taxIdType: 'SSN',
    taxId: '123-45-4412',
    ownershipFraction: 0.85,
    address: {
      street: '418 Valencia St',
      street2: 'Apt 3',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'US',
    },
    phone: '+14155552207',
    email: 'maya@brightsidecoffee.com',
  },
  externalBank: {
    name: 'Chase Business',
    mask: '••6789',
    holder: 'Brightside Coffee Co.',
  },
  settlement: {
    ytd: 482_100,
    avgMonthly: 54_600,
    last30: 61_240,
  },
}

export function formatPhoneDisplay(e164) {
  if (!e164) return ''
  const digits = e164.replace(/\D/g, '')
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (national.length !== 10) return e164
  return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`
}

export function maskTaxId(taxId, taxIdType) {
  if (!taxId) return ''
  const digits = taxId.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  if (taxIdType === 'EIN') return `••-•••${last4}`
  return `•••-••-${last4}`
}

export function formatCurrency(n) {
  if (n == null || Number.isNaN(Number(n))) return ''
  return `$${Number(n).toLocaleString('en-US')}`
}

export const agreementDefs = [
  {
    id: 'deposit',
    title: 'Deposit Account Terms & Conditions',
    subtitle: 'Governs your Partner Business Anywhere account (DDA)',
    file: '/disclosures/deposit.html',
  },
  {
    id: 'savings',
    title: 'Business Savings Disclosure',
    subtitle: '2.00% APY · $50 min · Truth in Savings + FDIC',
    file: '/disclosures/savings.html',
  },
  {
    id: 'fees',
    title: 'Account Fee Schedule',
    subtitle: 'Fees for DDA, Savings, and Debit Card',
    file: '/disclosures/fees.html',
  },
  {
    id: 'debit-card',
    title: 'Visa Business Debit Card Agreement',
    subtitle: 'Terms for your Business Anytime debit card',
    file: '/disclosures/debit-card.html',
  },
]

export const priorConsents = [
  {
    id: 'esign',
    title: 'E-Sign Consent',
    url: 'https://jaris.io/legal/terms',
  },
  {
    id: 'privacy',
    title: 'Privacy Notice',
    url: 'https://jaris.io/legal/privacy',
  },
]
