interface UserI {
  sub: string;
  email: string;
  email_verified: boolean;
}

export default class User implements UserI {
  public sub!: string;
  public email!: string;
  public email_verified!: boolean;

  constructor(obj: UserI) {
    Object.assign(this, obj);
  }
}