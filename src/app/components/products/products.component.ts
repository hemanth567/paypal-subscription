import { Component } from '@angular/core';

interface Product {
  type: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  products: Product[] = [
    { type: 'Product  1', price: 9.99, selected: false },
    { type: 'Product  2', price: 14.99, selected: false },
    { type: 'Product 3', price: 19.99, selected: false }
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
    product.selected = !product.selected;
    if (product.selected) {
      this.cartItems.push(product);
    } else {
      const index = this.cartItems.findIndex(item => item.type === product.type);
      if (index !== -1) {
        this.cartItems.splice(index, 1);
      }
    }
    this.cartItems = [...this.cartItems];
  }

  approveCallback(data){

  }

  errorCallback(data){
    
  }

  cancelCallback(data){
    
  }

}
