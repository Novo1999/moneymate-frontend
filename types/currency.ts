export enum Currency {
  // Major Global Currencies
  USD = 'USD', // United States Dollar
  EUR = 'EUR', // Euro
  JPY = 'JPY', // Japanese Yen
  GBP = 'GBP', // British Pound Sterling
  AUD = 'AUD', // Australian Dollar
  CAD = 'CAD', // Canadian Dollar
  CHF = 'CHF', // Swiss Franc
  CNY = 'CNY', // Chinese Yuan
  SEK = 'SEK', // Swedish Krona
  NZD = 'NZD', // New Zealand Dollar

  // Other Major Currencies
  NOK = 'NOK', // Norwegian Krone
  DKK = 'DKK', // Danish Krone
  SGD = 'SGD', // Singapore Dollar
  HKD = 'HKD', // Hong Kong Dollar
  KRW = 'KRW', // South Korean Won
  INR = 'INR', // Indian Rupee
  BRL = 'BRL', // Brazilian Real
  RUB = 'RUB', // Russian Ruble
  MXN = 'MXN', // Mexican Peso
  ZAR = 'ZAR', // South African Rand

  // Middle East & Africa
  SAR = 'SAR', // Saudi Riyal
  AED = 'AED', // UAE Dirham
  ILS = 'ILS', // Israeli Shekel
  TRY = 'TRY', // Turkish Lira
  EGP = 'EGP', // Egyptian Pound
  NGN = 'NGN', // Nigerian Naira
  KES = 'KES', // Kenyan Shilling
  MAD = 'MAD', // Moroccan Dirham
  GHS = 'GHS', // Ghanaian Cedi
  TND = 'TND', // Tunisian Dinar

  // Asia Pacific
  THB = 'THB', // Thai Baht
  MYR = 'MYR', // Malaysian Ringgit
  PHP = 'PHP', // Philippine Peso
  IDR = 'IDR', // Indonesian Rupiah
  VND = 'VND', // Vietnamese Dong
  TWD = 'TWD', // Taiwan Dollar
  PKR = 'PKR', // Pakistani Rupee
  BDT = 'BDT', // Bangladeshi Taka
  LKR = 'LKR', // Sri Lankan Rupee
  NPR = 'NPR', // Nepalese Rupee

  // Latin America
  CLP = 'CLP', // Chilean Peso
  COP = 'COP', // Colombian Peso
  PEN = 'PEN', // Peruvian Sol
  ARS = 'ARS', // Argentine Peso
  UYU = 'UYU', // Uruguayan Peso
  BOB = 'BOB', // Bolivian Boliviano
  PYG = 'PYG', // Paraguayan Guarani
  VES = 'VES', // Venezuelan Bolívar
  CRC = 'CRC', // Costa Rican Colón
  GTQ = 'GTQ', // Guatemalan Quetzal

  // Eastern Europe
  PLN = 'PLN', // Polish Zloty
  CZK = 'CZK', // Czech Koruna
  HUF = 'HUF', // Hungarian Forint
  RON = 'RON', // Romanian Leu
  BGN = 'BGN', // Bulgarian Lev
  HRK = 'HRK', // Croatian Kuna
  RSD = 'RSD', // Serbian Dinar
  UAH = 'UAH', // Ukrainian Hryvnia

  // Other European
  ISK = 'ISK', // Icelandic Krona

  // Central Asia & Others
  KZT = 'KZT', // Kazakhstani Tenge
  UZS = 'UZS', // Uzbekistani Som

  // Caribbean & Small Nations
  BBD = 'BBD', // Barbadian Dollar
  BMD = 'BMD', // Bermudian Dollar
  BSD = 'BSD', // Bahamian Dollar
  JMD = 'JMD', // Jamaican Dollar
  TTD = 'TTD', // Trinidad and Tobago Dollar

  // Pacific
  FJD = 'FJD', // Fijian Dollar
  PGK = 'PGK', // Papua New Guinea Kina

  // Africa continued
  BWP = 'BWP', // Botswana Pula
  MUR = 'MUR', // Mauritian Rupee
  SCR = 'SCR', // Seychellois Rupee
  SZL = 'SZL', // Swazi Lilangeni
  LSL = 'LSL', // Lesotho Loti
  NAD = 'NAD', // Namibian Dollar
  ZMW = 'ZMW', // Zambian Kwacha
  MWK = 'MWK', // Malawian Kwacha
  UGX = 'UGX', // Ugandan Shilling
  TZS = 'TZS', // Tanzanian Shilling
  RWF = 'RWF', // Rwandan Franc
  ETB = 'ETB', // Ethiopian Birr

  // Middle East continued
  JOD = 'JOD', // Jordanian Dinar
  KWD = 'KWD', // Kuwaiti Dinar
  BHD = 'BHD', // Bahraini Dinar
  QAR = 'QAR', // Qatari Riyal
  OMR = 'OMR', // Omani Rial

  // Additional currencies
  AMD = 'ARM', // Armenian Dram
  GEL = 'GEL', // Georgian Lari
  AZN = 'AZN', // Azerbaijani Manat
  MDL = 'MDL', // Moldovan Leu
}

