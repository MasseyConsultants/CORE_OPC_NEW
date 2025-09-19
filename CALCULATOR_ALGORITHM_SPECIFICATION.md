# CORE OPC Calculator - 3D Bin Packing Algorithm & Calculation Specification

## Version 1.0 - Complete Technical Documentation

---

## 🎯 OVERVIEW

The CORE OPC Calculator uses a sophisticated 3D Bin Packing Problem (BPP) algorithm to optimally pack products into overpack boxes and calculate shipping rates. This document provides the complete technical specification of how all calculations work.

---

## 📦 3D BIN PACKING ALGORITHM

### **Core Data Structures**

```python
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
class PackingResult:
    packed_boxes: List[PackedBox]
    total_boxes: int
    total_weight: float
    total_cost: float
    overall_efficiency: float
    overflow_items: List[Tuple[Item, int]]
    recommendations: List[PackingRecommendation]
```

### **Algorithm Strategies**

#### **1. Best Fit Decreasing (BFD)**

- Sorts items by volume (largest first)
- For each item, finds the box with the smallest remaining space that can fit it
- Most efficient for volume utilization

#### **2. First Fit Decreasing (FFD)**

- Sorts items by volume (largest first)
- Places each item in the first box that can fit it
- Faster than BFD but less optimal

#### **3. Bottom Left Fill (BLF)**

- Places items starting from bottom-left corner
- Fills boxes systematically from bottom to top
- Good for rectangular items

### **Packing Algorithm Implementation**

```python
class PackingAlgorithm:
    def __init__(self, available_boxes: List[Box]):
        # Sort boxes by volume (smallest first) for cost optimization
        self.available_boxes = sorted(available_boxes,
                                    key=lambda b: b.length * b.width * b.height)

    def pack_items(self, items: List[Item], available_products: List[dict] = None) -> PackingResult:
        """
        Main packing method that tries multiple strategies
        """
        # Try cost-optimized packing first (smallest suitable box)
        result = self._cost_optimized_packing(items.copy(), available_products)

        # If cost-optimized fails, fall back to efficiency-optimized
        if result.overflow_items:
            efficiency_result = self._efficiency_optimized_packing(items.copy(), available_products)
            if not efficiency_result.overflow_items or len(efficiency_result.overflow_items) < len(result.overflow_items):
                result = efficiency_result

        return result
```

---

## 🧮 CALCULATION FORMULAS

### **1. Volume Calculations**

```python
# Item volume
item_volume = item.length * item.width * item.height

# Total item volume (with quantity)
total_item_volume = item_volume * item.quantity

# Box volume
box_volume = box.length * box.width * box.height

# Packed box volume
packed_volume = sum(item.length * item.width * item.height * quantity
                   for item, quantity in packed_box.items)
```

### **2. Weight Calculations**

```python
# Item weight
item_weight = item.weight

# Total item weight (with quantity)
total_item_weight = item_weight * item.quantity

# Packed box weight
packed_weight = sum(item.weight * quantity
                   for item, quantity in packed_box.items)
```

### **3. Efficiency Calculations**

```python
# Volume Utilization (Primary efficiency metric)
volume_utilization = (packed_volume / box_volume) * 100

# Weight Efficiency (Secondary efficiency metric)
weight_efficiency = (packed_weight / box.max_weight) * 100

# Overall Efficiency (Weighted combination)
overall_efficiency = (volume_utilization * 0.7) + (weight_efficiency * 0.3)
```

### **4. Cost Calculations**

```python
# Base shipping rate (from Tyson tariff tables)
base_rate = get_shipping_rate(destination_zip, service_level, total_weight, zone)

# Material rate (average of all materials)
material_rate = calculate_material_rate(packed_boxes)

# Accessories rate (if applicable)
accessories_rate = calculate_accessories_rate(packed_boxes)

# Total cost
total_cost = base_rate + material_rate + accessories_rate
```

---

## 📊 TYSON TARIFF INTEGRATION

### **Database Tables Used**

#### **1. tyson_ZipToZone_Matrix**

```sql
CREATE TABLE tyson_ZipToZone_Matrix (
    id SERIAL PRIMARY KEY,
    destination_zip VARCHAR(10),
    zone INTEGER
);
```

- Maps destination ZIP codes to shipping zones
- Used to determine zone for rate lookup

#### **2. tyson_Standard_Overnight_Service_Charges**

```sql
CREATE TABLE tyson_Standard_Overnight_Service_Charges (
    id SERIAL PRIMARY KEY,
    zone INTEGER,
    lbs FLOAT,
    rate FLOAT
);
```

- Contains overnight shipping rates by zone and weight
- Used for overnight service calculations

