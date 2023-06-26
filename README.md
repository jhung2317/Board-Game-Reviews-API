# My Northcoders Games API
## Purpose
This API is a back-end service for the purpose of accessing application data programmatically so as to provide information to the front-end architecture.

## Toolkit
This API is built in Node.JS environment, using PostgreSQL as database and node-postgres as connection, tested with Jest.

MVC architectural pattern is implemented.

## Set up environment
For security, the environment files are not included in this repository. In order to run this API, please follow the instructions as below:

## Run npm install
create '.env.test' and '.env.development' on the root directory.
update the aforesaid env files with reference of '.env.example'.
the database_name can be found inside ./db/setup.sql.
List of available endpoints for the API
To get the list of available endpoints, please use GET to /api. The response will ccontain the following information:

## Description of the endpoint
acceptable query options
format of the request body for POST/PUT/PATCH
examples of responses
