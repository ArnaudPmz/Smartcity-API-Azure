const { Router } = require('express');
const router = require("express").Router();
const EntityRouter = require('./entity');
const EntityController = require("../controller/entity");
const AddressRouter = require("./address");
const AnnounceRouter = require('./announce');
const AppointmentRouter = require('./appointment');
const RoleRouter = require('./role');
const CategoryRouter = require('./category');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/spec.json');
 
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

//router.use("v1/entity", EntityRouterV1);
//router.use("v2/entity", EntityRouterV2);
router.use("/entity", EntityRouter);
router.use('/announce', AnnounceRouter);
router.use('/address', AddressRouter);
router.use('/category', CategoryRouter);
router.use('/appointment', AppointmentRouter);
router.use('/role', RoleRouter);

/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - Client
 *      description: Renvoie un JWT token permettant l'identification
 *      requestBody:
 *          $ref: '#/components/requestBodies/ConnectClient'
 *      responses:
 *          200:
 *            description: un token JWT
 *            content:
 *                text/plain:
 *                    schema:
 *                        type: string
 *          400:
 *              description: Arguments manquants ou invalides
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/login', EntityController.login);


/**
 * @swagger
 * /register:
 *  post:
 *      tags:
 *          - Client
 *      requestBody:
 *          $ref: '#/components/requestBodies/CreateClient'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ClientCreated'
 *          400:
 *              description: L'email est déjà utilisé ou le format du mot de passe est incorrect
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/register', EntityController.create);

module.exports = router;