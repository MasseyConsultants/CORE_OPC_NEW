"""
Tyson Tariff Service for shipping rate calculations
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.tyson_tariff import (
    TysonZipToZoneMatrix,
    TysonStandardOvernightServiceCharges,
    TysonSecondDayServiceCharges,
    TysonMaterials,
    TysonAccessoriesCharges
)
from app.schemas.packing import PackedBox

class TysonTariffService:
    def __init__(self, db: Session):
        self.db = db

    def get_zone_from_zip(self, zip_code: str) -> int:
        """Get shipping zone from ZIP code"""
        result = self.db.query(TysonZipToZoneMatrix).filter(
            TysonZipToZoneMatrix.destination_zip == zip_code
        ).first()
        return result.zone if result else 1  # Default to zone 1

    def get_overnight_rate(self, zone: int, weight: float) -> float:
        """Get overnight shipping rate"""
        # Find the weight band that covers our weight
        result = self.db.query(TysonStandardOvernightServiceCharges).filter(
            TysonStandardOvernightServiceCharges.lbs >= weight
        ).order_by(TysonStandardOvernightServiceCharges.lbs).first()
        
        if not result:
            return 0.0
            
        # Get the rate for the specific zone
        zone_column = f"zone_{zone}"
        if hasattr(result, zone_column):
            return getattr(result, zone_column) or 0.0
        else:
            return 0.0

    def get_second_day_rate(self, zone: int, weight: float) -> float:
        """Get second day shipping rate"""
        # Find the weight band that covers our weight
        result = self.db.query(TysonSecondDayServiceCharges).filter(
            TysonSecondDayServiceCharges.lbs >= weight
        ).order_by(TysonSecondDayServiceCharges.lbs).first()
        
        if not result:
            return 0.0
            
        # Get the rate for the specific zone
        zone_column = f"zone_{zone}"
        if hasattr(result, zone_column):
            return getattr(result, zone_column) or 0.0
        else:
            return 0.0

    def get_standard_rate(self, zone: int, weight: float) -> float:
        """Get standard shipping rate (using second day as fallback)"""
        # For now, use second day rates as standard
        return self.get_second_day_rate(zone, weight)

    def get_shipping_rate(self, destination_zip: str, service_level: str, total_weight: float) -> float:
        """
        Get shipping rate from Tyson tariff tables
        """
        # 1. Get zone from ZIP code
        zone = self.get_zone_from_zip(destination_zip)

        # 2. Look up rate based on service level
        if service_level == "overnight":
            rate = self.get_overnight_rate(zone, total_weight)
        elif service_level == "second_day":
            rate = self.get_second_day_rate(zone, total_weight)
        else:
            rate = self.get_standard_rate(zone, total_weight)

        return rate

    def calculate_material_rate(self, packed_boxes: List[PackedBox]) -> float:
        """
        Calculate material rate based on packed boxes
        """
        # Get all materials from database
        materials = self.db.query(TysonMaterials).all()

        if not materials:
            return 0.0

        # Calculate average material cost (using refrigerated overnight rate as default)
        total_cost = sum(material.refrigerated_overnight_rate or 0.0 for material in materials if material.refrigerated_overnight_rate)
        if total_cost == 0:
            return 0.0
            
        average_cost = total_cost / len([m for m in materials if m.refrigerated_overnight_rate])

        # Apply to each box
        total_material_rate = 0.0
        for packed_box in packed_boxes:
            # Material cost is proportional to box volume
            box_volume = packed_box.box.length * packed_box.box.width * packed_box.box.height
            material_cost = average_cost * (box_volume / 1000)  # Normalize by 1000 cubic inches
            total_material_rate += material_cost

        return total_material_rate

    def calculate_accessories_rate(self, packed_boxes: List[PackedBox]) -> float:
        """
        Calculate accessory rate based on packed boxes
        """
        # Get all accessories from database
        accessories = self.db.query(TysonAccessoriesCharges).all()

        if not accessories:
            return 0.0

        # Calculate total accessory cost
        total_accessory_cost = sum(accessory.rate or 0.0 for accessory in accessories if accessory.rate)

        # Apply to each box
        total_accessories_rate = total_accessory_cost * len(packed_boxes)

        return total_accessories_rate

    def get_weight_band(self, weight: float) -> int:
        """
        Determine weight band for rate lookup
        """
        if weight <= 1:
            return 1
        elif weight <= 2:
            return 2
        elif weight <= 3:
            return 3
        elif weight <= 5:
            return 5
        elif weight <= 10:
            return 10
        elif weight <= 20:
            return 20
        elif weight <= 30:
            return 30
        elif weight <= 50:
            return 50
        else:
            return 100
