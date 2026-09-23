from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

import models
from database import engine, get_db
from schemas import ProductCreate


# Initialize database tables
models.Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="Product Trac API"
)


# Configure frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home route
@app.get("/")
def home():

    return {
        "message": "Product Trac API is running"
    }


# List all products
@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):

    products = db.query(
        models.Product
    ).all()

    return products


# Get one product
@app.get("/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(
        models.Product
    ).filter(
        models.Product.id == product_id
    ).first()

    if product is None:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# Create a product
@app.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    new_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity
    )

    db.add(new_product)

    db.commit()

    db.refresh(new_product)

    return new_product


# Update a product
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = db.query(
        models.Product
    ).filter(
        models.Product.id == product_id
    ).first()

    if existing_product is None:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_product.name = product.name
    existing_product.description = product.description
    existing_product.price = product.price
    existing_product.quantity = product.quantity

    db.commit()

    db.refresh(existing_product)

    return existing_product


# Delete a product
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(
        models.Product
    ).filter(
        models.Product.id == product_id
    ).first()

    if product is None:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)

    db.commit()

    return {
        "message": "Product deleted successfully"
    }