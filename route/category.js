const Router = require("express-promise-router");
const router = new Router;
const routesVersioning = require('express-routes-versioning')();
const CategoryController = require("../controller/category");
const AuthMiddleware = require("../middleware/Authentication");
const IdMiddleware = require("../middleware/Authorization");

/**
 * @swagger
 * /category:
 *  get:
 *      tags:
 *         - Category
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
    "1.0.0": CategoryController.all
}));

/**
 * @swagger
 * /category/{id}:
 *  get:
 *      tags:
 *         - Category
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: nom
 *            description: Nom d'une catégorie
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Catégorie trouvée
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Catégorie non trouvée
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:name', AuthMiddleware.identification, routesVersioning({
    "1.0.0": CategoryController.get
}));

module.exports = router;