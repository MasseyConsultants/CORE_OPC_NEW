"""
Enhanced Shipping Calculation Service
"""

from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid

from app.schemas.packing import (
    ShippingCalculationRequest,
    ShippingCalculationResponse,
    ItemRequest,
    BoxResponse,
    PackedItemResponse,
    PackedBoxResponse,
    PackingRecommendationResponse,
    CostBreakdown
)
from app.schemas.packing import Item, Box
from app.services.packing_algorithm import PackingAlgorithm
from app.services.tyson_tariff_service import TysonTariffService
from app.models.overpack_box import OverpackBox
from app.models.product import Product

class CalculationService:
    def __init__(self, db: Session):
        self.db = db
        self.tariff_service = TysonTariffService(db)

    def calculate_enhanced_shipping(self, request: ShippingCalculationRequest, debug_mode: bool = False) -> ShippingCalculationResponse:
        """
        Complete calculation workflow
        """
        debug_info = {
            "steps": [],
            "algorithm_debug": {},
            "box_selection": {},
            "cost_calculation": {},
            "timing": {}
        }
        
        print("=== CALCULATION SERVICE DEBUG START ===")
        print(f"Request: {request}")
        print(f"Debug mode: {debug_mode}")
        
        # 1. Validate inputs
        print("Step 1: Validating inputs...")
        self._validate_inputs(request)
        print("✓ Input validation passed")
        debug_info["steps"].append({
            "step": 1,
            "name": "Input Validation",
            "status": "success",
            "details": f"Validated {len(request.items)} items for ZIP {request.destination_zip}"
        })

        # 2. Get available boxes
        print("Step 2: Getting available boxes...")
        available_boxes = self._get_available_boxes(request.customer_id)
        print(f"✓ Found {len(available_boxes)} available boxes")
        debug_info["steps"].append({
            "step": 2,
            "name": "Box Retrieval",
            "status": "success",
            "details": f"Found {len(available_boxes)} available boxes for customer {request.customer_id}",
            "boxes": [{"id": box.id, "name": box.name, "dimensions": f"{box.length}x{box.width}x{box.height}", "max_weight": box.max_weight} for box in available_boxes]
        })

        # 3. Get available products for recommendations
        print("Step 3: Getting available products...")
        available_products = self._get_available_products(request.customer_id)
        print(f"✓ Found {len(available_products)} available products")
        debug_info["steps"].append({
            "step": 3,
            "name": "Product Retrieval",
            "status": "success",
            "details": f"Found {len(available_products)} available products for recommendations"
        })

        # 4. Convert request items to algorithm items
        print("Step 4: Converting items...")
        algorithm_items = self._convert_to_algorithm_items(request.items)
        print(f"✓ Converted {len(algorithm_items)} items")
        debug_info["steps"].append({
            "step": 4,
            "name": "Item Conversion",
            "status": "success",
            "details": f"Converted {len(algorithm_items)} items for algorithm processing",
            "items": [{"id": item.id, "name": item.name, "dimensions": f"{item.length}x{item.width}x{item.height}", "weight": item.weight, "quantity": item.quantity} for item in algorithm_items]
        })

        # 5. Run packing algorithm
        print("Step 5: Running packing algorithm...")
        packing_algorithm = PackingAlgorithm(available_boxes)
        packing_result = packing_algorithm.pack_items(algorithm_items, available_products, debug_mode=debug_mode)
        print(f"✓ Packing completed: {packing_result.total_boxes} boxes, {packing_result.total_weight} lbs")
        
        # Store algorithm debug info
        if hasattr(packing_result, 'debug_info'):
            debug_info["algorithm_debug"] = packing_result.debug_info
        
        debug_info["steps"].append({
            "step": 5,
            "name": "3D Packing Algorithm",
            "status": "success",
            "details": f"Packed {len(algorithm_items)} items into {packing_result.total_boxes} boxes",
            "total_weight": packing_result.total_weight,
            "overall_efficiency": packing_result.overall_efficiency,
            "packed_boxes": len(packing_result.packed_boxes),
            "overflow_items": len(packing_result.overflow_items)
        })

        # 6. Calculate shipping rates
        print("Step 6: Calculating shipping rates...")
        zone = self.tariff_service.get_zone_from_zip(request.destination_zip)
        print(f"✓ Zone {zone} for ZIP {request.destination_zip}")
        
        base_rate = self.tariff_service.get_shipping_rate(
            request.destination_zip, 
            request.service_level, 
            packing_result.total_weight
        )
        print(f"✓ Base rate: ${base_rate}")
        debug_info["cost_calculation"]["zone"] = zone
        debug_info["cost_calculation"]["base_rate"] = base_rate
        debug_info["steps"].append({
            "step": 6,
            "name": "Shipping Rate Calculation",
            "status": "success",
            "details": f"Zone {zone} for ZIP {request.destination_zip}, Base rate: ${base_rate:.2f}"
        })

        # 7. Calculate material rates
        print("Step 7: Calculating material rates...")
        material_rate = self.tariff_service.calculate_material_rate(packing_result.packed_boxes)
        print(f"✓ Material rate: ${material_rate}")
        debug_info["cost_calculation"]["material_rate"] = material_rate
        debug_info["steps"].append({
            "step": 7,
            "name": "Material Rate Calculation",
            "status": "success",
            "details": f"Material rate: ${material_rate:.2f}"
        })

        # 8. Calculate accessory rates
        print("Step 8: Calculating accessory rates...")
        accessories_rate = self.tariff_service.calculate_accessories_rate(packing_result.packed_boxes)
        print(f"✓ Accessories rate: ${accessories_rate}")
        debug_info["cost_calculation"]["accessories_rate"] = accessories_rate
        debug_info["steps"].append({
            "step": 8,
            "name": "Accessory Rate Calculation",
            "status": "success",
            "details": f"Accessories rate: ${accessories_rate:.2f}"
        })

        # 9. Calculate total cost
        print("Step 9: Calculating total cost...")
        total_cost = base_rate + material_rate + accessories_rate
        print(f"✓ Total cost: ${total_cost}")
        debug_info["cost_calculation"]["total_cost"] = total_cost
        debug_info["steps"].append({
            "step": 9,
            "name": "Total Cost Calculation",
            "status": "success",
            "details": f"Total cost: ${total_cost:.2f} (Base: ${base_rate:.2f} + Material: ${material_rate:.2f} + Accessories: ${accessories_rate:.2f})"
        })

        # 10. Build response
        print("Step 10: Building response...")
        response = ShippingCalculationResponse(
            destination_zip=request.destination_zip,
            zone=zone,
            service_level=request.service_level,
            total_weight=packing_result.total_weight,
            total_boxes=packing_result.total_boxes,
            overall_efficiency=packing_result.overall_efficiency,
            box_costs=0.0,  # Not used in current implementation
            cost_breakdown=CostBreakdown(
                base_rate=base_rate,
                material_rate=material_rate,
                accessories=accessories_rate,
                total_cost=total_cost
            ),
            packed_boxes=self._convert_packed_boxes_to_response(packing_result.packed_boxes),
            recommendations=self._convert_recommendations_to_response(packing_result.recommendations),
            calculation_id=str(uuid.uuid4()),
            created_at=datetime.utcnow().isoformat()
        )
        
        # Add debug info to response if debug mode is enabled
        if debug_mode:
            response.debug_info = debug_info
        
        print("✓ Response built successfully")
        print("=== CALCULATION SERVICE DEBUG END - SUCCESS ===")
        return response

    def _validate_inputs(self, request: ShippingCalculationRequest):
        """Validate all inputs before processing"""
        if not request.items:
            raise ValueError("No items provided")

        if not request.destination_zip or len(request.destination_zip) != 5:
            raise ValueError("Invalid destination ZIP code")

        if request.service_level not in ["overnight", "second_day", "standard"]:
            raise ValueError("Invalid service level")

        for item in request.items:
            if item.quantity <= 0:
                raise ValueError(f"Invalid quantity for item {item.name}")
            if item.length <= 0 or item.width <= 0 or item.height <= 0:
                raise ValueError(f"Invalid dimensions for item {item.name}")
            if item.weight <= 0:
                raise ValueError(f"Invalid weight for item {item.name}")

    def _get_available_boxes(self, customer_id: str) -> List[Box]:
        """Get available overpack boxes for customer"""
        db_boxes = self.db.query(OverpackBox).filter(
            OverpackBox.customerId == customer_id,
            OverpackBox.active == True
        ).all()

        return [
            Box(
                id=str(box.id),
                name=box.name,
                length=box.length,
                width=box.width,
                height=box.height,
                max_weight=box.maxWeight,
                cost=box.cost or 0.0
            )
            for box in db_boxes
        ]

    def _get_available_products(self, customer_id: str) -> List[dict]:
        """Get available products for recommendations"""
        db_products = self.db.query(Product).filter(
            Product.customerId == customer_id,
            Product.active == True
        ).all()

        return [
            {
                'id': str(product.id),
                'name': product.name,
                'sku': product.sku,
                'length': product.length,
                'width': product.width,
                'height': product.height,
                'weight': product.weight
            }
            for product in db_products
        ]

    def _convert_to_algorithm_items(self, request_items: List[ItemRequest]) -> List[Item]:
        """Convert request items to algorithm items"""
        return [
            Item(
                id=item.id,
                name=item.name,
                length=item.length,
                width=item.width,
                height=item.height,
                weight=item.weight,
                quantity=item.quantity
            )
            for item in request_items
        ]

    def _convert_packed_boxes_to_response(self, packed_boxes) -> List[PackedBoxResponse]:
        """Convert packed boxes to response format"""
        result = []
        for packed_box in packed_boxes:
            packed_items = [
                PackedItemResponse(
                    item_id=item.id,
                    item_name=item.name,
                    quantity=quantity,
                    dimensions=f"{item.length}\" × {item.width}\" × {item.height}\"",
                    weight=item.weight * quantity
                )
                for item, quantity in packed_box.items
            ]

            box_response = BoxResponse(
                id=packed_box.box.id,
                name=packed_box.box.name,
                length=packed_box.box.length,
                width=packed_box.box.width,
                height=packed_box.box.height,
                max_weight=packed_box.box.max_weight,
                cost=packed_box.box.cost
            )

            result.append(PackedBoxResponse(
                box=box_response,
                items=packed_items,
                total_weight=packed_box.total_weight,
                total_volume=packed_box.total_volume,
                utilization=packed_box.utilization,
                packing_efficiency=packed_box.packing_efficiency
            ))

        return result

    def _convert_recommendations_to_response(self, recommendations) -> List[PackingRecommendationResponse]:
        """Convert recommendations to response format"""
        return [
            PackingRecommendationResponse(
                box_id=rec.box_id,
                box_name=rec.box_name,
                recommendation_type=rec.recommendation_type,
                message=rec.message,
                suggested_products=rec.suggested_products
            )
            for rec in recommendations
        ]
