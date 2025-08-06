export interface ValidResponse<T> {
  status: string;
  message: string | null;
  data: T;
}
