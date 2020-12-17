const Router = require("express-promise-router");
const router = new Router;
const routesVersioning = require('express-routes-versioning')();
const AnnounceController = require("../controller/announce");
const AuthMiddleware = require("../middleware/Authentication");
const IdMiddleware = require("../middleware/Authorization");

/**
 * @swagger
 * /announce:
 *  get:
 *      tags:
 *         - Announce
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
    "1.0.0": AnnounceController.all
}));

/**
 * @swagger
 * /announce/{id}:
 *  get:
 *      tags:
 *         - Announce
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: ID d'une annonce
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Annonce trouvée
 *          400:
 *              description: Paramètre incorrect
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Annonce non trouvée
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AnnounceController.getAnnounce
}));

/**
 * @swagger
 * /announce/{id}/appointments:
 *  get:
 *      tags:
 *         - Announce
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: ID d'une annonce
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          400:
 *              description: Paramètre incorrect
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Annonce inexistante
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id/appointments', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AnnounceController.getAnnounceAppointments
}));

/**
 * @swagger
 * /announce/{id}/appointments:
 *  get:
 *      tags:
 *         - Announce
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: ID d'une annonce
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          400:
 *              description: Paramètre incorrect
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Annonce inexistante
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id/appointments', AuthMiddleware.identification, AnnounceController.getAnnounceAppointments);

/**
 * @swagger
 * /announce:
 *  patch:
 *      tags:
 *          - Announce
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/UpdateAnnounce'
 *      responses:
 *          200:
 *              description: Annonce mise à jour
 *          400:
 *              description: Date non antérieure
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Annonce invalide
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AnnounceController.update  
}));

/**
 * @swagger
 * /announce:
 *  post:
 *      tags:
 *          - Announce
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/CreateAnnounce'
 *      responses:
 *          201:
 *              description: Annonce créée
 *          400:
 *              description: Annonce inexistante
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AnnounceController.create
}));

/**
 * @swagger
 * /announce:
 *  delete:
 *      tags:
 *          - Announce
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/DeleteAnnounce'
 *      responses:
 *          204:
 *              description: Annonce supprimée
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          404:
 *              description: L'annonce n'existe pas
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AnnounceController.delete
}));

module.exports = router;