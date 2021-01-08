import { Injectable } from '@angular/core';
import { FullUser, UserInfo } from '../models/user';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private datePipe: DatePipe) { }
  onlineUsers: string[];

  sortData(data: FullUser[]) {
    let creationTime;
    let lastSignInTime;
    let fixedDates: FullUser[] = [];

    var sortedArray: FullUser[] = data.sort((obj1, obj2) => {
      var sortObject1 = new Date(obj1.creationTime).getTime();
      var sortObject2 = new Date(obj2.creationTime).getTime();
      if (sortObject1 > sortObject2)
        return 1;
      if (sortObject1 < sortObject2)
        return -1;
      return 0;
    });

    sortedArray.forEach(element => {
      creationTime = this.datePipe.transform(element.creationTime, 'dd.MM.yy HH:mm')
      lastSignInTime = this.datePipe.transform(element.lastSignInTime, 'dd.MM.yy HH:mm')
      fixedDates.push({
        uid: element.uid,
        creationTime: creationTime,
        lastSignInTime: lastSignInTime,
        displayName: element.displayName,
        email: element.email,
        phoneNumber: element.phoneNumber,
        providerId: element.providerId,
        photoURL: element.photoURL,
        subscribeToNews: element.subscribeToNews,
        roleType: element.roleType
      })
    });

    return fixedDates;
  }

  getSubscribers(users: FullUser[]) {
    let subscribedUsers = [];
    var output = users.map(function (obj) {
      return Object.keys(obj).sort().map(function (key) {
        return obj[key];
      });
    });

    if (output) {
      output.forEach(user => {
        if (user[8] == true) {
          if (user[2]) {
            subscribedUsers.push({ user: user[2], uid: user[9] })
          }
          else if (user[4]) {
            subscribedUsers.push({ user: user[4], uid: user[9] })
          }
        }
      });
    }
    return subscribedUsers;
  }
}
