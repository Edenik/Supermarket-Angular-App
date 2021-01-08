export class Product {
    id?: number;
    productName: string;
    price: number;
    brand: string;
    weight:number;
    unit: string;
    inSale: boolean;
    salePrice: number;
    saleDescription: string;
    hasNutritialMark: boolean;
    nutritialSodium: boolean;
    nutritialSugar: boolean;
    nutritialFat: boolean;
    category: string;
    subCategory: string;
    photoURL:string;
    dateAdded:string;
    addedByUID:string;
    dateEdited:string;
    editedByUID:string;
    categoryName?:string;
    subcategoryName?:string;
}
