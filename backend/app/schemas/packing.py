"""
3D Bin Packing Problem data structures and schemas
"""

from dataclasses import dataclass
from typing import List, Tuple, Optional
from pydantic import BaseModel, Field

# Core Data Structures
@dataclass
class Item:
    id: str
    name: str
    length: float      # inches
    width: float       # inches
    height: float      # inches
    weight: float      # pounds
    quantity: int      # number of items

@dataclass
class Box:
    id: str
    name: str
    length: float      # inches
    width: float       # inches
    height: float      # inches
    max_weight: float  # pounds
    cost: float        # dollars

@dataclass
class PackedBox:
    box: Box
    items: List[Tuple[Item, int]]  # (item, quantity_in_this_box)
    total_weight: float
    total_volume: float
    utilization: float        # volume utilization percentage
    packing_efficiency: float # weight efficiency percentage

@dataclass
class PackingRecommendation:
    box_id: str
    box_name: str
    recommendation_type: str  # "specific" or "generic"
    message: str
    suggested_products: Optional[List[dict]] = None

@dataclass
class PackingResult:
    packed_boxes: List[PackedBox]
    total_boxes: int
    total_weight: float
    total_cost: float
    overall_efficiency: float
    overflow_items: List[Tuple[Item, int]]
    recommendations: List[PackingRecommendation]
    debug_info: Optional[dict] = None

# Pydantic Schemas for API
class ItemRequest(BaseModel):
    id: str
    name: str
    length: float = Field(..., gt=0, description="Length in inches")
    width: float = Field(..., gt=0, description="Width in inches")
    height: float = Field(..., gt=0, description="Height in inches")
    weight: float = Field(..., gt=0, description="Weight in pounds")
    quantity: int = Field(..., gt=0, description="Number of items")

class BoxResponse(BaseModel):
    id: str
    name: str
    length: float
    width: float
    height: float
    max_weight: float
    cost: float

class PackedItemResponse(BaseModel):
    item_id: str
    item_name: str
    quantity: int
    dimensions: str
    weight: float

class PackedBoxResponse(BaseModel):
    box: BoxResponse
    items: List[PackedItemResponse]
    total_weight: float
    total_volume: float
    utilization: float
    packing_efficiency: float

class PackingRecommendationResponse(BaseModel):
    box_id: str
    box_name: str
    recommendation_type: str
    message: str
    suggested_products: Optional[List[dict]] = None

class PackingResultResponse(BaseModel):
    packed_boxes: List[PackedBoxResponse]
    total_boxes: int
    total_weight: float
    total_cost: float
    overall_efficiency: float
    overflow_items: List[PackedItemResponse]
    recommendations: List[PackingRecommendationResponse]

class CostBreakdown(BaseModel):
    base_rate: float
    material_rate: float
    accessories: float
    total_cost: float

class ShippingCalculationRequest(BaseModel):
    items: List[ItemRequest]
    destination_zip: str = Field(..., min_length=5, max_length=5, description="5-digit ZIP code")
    service_level: str = Field(..., description="Service level: overnight, second_day, or standard")
    origin_zip: Optional[str] = Field(None, description="Origin ZIP code")
    customer_id: str = Field(..., description="Customer ID")

class ShippingCalculationResponse(BaseModel):
    destination_zip: str
    zone: int
    service_level: str
    total_weight: float
    total_boxes: int
    overall_efficiency: float
    box_costs: float
    cost_breakdown: CostBreakdown
    packed_boxes: List[PackedBoxResponse]
    recommendations: List[PackingRecommendationResponse]
    calculation_id: str
    created_at: str
    debug_info: Optional[dict] = None
