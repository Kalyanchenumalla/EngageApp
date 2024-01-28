import { User } from "./user";

export class userParams {
    //class gives an opportunity to use a constructor but an interface cannot, we can initialize properties
    gender: string;
    minAge = 15;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 24;
    orderBy = 'lastActive'

    constructor(user: User) {
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}