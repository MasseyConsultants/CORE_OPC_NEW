/**
 * Calculator store using Zustand
 */

import { create } from 'zustand';
import { Product, OverpackBox, EnhancedShippingCalculation } from '../types';

interface CalculatorState {
  // Selected items
  selectedProducts: Product[];
  selectedBoxes: OverpackBox[];
  
  // Shipping details
  destinationZip: string;
  originZip: string;
  serviceLevel: string;
  
  // Calculation results
  calculation: EnhancedShippingCalculation | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  updateProductQuantity: (productId: number, quantity: number) => void;
  clearProducts: () => void;
  
  addBox: (box: OverpackBox) => void;
  removeBox: (boxId: number) => void;
  clearBoxes: () => void;
  
  setDestinationZip: (zip: string) => void;
  setOriginZip: (zip: string) => void;
  setServiceLevel: (level: string) => void;
  
  setCalculation: (calculation: EnhancedShippingCalculation | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  selectedProducts: [],
  selectedBoxes: [],
  destinationZip: '',
  originZip: '',
  serviceLevel: 'Ground',
  calculation: null,
  loading: false,
  error: null,

  addProduct: (product: Product) => {
    const { selectedProducts } = get();
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    
    if (existingProduct) {
      // Update quantity if product already exists
      set({
        selectedProducts: selectedProducts.map(p =>
          p.id === product.id
            ? { ...p, quantity: (p as any).quantity ? (p as any).quantity + 1 : 2 }
            : p
        )
      });
    } else {
      // Add new product with quantity 1
      set({
        selectedProducts: [...selectedProducts, { ...product, quantity: 1 } as any]
      });
    }
  },

  removeProduct: (productId: number) => {
    const { selectedProducts } = get();
    set({
      selectedProducts: selectedProducts.filter(p => p.id !== productId)
    });
  },

  updateProductQuantity: (productId: number, quantity: number) => {
    const { selectedProducts } = get();
    if (quantity <= 0) {
      set({
        selectedProducts: selectedProducts.filter(p => p.id !== productId)
      });
    } else {
      set({
        selectedProducts: selectedProducts.map(p =>
          p.id === productId
            ? { ...p, quantity } as any
            : p
        )
      });
    }
  },

  clearProducts: () => set({ selectedProducts: [] }),

  addBox: (box: OverpackBox) => {
    const { selectedBoxes } = get();
    const existingBox = selectedBoxes.find(b => b.id === box.id);
    
    if (!existingBox) {
      set({
        selectedBoxes: [...selectedBoxes, box]
      });
    }
  },

  removeBox: (boxId: number) => {
    const { selectedBoxes } = get();
    set({
      selectedBoxes: selectedBoxes.filter(b => b.id !== boxId)
    });
  },

  clearBoxes: () => set({ selectedBoxes: [] }),

  setDestinationZip: (zip: string) => set({ destinationZip: zip }),
  setOriginZip: (zip: string) => set({ originZip: zip }),
  setServiceLevel: (level: string) => set({ serviceLevel: level }),

  setCalculation: (calculation: EnhancedShippingCalculation | null) => set({ calculation }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  reset: () => set({
    selectedProducts: [],
    selectedBoxes: [],
    destinationZip: '',
    originZip: '',
    serviceLevel: 'Ground',
    calculation: null,
    loading: false,
    error: null
  })
}));