#### **3. tyson_Second_Day_Service_Charges**

```sql
CREATE TABLE tyson_Second_Day_Service_Charges (
    id SERIAL PRIMARY KEY,
    zone INTEGER,
    lbs FLOAT,
    rate FLOAT
);
```

- Contains second-day shipping rates by zone and weight
- Used for second-day service calculations

#### **4. tyson_Materials**

```sql
CREATE TABLE tyson_Materials (
    id SERIAL PRIMARY KEY,
    material_name VARCHAR(255),
    cost_per_unit FLOAT,
    unit_type VARCHAR(50)
);
```

- Contains material costs for packaging
- Used to calculate material rates

#### **5. tyson_Accessories_Charges**

```sql
CREATE TABLE tyson_Accessories_Charges (
    id SERIAL PRIMARY KEY,
    accessory_name VARCHAR(255),
    cost FLOAT
);
```

- Contains accessory costs (labels, tape, etc.)
- Used for accessory rate calculations

### **Rate Lookup Process**

```python
def get_shipping_rate(destination_zip: str, service_level: str, total_weight: float) -> float:
    """
    Get shipping rate from Tyson tariff tables
    """
    # 1. Get zone from ZIP code
    zone = get_zone_from_zip(destination_zip)

    # 2. Determine weight band
    weight_band = get_weight_band(total_weight)

    # 3. Look up rate based on service level
    if service_level == "overnight":
        rate = get_overnight_rate(zone, weight_band)
    elif service_level == "second_day":
        rate = get_second_day_rate(zone, weight_band)
    else:
        rate = get_standard_rate(zone, weight_band)

    return rate

def get_zone_from_zip(zip_code: str) -> int:
    """Get shipping zone from ZIP code"""
    result = db.query(tyson_ZipToZone_Matrix).filter(
        tyson_ZipToZone_Matrix.destination_zip == zip_code
    ).first()
    return result.zone if result else 1  # Default to zone 1

def get_overnight_rate(zone: int, weight: float) -> float:
    """Get overnight shipping rate"""
    result = db.query(tyson_Standard_Overnight_Service_Charges).filter(
        tyson_Standard_Overnight_Service_Charges.zone == zone,
        tyson_Standard_Overnight_Service_Charges.lbs >= weight
    ).order_by(tyson_Standard_Overnight_Service_Charges.lbs).first()
    return result.rate if result else 0.0
```

---

## 🔄 PACKING ALGORITHM WORKFLOW

### **Step 1: Input Validation**

```python
def validate_inputs(items: List[Item], destination_zip: str, service_level: str):
    """Validate all inputs before processing"""
    if not items:
        raise ValueError("No items provided")

    if not destination_zip or len(destination_zip) != 5:
        raise ValueError("Invalid destination ZIP code")

    if service_level not in ["overnight", "second_day", "standard"]:
        raise ValueError("Invalid service level")

    for item in items:
        if item.quantity <= 0:
            raise ValueError(f"Invalid quantity for item {item.name}")
        if item.length <= 0 or item.width <= 0 or item.height <= 0:
            raise ValueError(f"Invalid dimensions for item {item.name}")
        if item.weight <= 0:
            raise ValueError(f"Invalid weight for item {item.name}")
```

### **Step 2: Cost-Optimized Packing**

```python
def _cost_optimized_packing(self, items: List[Item], available_products: List[dict] = None) -> PackingResult:
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
```

### **Step 3: Multi-Box Packing (Fallback)**

```python
def _fallback_to_larger_boxes(self, items: List[Item], available_products: List[dict] = None) -> PackingResult:
    """
    Pack items into multiple boxes when single box doesn't work
    """
    packed_boxes = []
    remaining_items = items.copy()

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
```

### **Step 4: Efficiency Optimization**

```python
def _efficiency_optimized_packing(self, items: List[Item], available_products: List[dict] = None) -> PackingResult:
    """
    Use Best Fit Decreasing strategy for maximum efficiency
    """
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
```

---

## 💡 INTELLIGENT RECOMMENDATIONS

### **Recommendation Generation**

```python
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
```

---

## 🎯 COMPLETE CALCULATION WORKFLOW

### **1. Input Processing**

