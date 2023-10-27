export interface IBook{
    id              : number;
    name            : string;
    isbn            : string;
    release         : Date;
    circulation     : number;
    description     : string;
    pages           : number;
    ageRestriction  : number;

    publisherId     : number;
    seriasId        : number;
}

export interface IBookPublisher{
    id              : number;
    bookId          : number;
    publisherId     : number;
}