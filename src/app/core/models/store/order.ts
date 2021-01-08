export class Order {
    id?:number;
    fullName:string;
    phone:string;
    email:string;
    city:string;
    adress:string;
    comments:string;
    orderStatus:string;
    uid:string;
    orderDiscount:number;
    originalOrderPrice:number;
    orderDate:string;
    statusUpdateUID:string;
    statusUpdateDate:string;
    orderItems?:OrderItem[];
}

export class OrderItem {
    id?:number;
    // order_id:number;
    product_id:number;
    quantity:number;
    order_item_price:number;
    order_item_discount:number;
}

export class OrderItemFull {
    id?:number;
    // order_id:number;
    product_id:number;
    quantity:number;
    order_item_price:number;
    order_item_discount:number;
    photoURL:string;
    product_name:string;
}
