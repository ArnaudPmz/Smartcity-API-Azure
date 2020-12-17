const Router = require("express-promise-router");
const router = new Router;
const routesVersioning = require('express-routes-versioning')();
const RoleController = require("../controller/role");
const AuthMiddleware = require("../middleware/Authentication");
const IdMiddleware = require("../middleware/Authorization");

/**
 * @swagger
 * /role:
 *  get:
 *      tags:
 *         - Role
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
    "1.0.0": RoleController.allRoles
}));

module.exports = router;