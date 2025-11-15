export interface iAlertData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'request';
}

export interface iAlertRequest extends iAlertData {
  isLoading: boolean;
}
