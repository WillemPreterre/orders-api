import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Orders API',
            version: '1.0.0',
            description: 'API documentation for the Orders API',
        },
    },
    apis: ['./src/routes/ordersRouter.ts'], 
};

const specs = swaggerJsdoc(options);

export default specs;
