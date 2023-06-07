import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

declare var paypal: any;
interface Product {
  name: string;
  id: string;
  price: number;
  quantity: number;
  discountedPrice?: number
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnChanges {

  @ViewChild('payPalRef', { static: true }) private payPalRef: ElementRef;
  @Input() cartItems: Product[] = [];
  @Input() payPalConfig: any;
  @Output() onSuccessCallback: any = new EventEmitter<any>();
  @Output() onErrorCallback: any = new EventEmitter<any>();
  @Output() onCancelCallback: any = new EventEmitter<any>();

  purchasedProducts: Product[] = [];
  cartTotal: number = 0;
  promoApplied: boolean = false;
  discountedTotal: number = 0;
  promoCode: string = '';
  discountPercentage: number = 0;

  ngOnInit(): void {
    this.initConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cartItems'] && !changes['cartItems'].firstChange) {
      this.calculateTotal();
    }
  }

  private initConfig() {
    paypal.Buttons({
      style: this.payPalConfig.style,
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units :[{
            custom_id: this.getCustomerData(),
            amount : {
              currency_code : "USD",
              value: this.cartTotal.toFixed(2).toString(),
              breakdown:{
                item_total: {
                  currency_code : "USD",
                  value: this.cartTotal.toFixed(2).toString(),
                }
              }
            },
            items: this.getCartItems()
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        actions.order.capture().then((orderDetails: any) => {
          const metadata = orderDetails.purchase_units[0].custom_id;
          console.log("Customer Data:", orderDetails.payer);
          console.log("Purchased Units:", orderDetails.purchase_units);
          console.log("Metadata:", metadata);
        });
        this.onSuccessCallback.next({ data, actions });
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

  getCustomerData(){
    const customerData = {
      name: 'hemanth',
      email: 'hemanth@gmail.com'
    }
    return JSON.stringify(customerData);
  }

  getCartItems(){
    const cart = this.cartItems.map((product)=>{
      return{
        name: product.name,
        quantity: product.quantity,
        unit_amount: {
          currency_code: "USD",
          value: (product.discountedPrice || product.price).toFixed(2).toString()
        }
      }
    });
    return cart;
  }

  calculateTotal() {
    this.cartTotal = 0;
    for (const item of this.cartItems) {
      const price = item.discountedPrice ?? item.price;
      this.cartTotal += price;
    }
  }

  getPurchaseUnits() {
    const purchaseUnits = this.cartItems.map((product: any) => {
      const formattedAmount = product.discountedPrice ? product.discountedPrice.toFixed(2) : product.price.toFixed(2);
      return {
        amount: {
          value: formattedAmount
        },
        ...product
      };
    });
    return purchaseUnits;
  }

  applyPromo() {
    this.calculateDiscountedTotal();
    this.promoApplied = true;
  }

  calculateDiscountedTotal() {
    this.cartItems.forEach(item => {
      const discount = item.price * (this.discountPercentage / 100);
      const discountedPrice = item.price - discount;
      item.discountedPrice = discountedPrice > 0 ? discountedPrice : 0;
    });
    this.calculateTotal();
  }

  applyPromoCode() {
    const promoCode = this.promoCode;
    if (this.promoCode === 'VALID') {
      this.discountPercentage = 10;
      this.calculateDiscountedTotal();
    }
  }

}
