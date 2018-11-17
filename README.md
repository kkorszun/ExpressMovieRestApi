# ExpressMovieRestApi
Simple REST API in Express.js

## Table of Contents ##
* [Description](#description)
* [Technologies](#technologies)
* [Usage](#usage)
* [Implementation](#implementation) 
## Description ##
REST API - database interacting with external API.
ROUTES :

__POST /movies__ -  Request body contains only movie title. Based on passed title, other movie details are fetched from external base and saved to application database.

__GET /movies__ - Serve list of all movies already present in application database.

__POST /comments__  - Request contains ID of movie already present in database, and comment text body. Comment is saved to application database and returned in request response.

__GET /comments__ - Serve list of all comments present in application database.

__GET /comments/:id__ - Serve list of comments associated with given movie id.


## Technologies ##
### App logic ###
* [Node.js](https://nodejs.org/) - application  server
* [Express](https://expressjs.com) - application  framework
* [body-parser](https://www.npmjs.com/package/body-parser) - body parsing middleware
* [bl](https://www.npmjs.com/package/bl) - Node.js Buffer list collector, in app collect whole response data from () response 

### APIs ###
* [OMDb API](http://www.omdbapi.com) - RESTful web service to obtain movie information

### Database ###
* [MongoDB](https://www.mongodb.com) - database
* [mongoose](https://mongoosejs.com) - object modeling for node.js

### Other ###
* [ESLint](https://eslint.org) - linting utility
* [dotenv](https://www.npmjs.com/package/dotenv) - environment variables loading


## Usage ##
### Requirements ###
* Node.js installed
* Npm installed
* Internet connection
* MongoDB base (as address) (local or external) 
* api-key for [OMDb API](http://www.omdbapi.com)

### Installation ###
Commandline in project directory:

```
npm install
```

### Run ###
#### environment variables ####
* PORT - http port
* DEFAULT_DB - if value other than "false" app uses hardcoded mongo address
* DB_HOST - mongoDB address with placeholders for user, password and base name
* DB_USER - db user
* DB_PASS - db user's password
* DB_NAME - db's name
* API_KEY - api-key for [OMDb API](http://www.omdbapi.com)

Commandline in project directory, environment variable API_KEY is required :

```
npm start
```

### Tests ###
Run tests: 

Commandline in project directory
```
npm test
```

## Implementation ##
[expressmovieapi.herokuapp.com](https://expressmovieapi.herokuapp.com) - app on [Heroku](https://heroku.com) 

### Implementation technologies ###
* [Heroku](https://heroku.com) - Cloud Application Platform
* [mLab](https://mlab.com/welcome/) - Database-as-a-Service for MongoDB. App's data base.

