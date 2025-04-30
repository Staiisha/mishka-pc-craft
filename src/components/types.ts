// types.ts
export interface Component {
  id: number;
  name: string;
  price: number;
  available: string;
  type: string;
  note: string;
  shippingprice: number;
  details: string;
  quantity: number;
}

export interface Build {
  id: number;
  name: string;
  sell_price: number;
  note: string;
  components: {
    component: string;  
    quantity: number;
  }[];
}

export interface BuildComponent {
  id?: string;
  name: string;
  description: string;
  components: Array<{
    component: string; 
    quantity: number;
  }>;
  in_progress_price?: string;
  planned_sell_price?: string | null;
  date?: string;
}

  
