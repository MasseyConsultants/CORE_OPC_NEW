"""
Tyson Tariff database models
"""

from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class TysonZipToZoneMatrix(Base):
    __tablename__ = "tyson_ZipToZone_Matrix"

    id = Column(Integer, primary_key=True, index=True)
    destination_zip = Column(String(10), nullable=False, index=True)
    zone = Column(Integer, nullable=False)

class TysonStandardOvernightServiceCharges(Base):
    __tablename__ = "tyson_Standard_Overnight_Service_Charges"

    id = Column(Integer, primary_key=True, index=True)
    lbs = Column(Float, nullable=False)
    zone_2 = Column(Float, nullable=True)
    zone_3 = Column(Float, nullable=True)
    zone_4 = Column(Float, nullable=True)
    zone_5 = Column(Float, nullable=True)
    zone_6 = Column(Float, nullable=True)
    zone_7 = Column(Float, nullable=True)
    zone_8 = Column(Float, nullable=True)

class TysonSecondDayServiceCharges(Base):
    __tablename__ = "tyson_Second_Day_Service_Charges"

    id = Column(Integer, primary_key=True, index=True)
    lbs = Column(Float, nullable=False)
    zone_2 = Column(Float, nullable=True)
    zone_3 = Column(Float, nullable=True)
    zone_4 = Column(Float, nullable=True)
    zone_5 = Column(Float, nullable=True)
    zone_6 = Column(Float, nullable=True)
    zone_7 = Column(Float, nullable=True)
    zone_8 = Column(Float, nullable=True)

class TysonMaterials(Base):
    __tablename__ = "tyson_Materials"

    id = Column(Integer, primary_key=True, index=True)
    size_lxwxh = Column(String(255), nullable=True)
    refrigerated_overnight_rate = Column(Float, nullable=True)
    frozen_overnight_rate = Column(Float, nullable=True)
    refrigerated_2nd_day_rate = Column(Float, nullable=True)
    frozen_2nd_day_rate = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)

class TysonAccessoriesCharges(Base):
    __tablename__ = "tyson_Accessories_Charges"

    id = Column(Integer, primary_key=True, index=True)
    activity = Column(String(255), nullable=True)
    rate = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
