// filing-history companies house api response
export declare module FilingHistory {
  export interface IFilingHistory {
    total_count: number
    filing_history_status: 'filing-history-available' | string
    // this is either 0 or a quoted string if specified (eg '35')
    start_index: number | string
    items: FilingHistoryItem[]
    items_per_page: number
  }
  export interface FilingHistoryItem {
    // this is usually a date string
    action_date?: string
    category: string
    date: string
    description: string
    description_values?: {
      capital?: [
        {
          currency: string
          figure: string
        }
      ]
      date?: string
      made_up_date?: string
      officer_name?: string
      termination_date?: string
      appointment_date?: string
      change_date?: string
      new_address?: string
      old_address?: string
      charge_number?: string
      charge_creation_date?: string
      new_date?: string
      description?: string
    }
    resolutions?: {
      category: string
      type: string
      subcategory: string
      description: string
      receiveDate?: string
    }[]
    subcategory?: string
    links?: {
      self: string
      document_metadata: string
    }
    type: string
    paper_filed?: boolean
    pages?: number
    transaction_id: string
    barcode: string
    associated_filings?: AssociatedFiling[]
  }
  export interface AssociatedFiling {
    // this is usually milliseconds
    action_date: number
    category: string
    date: string
    description: string
    data?: {}
    description_values: {
      capital?: [
        {
          currency: string
          figure: string
        }
      ]
      date?: string
      made_up_date?: string
    }
    type: string
  }
}

