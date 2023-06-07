import { Component } from '@angular/core';

interface Product {
  name: string;
  id: string;
  price: number;
  quantity: number;
  discountedPrice?:number
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  products: Product[] = [
    { id:"123a", name: 'Product  1', price: 9.99, quantity: 0 },
    { id:"456b", name: 'Product  2', price: 14.99, quantity: 0 },
    { id:"789b", name: 'Product 3', price: 19.99, quantity: 0 }
  ];
  cartItems: Product[] = [];
  payPalConfig: any;


  constructor() {
  }

  ngOnInit(): void {
    this.initCofig();
  }

  private initCofig() {
    this.payPalConfig = {
      style : {
        layout: 'vertical',
        color:  'gold',
        shape:  'pill',
        label:  'paypal'
      }
    }
  }

  toggleProductSelection(product: Product) {
    product.quantity = product.quantity == 1 ? 0 : 1;
    if (product.quantity) {
      this.cartItems.push(product);
    } else {
      const index = this.cartItems.findIndex(item => item.name === product.name);
      if (index !== -1) {
        this.cartItems.splice(index, 1);
      }
    }
    this.cartItems = [...this.cartItems];
  }

  onSuccessCallback(data){

  }

  errorCallback(data){
    
  }

  cancelCallback(data){
    
  }

}
