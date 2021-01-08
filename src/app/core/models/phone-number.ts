export class PhoneNumber {
    prefix: string;
    line: string;
  
    // format phone numbers as 972
    get il972() {
      const num =  '972' + this.prefix.substr(1) + this.line
      return `+${num}`
    }
  
}
