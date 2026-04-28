# CafeZero Frontend - Senior Engineer Implementation Plan

This document outlines the professional architecture for the CafeZero frontend, focusing on scalability, clean code, and API consumption.

## 1. Folder Structure Tree
A modular structure ensures that the project remains manageable as it grows.

```text
client/
├── src/
│   ├── assets/             # Global styles (CSS/SCSS), images, brand assets
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Navbar, Footer, Sidebar
│   │   ├── food/           # FoodCard, CategoryFilter, FoodGrid
│   │   ├── cart/           # CartDrawer, CartItem
│   │   └── common/         # Button, Input, Loader, Toast, Skeleton
│   ├── context/            # Global state (AuthContext, CartContext)
│   ├── hooks/              # Custom hooks (useAuth, useCart, useFetch)
│   ├── pages/              # Page components (Home, Details, Auth, Orders)
│   ├── services/           # API communication (axios instances & endpoints)
│   ├── utils/              # Formatting, constants, validation helpers
│   ├── App.js              # Routing and Context Providers
│   └── index.js            # Main entry point
```

## 2. Component Breakdown

### Layout Components
- **Navbar**: Sticky header with logo, search bar, Cart icon (with count), and Profile/Auth toggle.
- **Footer**: Simple links and social media icons.

### Feature Components
- **FoodCard**: Displays food image, name, price, rating, and a prominent "Add to Cart" (+) button.
- **CategoryFilter**: Horizontal scrollable list of food categories (Pizza, Burger, Sushi, etc.).
- **CartDrawer/CartItem**: A slide-in drawer showing selected items, quantity controls (+/-), and a "Checkout" button.
- **Loader / Skeleton**: UI feedback for data fetching states.

## 3. Page Layouts

- **Home**: Hero section (brand message) -> Category Filter -> Dynamic Food Grid.
- **Food Details**: Large image -> Title & Description -> Ingredients/Nutrients -> Price & Add to Cart.
- **Login / Signup**: Unified auth page with toggle and Google OAuth integration.
- **Orders**: History of previous orders with status (Pending/Delivered) and re-order button.

## 4. State Management & API
- **Context API**: Used for `AuthContext` (managing user sessions/tokens) and `CartContext` (managing cart items across pages).
- **Axios Service**: A central `api.js` file with `baseURL` and interceptors for adding Auth headers.

## 5. Wireframes (ASCII)

### Home Page
```text
[ Navbar: Logo | [ Search... ] | Cart(3) | Profile ]
-----------------------------------------------------
|                                                   |
|      HERO: Delicious Food Delivered To You        |
|                                                   |
-----------------------------------------------------
| [All] [Pizza] [Burger] [Sushi] [Dessert] <Scroll> |
-----------------------------------------------------
| [ Food Card ]  [ Food Card ]  [ Food Card ]       |
| [ Food Card ]  [ Food Card ]  [ Food Card ]       |
-----------------------------------------------------
```

### Food Details
```text
[ Navbar ]
-----------------------------------------------------
|                [ Back Button ]                    |
|  _______________________________________________  |
| |                |                              | |
| |   [ FOOD IMG ] |    [ NAME ] [Rating]         | |
| |                |    [ PRICE ]                 | |
| |                |    [ DESCRIPTION ]           | |
| |________________|    [ ADD TO CART BUTTON ]    | |
|__________________|______________________________| |
-----------------------------------------------------
```

### Cart UI (Slide-in)
```text
           [ CART ] [X]
-------------------------
| [ Food Item ] [ - 1 + ] |
| [ Food Item ] [ - 2 + ] |
| [ Food Item ] [ - 1 + ] |
-------------------------
| Subtotal:      $45.00   |
| Delivery:       $2.00   |
| TOTAL:         $47.00   |
-------------------------
|      [ CHECKOUT ]       |
-------------------------
```

## 6. Implementation Notes
- **Color Palette**: Primary `#FF6B00` (Orange), Secondary `#1A1A1A` (Dark), Background `#FFFFFF`.
- **API Strategy**: Use custom hooks for data fetching to decouple UI from API logic.
- **Persistence**: Store cart items in `localStorage` within the CartContext to prevent data loss on refresh.
- **Mobile First**: Use Flexbox and CSS Grid to ensure the food grid is responsive.
