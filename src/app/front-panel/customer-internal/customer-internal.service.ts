import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class InternalCustomerService {

  constructor(private http: HttpClient) {}

  //For pick history tools:
  getCustomerData(){
    let url = "https://tqecustomer.imfast.io/customer.json";
    return this.http.get(url);
  }
  getNextMonthData(){
    let url = "https://tqecustomer.imfast.io/next_month.json";
    return this.http.get(url);
  }
}