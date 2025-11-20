export interface iAlertData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'request';
  isLoading?: boolean;
}
