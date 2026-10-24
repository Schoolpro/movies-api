
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies API',
    description: 'Movies API for CSE 341 Project 2'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger.json';
const routes = ['./server.js'];
swaggerAutogen(outputFile, routes, doc);
