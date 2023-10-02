import { TokenType } from "@enums/TokenType";

export interface IToken{
    id          : number;
    createAt    : Date;
    updateAt    : Date;

    type        : TokenType;
    emailToken? : string;
    valid       : boolean;
    expiration  : Date;
}