export const exampleResponses: FilingHistory.IFilingHistory[] = [
  {
    total_count: 102,
    filing_history_status: 'filing-history-available',
    items: [
      {
        category: 'annual-return',
        description_values: {
          made_up_date: '2012-12-31'
        },
        type: 'AR01',
        action_date: '2012-12-31',
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        date: '2013-01-04',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/KT_RUkRgP71Mtv0V5CjKXHSAOHO14cisSeJbGCMdKdA',
          self: '/company/00329819/filing-history/MzA3MDQ4MTQzMmFkaXF6a2N4'
        },
        pages: 9,
        barcode: 'X1ZC240O',
        transaction_id: 'MzA3MDQ4MTQzMmFkaXF6a2N4'
      },
      {
        date: '2012-05-25',
        description: 'change-account-reference-date-company-current-extended',
        action_date: '2013-01-31',
        type: 'AA01',
        description_values: {
          new_date: '2013-01-31',
          made_up_date: '2012-07-31'
        },
        category: 'accounts',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/APmJvqvXIF24-sf3i2I0AbZ8y1K43FQLeDnlTfPypnw',
          self: '/company/00329819/filing-history/MzA1ODEwMjIyMGFkaXF6a2N4'
        },
        pages: 1,
        barcode: 'X19O03P7',
        transaction_id: 'MzA1ODEwMjIyMGFkaXF6a2N4'
      },
      {
        category: 'accounts',
        description_values: {
          made_up_date: '2011-07-31'
        },
        type: 'AA',
        description: 'accounts-with-accounts-type-total-exemption-small',
        action_date: '2011-07-31',
        date: '2012-04-30',
        pages: 7,
        paper_filed: true,
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/EFrWqLlJBDIpseI0a2cam016bGY4JUMJovFkHLqqQ18',
          self: '/company/00329819/filing-history/MzA1NjY4NDUyNGFkaXF6a2N4'
        },
        barcode: 'A17NUH01',
        transaction_id: 'MzA1NjY4NDUyNGFkaXF6a2N4'
      },
      {
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        action_date: '2011-12-31',
        date: '2012-01-06',
        category: 'annual-return',
        description_values: {
          made_up_date: '2011-12-31'
        },
        type: 'AR01',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/DryMRAvkHRoWWXBgk8Ey0Drl50MJdJihYlsgCZEy1ic',
          self: '/company/00329819/filing-history/MzA1MDIyNzk1NmFkaXF6a2N4'
        },
        pages: 9,
        barcode: 'X0ZX4HGI',
        transaction_id: 'MzA1MDIyNzk1NmFkaXF6a2N4'
      },
      {
        date: '2012-01-06',
        description: 'change-person-director-company-with-change-date',
        action_date: '2011-12-31',
        type: 'CH01',
        description_values: {
          officer_name: 'Mr Aldo Luigi Calocero Olmi',
          change_date: '2011-12-31'
        },
        subcategory: 'change',
        category: 'officers',
        links: {
          self: '/company/00329819/filing-history/MzA1MDIwMTcxNWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Z-uFkZbwtEY_INGJVCYqvFNA5hfqYEI893PjY0mI6TM'
        },
        pages: 2,
        barcode: 'X0ZX4HGA',
        transaction_id: 'MzA1MDIwMTcxNWFkaXF6a2N4'
      },
      {
        date: '2011-11-11',
        action_date: '2011-11-04',
        description: 'change-person-director-company-with-change-date',
        subcategory: 'change',
        description_values: {
          change_date: '2011-11-04',
          officer_name: 'Mr Aldo Luigi Calocero Olmi'
        },
        category: 'officers',
        type: 'CH01',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/g0JPzcP-qzScm2z5NpRs1BU4xRJ88gt7DP12AVNa8Zo',
          self: '/company/00329819/filing-history/MzA0Njk5NDM3NWFkaXF6a2N4'
        },
        pages: 2,
        barcode: 'XB2H7Z52',
        transaction_id: 'MzA0Njk5NDM3NWFkaXF6a2N4'
      },
      {
        date: '2011-04-18',
        description: 'accounts-with-accounts-type-total-exemption-small',
        action_date: '2010-07-31',
        type: 'AA',
        description_values: {
          made_up_date: '2010-07-31'
        },
        category: 'accounts',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/kduFi_qK2eHWhLg-EIvsBlb4OrUiGVp2m3Cvm0lvNS4',
          self: '/company/00329819/filing-history/MzAzNTc4MDE0MmFkaXF6a2N4'
        },
        pages: 7,
        paper_filed: true,
        barcode: 'AG1OCTBV',
        transaction_id: 'MzAzNTc4MDE0MmFkaXF6a2N4'
      },
      {
        date: '2011-01-10',
        action_date: '2010-12-31',
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        type: 'AR01',
        description_values: {
          made_up_date: '2010-12-31'
        },
        category: 'annual-return',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/tu6xIrixWiwmUsOfznwoZOL5YU5YzV2yMAhLFqakbGM',
          self: '/company/00329819/filing-history/MzAzMDExMzIyNmFkaXF6a2N4'
        },
        pages: 9,
        barcode: 'XFCGOQO6',
        transaction_id: 'MzAzMDExMzIyNmFkaXF6a2N4'
      },
      {
        description: 'accounts-with-accounts-type-total-exemption-small',
        action_date: '2009-07-31',
        date: '2010-04-21',
        type: 'AA',
        category: 'accounts',
        description_values: {
          made_up_date: '2009-07-31'
        },
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/DlLjnJiKIhqksWyDQZgFVKTJ3EqEboH957mLqxHshyk',
          self: '/company/00329819/filing-history/MzAxMzk1OTI0NmFkaXF6a2N4'
        },
        pages: 7,
        paper_filed: true,
        barcode: 'LPI3KJB9',
        transaction_id: 'MzAxMzk1OTI0NmFkaXF6a2N4'
      },
      {
        date: '2010-01-08',
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        action_date: '2009-12-31',
        type: 'AR01',
        description_values: {
          made_up_date: '2009-12-31'
        },
        category: 'annual-return',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/aYD-z1NVEiN2ixVRPMNXSgjP_q1-TQXmKZmD1edHEz4',
          self: '/company/00329819/filing-history/MzAwNjY4MjkxMWFkaXF6a2N4'
        },
        pages: 9,
        barcode: 'XA1W0GH1',
        transaction_id: 'MzAwNjY4MjkxMWFkaXF6a2N4'
      },
      {
        action_date: '2009-12-31',
        description: 'change-person-director-company-with-change-date',
        date: '2010-01-08',
        category: 'officers',
        subcategory: 'change',
        description_values: {
          change_date: '2009-12-31',
          officer_name: 'Mr Antonio Alberto Calocero Olmi'
        },
        type: 'CH01',
        links: {
          self: '/company/00329819/filing-history/MzAwNjY4MTQwMGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/lENnl9ZGfJSrd6GUm1B4R_ccw9nmHEuxD6pwjmUvk1Q'
        },
        pages: 2,
        barcode: 'XA1VZGHZ',
        transaction_id: 'MzAwNjY4MTQwMGFkaXF6a2N4'
      },
      {
        description_values: {
          made_up_date: '2008-07-31'
        },
        category: 'accounts',
        type: 'AA',
        date: '2009-05-16',
        action_date: '2008-07-31',
        description: 'accounts-with-accounts-type-total-exemption-small',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/pjpDUrZBqk71u-N1nHuTnETpejD_E4WTTNBS1FHQ_40',
          self: '/company/00329819/filing-history/MjAzMzA5NTkxOWFkaXF6a2N4'
        },
        pages: 7,
        paper_filed: true,
        barcode: 'L69VH9UF',
        transaction_id: 'MjAzMzA5NTkxOWFkaXF6a2N4'
      },
      {
        type: '363a',
        description_values: {
          description: 'Return made up to 31/12/08; full list of members'
        },
        category: 'annual-return',
        date: '2009-01-19',
        description: 'legacy',
        links: {
          self: '/company/00329819/filing-history/MjAyMzY1OTA3NWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Us7d8mCPqfxTmQwA-M6Sy1npGdS5DEnygrK7M5-sGiI'
        },
        pages: 9,
        barcode: 'XJOTO6NE',
        transaction_id: 'MjAyMzY1OTA3NWFkaXF6a2N4'
      },
      {
        date: '2008-05-16',
        description: 'accounts-with-accounts-type-total-exemption-small',
        action_date: '2007-07-31',
        description_values: {
          made_up_date: '2007-07-31'
        },
        category: 'accounts',
        type: 'AA',
        links: {
          self: '/company/00329819/filing-history/MjAwNTU2MzgxN2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/0gFJTZE62JbHqj6zJRVpRKZ1CHksl1_sFOeIgcXYi-k'
        },
        pages: 7,
        paper_filed: true,
        barcode: 'LMYNZZQG',
        transaction_id: 'MjAwNTU2MzgxN2FkaXF6a2N4'
      },
      {
        date: '2008-01-25',
        description_values: {
          description: 'Return made up to 31/12/07; full list of members'
        },
        type: '363a',
        category: 'annual-return',
        description: 'legacy',
        links: {
          self: '/company/00329819/filing-history/MTkxMjcyMTgxYWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/85TxTYCIRuSLC19TG0QI4JbmNIQ65V7hIrh0p0X3sU4'
        },
        pages: 6,
        barcode: null,
        transaction_id: 'MTkxMjcyMTgxYWRpcXprY3g'
      },
      {
        action_date: '2006-07-31',
        date: '2007-06-07',
        description_values: {
          made_up_date: '2006-07-31'
        },
        description: 'accounts-with-accounts-type-total-exemption-small',
        category: 'accounts',
        type: 'AA',
        pages: 7,
        paper_filed: true,
        links: {
          self: '/company/00329819/filing-history/MTgxODU4MDY2YWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/uk4k7qsllEgj1BxyjujvbikyNEuCktq7m0An1jOGeBM'
        },
        barcode: null,
        transaction_id: 'MTgxODU4MDY2YWRpcXprY3g'
      },
      {
        date: '2007-05-22',
        description_values: {
          description: "Director's particulars changed"
        },
        type: '288c',
        category: 'officers',
        description: 'legacy',
        pages: 1,
        links: {
          self: '/company/00329819/filing-history/MTgwNDc2MDUxYWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/0R6iR11VYxIrOKudJaP88kqJ_tBh1uCbUjjblvcyArQ'
        },
        barcode: null,
        transaction_id: 'MTgwNDc2MDUxYWRpcXprY3g'
      },
      {
        date: '2007-01-23',
        description_values: {
          description: 'Return made up to 31/12/06; full list of members'
        },
        category: 'annual-return',
        type: '363a',
        description: 'legacy',
        links: {
          self: '/company/00329819/filing-history/MTc0NDk2ODg3YWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/oIGcTyMbgDKoymr31AEWXrin_oYWXuFBKSKvkaamr4A'
        },
        pages: 6,
        barcode: null,
        transaction_id: 'MTc0NDk2ODg3YWRpcXprY3g'
      },
      {
        date: '2006-06-13',
        description_values: {
          description: 'Resolutions'
        },
        description: 'resolution',
        resolutions: [
          {
            subcategory: 'resolution',
            type: 'RES01',
            category: 'incorporation',
            description: 'resolution-memorandum'
          }
        ],
        category: 'resolution',
        type: 'RESOLUTIONS',
        paper_filed: true,
        links: {
          self: '/company/00329819/filing-history/MTYyMzA0MTQyYWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/eDhzHIHfzc9F8WsrwhXOflXzOoxWjd6koUy6YK0mY_I'
        },
        pages: 1,
        barcode: null,
        transaction_id: 'MTYyMzA0MTQyYWRpcXprY3g'
      },
      {
        action_date: '2005-07-31',
        date: '2006-06-05',
        description_values: {
          made_up_date: '2005-07-31'
        },
        description: 'accounts-with-accounts-type-total-exemption-small',
        category: 'accounts',
        type: 'AA',
        pages: 6,
        paper_filed: true,
        links: {
          self: '/company/00329819/filing-history/MTYxNzg0MDg4YWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/a-WS-5yf2rD_vowS3SHdOFgTdcBjTulTYkiY7m9lGMU'
        },
        barcode: null,
        transaction_id: 'MTYxNzg0MDg4YWRpcXprY3g'
      },
      {
        date: '2006-01-20',
        description_values: {
          description: 'Return made up to 31/12/05; full list of members'
        },
        category: 'annual-return',
        type: '363a',
        description: 'legacy',
        links: {
          self: '/company/00329819/filing-history/MTU0MDk4MzM4YWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/E5m0VmWyEHr4P2EMxZqhNhyPgWe7_C1kWcTRMJzWCGU'
        },
        pages: 5,
        barcode: null,
        transaction_id: 'MTU0MDk4MzM4YWRpcXprY3g'
      },
      {
        date: '2006-01-20',
        description_values: {
          description: 'Location of register of members'
        },
        type: '353',
        category: 'address',
        description: 'legacy',
        links: {
          self: '/company/00329819/filing-history/MTI2MjQyMTA4YWRpcXprY3g',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/-C1fLp4r8B32mgfnmqW48QwnMUoHkKHe3-lor3l5ysk'
        },
        pages: 1,
        barcode: null,
        transaction_id: 'MTI2MjQyMTA4YWRpcXprY3g'
      },
      {
        action_date: '2004-07-31',
        date: '2005-05-19',
        description_values: {
          made_up_date: '2004-07-31'
        },
        description: 'accounts-with-accounts-type-total-exemption-small',
        category: 'accounts',
        type: 'AA',
        pages: 6,
        paper_filed: true,
        links: {
          self: '/company/00329819/filing-history/OTkwMDg2NzZhZGlxemtjeA',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/_jBirytWt4nIgUSDveUfdqFMrdM5n-kWgafZolqOrSg'
        },
        barcode: null,
        transaction_id: 'OTkwMDg2NzZhZGlxemtjeA'
      },
      {
        date: '2005-01-12',
        description_values: {
          description: 'Return made up to 31/12/04; no change of members'
        },
        description: 'legacy',
        type: '363s',
        category: 'annual-return',
        links: {
          self: '/company/00329819/filing-history/OTQ5MzU2NjRhZGlxemtjeA',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/fRQ91fOv_8z7wH6VhbIolgGp4fD-e7-dNOAFmmShqAE'
        },
        pages: 8,
        paper_filed: true,
        barcode: null,
        transaction_id: 'OTQ5MzU2NjRhZGlxemtjeA'
      },
      {
        action_date: '2003-07-31',
        date: '2004-04-05',
        description_values: {
          made_up_date: '2003-07-31'
        },
        description: 'accounts-with-accounts-type-small',
        category: 'accounts',
        type: 'AA',
        pages: 7,
        paper_filed: true,
        links: {
          self: '/company/00329819/filing-history/MTY5NzAxNjVhZGlxemtjeA',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/j_tHLhyumM_lKIdJB6F713B7kvHouhnR5r5jKeGePpk'
        },
        barcode: null,
        transaction_id: 'MTY5NzAxNjVhZGlxemtjeA'
      }
    ],
    items_per_page: 25,
    start_index: '30'
  },
  {
    start_index: 0,
    items: [
      {
        action_date: '2020-12-31',
        category: 'confirmation-statement',
        date: '2021-01-20',
        description: 'confirmation-statement-with-no-updates',
        description_values: {
          made_up_date: '2020-12-31'
        },
        links: {
          self: '/company/00329819/filing-history/MzI4OTE5NTU4M2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Mamd-IrGFfDkdm2FthNKzrVKNWE4LkHOP0O8_Ze76ko'
        },
        type: 'CS01',
        pages: 3,
        barcode: 'X9WLHNCZ',
        transaction_id: 'MzI4OTE5NTU4M2FkaXF6a2N4'
      },
      {
        action_date: '2020-01-31',
        category: 'accounts',
        date: '2021-01-19',
        description: 'accounts-with-accounts-type-total-exemption-full',
        description_values: {
          made_up_date: '2020-01-31'
        },
        links: {
          self: '/company/00329819/filing-history/MzI4ODk5MDc5MGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/KF93zvCx4s-YLURee8_ykHanChojncdS7voQhjCs_88'
        },
        type: 'AA',
        pages: 11,
        barcode: 'X9WISY1T',
        transaction_id: 'MzI4ODk5MDc5MGFkaXF6a2N4'
      },
      {
        action_date: '2019-12-31',
        category: 'confirmation-statement',
        date: '2020-02-07',
        description: 'confirmation-statement-with-updates',
        description_values: {
          made_up_date: '2019-12-31'
        },
        links: {
          self: '/company/00329819/filing-history/MzI1NjczNjE0OGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/cbJnTiDq9GL0k_5QWvNTiXvsHB4ztfiNW7zPj0zSpQA'
        },
        type: 'CS01',
        pages: 5,
        barcode: 'X8YAF5O0',
        transaction_id: 'MzI1NjczNjE0OGFkaXF6a2N4'
      },
      {
        links: {
          self: '/company/00329819/filing-history/MzI0NzY5MTI0OGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/zctHmu5cCf17tZnYuOiyoJru24euDEP3Biu_d90J6Ac'
        },
        description: 'accounts-with-accounts-type-total-exemption-full',
        description_values: {
          made_up_date: '2019-01-31'
        },
        action_date: '2019-01-31',
        date: '2019-10-25',
        type: 'AA',
        category: 'accounts',
        pages: 12,
        barcode: 'X8GUR5SO',
        transaction_id: 'MzI0NzY5MTI0OGFkaXF6a2N4'
      },
      {
        action_date: '2019-10-10',
        description_values: {
          change_date: '2019-10-10',
          officer_name: 'Mr Dino Francesco Andrea Olmi'
        },
        date: '2019-10-14',
        type: 'CH03',
        description: 'change-person-secretary-company-with-change-date',
        category: 'officers',
        subcategory: 'change',
        links: {
          self: '/company/00329819/filing-history/MzI0NjcwNDUwOWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/xA4vBGy4Uy1Ky5GERZIXIiZAcWtTM3XY7VzT_DS20s8'
        },
        pages: 1,
        barcode: 'X8G1LEW3',
        transaction_id: 'MzI0NjcwNDUwOWFkaXF6a2N4'
      },
      {
        action_date: '2019-05-02',
        subcategory: 'termination',
        date: '2019-06-28',
        category: 'officers',
        description: 'termination-director-company-with-name-termination-date',
        type: 'TM01',
        links: {
          self: '/company/00329819/filing-history/MzIzODEwODUyNGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/_6qZJYfpAMH7NuiT4ClVusTRrY8g-diMFThX9AvrFGU'
        },
        description_values: {
          officer_name: 'Dino Francesco Andrea Olmi',
          termination_date: '2019-05-02'
        },
        pages: 1,
        barcode: 'X88JWWMO',
        transaction_id: 'MzIzODEwODUyNGFkaXF6a2N4'
      },
      {
        category: 'address',
        description_values: {
          new_address: '325-327 Oldfield Lane North Greenford Middlesex UB6 0FX',
          old_address: 'York House Empire Way Wembley Middlesex HA9 0FQ United Kingdom'
        },
        date: '2019-03-28',
        links: {
          self: '/company/00329819/filing-history/MzIzMDYzNDQxMWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Wh0BFlqi2xPz6UHchcWTp5ws3wV3uW77vDKVr8g6bV4'
        },
        description: 'change-sail-address-company-with-old-address-new-address',
        type: 'AD02',
        pages: 1,
        barcode: 'X827YZD5',
        transaction_id: 'MzIzMDYzNDQxMWFkaXF6a2N4'
      },
      {
        action_date: '2018-12-31',
        description_values: {
          made_up_date: '2018-12-31'
        },
        links: {
          self: '/company/00329819/filing-history/MzIyMzYwNTI4MmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/mCSihUCNUjNzUkCLQfMoP4w-jVPgbt36F3uLBK6lgQQ'
        },
        date: '2019-01-03',
        description: 'confirmation-statement-with-updates',
        type: 'CS01',
        category: 'confirmation-statement',
        pages: 5,
        barcode: 'X7WEFC1F',
        transaction_id: 'MzIyMzYwNTI4MmFkaXF6a2N4'
      },
      {
        description_values: {
          made_up_date: '2018-01-31'
        },
        category: 'accounts',
        type: 'AA',
        date: '2018-10-31',
        links: {
          self: '/company/00329819/filing-history/MzIxODM1MTAyM2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/V9H4_SUNH34I_YBCWGfevgWlzkl4FFGHzSaYXA6Z0m0'
        },
        description: 'accounts-with-accounts-type-total-exemption-full',
        action_date: '2018-01-31',
        pages: 11,
        barcode: 'X7HQ5BU2',
        transaction_id: 'MzIxODM1MTAyM2FkaXF6a2N4'
      },
      {
        links: {
          self: '/company/00329819/filing-history/MzIwMDk2NTg1NGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/r96u6M2JOtgotv9bPuuIERRkYfu8gXoTjRnrb-zA-sg'
        },
        category: 'mortgage',
        action_date: '2018-03-23',
        subcategory: 'create',
        type: 'MR01',
        description: 'mortgage-create-with-deed-with-charge-number-charge-creation-date',
        date: '2018-03-26',
        description_values: {
          charge_number: '003298190003',
          charge_creation_date: '2018-03-23'
        },
        pages: 9,
        barcode: 'X72KB097',
        transaction_id: 'MzIwMDk2NTg1NGFkaXF6a2N4'
      },
      {
        description: 'confirmation-statement-with-no-updates',
        type: 'CS01',
        links: {
          self: '/company/00329819/filing-history/MzE5NTE4MzgzMGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/NtOwS6fe2Gc90tcCgIVDLOPH1_cIAdkSG1BnUpAihNg'
        },
        action_date: '2017-12-31',
        date: '2018-01-12',
        description_values: {
          made_up_date: '2017-12-31'
        },
        category: 'confirmation-statement',
        pages: 3,
        barcode: 'X6XHQSNS',
        transaction_id: 'MzE5NTE4MzgzMGFkaXF6a2N4'
      },
      {
        category: 'accounts',
        paper_filed: true,
        action_date: '2017-01-31',
        date: '2017-11-03',
        description_values: {
          made_up_date: '2017-01-31'
        },
        type: 'AA',
        links: {
          self: '/company/00329819/filing-history/MzE4OTQwMDAyNmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/20DgYT3yHmyo4jJoKUntg7XHkAYiy5ZAnE9p3QahK1E'
        },
        description: 'accounts-with-accounts-type-total-exemption-full',
        pages: 12,
        barcode: 'A6I87AMQ',
        transaction_id: 'MzE4OTQwMDAyNmFkaXF6a2N4'
      },
      {
        description_values: {
          officer_name: 'Mr Aldo Luigi Calocero Olmi',
          change_date: '2017-08-21'
        },
        date: '2017-09-06',
        action_date: '2017-08-21',
        links: {
          self: '/company/00329819/filing-history/MzE4NDc3MDI2OWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/TAjwhGnLxbQzwED7oYL_9BsJ27Kbrt_v7HceoMFCeew'
        },
        category: 'officers',
        subcategory: 'change',
        description: 'change-person-director-company-with-change-date',
        type: 'CH01',
        pages: 2,
        barcode: 'X6ED80Y4',
        transaction_id: 'MzE4NDc3MDI2OWFkaXF6a2N4'
      },
      {
        category: 'confirmation-statement',
        description_values: {
          made_up_date: '2016-12-31'
        },
        links: {
          self: '/company/00329819/filing-history/MzE2NjA4MzM4OGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/3pW1pglZglIrsuw2XV7h2pAdSw1Qe8aXPQF6Nilohjw'
        },
        date: '2017-01-06',
        description: 'confirmation-statement-with-updates',
        type: 'CS01',
        action_date: '2016-12-31',
        pages: 5,
        barcode: 'X5XIN22I',
        transaction_id: 'MzE2NjA4MzM4OGFkaXF6a2N4'
      },
      {
        links: {
          self: '/company/00329819/filing-history/MzE2MTM4ODM4OGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/jvc3jlz_ofUL8k3e36SoxyMyW8kijqLSZ9bwZJ_9ljg'
        },
        category: 'accounts',
        description_values: {
          made_up_date: '2016-01-31'
        },
        action_date: '2016-01-31',
        type: 'AA',
        paper_filed: true,
        description: 'accounts-with-accounts-type-total-exemption-small',
        date: '2016-11-10',
        pages: 6,
        barcode: 'L5ISOVS2',
        transaction_id: 'MzE2MTM4ODM4OGFkaXF6a2N4'
      },
      {
        description: 'appoint-person-director-company-with-name-date',
        date: '2016-07-05',
        type: 'AP01',
        links: {
          self: '/company/00329819/filing-history/MzE1MjI5NjEyMGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/_XxyJ9HCMWgjLoFusGvr7etDAUMknyQNYMTslxJ6YKE'
        },
        category: 'officers',
        action_date: '2016-07-01',
        description_values: {
          appointment_date: '2016-07-01',
          officer_name: 'Mr Richard William Davy'
        },
        subcategory: 'appointments',
        pages: 2,
        barcode: 'X5AKN3D2',
        transaction_id: 'MzE1MjI5NjEyMGFkaXF6a2N4'
      },
      {
        description_values: {
          officer_name: 'Mr Philip Millard',
          appointment_date: '2016-07-01'
        },
        category: 'officers',
        links: {
          self: '/company/00329819/filing-history/MzE1MjI5NTQ3OGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/CHJFipPQOCknhXOtHrTU1A86QRKoJZ91aTYjyWKr5_I'
        },
        action_date: '2016-07-01',
        type: 'AP01',
        date: '2016-07-05',
        description: 'appoint-person-director-company-with-name-date',
        subcategory: 'appointments',
        pages: 2,
        barcode: 'X5AKN1JD',
        transaction_id: 'MzE1MjI5NTQ3OGFkaXF6a2N4'
      },
      {
        associated_filings: [
          {
            action_date: 1453075200000,
            category: 'capital',
            date: '2016-01-18',
            description: 'statement-of-capital',
            description_values: {
              capital: [
                {
                  currency: 'GBP',
                  figure: '5,875'
                }
              ],
              date: '2016-01-18'
            },
            type: 'SH01'
          }
        ],
        links: {
          self: '/company/00329819/filing-history/MzEzOTg4NDI0NGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/yihDH3mOyqwOSzVJWLSarP7CHDvzB96nKUts3xeT4Bg'
        },
        description_values: {
          made_up_date: '2015-12-31'
        },
        type: 'AR01',
        category: 'annual-return',
        date: '2016-01-18',
        action_date: '2015-12-31',
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        pages: 10,
        barcode: 'X4YMZOO3',
        transaction_id: 'MzEzOTg4NDI0NGFkaXF6a2N4'
      },
      {
        date: '2016-01-18',
        description: 'move-registers-to-sail-company-with-new-address',
        links: {
          self: '/company/00329819/filing-history/MzEzOTc4MTUzMGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/OeDX8RuIorDN-vSfj95cGarvacbsloYZNg8QkLtQiTk'
        },
        type: 'AD03',
        category: 'address',
        description_values: {
          new_address: 'York House Empire Way Wembley Middlesex HA9 0FQ'
        },
        pages: 1,
        barcode: 'X4YMZONZ',
        transaction_id: 'MzEzOTc4MTUzMGFkaXF6a2N4'
      },
      {
        action_date: '2015-12-31',
        description: 'change-person-director-company-with-change-date',
        date: '2016-01-15',
        subcategory: 'change',
        type: 'CH01',
        category: 'officers',
        description_values: {
          change_date: '2015-12-31',
          officer_name: 'Mr Aldo Luigi Calocero Olmi'
        },
        links: {
          self: '/company/00329819/filing-history/MzEzOTc4MTUyM2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/5MN04yQhjibMIeHT8dWUfW7bEcZ81TtSebG33qkN5_4'
        },
        pages: 2,
        barcode: 'X4YMZOGA',
        transaction_id: 'MzEzOTc4MTUyM2FkaXF6a2N4'
      },
      {
        description: 'change-sail-address-company-with-new-address',
        date: '2016-01-15',
        description_values: {
          new_address: 'York House Empire Way Wembley Middlesex HA9 0FQ'
        },
        type: 'AD02',
        category: 'address',
        links: {
          self: '/company/00329819/filing-history/MzEzOTc4MTUyOWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/tgnqVJ5s__mcRhW4UjCysNpGNngM0kOlVkVlgRP1jMc'
        },
        pages: 1,
        barcode: 'X4YMZOGI',
        transaction_id: 'MzEzOTc4MTUyOWFkaXF6a2N4'
      },
      {
        description: 'accounts-with-accounts-type-total-exemption-small',
        category: 'accounts',
        action_date: '2015-01-31',
        date: '2015-11-13',
        paper_filed: true,
        type: 'AA',
        links: {
          self: '/company/00329819/filing-history/MzEzNDY1ODE2NWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/YTF_ZZg-qzuKS4JlEy5XcNrcJCUQkIzzLSaK0smANBQ'
        },
        description_values: {
          made_up_date: '2015-01-31'
        },
        pages: 6,
        barcode: 'L4J4DTSZ',
        transaction_id: 'MzEzNDY1ODE2NWFkaXF6a2N4'
      },
      {
        category: 'address',
        description: 'change-registered-office-address-company-with-date-old-address-new-address',
        links: {
          self: '/company/00329819/filing-history/MzEyNzUzOTU4NmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/th4HMQxlrgzMlG6yE9DueDPCMO0gmiUytvWlgXJlla8'
        },
        type: 'AD01',
        date: '2015-07-22',
        action_date: '2015-07-22',
        description_values: {
          new_address: '46/47 Io Centre Armstrong Road Royal Arsenal Woolwich London SE18 6AT',
          change_date: '2015-07-22',
          old_address: 'York House Empire Way Wembley Middlesex HA9 0FQ United Kingdom'
        },
        pages: 1,
        barcode: 'X4C6QBEA',
        transaction_id: 'MzEyNzUzOTU4NmFkaXF6a2N4'
      },
      {
        type: 'AD01',
        description_values: {
          new_address: 'York House Empire Way Wembley Middlesex HA9 0FQ',
          change_date: '2015-04-15',
          old_address: 'Lanmor House 370/386 High Road Wembley Middlesex HA9 6AX'
        },
        date: '2015-04-15',
        description: 'change-registered-office-address-company-with-date-old-address-new-address',
        category: 'address',
        action_date: '2015-04-15',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Pu9rZfTEgXyxUsVWit6w8tXao3HjN5sHqveVp1LmziM',
          self: '/company/00329819/filing-history/MzEyMTIyMzE1OGFkaXF6a2N4'
        },
        pages: 1,
        barcode: 'X45DQAHT',
        transaction_id: 'MzEyMTIyMzE1OGFkaXF6a2N4'
      },
      {
        subcategory: 'create',
        description: 'mortgage-create-with-deed',
        date: '2015-02-12',
        type: 'MR01',
        category: 'mortgage',
        barcode: null,
        transaction_id: 'MzExNzE3NTU0OWFkaXF6a2N4'
      }
    ],
    filing_history_status: 'filing-history-available',
    items_per_page: 25,
    total_count: 102
  },
  {
    filing_history_status: 'filing-history-available',
    start_index: 0,
    items_per_page: 25,
    total_count: 8,
    items: [
      {
        action_date: '2021-03-16',
        category: 'confirmation-statement',
        date: '2021-03-16',
        description: 'confirmation-statement-with-no-updates',
        description_values: {
          made_up_date: '2021-03-16'
        },
        links: {
          self: '/company/10676322/filing-history/MzI5NDQ0MjE5MGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Y-JOnXJ-zvy9ERJNAcRSRzojil997VvtwqmyC9MRvAs'
        },
        type: 'CS01',
        pages: 3,
        barcode: 'XA0E667K',
        transaction_id: 'MzI5NDQ0MjE5MGFkaXF6a2N4'
      },
      {
        action_date: '2020-03-31',
        category: 'accounts',
        date: '2021-01-22',
        description: 'accounts-with-accounts-type-micro-entity',
        description_values: {
          made_up_date: '2020-03-31'
        },
        links: {
          self: '/company/10676322/filing-history/MzI4OTQzODc5MGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/DR2uueIff1_ydir2xBw6ilyEjTTbN-s2b64v1wpqGl0'
        },
        type: 'AA',
        pages: 5,
        barcode: 'X9WQX0NE',
        transaction_id: 'MzI4OTQzODc5MGFkaXF6a2N4'
      },
      {
        action_date: '2020-03-16',
        category: 'confirmation-statement',
        date: '2020-03-16',
        description: 'confirmation-statement-with-no-updates',
        description_values: {
          made_up_date: '2020-03-16'
        },
        links: {
          self: '/company/10676322/filing-history/MzI1OTg5MDY4MmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/OnqEdnwfUbe-ppMkKYysMlO_aE-ecQkQRdXdwDIwAtM'
        },
        type: 'CS01',
        pages: 3,
        barcode: 'X90XOIJL',
        transaction_id: 'MzI1OTg5MDY4MmFkaXF6a2N4'
      },
      {
        action_date: '2019-03-31',
        category: 'accounts',
        date: '2019-11-29',
        description: 'accounts-with-accounts-type-micro-entity',
        description_values: {
          made_up_date: '2019-03-31'
        },
        links: {
          self: '/company/10676322/filing-history/MzI1MDgwNjI3NWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/mXsEboqaez9xbHCYbmxQ9azdILcjSvb8HOkqWnhjVX8'
        },
        type: 'AA',
        pages: 4,
        barcode: 'X8J83994',
        transaction_id: 'MzI1MDgwNjI3NWFkaXF6a2N4'
      },
      {
        links: {
          self: '/company/10676322/filing-history/MzIyOTUzMDI4N2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/PHkP2Rv-Y1LzO9MeIOtLWX-6de24FldAcU9_-80Ou9Q'
        },
        description: 'confirmation-statement-with-no-updates',
        date: '2019-03-18',
        category: 'confirmation-statement',
        action_date: '2019-03-16',
        description_values: {
          made_up_date: '2019-03-16'
        },
        type: 'CS01',
        pages: 3,
        barcode: 'X81H5ZVD',
        transaction_id: 'MzIyOTUzMDI4N2FkaXF6a2N4'
      },
      {
        links: {
          self: '/company/10676322/filing-history/MzIxNzA2MjYzM2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/nJX13WOvkH4ALy-MqFyeHejbfrxhYO3lcEpY2lVfTjs'
        },
        type: 'AA',
        category: 'accounts',
        date: '2018-10-16',
        action_date: '2018-03-31',
        description_values: {
          made_up_date: '2018-03-31'
        },
        description: 'accounts-with-accounts-type-micro-entity',
        pages: 5,
        barcode: 'X7GO6XJF',
        transaction_id: 'MzIxNzA2MjYzM2FkaXF6a2N4'
      },
      {
        action_date: '2018-03-16',
        links: {
          self: '/company/10676322/filing-history/MzIwMDIzNzEyNmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/mEC6oFK5raAUVXY51z4vrJKJoHsbG7I-er6LZ3g_TkY'
        },
        category: 'confirmation-statement',
        date: '2018-03-16',
        description_values: {
          made_up_date: '2018-03-16'
        },
        type: 'CS01',
        description: 'confirmation-statement-with-no-updates',
        pages: 3,
        barcode: 'X71VBAQX',
        transaction_id: 'MzIwMDIzNzEyNmFkaXF6a2N4'
      },
      {
        type: 'NEWINC',
        links: {
          self: '/company/10676322/filing-history/MzE3MTI4NzcxNWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/HMsKGYRQ0a12waWa3LG2zhcwXkujPWQ671cSMFZNVsU'
        },
        category: 'incorporation',
        date: '2017-03-17',
        description: 'incorporation-company',
        associated_filings: [
          {
            action_date: 1489708800000,
            category: 'capital',
            date: '2017-03-17',
            description: 'statement-of-capital',
            description_values: {
              capital: [
                {
                  currency: 'GBP',
                  figure: '1'
                }
              ],
              date: '2017-03-17'
            },
            type: 'SH01'
          }
        ],
        pages: 27,
        barcode: 'X62BSQLV',
        transaction_id: 'MzE3MTI4NzcxNWFkaXF6a2N4'
      }
    ]
  },
  {
    items: [
      {
        action_date: '2021-04-04',
        category: 'confirmation-statement',
        date: '2021-04-13',
        description: 'confirmation-statement-with-no-updates',
        description_values: {
          made_up_date: '2021-04-04'
        },
        links: {
          self: '/company/00084880/filing-history/MzI5NzYwMDgzOGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/wI9oH8qwWSiyMHMqbxKHmxdPW5yEb-c8TMMhLyq3p9A'
        },
        type: 'CS01',
        pages: 3,
        barcode: 'XA2CHTSH',
        transaction_id: 'MzI5NzYwMDgzOGFkaXF6a2N4'
      },
      {
        action_date: '2019-10-31',
        category: 'accounts',
        date: '2020-08-07',
        description: 'accounts-with-accounts-type-dormant',
        description_values: {
          made_up_date: '2019-10-31'
        },
        links: {
          self: '/company/00084880/filing-history/MzI3NDM5NTk3MmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/j3NGJYIypMueOTlAYfMlIhKRVyECnZeF5Offhd93AIg'
        },
        paper_filed: true,
        type: 'AA',
        pages: 5,
        barcode: 'S9AG1ROQ',
        transaction_id: 'MzI3NDM5NTk3MmFkaXF6a2N4'
      },
      {
        action_date: '2020-04-04',
        category: 'confirmation-statement',
        date: '2020-04-06',
        description: 'confirmation-statement-with-no-updates',
        description_values: {
          made_up_date: '2020-04-04'
        },
        links: {
          self: '/company/00084880/filing-history/MzI2MTgyMjkzMWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/FSW_Dgws5I296UHAaFG_edKmsIgzACWBdqmvG7iJlKw'
        },
        type: 'CS01',
        pages: 3,
        barcode: 'X92EPQ3F',
        transaction_id: 'MzI2MTgyMjkzMWFkaXF6a2N4'
      },
      {
        action_date: '2020-03-06',
        category: 'officers',
        date: '2020-03-20',
        description: 'termination-director-company-with-name-termination-date',
        description_values: {
          officer_name: 'Lesley Wild',
          termination_date: '2020-03-06'
        },
        links: {
          self: '/company/00084880/filing-history/MzI2MDM4NDY3NWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/WL_aHjRsW0Z449MHRYS_wSH3eCjwokAFs199QkbFOUY'
        },
        subcategory: 'termination',
        type: 'TM01',
        pages: 1,
        barcode: 'X918K8U0',
        transaction_id: 'MzI2MDM4NDY3NWFkaXF6a2N4'
      },
      {
        action_date: '2020-03-06',
        category: 'officers',
        date: '2020-03-20',
        description: 'appoint-person-director-company-with-name-date',
        description_values: {
          officer_name: 'Mr Paul Murray Cogan',
          appointment_date: '2020-03-06'
        },
        links: {
          self: '/company/00084880/filing-history/MzI2MDM4NDY3M2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/kSEaII98r-Bcd_3tKGyq5XC-XoltzA766hBPUuV1uZE'
        },
        subcategory: 'appointments',
        type: 'AP01',
        pages: 2,
        barcode: 'X918K8QG',
        transaction_id: 'MzI2MDM4NDY3M2FkaXF6a2N4'
      },
      {
        action_date: '2020-03-06',
        category: 'officers',
        date: '2020-03-20',
        description: 'appoint-person-director-company-with-name-date',
        description_values: {
          officer_name: 'Ms Clare Morrow',
          appointment_date: '2020-03-06'
        },
        links: {
          self: '/company/00084880/filing-history/MzI2MDM4NDQ1NWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/zsJSrJvyHoOwy6WIGQX2zZTauTO_zZaHRLbMBinFVZI'
        },
        subcategory: 'appointments',
        type: 'AP01',
        pages: 2,
        barcode: 'X918K7Q9',
        transaction_id: 'MzI2MDM4NDQ1NWFkaXF6a2N4'
      },
      {
        action_date: '2018-10-31',
        date: '2019-06-27',
        category: 'accounts',
        paper_filed: true,
        description: 'accounts-with-accounts-type-dormant',
        type: 'AA',
        description_values: {
          made_up_date: '2018-10-31'
        },
        links: {
          self: '/company/00084880/filing-history/MzIzNzk3MzI3NGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Bc_oA06GCYABeZogQbUjdY9DX9GOWT3Mk-3-zC0vdwE'
        },
        pages: 8,
        barcode: 'A885IMQO',
        transaction_id: 'MzIzNzk3MzI3NGFkaXF6a2N4'
      },
      {
        description_values: {
          made_up_date: '2019-04-04'
        },
        links: {
          self: '/company/00084880/filing-history/MzIzMTgyNzQ2MGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/YOjDxNZFCh-bWqLX6ZyCFnvhzBlxH-QjKwzbJoVBUqU'
        },
        category: 'confirmation-statement',
        type: 'CS01',
        date: '2019-04-11',
        description: 'confirmation-statement-with-no-updates',
        action_date: '2019-04-04',
        pages: 3,
        barcode: 'X836OQP5',
        transaction_id: 'MzIzMTgyNzQ2MGFkaXF6a2N4'
      },
      {
        links: {
          self: '/company/00084880/filing-history/MzIwOTc3NTY4N2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/X9A8T1EXrfl50z_yzj91y-n8OYxT6XWQUxn5j0GhhbQ'
        },
        category: 'accounts',
        paper_filed: true,
        description_values: {
          made_up_date: '2017-10-31'
        },
        description: 'accounts-with-accounts-type-dormant',
        action_date: '2017-10-31',
        type: 'AA',
        date: '2018-07-16',
        pages: 8,
        barcode: 'A7A0UTX4',
        transaction_id: 'MzIwOTc3NTY4N2FkaXF6a2N4'
      },
      {
        category: 'confirmation-statement',
        description: 'confirmation-statement-with-no-updates',
        date: '2018-04-17',
        action_date: '2018-04-04',
        description_values: {
          made_up_date: '2018-04-04'
        },
        links: {
          self: '/company/00084880/filing-history/MzIwMjc2NjA1OWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/HPAVDKddsW1xpHkauyRpsn6LEq4KoQbZWth7kJv2e-g'
        },
        type: 'CS01',
        pages: 3,
        barcode: 'X743I92H',
        transaction_id: 'MzIwMjc2NjA1OWFkaXF6a2N4'
      },
      {
        links: {
          self: '/company/00084880/filing-history/MzE4MDQ3NDgwNmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/uJfAgy3vjldqMw3tolqbAXAY8LzKpH0X7AyjJQU3B6g'
        },
        date: '2017-07-14',
        type: 'AA',
        category: 'accounts',
        action_date: '2016-10-31',
        description: 'accounts-with-accounts-type-dormant',
        description_values: {
          made_up_date: '2016-10-31'
        },
        paper_filed: true,
        pages: 8,
        barcode: 'A6A0YUUO',
        transaction_id: 'MzE4MDQ3NDgwNmFkaXF6a2N4'
      },
      {
        type: 'CS01',
        action_date: '2017-04-04',
        description: 'confirmation-statement-with-updates',
        date: '2017-04-07',
        links: {
          self: '/company/00084880/filing-history/MzE3MzEyMjYwM2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/Sx0AhialiJLzrjDhaNR5YzqdTX3w3lSgKxGYkvgD3Tw'
        },
        category: 'confirmation-statement',
        description_values: {
          made_up_date: '2017-04-04'
        },
        pages: 5,
        barcode: 'X63VC6IP',
        transaction_id: 'MzE3MzEyMjYwM2FkaXF6a2N4'
      },
      {
        date: '2016-07-27',
        category: 'accounts',
        action_date: '2015-10-31',
        type: 'AA',
        links: {
          self: '/company/00084880/filing-history/MzE1Mzc5MTA3MGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/aHYfer_Zk0KfTscyas-2EiprJPna0gGP1yQIMkx4KKc'
        },
        description: 'accounts-with-accounts-type-dormant',
        description_values: {
          made_up_date: '2015-10-31'
        },
        paper_filed: true,
        pages: 6,
        barcode: 'A5BRQXHD',
        transaction_id: 'MzE1Mzc5MTA3MGFkaXF6a2N4'
      },
      {
        links: {
          self: '/company/00084880/filing-history/MzE0NzM5NjkzNWFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/vLdbdbBj3w2R-CO4fayqLTTFfIxkjW-qPyPhXTg9RkM'
        },
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        description_values: {
          made_up_date: '2016-04-04'
        },
        date: '2016-04-28',
        type: 'AR01',
        category: 'annual-return',
        action_date: '2016-04-04',
        associated_filings: [
          {
            action_date: 1461801600000,
            category: 'capital',
            date: '2016-04-28',
            description: 'statement-of-capital',
            description_values: {
              capital: [
                {
                  currency: 'GBP',
                  figure: '80,000'
                }
              ],
              date: '2016-04-28'
            },
            type: 'SH01'
          }
        ],
        pages: 3,
        barcode: 'X55UEK83',
        transaction_id: 'MzE0NzM5NjkzNWFkaXF6a2N4'
      },
      {
        description_values: {
          made_up_date: '2014-10-31'
        },
        type: 'AA',
        date: '2015-07-07',
        category: 'accounts',
        paper_filed: true,
        action_date: '2014-10-31',
        links: {
          self: '/company/00084880/filing-history/MzEyNjQ5NDc0MmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/mMp5RJ0B6bgUIIIx4S6ysfNroCQoky7uXCyhI-7kx0s'
        },
        description: 'accounts-with-accounts-type-dormant',
        pages: 6,
        barcode: 'A4AQB7VL',
        transaction_id: 'MzEyNjQ5NDc0MmFkaXF6a2N4'
      },
      {
        associated_filings: [
          {
            action_date: 1430179200000,
            category: 'capital',
            date: '2015-04-28',
            description: 'statement-of-capital',
            description_values: {
              capital: [
                {
                  currency: 'GBP',
                  figure: '80,000'
                }
              ],
              date: '2015-04-28'
            },
            type: 'SH01'
          }
        ],
        description_values: {
          made_up_date: '2015-04-04'
        },
        category: 'annual-return',
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        date: '2015-04-28',
        type: 'AR01',
        links: {
          self: '/company/00084880/filing-history/MzEyMjExMjYzNmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/p-vAb5TwMVcKHfjQIPyEkCKCbeGpTbEYMyhOJeRSCW0'
        },
        action_date: '2015-04-04',
        pages: 3,
        barcode: 'X46916PT',
        transaction_id: 'MzEyMjExMjYzNmFkaXF6a2N4'
      },
      {
        date: '2014-07-14',
        description_values: {
          made_up_date: '2013-10-31'
        },
        action_date: '2013-10-31',
        category: 'accounts',
        type: 'AA',
        description: 'accounts-with-accounts-type-total-exemption-small',
        paper_filed: true,
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/VnEum-d4gx2I0ZB2lcur5im5vY4UV4GH-8JLvm8x62s',
          self: '/company/00084880/filing-history/MzEwMzU5NTg1M2FkaXF6a2N4'
        },
        pages: 6,
        barcode: 'A3BHRJUG',
        transaction_id: 'MzEwMzU5NTg1M2FkaXF6a2N4'
      },
      {
        description_values: {
          made_up_date: '2014-04-04'
        },
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        associated_filings: [
          {
            description_values: {
              date: '2014-04-17',
              capital: [
                {
                  figure: '80,000',
                  currency: 'GBP'
                }
              ]
            },
            description: 'statement-of-capital',
            date: '2014-04-17',
            category: 'capital',
            data: {},
            type: 'SH01',
            action_date: 1397692800000
          }
        ],
        date: '2014-04-17',
        action_date: '2014-04-04',
        type: 'AR01',
        category: 'annual-return',
        links: {
          self: '/company/00084880/filing-history/MzA5ODQzMTc5M2FkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/0lcKqP7qdOyfI8_634KRy2d5CYCzjqvCN60zIiahwW4'
        },
        pages: 3,
        barcode: 'X35ZF04O',
        transaction_id: 'MzA5ODQzMTc5M2FkaXF6a2N4'
      },
      {
        category: 'accounts',
        type: 'AA',
        action_date: '2012-10-31',
        date: '2013-07-03',
        description: 'accounts-with-accounts-type-dormant',
        description_values: {
          made_up_date: '2012-10-31'
        },
        paper_filed: true,
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/n96K0pyhbHQLFGQ0rYa3pZ0ulG_BbM0T3jCLjMI6J0s',
          self: '/company/00084880/filing-history/MzA4MDkwNDMwM2FkaXF6a2N4'
        },
        pages: 6,
        barcode: 'A2BFTTNV',
        transaction_id: 'MzA4MDkwNDMwM2FkaXF6a2N4'
      },
      {
        action_date: '2013-04-04',
        type: 'AR01',
        category: 'annual-return',
        description_values: {
          made_up_date: '2013-04-04'
        },
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        date: '2013-04-23',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/uKFM4hjzCGXDUX2UBuMAIBUAiyMyx5V_qUhvDCuxIvE',
          self: '/company/00084880/filing-history/MzA3Njc3NjAzM2FkaXF6a2N4'
        },
        pages: 3,
        barcode: 'X26VOMUJ',
        transaction_id: 'MzA3Njc3NjAzM2FkaXF6a2N4'
      },
      {
        subcategory: 'change',
        type: 'CH01',
        action_date: '2013-02-01',
        category: 'officers',
        date: '2013-04-18',
        description_values: {
          officer_name: 'Lesley Wild',
          change_date: '2013-02-01'
        },
        description: 'change-person-director-company-with-change-date',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/6XmnxowbEVrr4ZYa27gTjIohxVT5RPpW_-bodbk-RLY',
          self: '/company/00084880/filing-history/MzA3NjQ5MzE4OGFkaXF6a2N4'
        },
        pages: 2,
        barcode: 'X26IT7PS',
        transaction_id: 'MzA3NjQ5MzE4OGFkaXF6a2N4'
      },
      {
        date: '2012-04-26',
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        description_values: {
          made_up_date: '2012-04-04'
        },
        category: 'annual-return',
        action_date: '2012-04-04',
        type: 'AR01',
        links: {
          self: '/company/00084880/filing-history/MzA1NjU3MTA3NGFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/O6uRNVOJ4fkoky66uH_eRXyhewieNIWTusqlMdW6lA8'
        },
        pages: 3,
        barcode: 'X17NURDK',
        transaction_id: 'MzA1NjU3MTA3NGFkaXF6a2N4'
      },
      {
        date: '2012-02-16',
        description_values: {
          made_up_date: '2011-10-31'
        },
        description: 'accounts-with-accounts-type-full',
        action_date: '2011-10-31',
        type: 'AA',
        category: 'accounts',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/fJVHfMPv0kHwxooxJjyRaCVeR6bhkqm7vTarb-7_ooo',
          self: '/company/00084880/filing-history/MzA1MjU3OTgyOGFkaXF6a2N4'
        },
        pages: 10,
        paper_filed: true,
        barcode: 'A12QB9KA',
        transaction_id: 'MzA1MjU3OTgyOGFkaXF6a2N4'
      },
      {
        description_values: {
          made_up_date: '2011-04-04'
        },
        description: 'annual-return-company-with-made-up-date-full-list-shareholders',
        date: '2011-04-19',
        action_date: '2011-04-04',
        type: 'AR01',
        category: 'annual-return',
        links: {
          self: '/company/00084880/filing-history/MzAzNTg1OTA0NmFkaXF6a2N4',
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/1Q3TI98n1S91fnnCDUqWNAeP8NBWtYgZNnLc0D8wmqw'
        },
        pages: 3,
        barcode: 'XE3SNTF1',
        transaction_id: 'MzAzNTg1OTA0NmFkaXF6a2N4'
      },
      {
        description_values: {
          officer_name: 'Jonathan Wild'
        },
        description: 'termination-director-company-with-name',
        date: '2011-04-19',
        type: 'TM01',
        category: 'officers',
        subcategory: 'termination',
        links: {
          document_metadata:
            'https://frontend-doc-api.company-information.service.gov.uk/document/IZyKG5HeapxjXZZ36JAjOf2ScUELAah1TJCDvTcIZHg',
          self: '/company/00084880/filing-history/MzAzNTg1NDg3MGFkaXF6a2N4'
        },
        pages: 1,
        barcode: 'XE2WVTFC',
        transaction_id: 'MzAzNTg1NDg3MGFkaXF6a2N4'
      }
    ],
    items_per_page: 25,
    filing_history_status: 'filing-history-available',
    total_count: 94,
    start_index: 0
  }
]
