import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/store/product';
import { Order, OrderItem } from '../models/store/order';
import { Category, SubCategory } from '../models/store/category';

@Injectable({
  providedIn: 'root'
})
export class StoreApiService {

  constructor(private http: HttpClient) { }

  // //Products  
  // getProductById(id: number): Observable<Product> {
  //   return this.http.get<Product>(`${environment.api}/ProductsDetails/${id}`)
  // }

  // getAllProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(`${environment.api}/ProductsDetails/`);
  // }

  // getProductsByQuery(query): Observable<Product[]> {
  //   return this.http.get<Product[]>(`${environment.api}/ProductsDetails?${query}`);
  // }

  // addProduct(product: Product) {
  //   return this.http.post<Product>(`${environment.api}/ProductsDetails/`, product)
  // }

  // editProduct(id, newParams: Product) {
  //   return this.http.put<Product>(`${environment.api}/ProductsDetails/${id}`, newParams)
  // }

  // deleteProduct(id) {
  //   return this.http.delete<Product>(`${environment.api}/ProductsDetails/${id}`)
  // }

  // //Order
  // getOrderById(id: number): Observable<Order> {
  //   return this.http.get<Order>(`${environment.api}/OrderDetails/${id}`)
  // }

  // getAllOrders(): Observable<Order[]> {
  //   return this.http.get<Order[]>(`${environment.api}/OrderDetails/`);
  // }

  // addOrder(order: Order) {
  //   return this.http.post<Order>(`${environment.api}/OrderDetails/`, order)
  // }

  // editOrder(id, newParams: Order) {
  //   return this.http.put<Order>(`${environment.api}/OrderDetails/${id}`, newParams)
  // }

  // deleteOrder(id) {
  //   return this.http.delete<Order>(`${environment.api}/OrderDetails/${id}`)
  // }

  // //Order Item
  // getOrderItemById(id: number): Observable<OrderItem> {
  //   return this.http.get<OrderItem>(`${environment.api}/OrderItemDetails/${id}`)
  // }

  // getAllOrderItems(): Observable<OrderItem[]> {
  //   return this.http.get<OrderItem[]>(`${environment.api}/OrderItemDetails/`);
  // }

  // getAllOrderItemsByOrderId(id): Observable<OrderItem[]> {
  //   return this.http.get<OrderItem[]>(`${environment.api}/OrderItemDetails/?orderId=${id}`);
  // }

  // addOrderItem(orderItem: OrderItem) {
  //   return this.http.post<OrderItem>(`${environment.api}/OrderItemDetails/`, orderItem).toPromise();
  // }

  // editOrderItem(id, newParams: OrderItem) {
  //   return this.http.put<OrderItem>(`${environment.api}/OrderItemDetails/${id}`, newParams)
  // }

  // deleteOrderItem(id) {
  //   return this.http.delete<OrderItem>(`${environment.api}/OrderItemDetails/${id}`).toPromise();
  // }


  // //Category
  // getCategoryById(id: number): Observable<Category> {
  //   return this.http.get<Category>(`${environment.api}/CategoryDetails/${id}`)
  // }

  // getAllCategories(): Observable<Category[]> {
  //   return this.http.get<Category[]>(`${environment.api}/CategoryDetails/`);
  // }

  // addCategory(category: Category) {
  //   return this.http.post<Category>(`${environment.api}/CategoryDetails/`, category)
  // }

  // editCategory(id, newParams: Category) {
  //   return this.http.put<Category>(`${environment.api}/CategoryDetails/${id}`, newParams)
  // }

  // deleteCategory(id) {
  //   return this.http.delete<Category>(`${environment.api}/CategoryDetails/${id}`)
  // }

  // //SubCategory
  // getSubCategoryById(id: number): Observable<SubCategory> {
  //   return this.http.get<SubCategory>(`${environment.api}/SubcategoryDetails/${id}`)
  // }

  // getSubCategoryByQuery(query): Observable<SubCategory[]> {
  //   return this.http.get<SubCategory[]>(`${environment.api}/SubcategoryDetails?${query}`);
  // }

  // getAllSubCategories(): Observable<SubCategory[]> {
  //   return this.http.get<SubCategory[]>(`${environment.api}/SubcategoryDetails/`);
  // }

  // addSubCategory(subCategory: SubCategory) {
  //   return this.http.post<SubCategory>(`${environment.api}/SubcategoryDetails/`, subCategory)
  // }

  // editSubCategory(id, newParams: SubCategory) {
  //   return this.http.put<SubCategory>(`${environment.api}/SubcategoryDetails/${id}`, newParams)
  // }

  // deleteSubCategory(id) {
  //   return this.http.delete<SubCategory>(`${environment.api}/SubcategoryDetails/${id}`)
  // }
}
