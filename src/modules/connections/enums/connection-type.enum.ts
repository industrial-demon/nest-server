type ValueOf<T> = T[keyof T];

export const ConnectionType = {
  CSVFile: 'CSVFile',
  MySQL: 'MySQL',
  Amazon_S3_v2: 'Amazon_S3_v2',
  Oracle: 'Oracle',
  FTP: 'FTP',
  Salesforce: 'Salesforce',
  MS_ACCESS: 'MS_ACCESS',
  WebServicesConsumer: 'WebServicesConsumer',
  MSD: 'MSD',
  SqlServer: 'SqlServer',
  Snowflake_Cloud_Data_Warehouse_V2: 'Snowflake_Cloud_Data_Warehouse_V2',
  TOOLKIT_CCI: 'TOOLKIT_CCI',
} as const

export type ConnectionType = ValueOf<typeof ConnectionType>;
