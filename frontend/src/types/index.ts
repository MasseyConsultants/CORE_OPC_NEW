/**
 * Core TypeScript types for CORE OPC Calculator
 */

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  sku: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  active: boolean;
  customerId: string;
  dryIceVolume: number;
  dryIceWeight: number;
  priority: number;
  requiresDryIce: boolean;
  hold: boolean;
  onHandPrimary: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  name: string;
  sku: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  active?: boolean;
  customerId: string;
  dryIceVolume?: number;
  dryIceWeight?: number;
  priority?: number;
  requiresDryIce?: boolean;
  hold?: boolean;
  onHandPrimary?: number;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  logoUrl?: string;
  active: boolean;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

// Overpack Box types
export interface OverpackBox {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  maxWeight: number;
  active: boolean;
  cost: number;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

// Shipping Calculation types
export interface ShippingCalculation {
  id: string;
  userId?: string;
  destinationZip: string;
  serviceLevel: string;
  optimalBox: OptimalBox[];
  calculationType: string;
  customerId: string;
  originZip?: string;
  packages: Package[];
  totalCost: number;
  totalWeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface OptimalBox {
  boxType: string;
  packages: PackedPackage[];
}

export interface PackedPackage {
  name: string;
  weight: number;
  position: { x: number; y: number; z: number };
  dimensions: {
    width: number;
    height: number;
    length: number;
    rotation: string;
  };
}

export interface Package {
  sku: string;
  name: string;
  weight: number;
  quantity: number;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

// Calculator types
export interface CalculatorState {
  selectedProducts: Product[];
  selectedBoxes: OverpackBox[];
  destinationZip: string;
  originZip: string;
  serviceLevel: string;
  calculation: EnhancedShippingCalculation | null;
  loading: boolean;
  error: string | null;
}

// Enhanced calculation types
export interface ItemRequest {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
}

export interface BoxResponse {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  max_weight: number;
  cost: number;
}

export interface PackedItemResponse {
  item_id: string;
  item_name: string;
  quantity: number;
  dimensions: string;
  weight: number;
}

export interface PackedBoxResponse {
  box: BoxResponse;
  items: PackedItemResponse[];
  total_weight: number;
  total_volume: number;
  utilization: number;
  packing_efficiency: number;
}

export interface PackingRecommendationResponse {
  box_id: string;
  box_name: string;
  recommendation_type: string;
  message: string;
  suggested_products?: Array<{
    id: string;
    name: string;
    sku: string;
    dimensions: string;
    weight: string;
    volume: string;
  }>;
}

export interface CostBreakdown {
  base_rate: number;
  material_rate: number;
  accessories: number;
  total_cost: number;
}

export interface EnhancedShippingCalculation {
  destination_zip: string;
  zone: number;
  service_level: string;
  total_weight: number;
  total_boxes: number;
  overall_efficiency: number;
  box_costs: number;
  cost_breakdown: CostBreakdown;
  packed_boxes: PackedBoxResponse[];
  recommendations: PackingRecommendationResponse[];
  calculation_id: string;
  created_at: string;
  debug_info?: DebugInfo;
}

// Tyson Tariff types (based on database tables)
export interface TysonTariff {
  id: number;
  serviceLevel: string;
  zone: string;
  weightBand: number;
  rate: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TysonAccessoriesCharges {
  id: number;
  activity: string;
  rate: number;
  unit: string;
}

export interface TysonMaterials {
  id: number;
  material: string;
  rate: number;
  unit: string;
}

export interface TysonZipToZoneMatrix {
  id: number;
  zipCode: string;
  zone: string;
  state: string;
  city: string;
}

// System Settings types
export interface SystemSettings {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  debugMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsUpdate {
  companyName?: string;
  companyLogoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  debugMode?: boolean;
}

// Debug types
export interface DebugInfo {
  steps: Array<{
    step: number;
    name: string;
    status: string;
    details: string;
    [key: string]: any;
  }>;
  algorithm_debug: {
    strategy_attempts: Array<{
      strategy: string;
      success: boolean;
      boxes_used: number;
      overflow_items: number;
    }>;
    box_evaluations: any[];
    item_placements: any[];
    final_selection: {
      strategy: string;
    };
  };
  box_selection: any;
  cost_calculation: {
    zone: number;
    base_rate: number;
    material_rate: number;
    accessories_rate: number;
    total_cost: number;
  };
  timing: any;
}
