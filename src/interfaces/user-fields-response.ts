export interface UserFieldsResponse {
  id: number;
  name: string;
  email: string;
  nickname: string;
  address?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive: boolean;
}
