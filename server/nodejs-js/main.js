const express = require('express');
const cors = require('cors');
const reveal = require('reveal-sdk-node');

const app = express();

app.use(cors()); // DEVELOPMENT only! In production, configure appropriately.

const generateUrl = () => {
	const baseUrl = 'https://disastrous-spencerville.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1/load';
	//get this from the Cube.dev playground under the Rest API tab
	const queryData = {
		"dimensions": [
		  "orders.status",
		  "orders.users_age",
		  "orders.users_city",
		  "orders.users_state"
		],
		"measures": [
		  "orders.completed_count",
		  "orders.completed_percentage",
		  "orders.count",
		  "orders.dau",
		  "orders.mau",
		  "orders.total",
		  "orders.wau"
		]
	  }
	const queryString = JSON.stringify(queryData); // Convert object to JSON string
	const encodedQuery = encodeURIComponent(queryString); // URL-encode the string
	const url = `${baseUrl}?query=${encodedQuery}`; // Append the encoded query string to the base URL
	return url;
}

const authenticationProvider = async (userContext, dataSource) => {
	return new reveal.RVBearerTokenDataSourceCredential("Enter Your Bearer Token Here");
}

const dataSourceItemProvider = async (userContext, dataSourceItem) => {
	await dataSourceProvider(userContext, dataSourceItem.dataSource);
	if (dataSourceItem instanceof reveal.RVRESTDataSourceItem) {
		dataSourceItem.url = dataSourceItem.dataSource.url;	
	}
	return dataSourceItem;
}

const dataSourceProvider = async (userContext, dataSource) => {
	if (dataSource instanceof reveal.RVRESTDataSource) {
		dataSource.url = generateUrl();
	}
	return dataSource;
}

const revealOptions = {
    authenticationProvider: authenticationProvider,
    dataSourceProvider: dataSourceProvider,
	dataSourceItemProvider: dataSourceItemProvider,
}
app.use('/', reveal(revealOptions));

app.listen(5111, () => {
    console.log(`Reveal server accepting http requests`);
});