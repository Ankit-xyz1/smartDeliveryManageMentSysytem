// Delivery Partner Type
export type DeliveryPartnerTypeFromDb = {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    currentLoad: number; // max 3
    areas: string[];
    shift: {
      start: string; // HH:mm
      end: string;   // HH:mm
    };
    metrics: {
      rating: number;
      completedOrders: number;
      cancelledOrders: number;
    };
  };
  
  // Order Type
  export type OrderType = {
    _id: string;
    orderNumber: string;
    customer: {
      name: string;
      phone: string;
      address: string;
    };
    area: string;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    status: 'pending' | 'assigned' | 'picked' | 'delivered';
    scheduledFor: string; // HH:mm
    assignedTo?: string;  // partner ID
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
  // Assignment Type
  export type AssignmentType = {
    orderId: string;
    partnerId: string;
    timestamp: Date;
    status: 'success' | 'failed';
    reason?: string;
  };
  
  // Assignment Metrics Type
  export type AssignmentMetricsType = {
    totalAssigned: number;
    successRate: number;
    averageTime: number;
    failureReasons: {
      reason: string;
      count: number;
    }[];
  };
  
  // Page Props Types
  export type PartnersPageProps = {
    partners: DeliveryPartnerType[];
    metrics: {
      totalActive: number;
      avgRating: number;
      topAreas: string[];
    };
  };
  
  export type OrdersPageProps = {
    orders: OrderType[];
    filters: {
      status: string[];
      areas: string[];
      date: string;
    };
  };
  
  export type AssignmentPageProps = {
    activeAssignments: AssignmentMetricsType[];
    metrics: AssignmentMetricsType;
    partners: {
      available: number;
      busy: number;
      offline: number;
    };
  };
  