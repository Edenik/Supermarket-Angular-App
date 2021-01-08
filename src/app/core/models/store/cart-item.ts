import { Product } from './product';

export class CartItem {
    productID:number;
    quantity:number;
    dateAdded:Date;
}

export class CartItemFull {
    dateAdded:Date;
    quantity:number;
    item:Product;
}