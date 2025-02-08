export interface Address {
  name: string;
  tel: string;
  province: string;
  city: string;
  county: string;
  addressDetail: string;
  areaCode: string;
  postalCode: string;
  isDefault: 0 | 1;
}

export interface AddAddressDto extends Address {}

export interface EditAddressDto extends Address {
  aid: string;
}

export interface AddressData extends Address {
  aid: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  isRemoved: 0 | 1;
}

export interface PayDto {
  sids: string;
  phone: string;
  address: string;
  receiver: string;
}