export const getCurrencyDisplayName = (currency: Currency): string => {
  const displayNames: Record<Currency, string> = {
    [Currency.USD]: 'US Dollar ($)',
    [Currency.EUR]: 'Euro (€)',
    [Currency.JPY]: 'Japanese Yen (¥)',
    [Currency.GBP]: 'British Pound (£)',
    [Currency.AUD]: 'Australian Dollar (A$)',
    [Currency.CAD]: 'Canadian Dollar (C$)',
    [Currency.CHF]: 'Swiss Franc (CHF)',
    [Currency.CNY]: 'Chinese Yuan (¥)',
    [Currency.SEK]: 'Swedish Krona (kr)',
    [Currency.NZD]: 'New Zealand Dollar (NZ$)',
    [Currency.NOK]: 'Norwegian Krone (kr)',
    [Currency.DKK]: 'Danish Krone (kr)',
    [Currency.SGD]: 'Singapore Dollar (S$)',
    [Currency.HKD]: 'Hong Kong Dollar (HK$)',
    [Currency.KRW]: 'South Korean Won (₩)',
    [Currency.INR]: 'Indian Rupee (₹)',
    [Currency.BRL]: 'Brazilian Real (R$)',
    [Currency.RUB]: 'Russian Ruble (₽)',
    [Currency.MXN]: 'Mexican Peso ($)',
    [Currency.ZAR]: 'South African Rand (R)',
    [Currency.SAR]: 'Saudi Riyal (﷼)',
    [Currency.AED]: 'UAE Dirham (د.إ)',
    [Currency.ILS]: 'Israeli Shekel (₪)',
    [Currency.TRY]: 'Turkish Lira (₺)',
    [Currency.EGP]: 'Egyptian Pound (£)',
    [Currency.NGN]: 'Nigerian Naira (₦)',
    [Currency.KES]: 'Kenyan Shilling (KSh)',
    [Currency.MAD]: 'Moroccan Dirham (MAD)',
    [Currency.GHS]: 'Ghanaian Cedi (₵)',
    [Currency.TND]: 'Tunisian Dinar (TND)',
    [Currency.THB]: 'Thai Baht (฿)',
    [Currency.MYR]: 'Malaysian Ringgit (RM)',
    [Currency.PHP]: 'Philippine Peso (₱)',
    [Currency.IDR]: 'Indonesian Rupiah (Rp)',
    [Currency.VND]: 'Vietnamese Dong (₫)',
    [Currency.TWD]: 'Taiwan Dollar (NT$)',
    [Currency.PKR]: 'Pakistani Rupee (₨)',
    [Currency.BDT]: 'Bangladeshi Taka (৳)',
    [Currency.LKR]: 'Sri Lankan Rupee (₨)',
    [Currency.NPR]: 'Nepalese Rupee (₨)',
    [Currency.CLP]: 'Chilean Peso ($)',
    [Currency.COP]: 'Colombian Peso ($)',
    [Currency.PEN]: 'Peruvian Sol (S/)',
    [Currency.ARS]: 'Argentine Peso ($)',
    [Currency.UYU]: 'Uruguayan Peso ($)',
    [Currency.BOB]: 'Bolivian Boliviano (Bs)',
    [Currency.PYG]: 'Paraguayan Guarani (₲)',
    [Currency.VES]: 'Venezuelan Bolívar (Bs)',
    [Currency.CRC]: 'Costa Rican Colón (₡)',
    [Currency.GTQ]: 'Guatemalan Quetzal (Q)',
    [Currency.PLN]: 'Polish Zloty (zł)',
    [Currency.CZK]: 'Czech Koruna (Kč)',
    [Currency.HUF]: 'Hungarian Forint (Ft)',
    [Currency.RON]: 'Romanian Leu (lei)',
    [Currency.BGN]: 'Bulgarian Lev (лв)',
    [Currency.HRK]: 'Croatian Kuna (kn)',
    [Currency.RSD]: 'Serbian Dinar (дин)',
    [Currency.UAH]: 'Ukrainian Hryvnia (₴)',
    [Currency.ISK]: 'Icelandic Krona (kr)',
    [Currency.KZT]: 'Kazakhstani Tenge (₸)',
    [Currency.UZS]: 'Uzbekistani Som (UZS)',
    [Currency.BBD]: 'Barbadian Dollar (BBD)',
    [Currency.BMD]: 'Bermudian Dollar (BMD)',
    [Currency.BSD]: 'Bahamian Dollar (BSD)',
    [Currency.JMD]: 'Jamaican Dollar (J$)',
    [Currency.TTD]: 'Trinidad and Tobago Dollar (TTD)',
    [Currency.FJD]: 'Fijian Dollar (FJD)',
    [Currency.PGK]: 'Papua New Guinea Kina (PGK)',
    [Currency.BWP]: 'Botswana Pula (P)',
    [Currency.MUR]: 'Mauritian Rupee (₨)',
    [Currency.SCR]: 'Seychellois Rupee (₨)',
    [Currency.SZL]: 'Swazi Lilangeni (SZL)',
    [Currency.LSL]: 'Lesotho Loti (LSL)',
    [Currency.NAD]: 'Namibian Dollar (NAD)',
    [Currency.ZMW]: 'Zambian Kwacha (ZMW)',
    [Currency.MWK]: 'Malawian Kwacha (MWK)',
    [Currency.UGX]: 'Ugandan Shilling (UGX)',
    [Currency.TZS]: 'Tanzanian Shilling (TZS)',
    [Currency.RWF]: 'Rwandan Franc (RWF)',
    [Currency.ETB]: 'Ethiopian Birr (ETB)',
    [Currency.JOD]: 'Jordanian Dinar (JOD)',
    [Currency.KWD]: 'Kuwaiti Dinar (KWD)',
    [Currency.BHD]: 'Bahraini Dinar (BHD)',
    [Currency.QAR]: 'Qatari Riyal (QAR)',
    [Currency.OMR]: 'Omani Rial (OMR)',
    [Currency.AMD]: 'Armenian Dram (AMD)',
    [Currency.GEL]: 'Georgian Lari (₾)',
    [Currency.AZN]: 'Azerbaijani Manat (₼)',
    [Currency.MDL]: 'Moldovan Leu (MDL)',
  }

  return displayNames[currency] || currency
}