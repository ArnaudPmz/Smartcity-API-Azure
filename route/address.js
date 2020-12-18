const Router = require("express-promise-router");
const router = new Router;
const routesVersioning = require('express-routes-versioning')();
const AddressController = require("../controller/address");
const AuthMiddleware = require("../middleware/Authentication");
const IdMiddleware = require("../middleware/Authorization");

/**
 * @swagger
 * /address:
 *  get:
 *      tags:
 *         - Address
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
    "1.0.0": AddressController.all
}));

/**
 * @swagger
 * /address/{id}:
 *  get:
 *      tags:
 *         - Address
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: ID de l'adresse
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Adresse trouvée
 *          400:
 *              description: Paramètre incorrect
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Adresse non trouvée
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AddressController.get
}));

/**
 * @swagger
 * /address:
 *  patch:
 *      tags:
 *          - Address
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/UpdateAddress'
 *      responses:
 *          200:
 *              description: Adresse mise à jour
 *          400:
 *              description: Paramètres invalides
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Client invalide
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AddressController.update
}));

/**
 * @swagger
 * /address:
 *  post:
 *      tags:
 *          - Address
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/CreateAddress'
 *      responses:
 *          201:
 *              description: Adresse mise à jour
 *          400:
 *              description: Adresse inexistante
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          409: 
 *               description: L'utilisateur a déjà une adresse, éditez-la
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AddressController.create
}));

/**
 * @swagger
 * /address:
 *  delete:
 *      tags:
 *          - Address
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/DeleteClient'
 *      responses:
 *          204:
 *              description: Adresse supprimée
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          404:
 *              description: L'adresse n'existe pas
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', AuthMiddleware.identification, IdMiddleware.mustBeManager, routesVersioning({
    "1.0.0": AddressController.delete
}));

module.exports = router;
