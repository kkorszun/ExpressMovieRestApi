# ExpressMovieRestApi
Simple REST API in Express.js

## Table of Contents ##
* [Description](#description)
* [Technologies](#technologies)
* [Usage](#usage)
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
* api-key for 

### Installation ###
Commandline in project directory:

```
npm install
```

### Run ###
Commandline in project directory:

```
npm start
```

## Implementation ##
[expressmovieapi.herokuapp.com](https://expressmovieapi.herokuapp.com) - app on [Heroku](https://heroku.com) 

### Implementation technologies ###
* [Heroku](https://heroku.com) - Cloud Application Platform
* [mLab](https://mlab.com/welcome/) - Database-as-a-Service for MongoDB. App's data base.

