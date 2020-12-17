/**
 *@swagger
 * components:
 *  responses:
 *      mustBeManager:
 *          description: L'action demandée ne peut être réalisée que par un manager
 */
module.exports.mustBeManager = (req,res,next) => {
    if(req.session && req.session.authLevel === "manager"){
        next();
    } else {
        res.sendStatus(403);
    }
}