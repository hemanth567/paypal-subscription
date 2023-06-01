
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var paypal: any;

interface PaymentPlan {
  type: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-pam-page',
  templateUrl: './pam-page.component.html',
  styleUrls: ['./pam-page.component.scss']
})
export class PamPageComponent implements OnInit, AfterViewInit {

  @ViewChild('paypalRef', { static: true }) private paypalRef: ElementRef;
  paymentPlans: PaymentPlan[] = [
    { type: 'Product  1', price: 9.99, selected: false },
    { type: 'Product  2', price: 14.99, selected: false },
    { type: 'Product 3', price: 19.99, selected: false }
  ];
  cartItems: PaymentPlan[] = [];
  purchasedProducts: any[] = [];

  constructor() {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  toggleProductSelection(plan: PaymentPlan) {
    plan.selected = !plan.selected;
    if (plan.selected) {
      this.cartItems.push(plan);
    } else {
      const index = this.cartItems.findIndex(item => item.type === plan.type);
      if (index !== -1) {
        this.cartItems.splice(index, 1);
      }
    }
  }

  isProductSelected(plan: PaymentPlan): boolean {
    return plan.selected;
  }

  buyNow(paypalButton) {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: this.calculateTotal()
              }
            }
          ]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.purchasedProducts = this.cartItems.slice();
          console.log("paypal callback object", details);
          console.log("purchased products", this.purchasedProducts);
          this.cartItems.length = 0;
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


  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  viewCart() {

    console.log('View Cart');
  }

}
