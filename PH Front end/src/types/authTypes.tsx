
export interface LoginPayload {
  email: string;
  password: string;
}

export interface user {
    id: string;
    name: string;
    userName: string;
    email: string;
    role: string;
    pincode: string;
    address: string;
  };


export interface LoginResponse {
  token: string;
  user: user  
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  mobileNum: string;
  pincode: string;
  userName: string;
  city: string;
  state: string;
  userTypeId: number;
}