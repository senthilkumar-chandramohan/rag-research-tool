// This file exports TypeScript interfaces and types that define the structure of data used in the application.

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
}

export type Response<T> = {
    data: T;
    error?: string;
};