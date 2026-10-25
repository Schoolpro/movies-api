
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies API',
    description: 'Movies API for CSE 341 Project 2'
  },
host: 'movies-api-toeb.onrender.com',
schemes: ['https']
};

const outputFile = './swagger.json';
const routes = ['./server.js'];
swaggerAutogen(outputFile, routes, doc);
