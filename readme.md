# ECMap/ECNav

ECMap/Nav is a web application that allows users to find specific rooms within the engineering center on the campus of University of Colorado Boulder, written primarily in Javascript, HTML, CSS, and MySQL.  Search results will render a map image with an idicator directing them to the correct room.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

To run this application locally, you need a local installation of Node.js.  You will also need an account and developer ID/keys to use the Auth0 framework.  Clone the repo to your local machine and navigate to the root directory of the repo.  In this directory create a file named .env.  Inside of your .env file you need to define the following variables:

'''
AUTH0_CLIENT_ID=your specific client ID
AUTH0_DOMAIN=your specific auth0 server
AUTH0_CLIENT_SECRET=your secret goes here
'''

Following this, from the root directory of the repo run:

'''
PORT=3000 nano server.js
'''

## Deployment

This application is designed to run on the Heroku platform, however if dependencies are met it will run on any server with MySQL, Node.js (and all included libraries), and Auth0.

## Built With

* [Node.js](http://www.nodejs.org/) - Server protocols, search functionality.
* [Express](https://www.expressjs.com/) - Web application framework for Node.js.
* [Auth0](https://www.auth0.com/) - One-token based authentication system.

## Contributing

Please feel free to submit pull requests to the team.  All requests will be reviewed and tested on branch before merging.

## Authors

* **Taylor Ellis** - Javascript/HTML/CSS
* **Robbie Tennant** - Javascript/HTML/CSS
* **Sam Fitz** - MySQL
* **Alyvia Hildebrand** - Imaging/CAD
* **Jason Hong** - MySQL
* **Steven James McDonald** - Javascript/HTML/CSS

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

