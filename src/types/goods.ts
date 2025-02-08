export interface Goods {
  createdAt: string;
  desc: string;
  enname: string;
  id: number;
  isHot: number;
  largeImg: string;
  name: string;
  pid: string;
  price: number;
  smallImg: string;
  type: string;
  typeDesc: string;
  updatedAt: string;
}

export interface GoodsType {
  createdAt: string;
  id: number;
  type: string;
  typeDesc: string;
  updatedAt: string;
}

export interface GoodsDetail {
  pid: string;
  name: string;
  desc: string;
  enname: string;
  is_hot: number;
  price: number;
  small_img: string;
  large_img: string;
  cream: string;
  cream_desc: string;
  milk: string;
  milk_desc: string;
  sugar: string;
  sugar_desc: string;
  tem: string;
  tem_desc: string;
  type: string;
  type_desc: string;
}

export interface AddShopcartDto {
  pid: string;
  count: number;
  rule: string;
}

export interface ShopCartGoods {
  count: number;
  created_at: string;
  desc: string;
  enname: string;
  is_hot: number;
  is_remove: number;
  large_img: string;
  name: string;
  pid: string;
  price: number;
  rule: string;
  sid: string;
  small_img: string;
  status: number;
  type: string;
  type_desc: string;
  updated_at: string;
  user_id: string;
}