```python
def calculate_enhanced_shipping(request: ShippingCalculationRequest, db: Session) -> ShippingCalculationResponse:
    """
    Complete calculation workflow
    """
    # 1. Validate inputs
    validate_inputs(request.items, request.destination_zip, request.service_level)

    # 2. Get available boxes
    available_boxes = get_available_boxes(db, request.customer_id)

    # 3. Get available products for recommendations
    available_products = get_available_products(db, request.customer_id)

    # 4. Run packing algorithm
    packing_algorithm = PackingAlgorithm(available_boxes)
    packing_result = packing_algorithm.pack_items(request.items, available_products)

    # 5. Calculate shipping rates
    zone = get_zone_from_zip(request.destination_zip)
    base_rate = get_shipping_rate(request.destination_zip, request.service_level, packing_result.total_weight, zone)

    # 6. Calculate material rates
    material_rate = calculate_material_rate(packing_result.packed_boxes)

    # 7. Calculate accessory rates
    accessories_rate = calculate_accessories_rate(packing_result.packed_boxes)

    # 8. Calculate total cost
    total_cost = base_rate + material_rate + accessories_rate

    # 9. Build response
    return ShippingCalculationResponse(
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
        packed_boxes=packing_result.packed_boxes,
        recommendations=packing_result.recommendations
    )
```

### **2. Material Rate Calculation**

```python
def calculate_material_rate(packed_boxes: List[PackedBox]) -> float:
    """
    Calculate material rate based on packed boxes
    """
    # Get all materials from database
    materials = db.query(tyson_Materials).all()

    if not materials:
        return 0.0

    # Calculate average material cost
    total_cost = sum(material.cost_per_unit for material in materials)
    average_cost = total_cost / len(materials)

    # Apply to each box
    total_material_rate = 0.0
    for packed_box in packed_boxes:
        # Material cost is proportional to box volume
        box_volume = packed_box.box.length * packed_box.box.width * packed_box.box.height
        material_cost = average_cost * (box_volume / 1000)  # Normalize by 1000 cubic inches
        total_material_rate += material_cost

    return total_material_rate
```

### **3. Accessory Rate Calculation**

```python
def calculate_accessories_rate(packed_boxes: List[PackedBox]) -> float:
    """
    Calculate accessory rate based on packed boxes
    """
    # Get all accessories from database
    accessories = db.query(tyson_Accessories_Charges).all()

    if not accessories:
        return 0.0

    # Calculate total accessory cost
    total_accessory_cost = sum(accessory.cost for accessory in accessories)

    # Apply to each box
    total_accessories_rate = total_accessory_cost * len(packed_boxes)

    return total_accessories_rate
```

---

## 📈 EFFICIENCY METRICS EXPLAINED

### **Volume Utilization**

- **Formula:** `(packed_volume / box_volume) * 100`
- **Range:** 0-100%
- **Target:** >70% for good efficiency
- **Weight in Overall Efficiency:** 70%

### **Weight Efficiency**

- **Formula:** `(packed_weight / box_max_weight) * 100`
- **Range:** 0-100%
- **Target:** >50% for good efficiency
- **Weight in Overall Efficiency:** 30%

### **Overall Efficiency**

- **Formula:** `(volume_utilization * 0.7) + (weight_efficiency * 0.3)`
- **Range:** 0-100%
- **Target:** >60% for good efficiency
- **Purpose:** Combined metric prioritizing volume utilization

---

## 🔍 EXAMPLE CALCULATION

### **Input:**

- **Items:** 3x Tyson Chicken Bites (4" × 9.5" × 11", 1.25 lbs each)
- **Destination:** 75262 (Dallas, TX)
- **Service:** Overnight

### **Step 1: Calculate Total Volume & Weight**

```
Total Volume = 3 × (4 × 9.5 × 11) = 3 × 418 = 1,254 cubic inches
Total Weight = 3 × 1.25 = 3.75 lbs
```

### **Step 2: Find Suitable Box**

```
Available Boxes:
- XS Cube: 12" × 12" × 12" = 1,728 cubic inches, 75 lbs max
- S Cube: 14" × 14" × 14" = 2,744 cubic inches, 75 lbs max

XS Cube is sufficient (1,728 > 1,254 and 75 > 3.75)
```

### **Step 3: Calculate Efficiency**

```
Volume Utilization = (1,254 / 1,728) × 100 = 72.6%
Weight Efficiency = (3.75 / 75) × 100 = 5.0%
Overall Efficiency = (72.6 × 0.7) + (5.0 × 0.3) = 52.3%
```

### **Step 4: Calculate Shipping Rate**

```
Zone = 4 (from ZIP 75262)
Weight = 3.75 lbs
Service = Overnight
Base Rate = $133.24 (from tariff table)
```

### **Step 5: Calculate Material Rate**

```
Average Material Cost = $29.84
Box Volume = 1,728 cubic inches
Material Rate = $29.84 × (1,728 / 1000) = $51.56
```

### **Step 6: Calculate Total Cost**

```
Total Cost = $133.24 + $51.56 + $0.00 = $184.80
```

---

This specification provides the complete technical details of how the CORE OPC Calculator works, including all formulas, algorithms, and calculation methods used in the system.
