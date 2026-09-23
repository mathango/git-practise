from pydantic import BaseModel, Field


# Product request validation schema
class ProductCreate(BaseModel):

    name: str = Field(
        min_length=1
    )

    description: str = ""

    price: float = Field(
        ge=0
    )

    quantity: int = Field(
        ge=0
    )