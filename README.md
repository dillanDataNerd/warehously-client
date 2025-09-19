# Warehously – Client

## [See the App!](https://warehously.netlify.app/)

## Description

Frontend web application for **Warehously**, the warehouse management system.  
Provides user interface for authentication, inventory management, order creation, editing, and viewing.  

#### [Client Repo here](https://github.com/dillanDataNerd/warehously-client)  
#### [Server Repo here](https://github.com/dillanDataNerd/warehously-server)

## Technologies & Libraries used

- React  
- Vite  
- JavaScript  
- React Router  
- Axios  
- Material ui 

# Client Structure

## User Stories

- **sign up** – As a user I want to register for an account so I can use the application.  
- **login** – As a user I want to log in so I can access protected pages.  
- **view inventory** – As a user I want to see a list of inventory items so I know what stock exists.  
- **search inventory** – As a user I want to filter/search inventory by name or SKU.  
- **view inventory details** – As a user I want to click into an item to see more details and edit or delete if permitted.  
- **add inventory item** – As a user I want to create a new inventory item.  
- **view orders** – As a user I want to see a list of orders with status.  
- **create order** – As a user I want to create a new order and add order lines. This will update the actual stock that I have available  
- **edit order** – As a user I want to update an existing order and update the inventory with the changes.  
- **view order details** – As a user I want to see details of a specific order.  
- **logout** – As a user I want to log out so my account is secure.  

## Client Routes

## React Router Routes (React App)
| Path                   | Page               | Components               | Permissions            | Behavior                                                      |
|-------------------------|--------------------|---------------------------|--------------------------|---------------------------------------------------------------|
| `/`                     | Home / Dashboard   | InventoryList, OrderList  | public or `IsPrivate`    | Redirect to login if not logged in                           |
| `/signup`               | Signup             | SignupForm                | anon only `<IsAnon>`     | After signup → redirect to dashboard                         |
| `/login`                | Login              | LoginForm                 | anon only `<IsAnon>`     | After login → dashboard                                       |
| `/inventory`            | Inventory List     | InventoryCard / Table     | user only `<IsPrivate>`   | View all inventory items                                      |
| `/inventory/:id`        | Inventory Detail    | InventoryEditForm, Detail  | user only `<IsPrivate>`   | View, edit, delete item                                       |
| `/inventory/new`        | Add Inventory       | InventoryForm             | user only `<IsPrivate>`   | Create a new inventory                                       |
| `/orders`               | Orders List         | OrderCard / Table         | user only `<IsPrivate>`   | View all orders with status                                   |
| `/orders/new`           | New Order           | OrderForm                 | user only `<IsPrivate>`   | Create a new order                                           |
| `/orders/:id`           | Order Detail        | OrderDetail, OrderLines    | user only `<IsPrivate>`   | View/edit order and its lines                                 |

## Other Components

- Navbar  
- Footer  
- ProtectedRoute / Route guards (`IsPrivate`, `IsAnon`)  
- Forms (InventoryForm, OrderForm, OrderLineForm)  
- Tables (Inventory, Order)  
- Loading spinners / Toast notifications / Error banners  

## Services

- **Auth Service**  
  - `auth.signup(data)`  
  - `auth.login(data)`  
  - `auth.verify()`  

- **Inventory Service**  
  - `getInventory(query)`  
  - `getInventoryById(id)`  
  - `createInventory(item)`  
  - `updateInventory(id, item)`  
  - `deleteInventory(id)`  

- **Orders Service**  
  - `getOrders(status?)`  
  - `getOrderById(id)`  
  - `createOrder(orderData)`  
  - `updateOrder(id, orderData)`  
  - `deleteOrder(id)`  

- **Order Lines Service**  
  - `addOrderLine(orderId, lineData)`  
  - `updateOrderLine(lineId, lineData)`  
  - `deleteOrderLine(lineId)`  

## Context

- `AuthContext` – handles current user, token, login state, logout

## Client feature backlog
- Make an admin only section where they can update user roles
- Create a restocking tables shipment so we can cleany add back inventory
- Make a log of orderlines associated to inventory in the inventory details page similar to the list of orderlines associated to an order

### Collaborators

[Dillan](https://github.com/dillanDataNerd)
