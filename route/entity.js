const Router = require("express-promise-router");
const router = new Router;
const routesVersioning = require('express-routes-versioning')();
const EntityController = require("../controller/entity");
const AuthMiddleware = require("../middleware/Authentication");
const IdMiddleware = require("../middleware/Authorization");

//router.get('/', EntityController.allEntity);

/**
 * @swagger
 * /entity:
 *  get:
 *      tags:
 *         - Client
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Opération échouée
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": EntityController.allEntity,
}));

/**
 * @swagger
 * /entity/{id}:
 *  get:
 *      tags:
 *         - Client
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: ID d'un client
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Client trouvé
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Client non trouvé
 *          500:
 *              description: Erreur serveur
 *
 */

router.get('/:id', AuthMiddleware.identification, routesVersioning({
    "1.0.0": EntityController.getEntity
}));

/**
 * @swagger
 * /entity/{id}/announces:
 *  get:
 *      summary: Return announces of client
 *      tags:
 *          - Client
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          400:
 *              description: Paramètre incorrect
 *          404: 
 *              description: Client non trouvé
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id/announces', AuthMiddleware.identification, routesVersioning({
    "1.0.0": EntityController.getAnnounces
}));

/**
 * @swagger
 * /entity:
 *  post:
 *      tags:
 *          - Client
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/CreateClient'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ClientCreated'
 *          400:
 *              description: L'email est déjà utilisé ou le format du mot de passe est incorrect
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', AuthMiddleware.identification, IdMiddleware.mustBeManager, routesVersioning({
    "1.0.0": EntityController.create
}));

/**
 * @swagger
 * /entity:
 *  patch:
 *      tags:
 *          - Client
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ClientAUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ClientUpdated'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": EntityController.update
}));

/**
 * @swagger
 * /entity:
 *  delete:
 *      tags:
 *          - Client
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/DeleteClient'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ClientDeleted'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          404:
 *              description: Le client n'existe pas
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', AuthMiddleware.identification, IdMiddleware.mustBeManager, routesVersioning({
    "1.0.0": EntityController.delete
}));

module.exports = router;