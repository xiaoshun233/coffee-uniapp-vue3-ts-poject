export interface Login {
  phone: string;
  password: string;
}

export interface Register extends Login {
  nickName: string;
}

export interface Info {
  desc: string;
  nickName: string;
  userImg: string;
  vip: number;
}

export interface MyInfo extends Info {
  userBg: string;
}

export interface AccountInfo extends Info {
  phone: string;
  userId: string;
}
