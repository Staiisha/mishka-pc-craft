// types.ts
export interface Component {
  id: number;
  name: string;
  price: number;
  available: string;
  type: string;
  note: string;
  shippingprice: number;
}

export interface Build {
  id: number;
  name: string;
  sell_price: number;
  note: string;
  components: Component[];
}

export interface BuildComponent {
    id?: number;
    name: string;
    available: string;
    sellingprice: string;
    price: number;
    costprice: string;
    manufacturer: string;
    type: string;
    note?: string;
    description?: string;
    components?: number[]; // Добавляем массив ID компонентов
  }
  
