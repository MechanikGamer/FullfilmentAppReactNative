# E-Commerce Warehouse Packing Application

Welcome to the repository of a bespoke packing application designed to optimize the order fulfillment process for an online store powered by WordPress. This project embodies a full-stack solution, with a mobile app developed in React Native for the front end, and a robust backend built with Express, Node.js, and MongoDB.

## Key Features

- **WordPress Integration**: Seamlessly fetches orders from the online store through a dedicated API, streamlining the workflow for the warehouse team.
- **Secure User Authentication**: Utilizes JWT (JSON Web Tokens) to ensure that access to the application is securely managed, allowing only authenticated users to view and process orders.
- **Comprehensive Order Management**: Offers a detailed view of orders, including product SKUs, descriptions, and specific packing instructions, to facilitate an efficient packing process.
- **Label Printing Capability**: Enables the printing of shipping labels directly within the app, further enhancing the efficiency of the packing process.
- **API-Driven Order Updates**: Automatically notifies the WordPress store and updates the order status upon packing completion, removing packed orders from the app's queue.
- **XML-Based Product Updates**: Integrates with the wholesaler's XML API for real-time product information updates, ensuring the warehouse has access to the latest data.

## Localization Solution

To address the language barrier and simplify operations in the Polish fulfillment warehouse, the application fetches product names and EANs from the wholesaler's XML. This approach bypasses the need to rely on product information in Scandinavian languages from WordPress, making the packing process more intuitive for the local team.

## Dive In

Explore the repository to delve into the codebase, understand the challenges encountered, and the innovative solutions deployed. Your insights, feedback, and contributions are welcome and highly appreciated!

![Screenshot](/images/screen1.png "Screenshot")
![Screenshot](/images/main.png "Screenshot")
![Screenshot](/images/screen2.png "Screenshot")

To Run:

```
npm i
```

```
npx expo start
```

In folder API create .env file

```
PORT=
DATABASE_URL=
TOKEN_SECRET=
PRODUCTS_A1_API_URL=
WP_API_URL=
WP_API_KEY=
WP_API_SECRET=c
CRON_INTERVAL=*/55 * * * *
CRON_ACTION_INTERVAL=*/60 * * * *
CRON_ACTION_INTERVAL2=0 2 * * *
BACKEND_URL=
S3BUCKET_URL=

```

Main .env

```
BACKEND_API_URL=http://localhost:8000

## 0.03A

Main colors: #DC3C5E
Secondarycolor #007FFF

Frontend:

Backend:

```

## 0.02A

Main colors: #DC3C5E
Secondarycolor #007FFF

Frontend:

- Fixed manual packing button
- Added Print label
- Added Cancel logic when packing
- Styling when items are packed set to green
- Added Packing Status in View Order
- Added View Order Screen and Start Packing Screen
- Packing Side
- Packing Side added drag to refresh orders

Backend:

- Added daly delete labels
- Added PrintLabel api backend
- Added routing for packing and Models
- Api to download orders from backend
- Download Products from Action

## 0.01A

Main colors: #DC3C5E
Secondarycolor #007FFF

Frontend:

- Tabs after login
- Register View
- Login View (Working)
- Installed Expo Router

Backend:

- Added auto Order download from Woocomerce
- Login Account
- Register Account
- Created Backend
