# OHDSI 2017 Face to Face Starter Template

## Installation Guide
* [Install Node](https://nodejs.org/en/download/)
* Install Grunt 
		
		`npm install -g grunt`
		
* Install project dependencies (this will download and setup dependencies such as d3 into a `node_modules` directory) 
		
		`npm install`

## Starting the server
* Run in the root directory
	`node .`

## Grunt tasks
* If you want javascript code hints, you can run:
  `grunt jshint`
* If you want to run grunt watch, to run tasks as you make code changes, run:
  `grunt watch`


## Adding new dependencies
* Find the package you wish to install in the [node package manager](https://www.npmjs.com/), then run:
  `npm install <package> --save`

## Conventions
Using a local express server, all your local assets will be in the web directory.
To include new files from `node_modules`, use the `lib` path in your html file.
