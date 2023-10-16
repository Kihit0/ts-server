export interface IUser {
    id          : number;
    email       : string;
    username    : string;
    family      : string;
    createDate? : Date | string;
    password?   : string;
    token?      : string;
    roleId      : number;
}    
