# NodeJS, Sequelize, Express Project in Clean-Code Architecture


**Supported version of nodejs-15.13.0**,
**Supported version of sequelize-6.6.5**

- This is a Web application, developed using MVC pattern with Node.js, ExpressJS, and Sequelize ORM. 
- Basic boilerplate for web applications, built on Express.js using the clean-code architecture
- A Sql database is used for data storage, with object modeling provided by Sequelize.
- Supported SQL Databases are - MSSQL, MySql, PostgreSQL 

## Initial
- Configure a basic server in app.js.
- Organize the routes with Express Router.
- Use the mainRoutes in app as middleware.
- Set a final use after the routes, to display a 404 message for the unhandled requests.
1. Install needed Node.js modules:
     ```$ npm install```
2. execute server:
     ```$ npm start```
3. When the app will run successfully,
		- One user with User role,
	    # Default User credentials
		**username** : Jolie_Watsica
		**password** : Q54zo9G6Dw8vwa_
		
		- One user with Admin role,
	    # Default Admin credentials
		**username** : Hans_Padberg4
		**password** : XJqYH4b2OBxzsEE
		

## How to run with Docker ? :
- if you have docker file you can execute following command

- build the image
	```$ docker build --pull --rm -f "Dockerfile" -t <imageName>:latest "." ```
	
- execute the command
	```$ docker run -p 3000:3000 <imageName> ```
	 

## Default Folder structure:

	--project_folder
		--config
		--constants
		--controllers
		--entity
		--helpers
		--jobs
		--logs
		--middleware
		--models
		--postman
		--public
		--routes
		--services
		--utils
		--validation
		--views
		--app.js
		--.env
		--.gitignore
		--.eslintrc.js
## app.js
- Entry point of application.

## config
- Passport strategy for all platforms.
- Based on Auth Model - authentication files has been generated.
- Used .env file and configure the db connection string and port to use in the project.

## constants
- Contains files of constants

## controller
- Includes controller files per model
- Controllers are separated per Platform

     	  -controller
     	        -admin
     	            -model
     	                -index.js
     	                -controller.js
     	        -device
     	          -model
     	                -index.js
     	                -controller.js
     	        -desktop
     	          -model
     	                -index.js
     	                -controller.js
     	        -client
     	          -model
     	                -index.js
     	                -controller.js

## entity
- These are the business objects of your application. These should not be affected by any change external to them, and these should be the most stable code within your application. These can be POJOs, objects with methods, or even data structures.

## helper
- a helper function is used to assist in providing some functionality, which isn't the main goal of the application or class in which it is used.

## jobs
- Cron jobs related Files and configuration

## logs
- Log file

## middleware
- User authentication Middleware based on Roles and permission for Routes' access
- Custom Policy files

## models
- Sequelize Models, as per user defined schema 

## postman
- Postman collection File for Platform based APIs that are generated.
- Import this JSON in Postman to test the APIs.

## public 
- You can add static files like like images, pdf etc.

## routes
- Based on platform,separate folder is generated,within those folders model wise route files are that has model crud APIs' routes.
- index.js file, main file which includes all platform routes.
- Added index files in app.js to access the routes of the application.

## services
     	-jobs
       		-cron job services
     	-auth.js
       		-Logic for JWT Tokenization for user to login into Application using username and password along with otp if required.
       	-dbService.js
       	    - Database related operations
       	     -common Database functionalities
     	  	 -findAll(find all records)
     	  	 -updateByPk(update single record in db by primary key)
     	  	 -deleteByPk(delete single record in db)
     	  	 -createOne(Insert single record in db)
     	  	 -findOne(find single record by query)
     	  	 -softDeleteByPk
     	  	 -updateMany(update records that matches query)
             -deleteMany(delete record that matches query)
     	  	 -createMany(insert multiple records in db)
     	  	 -count (count records that matches query)
       	    
## utils
     	-common.js
       		-converted object to enum function.
     	-messages.js
  		    -static messages that are sent with response - contains status and Data
	    -responseCode.js
  		    -codes for responses
	    -validateRequest.js
  		    -validate schema based on joi validation

## validation
- Joi validations files.
- Files are separated by models.

## views
- Add ejs files