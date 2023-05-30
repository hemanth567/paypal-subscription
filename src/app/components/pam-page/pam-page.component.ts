
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var paypal: any;

@Component({
  selector: 'app-pam-page',
  templateUrl: './pam-page.component.html',
  styleUrls: ['./pam-page.component.scss']
})
export class PamPageComponent implements OnInit, AfterViewInit {

  @ViewChild('paypalRef', { static: true }) private paypalRef: ElementRef;
  paymentPlans: any[] = [
    { type: 'Plan Type 1', price: 9.99 },
    { type: 'Plan Type 2', price: 14.99 },
    { type: 'Plan Type 3', price: 19.99 },
    { type: 'Plan Type 4', price: 24.99 }
  ];

  constructor() {
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  buyNow(paypalButton, plan) {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: plan.price
              }
            }
          ]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          // Handle successful payment
          console.log(details);
        });
      },
      onCancel: (data: any) => {
        console.log(data);
      },
      onError: (err: any) => {
        console.error(err);
      },
      fundingSource: paypal.FUNDING.PAYPAL
    }).render(paypalButton);

  }

}