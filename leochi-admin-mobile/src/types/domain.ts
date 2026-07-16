export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderListItem = {
  id: string;
  orderNumber: string;
  stripeSessionId?: string;
  customerName?: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
};

export type OrderDetails = {
  id: string;
  orderNumber: string;
  stripeSessionId?: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  shippingAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: string;
  trackingNumber?: string;
  carrier?: string;
  products: Array<{
    name: string;
    size?: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  createdAt: string;
  timeline: Array<{
    key: string;
    label: string;
    timestamp: string;
  }>;
};

export type DashboardMetrics = {
  todaysRevenue: number;
  revenueThisMonth: number;
  ordersToday: number;
  totalOrders: number;
  pendingOrders: number;
  bestSellingProducts: BestSellingProduct[];
  recentOrders: OrderListItem[];
};

export type AnalyticsPoint = {
  date: string;
  revenue: number;
};

export type BestSellingProduct = {
  name: string;
  unitsSold: number;
  revenue: number;
};

export type AnalyticsMetrics = {
  revenueToday: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  bestSellingProducts: BestSellingProduct[];
  revenueGraph: AnalyticsPoint[];
};

export type StoreInfo = {
  storeName: string;
  website: string;
  ownerEmail: string;
};
