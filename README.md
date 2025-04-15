# Reveal SDK Node.js & Cube.dev REST API Example

This repository demonstrates how to integrate the Reveal SDK with a Cube.dev REST API endpoint using a Node.js backend server. It includes:

1.  A **Node.js/Express server** that acts as the backend for the Reveal SDK, handling data source definition and authentication for a Cube.dev REST API.
2.  A **simple HTML client** that embeds the Reveal SDK web component and configures it to use the Node.js server.

## Video
[![Video Title](https://img.youtube.com/vi/jVrhdWZA11o/hqdefault.jpg)](http://www.youtube.com/watch?v=jVrhdWZA11o)

## Features

* Node.js backend implementation for Reveal SDK (`reveal-sdk-node`).
* Connects to a Cube.dev REST API endpoint as a data source.
* Dynamically generates the Cube.dev REST API URL based on predefined dimensions and measures.
* Includes a placeholder for Bearer Token authentication required by Cube.dev's REST API.
* Provides a basic HTML/JavaScript client showing how to embed and configure the `RevealView`.
* Configures the client-side Reveal SDK to recognize the custom "Cube.dev" REST data source defined on the server.
* Starts the RevealView in edit mode (`startInEditMode = true`).

## Prerequisites

* **Node.js and npm (or yarn):** Required to run the server application. Download from [https://nodejs.org/](https://nodejs.org/).
* **Cube.dev Deployment:** You need a running Cube.dev instance with the REST API enabled.
* **Cube.dev REST API Endpoint URL:** The base URL for your Cube.dev REST API (e.g., `https://your-instance.cubecloudapp.dev/cubejs-api/v1/load`).
* **Cube.dev Bearer Token:** A valid Bearer token to authenticate requests to your Cube.dev REST API. You can usually generate this within your Cube Cloud deployment settings or configure it in your self-hosted Cube.js setup.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    Navigate to the directory containing `package.json` (likely the root or a `server` sub-directory) and run:
    ```bash
    npm install
    # or
    # yarn install
    ```

## Configuration

You **must** configure the server before running the application:

1.  **Edit the Server File** (e.g., `server.js` or `app.js`):
    * **Bearer Token:** Locate the `authenticationProvider` function and replace the placeholder string `"Enter Your Bearer Token Here"` with your actual Cube.dev REST API Bearer token:
        ```javascript
        const authenticationProvider = async (userContext, dataSource) => {
            // ********** UPDATE THIS LINE **********
            return new reveal.RVBearerTokenDataSourceCredential("YOUR_ACTUAL_CUBE_DEV_BEARER_TOKEN");
            // *************************************
        }
        ```
    * **(Optional) Cube.dev URL & Query:** If your Cube.dev REST API base URL or the specific query (dimensions/measures) you want to use differs from the example, update the `generateUrl` function accordingly:
        ```javascript
        const generateUrl = () => {
            // ********** UPDATE IF NEEDED **********
            const baseUrl = '[https://your-instance.cubecloudapp.dev/cubejs-api/v1/load](https://your-instance.cubecloudapp.dev/cubejs-api/v1/load)'; // Update Base URL
            const queryData = {
              "dimensions": [ /* Your Dimensions */ ],
              "measures": [ /* Your Measures */ ]
            };
            // *************************************
            const queryString = JSON.stringify(queryData);
            const encodedQuery = encodeURIComponent(queryString);
            const url = `${baseUrl}?query=${encodedQuery}`;
            return url;
        }
        ```

2.  **Verify Client Configuration** (e.g., `index.html`):
    * Ensure the `$.ig.RevealSdkSettings.setBaseUrl(...)` call points to the correct address and port where your Node.js server will be running (default is `http://localhost:5111/`).

## Running the Application

1.  **Start the Node.js Server:**
    From your terminal, in the directory with the server file, run:
    ```bash
    node server.js
    # Or your specific server entry point file
    ```
    You should see the message: `Reveal server accepting http requests`

2.  **Open the HTML Client:**
    Open the `index.html` file (or your client HTML file) in your web browser. You can usually do this by double-clicking the file or using a simple local web server extension if needed (like VS Code's Live Server).

    The Reveal SDK component should load, starting in edit mode. When you attempt to add a new visualization and select the "Cube.dev" data source, the client will communicate with the Node.js backend, which will provide the configured Cube.dev URL and authentication token to fetch the data.

## How it Works

1.  **Client Initialization:** The `index.html` page loads the Reveal SDK JS library and initializes `RevealView`. It sets the backend URL (`setBaseUrl`) to point to the Node.js server.
2.  **Data Source Definition (Client):** The `onDataSourcesRequested` callback on the client defines the *type* of data source available in the UI. It creates a `RVRESTDataSource` instance named "Cube.dev". This tells the Reveal UI to show this option, but the actual connection details are handled server-side.
3.  **Data Request:** When the user selects the "Cube.dev" data source in the Reveal UI, the client SDK sends a request to the Node.js backend.
4.  **Server-Side Providers:**
    * `dataSourceProvider`: Intercepts the request for the REST data source. It calls `generateUrl` to get the specific Cube.dev REST API endpoint URL (including the query) and assigns it to the `dataSource.url` property.
    * `authenticationProvider`: Intercepts the request and provides the necessary `RVBearerTokenDataSourceCredential` containing the Cube.dev Bearer token.
    * `dataSourceItemProvider`: Ensures the URL from the `dataSource` is correctly applied to the specific `dataSourceItem` being processed.
5.  **Data Fetching:** The Reveal SDK backend (running within the Node.js server) uses the provided URL and credentials to make the actual HTTP request to the Cube.dev REST API.
6.  **Visualization:** Reveal SDK processes the response from Cube.dev and renders the data within the `RevealView` component on the client.

## Important Notes

* **CORS:** The server uses `app.use(cors());` without specific origin configuration. This is generally **unsafe for production**. In a production environment, configure the `cors` middleware to allow requests only from your specific frontend application's domain.
* **Security:** The Cube.dev Bearer token is currently hardcoded in the server file. For production, **never hardcode sensitive credentials**. Use environment variables, secrets management systems (like AWS Secrets Manager, Azure Key Vault, HashiCorp Vault), or other secure configuration methods.
* **Hardcoded Query:** The `generateUrl` function uses a fixed Cube.dev query. In a real application, you might want to make this more dynamic based on user context or UI selections.
* **Error Handling:** The provided code has minimal error handling. Robust applications should include proper error handling for network requests, authentication failures, and unexpected data formats.
