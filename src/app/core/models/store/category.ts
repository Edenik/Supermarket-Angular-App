export class Category {
    id?:number;
    name:string;
    dateAdded:string;
    addedByUID:string;
    dateEdited:string;
    editedByUID:string;
    quantity?:number;
}

export class SubCategory {
    id?:number;
    name:string;
    dateAdded:string;
    addedByUID:string;
    dateEdited:string;
    editedByUID:string;
    categoryID:number;
    categoryName:string;
    quantity?:number;
}

