// Modelo de item del producto
type ItemProduct = {
    Name: string;
    amount: string;
  };
  
  // Modelo de producto
  type Producto = {
    Uid: string;
    Name: string;
    Image: string[];
    Price: number;
    Discount_price: number;
    IsActive: boolean;
    Description: string;
    Items: ItemProduct[];
  };
  
  // Modelo de orden individual
  type Order = {
    Producto: Producto;
    amount: number;
    additional_information: string;
  };
  
  // Modelo de grupo de órdenes
  type Orders = {
    Uid: string;
    table: string;
    Description_general: string;
    Orders_group: Order[];
  };
  
  // Modelo de adicional en la cuenta
  type Additional = {
    name: string;
    amount: number;
    Price: number;
  };
  
  // Modelo de factura
  type Bill = {
    Uid: string;
    Uid_Orders: string;
    Orders: Orders;
    Additional_values: Additional[];
    Final_value: string;
  };
  