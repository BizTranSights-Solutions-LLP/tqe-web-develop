import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

declare const fbq: any;
@Component({
  selector: 'app-vip',
  template: '<p>VIP</p>'
})
export class VipComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    window.location.href = 'https://www.thequantedge.us/gaming-offer-1';
  }
}
