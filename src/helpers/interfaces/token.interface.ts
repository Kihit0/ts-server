export interface IToken{
    id          : number;
    createAt    : Date;
    updateAt    : Date;
    expiration  : Date;
    userId      : number;
    token       : string;
}