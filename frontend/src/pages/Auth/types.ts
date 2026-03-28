export type User = {
  id: string;
  fullName: string;
  role: string;
  email: string;
};

export enum Role {
  FREELANCER = 'freelancer', 
  CUSTOMER = 'customer',
}