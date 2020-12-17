const Router = require("express-promise-router");
const router = new Router;
const routesVersioning = require('express-routes-versioning')();
const AppointmentController = require("../controller/appointment");
const AuthMiddleware = require("../middleware/Authentication");
const IdMiddleware = require("../middleware/Authorization");

/**
 * @swagger
 * /appointment:
 *  get:
 *      tags:
 *         - Appointment
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
    "1.0.0": AppointmentController.all
}));

/**
 * @swagger
 * /appointments/{id}:
 *  get:
 *      tags:
 *         - Appointment
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: ID d'un rendez-vous
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Rendez-vous trouvé
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Rendez-vous non trouvé
 *          500:
 *              description: Erreur serveur
 *
 */

router.get('/:id', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AppointmentController.getAppointment
}));

/**
 * @swagger
 * /appointment:
 *  post:
 *      tags:
 *          - Appointment
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/CreateAppointment'
 *      responses:
 *          201:
 *              description: Rendez-vous créé
 *          400:
 *              description: Paramètres inccorects
 *          404:
 *              description: Erreur de création
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AppointmentController.create
}));

/**
 * @swagger
 * /appointment:
 *  patch:
 *      tags:
 *          - Appointment
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/UpdateAppointment'
 *      responses:
 *          204:
 *              description: Rendez-vous mis à jour
 *          400:
 *              description: Status invalide
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Rendez-vous inexistant
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', AuthMiddleware.identification, routesVersioning({
    "1.0.0": AppointmentController.update
}));


/**
 * @swagger
 * /appointment:
 *  delete:
 *      tags:
 *          - Appointment
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/DeleteAppointment'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/AppointmentDeleted'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/mustBeManager'
 *          404:
 *              description: Le rendez-vous n'existe pas
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', AuthMiddleware.identification, IdMiddleware.mustBeManager, routesVersioning({
    "1.0.0": AppointmentController.delete
}));

module.exports = router;