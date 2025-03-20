export class User {
  constructor(
    public _id: string | null,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public firstLogin: boolean = true,
    public temporaryPassword?: string,
    public temporaryPasswordExpiresAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
