"""
Enhanced Shipping Calculation API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.packing import ShippingCalculationRequest, ShippingCalculationResponse
from app.services.calculation_service import CalculationService
from app.auth.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/calculate", response_model=ShippingCalculationResponse)
def calculate_shipping(
    request: ShippingCalculationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculate optimal shipping solution using 3D Bin Packing Problem algorithm
    """
    print("=== BACKEND CALCULATION DEBUG START ===")
    print(f"Request received: {request}")
    print(f"Current user: {current_user}")
    print(f"User customer ID: {current_user.customerId}")

    try:
        # Check if debug mode is enabled in system settings
        from app.models.system_settings import SystemSettings
        settings = db.query(SystemSettings).first()
        debug_mode = settings.debugMode if settings else False
        print(f"Debug mode enabled: {debug_mode}")

        calculation_service = CalculationService(db)
        print("Calculation service created successfully")

        result = calculation_service.calculate_enhanced_shipping(request, debug_mode=debug_mode)
        print("Calculation completed successfully")
        print(f"Result: {result}")

        print("=== BACKEND CALCULATION DEBUG END - SUCCESS ===")
        return result
    except ValueError as e:
        print(f"=== BACKEND CALCULATION DEBUG END - VALIDATION ERROR ===")
        print(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        print(f"=== BACKEND CALCULATION DEBUG END - GENERAL ERROR ===")
        print(f"General error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Calculation failed: {str(e)}"
        )

@router.get("/health")
def calculation_health_check():
    """
    Health check for calculation service
    """
    return {"status": "healthy", "service": "calculation"}
