from sqlalchemy import Column, Integer, String, Float

from database import Base


# Product database table
class Product(Base):

    __tablename__ = "products"

    # Product identifier
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Product details
    name = Column(
        String,
        nullable=False
    )

    description = Column(
        String
    )

    price = Column(
        Float,
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )