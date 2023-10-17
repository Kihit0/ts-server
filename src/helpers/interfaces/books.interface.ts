export interface IBook{
    id              : number;
    name            : string;
    isbn            : string;
    release         : Date;
    circulation     : number;
    description     : string;
    mumberOfPages   : number;
    ageRestriction  : number;

    publisherId     : number;
    authorId        : number;
    category        : number;
    serias          : number;
}