"""
3D Bin Packing Problem Algorithm Implementation
"""

from dataclasses import dataclass
from typing import List, Tuple, Optional
from app.schemas.packing import Item, Box, PackedBox, PackingResult, PackingRecommendation

class PackingAlgorithm:
    def __init__(self, available_boxes: List[Box]):
        # Sort boxes by volume (smallest first) for cost optimization
        self.available_boxes = sorted(available_boxes,
                                    key=lambda b: b.length * b.width * b.height)

    def pack_items(self, items: List[Item], available_products: List[dict] = None, debug_mode: bool = False) -> PackingResult:
        """
        Main packing method that tries multiple strategies
        """
        debug_info = {
            "strategy_attempts": [],
            "box_evaluations": [],
            "item_placements": [],
            "final_selection": {}
        }
        
        # Try cost-optimized packing first (smallest suitable box)
        result = self._cost_optimized_packing(items.copy(), available_products, debug_mode, debug_info)
        debug_info["strategy_attempts"].append({
            "strategy": "cost_optimized",
            "success": len(result.overflow_items) == 0,
            "boxes_used": len(result.packed_boxes),
            "overflow_items": len(result.overflow_items)
        })

        # If cost-optimized fails, fall back to efficiency-optimized
        if result.overflow_items:
            efficiency_result = self._efficiency_optimized_packing(items.copy(), available_products, debug_mode, debug_info)
            debug_info["strategy_attempts"].append({
                "strategy": "efficiency_optimized",
                "success": len(efficiency_result.overflow_items) == 0,
                "boxes_used": len(efficiency_result.packed_boxes),
                "overflow_items": len(efficiency_result.overflow_items)
            })
            
            if not efficiency_result.overflow_items or len(efficiency_result.overflow_items) < len(result.overflow_items):
                result = efficiency_result
                debug_info["final_selection"]["strategy"] = "efficiency_optimized"
            else:
                debug_info["final_selection"]["strategy"] = "cost_optimized"
        else:
            debug_info["final_selection"]["strategy"] = "cost_optimized"
        
        # Add debug info to result
        if debug_mode:
            result.debug_info = debug_info

        return result

    def _cost_optimized_packing(self, items: List[Item], available_products: List[dict] = None, debug_mode: bool = False, debug_info: dict = None) -> PackingResult:
        """
        Try to fit all items in the smallest possible box
        """
        # Calculate total volume and weight
        total_volume = sum(item.length * item.width * item.height * item.quantity for item in items)
        total_weight = sum(item.weight * item.quantity for item in items)

        # Find smallest box that can fit everything
        suitable_box = self._find_smallest_suitable_box(total_volume, total_weight)

        if suitable_box:
            # All items fit in one box - optimal solution
            packed_box = PackedBox(
                box=suitable_box,
                items=[(item, item.quantity) for item in items],
                total_weight=total_weight,
                total_volume=total_volume,
                utilization=(total_volume / (suitable_box.length * suitable_box.width * suitable_box.height)) * 100,
                packing_efficiency=(total_weight / suitable_box.max_weight) * 100
            )

            recommendations = self._generate_recommendations([packed_box], available_products)

            return PackingResult(
                packed_boxes=[packed_box],
                total_boxes=1,
                total_weight=total_weight,
                total_cost=0.0,  # Will be calculated by rate lookup
                overall_efficiency=packed_box.utilization * 0.7 + packed_box.packing_efficiency * 0.3,
                overflow_items=[],
                recommendations=recommendations
            )
        else:
            # Fall back to multi-box packing
            return self._fallback_to_larger_boxes(items, available_products)

    def _fallback_to_larger_boxes(self, items: List[Item], available_products: List[dict] = None) -> PackingResult:
        """
        Pack items into multiple boxes when single box doesn't work
        """
        packed_boxes = []
        remaining_items = items.copy()

        if not self.available_boxes:
            # No boxes available - return empty result with overflow
            return PackingResult(
                packed_boxes=[],
                total_boxes=0,
                total_weight=sum(item.weight * item.quantity for item in items),
                total_cost=0.0,
                overall_efficiency=0.0,
                overflow_items=[(item, item.quantity) for item in items],
                recommendations=[]
            )

        while remaining_items:
            # Try to pack remaining items in the largest available box
            largest_box = max(self.available_boxes, key=lambda b: b.length * b.width * b.height)

            # Use FFD strategy for this box
            box_items = []
            box_weight = 0
            box_volume = 0

            for item in remaining_items[:]:
                if (box_weight + item.weight * item.quantity <= largest_box.max_weight and
                    box_volume + item.length * item.width * item.height * item.quantity <=
                    largest_box.length * largest_box.width * largest_box.height):

                    box_items.append((item, item.quantity))
                    box_weight += item.weight * item.quantity
                    box_volume += item.length * item.width * item.height * item.quantity
                    remaining_items.remove(item)

            if box_items:
                packed_box = PackedBox(
                    box=largest_box,
                    items=box_items,
                    total_weight=box_weight,
                    total_volume=box_volume,
                    utilization=(box_volume / (largest_box.length * largest_box.width * largest_box.height)) * 100,
                    packing_efficiency=(box_weight / largest_box.max_weight) * 100
                )
                packed_boxes.append(packed_box)
            else:
                # Can't fit any more items
                break

        # Calculate totals
        total_weight = sum(box.total_weight for box in packed_boxes)
        total_volume = sum(box.total_volume for box in packed_boxes)
        overall_efficiency = sum(box.utilization * 0.7 + box.packing_efficiency * 0.3 for box in packed_boxes) / len(packed_boxes) if packed_boxes else 0

        recommendations = self._generate_recommendations(packed_boxes, available_products)

        return PackingResult(
            packed_boxes=packed_boxes,
            total_boxes=len(packed_boxes),
            total_weight=total_weight,
            total_cost=0.0,
            overall_efficiency=overall_efficiency,
            overflow_items=remaining_items,
            recommendations=recommendations
        )

    def _efficiency_optimized_packing(self, items: List[Item], available_products: List[dict] = None, debug_mode: bool = False, debug_info: dict = None) -> PackingResult:
        """
        Use Best Fit Decreasing strategy for maximum efficiency
        """
        if not self.available_boxes:
            # No boxes available - return empty result with overflow
            return PackingResult(
                packed_boxes=[],
                total_boxes=0,
                total_weight=sum(item.weight * item.quantity for item in items),
                total_cost=0.0,
                overall_efficiency=0.0,
                overflow_items=[(item, item.quantity) for item in items],
                recommendations=[]
            )

        # Sort items by volume (largest first)
        sorted_items = sorted(items, key=lambda x: x.length * x.width * x.height, reverse=True)
        packed_boxes = []

        for item in sorted_items:
            placed = False
            # Try to fit in existing boxes first
            for packed_box in packed_boxes:
                if self._can_fit_in_box(item, packed_box):
                    packed_box.items.append((item, item.quantity))
                    packed_box.total_weight += item.weight * item.quantity
                    packed_box.total_volume += item.length * item.width * item.height * item.quantity
                    packed_box.utilization = (packed_box.total_volume / (packed_box.box.length * packed_box.box.width * packed_box.box.height)) * 100
                    packed_box.packing_efficiency = (packed_box.total_weight / packed_box.box.max_weight) * 100
                    placed = True
                    break

            if not placed:
                # Create new box
                suitable_box = self._find_smallest_suitable_box(
                    item.length * item.width * item.height * item.quantity,
                    item.weight * item.quantity
                )
                if suitable_box:
                    packed_box = PackedBox(
                        box=suitable_box,
                        items=[(item, item.quantity)],
                        total_weight=item.weight * item.quantity,
                        total_volume=item.length * item.width * item.height * item.quantity,
                        utilization=(item.length * item.width * item.height * item.quantity / (suitable_box.length * suitable_box.width * suitable_box.height)) * 100,
                        packing_efficiency=(item.weight * item.quantity / suitable_box.max_weight) * 100
                    )
                    packed_boxes.append(packed_box)

        # Calculate totals and return result
        total_weight = sum(box.total_weight for box in packed_boxes)
        total_volume = sum(box.total_volume for box in packed_boxes)
        overall_efficiency = sum(box.utilization * 0.7 + box.packing_efficiency * 0.3 for box in packed_boxes) / len(packed_boxes) if packed_boxes else 0

        recommendations = self._generate_recommendations(packed_boxes, available_products)

        return PackingResult(
            packed_boxes=packed_boxes,
            total_boxes=len(packed_boxes),
            total_weight=total_weight,
            total_cost=0.0,
            overall_efficiency=overall_efficiency,
            overflow_items=[],
            recommendations=recommendations
        )

    def _find_smallest_suitable_box(self, volume: float, weight: float) -> Optional[Box]:
        """
        Find the smallest box that can fit the given volume and weight
        """
        for box in self.available_boxes:
            box_volume = box.length * box.width * box.height
            if box_volume >= volume and box.max_weight >= weight:
                return box
        return None

    def _can_fit_in_box(self, item: Item, packed_box: PackedBox) -> bool:
        """
        Check if an item can fit in an existing packed box
        """
        item_volume = item.length * item.width * item.height * item.quantity
        item_weight = item.weight * item.quantity
        
        remaining_volume = (packed_box.box.length * packed_box.box.width * packed_box.box.height) - packed_box.total_volume
        remaining_weight = packed_box.box.max_weight - packed_box.total_weight
        
        return item_volume <= remaining_volume and item_weight <= remaining_weight

    def _generate_recommendations(self, packed_boxes: List[PackedBox], available_products: List[dict] = None) -> List[PackingRecommendation]:
        """
        Generate intelligent recommendations for improving packing efficiency
        """
        recommendations = []

        for packed_box in packed_boxes:
            if packed_box.utilization < 50:  # Low volume utilization
                if available_products:
                    suggested_products = self._get_suggested_products_for_box(packed_box, available_products)
                    recommendations.append(PackingRecommendation(
                        box_id=packed_box.box.id,
                        box_name=packed_box.box.name,
                        recommendation_type="specific",
                        message=f"Consider adding these products to improve efficiency:",
                        suggested_products=suggested_products
                    ))
                else:
                    recommendations.append(PackingRecommendation(
                        box_id=packed_box.box.id,
                        box_name=packed_box.box.name,
                        recommendation_type="generic",
                        message=f"Low volume utilization ({packed_box.utilization:.1f}%). Consider adding more products to fill the space."
                    ))

        return recommendations

    def _get_suggested_products_for_box(self, packed_box: PackedBox, available_products: List[dict]) -> List[dict]:
        """
        Suggest products that could fit in the remaining space
        """
        remaining_volume = (packed_box.box.length * packed_box.box.width * packed_box.box.height) - packed_box.total_volume
        remaining_weight = packed_box.box.max_weight - packed_box.total_weight

        suggestions = []
        for product in available_products:
            product_volume = product['length'] * product['width'] * product['height']
            if (product_volume <= remaining_volume and
                product['weight'] <= remaining_weight):
                suggestions.append({
                    'id': product['id'],
                    'name': product['name'],
                    'sku': product['sku'],
                    'dimensions': f"{product['length']}\" × {product['width']}\" × {product['height']}\"",
                    'weight': f"{product['weight']} lbs",
                    'volume': f"{product_volume:.1f} cubic inches"
                })

        return suggestions[:5]  # Return top 5 suggestions
