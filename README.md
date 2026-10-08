# Item & Purchase Management System

A full-stack web application for managing item types, items, stock, and purchases.

The application provides interfaces for managing inventory and recording purchases. It maintains purchase history and automatically updates item stock when purchases are created or modified.

## Technologies Used

### Frontend

* React
* Vite
* Axios
* React Router DOM
* CSS

### Backend

* Node.js
* Express.js
* MySQL
* mysql2
* CORS
* dotenv

## Features

### Dashboard

* View total number of items
* View total active items
* View total purchases
* View out-of-stock items

### Item Type Management

* Create item types
* View item types
* Update item types
* Delete item types
* Prevent deletion of item types that are currently being used

### Item Management

* Create items
* View all items
* View item details
* Update items
* Activate and deactivate items
* Delete items
* Track current stock
* Display stock availability

### Stock Availability

The system displays item availability based on current stock:

* **In Stock** - Stock greater than 5
* **Low Stock** - Stock between 1 and 5
* **Out of Stock** - Stock equal to 0

### Purchase Management

* Create purchases
* Use unique Order IDs
* Add multiple items to one purchase
* Remove items before submitting a purchase
* Validate item availability
* Validate available stock
* Deduct stock after purchase
* View purchase details
* Update purchase quantities
* Automatically adjust stock when purchase quantities are changed
* Preserve purchase history
* Purchases cannot be deleted

## Business Rules

### Item Rules

* Item name is required.
* Item type is required.
* Purchase date is required.
* Stock cannot be negative.
* Item type must exist before creating an item.
* Items can be Active or Inactive.
* Inactive items cannot be selected for new purchases.
* If an item has purchase history, it cannot be permanently deleted.
* Items with purchase history are marked as Inactive instead.

### Purchase Rules

* Order ID is required.
* Order ID must be unique.
* Purchase date is required.
* At least one item must be added to a purchase.
* Duplicate items cannot be added to the same purchase.
* Selected item must exist.
* Selected item must be Active.
* Quantity must be a positive integer.
* Quantity cannot be greater than available stock.
* Stock cannot become negative.
* Purchase history cannot be deleted.

## Stock Management

When a purchase is created, the purchased quantity is deducted from the item's stock.

Example:

```text
Initial Stock = 20
Purchased Quantity = 5

Updated Stock = 20 - 5
              = 15
```

When a purchase is updated, the system adjusts stock based on the difference between the old and new quantity.

Example:

```text
Old Quantity = 3
New Quantity = 5

Difference = 5 - 3
           = 2

Stock decreases by 2
```

If the quantity changes from 5 to 2:

```text
Old Quantity = 5
New Quantity = 2

Difference = 2 - 5
           = -3

Stock increases by 3
```

## Database Setup

A complete database schema is provided in:

```text
database.sql
```

### Step 1: Create the Database

Open MySQL and run the contents of:

```text
database.sql
```

The script creates the database:

```text
item_purchase_management
```

and all required tables.

### Step 2: Configure Database Connection

Open:

```text
backend/db/connection.js
```

Update the MySQL password if required.

Example:

```js
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "YOUR_PASSWORD",
    database: "item_purchase_management"
});
```

If your MySQL installation does not use a password:

```js
password: ""
```

Do not commit your actual database password to GitHub.

## Backend Setup

Open a terminal in the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:8000
```

## Frontend Setup

Open another terminal in the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Vite will display the frontend URL in the terminal.

Usually it will be:

```text
http://localhost:5173
```

## Project Structure

```text
item_purchase_management/
│
├── backend/
│   ├── controllers/
│   │   ├── itemController.js
│   │   ├── itemTypeController.js
│   │   └── purchaseController.js
│   │
│   ├── routes/
│   │   ├── items.js
│   │   ├── itemTypes.js
│   │   └── purchases.js
│   │
│   ├── db/
│   │   ├── connection.js
│   │   └── init.js
│   │
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Items.jsx
│   │   │   ├── AddItem.jsx
│   │   │   ├── EditItem.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   ├── ItemTypes.jsx
│   │   │   ├── Purchases.jsx
│   │   │   ├── AddPurchase.jsx
│   │   │   ├── EditPurchase.jsx
│   │   │   └── PurchaseDetails.jsx
│   │   │
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── database.sql
└── README.md
```

## Application Flow

```text
Dashboard
   |
   +-------------------+
   |                   |
   v                   v
Item Types           Items
   |                   |
   |                   +-- Create Item
   |                   +-- View Details
   +-- Create          +-- Update
   +-- Update          +-- Activate/Deactivate
   +-- Delete          +-- Delete
                       |
                       v
                     Stock
                       |
                       v
                   Purchases
                       |
                       +-- Create Purchase
                       +-- Add Multiple Items
                       +-- Validate Stock
                       +-- Deduct Stock
                       +-- View Details
                       +-- Update Purchase
                       +-- Adjust Stock
