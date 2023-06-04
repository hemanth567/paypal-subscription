import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

declare var paypal: any;
interface PaymentPlan {
  type: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit,OnChanges{

  @ViewChild('payPalRef', {static: true}) private payPalRef: ElementRef;
  @Input() cartItems: PaymentPlan[] = [];
  @Input() payPalConfig: any;
  @Output() onApproveCallback: any =  new EventEmitter<any>();
  @Output() onErrorCallback: any =  new EventEmitter<any>();
  @Output() onCancelCallback: any =  new EventEmitter<any>();

  purchasedProducts: PaymentPlan[] = [];
  cartTotal : number = 0;

  ngOnInit(): void {
    this.initConfig();
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['cartItems'] && !changes['cartItems'].firstChange) {
      this.calculateTotal();
    }
  }

  private initConfig() {
    paypal.Buttons({
      style: this.payPalConfig.style,
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: this.cartTotal
              }
            }
          ]
        });
      },
      onApprove: (data: any, actions: any) => {
        console.log(data, actions)
        this.onApproveCallback.next({data,actions})
        // return actions.order.capture().then((details: any) =>{        });
      },
      onCancel: (data: any) => {
        this.onCancelCallback(data);
      },
      onError: (err: any) => {
        this.onErrorCallback(err);
      },
      fundingSource: paypal.FUNDING.PAYPAL
    }).render(this.payPalRef.nativeElement);
  }

  calculateTotal() {
    this.cartTotal = 0;
    for (const item of this.cartItems) {
      this.cartTotal += item.price;
    }
  }

}
