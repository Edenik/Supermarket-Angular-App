export class FirebaseUserModel {
    image: string;
    name: string;
    provider: string;
    email:string;
    uid:string;
    phoneNumber:string;
    roleType:string;

    constructor() {
        this.image = "";
        this.name = "";
        this.provider = "";
        this.email = "";
        this.uid = "";
        this.phoneNumber = "";
        this.roleType = "";
    }
}


export class UserInfo {
    displayName: string;
    email: string;
    photoURL: string;
}

export class FullUser {
    creationTime: string;
    displayName: string;
    email: string;
    lastSignInTime: string;
    phoneNumber: string;
    photoURL: string;
    providerId: string;
    roleType: string;
    uid: string;
    subscribeToNews:boolean;

}

export class MinUser {
    user:string;
    uid:string;
}