```

### Purchase Flow

```text
Create Purchase
       |
       v
Select Active Items
       |
       v
Enter Quantities
       |
       v
Validate Items and Stock
       |
       v
Create Purchase
       |
       v
Deduct Stock
       |
       v
Save Purchase History
```

## API Documentation

### Item APIs

#### Get All Items

```http
GET /items
```

Returns all items along with their item type.

#### Get Item By ID

```http
GET /items/:id
```

Example:

```http
GET /items/1
```

#### Create Item

```http
POST /items
```

Request body:

```json
{
    "name": "Laptop",
    "purchase_date": "2026-10-08",
    "stock_available": 10,
    "item_type_id": 11,
    "active": true
}
```

#### Update Item

```http
PUT /items/:id
```

Request body:

```json
{
    "name": "Laptop",
    "purchase_date": "2026-10-08",
    "stock_available": 15,
    "item_type_id": 11,
    "active": true
}
```

#### Delete Item

```http
DELETE /items/:id
```

If the item has no purchase history, it can be permanently deleted.

If the item has purchase history, it is marked as inactive instead.

### Item Type APIs

#### Get Item Types

```http
GET /item-types
```

#### Create Item Type

```http
POST /item-types
```

Request body:

```json
{
    "type_name": "Electronics"
}
```

#### Update Item Type

```http
PUT /item-types/:id
```

Request body:

```json
{
    "type_name": "Electronic Devices"
}
```

#### Delete Item Type

```http
DELETE /item-types/:id
```

An item type cannot be deleted if it is currently being used by an item.

### Purchase APIs

#### Get All Purchases

```http
GET /purchases
```

#### Get Purchase Details

```http
GET /purchases/:id
```

Returns:

* Order ID
* Purchase date
* Item name
* Item type
* Quantity
* Current stock

#### Create Purchase

```http
POST /purchases
```

Example request:

```json
{
    "order_id": "ORD001",
    "purchase_date": "2026-10-08",
    "items": [
        {
            "item_id": 1,
            "quantity": 2
        },
        {
            "item_id": 2,
            "quantity": 3
        }
    ]
}
```

Multiple items can be included in one purchase.

#### Update Purchase

```http
PUT /purchases/:id
```

Example request:

```json
{
    "items": [
        {
            "item_id": 1,
            "quantity": 5
        },
        {
            "item_id": 2,
            "quantity": 2
        }
    ]
}
```

The system adjusts item stock according to the difference between the old and new quantities.

## Transaction Handling

Purchase creation and purchase updates use database transactions to maintain stock consistency.

The purchase creation process is:

```text
BEGIN TRANSACTION
       |
       v
Validate items and quantities
       |
       v
Create purchase
       |
       v
Create purchase items
       |
       v
Deduct item stock
       |
       v
COMMIT
```

If an error occurs, the transaction is rolled back.

```text
ROLLBACK
```

This prevents incomplete purchases and incorrect stock updates.

## HTTP Status Codes

| Status Code | Meaning                             |
| ----------- | ----------------------------------- |
| 200         | Request successful                  |
| 201         | Resource created                    |
| 400         | Invalid request or validation error |
| 404         | Resource not found                  |
| 409         | Conflict                            |
| 500         | Internal server error               |

## Error Handling

The application handles common validation and business rule errors including:

* Missing item name
* Missing item type
* Invalid item type
* Invalid item ID
* Invalid purchase date
* Negative stock
* Missing Order ID
* Duplicate Order ID
* Duplicate items in a purchase
* Invalid quantity
* Insufficient stock
* Inactive items
* Missing purchase
* Attempting to delete a protected item type

## Testing

The backend has been tested for:

* Item creation
* Item update
* Item deletion
* Item activation/deactivation
* Item type management
* Purchase creation
* Multiple items in one purchase
* Duplicate Order ID validation
* Duplicate item validation
* Quantity validation
* Insufficient stock validation
* Purchase details
* Purchase update
* Stock adjustment after purchase update
* Transaction handling

## Running the Complete Application

### Terminal 1 - Backend

```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

Make sure MySQL is running before starting the backend.

## Important Notes

* MySQL must be running before starting the backend.
* The backend runs on port `8000`.
* The frontend communicates with the backend using Axios.
* Purchase records are never deleted.
* Item stock is automatically updated when purchases are created or modified.
* An item with purchase history is retained for historical records and marked inactive instead of being permanently deleted.
* Do not commit database passwords or other sensitive credentials to GitHub.

## Author

**Shaik Resham Afroz**
