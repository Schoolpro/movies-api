
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies API',
    description: 'Acá podés consultar películas y directores. Para cambiar los datos, iniciá sesión desde /auth/google y después volvé a /api-docs.'
  },
basePath: '/'
};

const outputFile = './swagger.json';
const routes = ['./server.js'];
// Completa los datos que Swagger no puede deducir de las rutas.
swaggerAutogen(outputFile, routes, doc).then((result) => {
  if (!result || !result.data) {
    throw new Error('No se pudo generar la documentación');
  }

  const data = result.data;

  // Así las pruebas usan la misma dirección donde se abrió la página.
  delete data.host;
  delete data.schemes;

  data.definitions = {
    Movie: {
      type: 'object',
      required: ['title', 'director', 'year', 'genre', 'rating', 'language', 'duration'],
      additionalProperties: false,
      properties: {
        title: { type: 'string', example: 'Interstellar' },
        director: { type: 'string', example: 'Christopher Nolan' },
        year: { type: 'integer', minimum: 1888, example: 2014 },
        genre: { type: 'string', example: 'Sci-Fi' },
        rating: { type: 'number', minimum: 0, maximum: 10, example: 9 },
        language: { type: 'string', example: 'English' },
        duration: { type: 'integer', minimum: 1, example: 169 }
      }
    },
    Director: {
      type: 'object',
      required: ['name', 'birthYear', 'nationality', 'biography'],
      additionalProperties: false,
      properties: {
        name: { type: 'string', example: 'Christopher Nolan' },
        birthYear: { type: 'integer', minimum: 1800, maximum: new Date().getFullYear(), example: 1970 },
        nationality: { type: 'string', example: 'British-American' },
        biography: { type: 'string', example: 'Director y guionista.' }
      }
    }
  };

  for (const [path, methods] of Object.entries(data.paths)) {
    const movie = path.startsWith('/movies');
    const director = path.startsWith('/directors');

    if (movie || director) {
      const model = movie ? 'Movie' : 'Director';
      const tag = movie ? 'Películas' : 'Directores';

      for (const [method, operation] of Object.entries(methods)) {
        if (!['get', 'post', 'put', 'delete'].includes(method)) continue;

        operation.tags = [tag];
        operation.produces = ['application/json'];
        operation.responses = operation.responses || {};
        operation.responses['500'] = { description: 'No se pudo completar la solicitud' };

        if (path.includes('{id}')) {
          operation.parameters = (operation.parameters || []).filter(parameter => parameter.in !== 'body');
          const id = operation.parameters.find(parameter => parameter.name === 'id');
          if (id) id.pattern = '^[a-fA-F0-9]{24}$';
          operation.responses['400'] = { description: 'El ID o los datos no son válidos' };
          operation.responses['404'] = { description: 'No se encontró el registro' };
        }

        if (method === 'get') {
          operation.description = path.includes('{id}') ? 'Busca un registro por su ID.' : 'Devuelve todos los registros.';
        } else {
          operation.description = 'Para agregar, editar o borrar datos, primero iniciá sesión desde /auth/google en este navegador y volvé a esta página.';
          operation.responses['401'] = { description: 'Falta iniciar sesión' };
        }

        if (method === 'post' || method === 'put') {
          operation.consumes = ['application/json'];
          operation.parameters = (operation.parameters || []).filter(parameter => parameter.in !== 'body');
          operation.parameters.push({
            name: 'body',
            in: 'body',
            required: true,
            description: 'Completá todos los campos.',
            schema: { $ref: '#/definitions/' + model }
          });
          operation.responses['400'] = { description: 'Revisá los campos enviados' };
        }

        if (method === 'post') {
          operation.responses['201'] = {
            description: 'Registro guardado',
            schema: { type: 'object', properties: { id: { type: 'string' } } }
          };
        }

        if (method === 'put') {
          operation.responses['204'] = { description: 'Registro actualizado, sin cuerpo de respuesta' };
        }

        if (method === 'delete') {
          operation.responses['200'] = { description: 'Registro eliminado' };
        }
      }
    }

    if (path.startsWith('/auth')) {
      for (const operation of Object.values(methods)) {
        operation.tags = ['Sesión'];
      }
    }
  }

  const descriptions = {
    '/auth/google': 'Abrí esta ruta en el navegador para iniciar sesión con Google. No uses Try it out para el login.',
    '/auth/google/callback': 'Google vuelve a esta ruta después de iniciar sesión. No hace falta completarla a mano.',
    '/auth/user': 'Muestra el usuario que inició sesión. Sin sesión responde 401.',
    '/auth/logout': 'Cierra la sesión de esta aplicación y vuelve al inicio.'
  };

  for (const [path, methods] of Object.entries(data.paths)) {
    const description = descriptions[path.replace(/\/$/, '')];
    if (description && methods.get) methods.get.description = description;
  }

  require('fs').writeFileSync(outputFile, JSON.stringify(data, null, 2) + '\n');
});
