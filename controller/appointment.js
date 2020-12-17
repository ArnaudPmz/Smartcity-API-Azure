const { DataTypes } = require('sequelize');
const sequelize = require('../model/sequelize');
const Appointment = require('../model/appointment')(sequelize, DataTypes);
const Status = require('../model/status')(sequelize, DataTypes);
const Announce = require('../model/announce')(sequelize, DataTypes);

module.exports.all = async(req, res) => {
    try{
        const appointments = await Appointment.findAll();
        if(appointments !== null){
            res.json(appointments);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(500);
    }
}

module.exports.getAppointment = async(req, res) => {
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const appointmentFound = await Appointment.findOne({
                where:{
                    id: id
                }
            });
            if(appointmentFound !== null){
                res.json(appointmentFound);
            } else {
                res.sendStatus(404);
            }
        }
    } catch(error) {
        res.sendStatus(500);
    }
}

/**
 * @swagger
 *  components:
 *      requestBodies:
 *          CreateAppointment:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              announceId:
 *                                  type: integer
 *                              entityId:
 *                                  type: integer
 *                                  description: ID de l'auteur de la demande de rendez-vous
 */
module.exports.create = async(req, res) => {
    const {announceId, entityId} = req.body;
    if(announceId === undefined || entityId === undefined){
        res.sendStatus(400);
    } else {
        const announceConcerned = await Announce.findOne({ where: { id: announceId }});
        if(announceConcerned){
            console.log(announceConcerned);
            try{
                const appointment = await Appointment.create({
                    date: announceConcerned.dataValues.date,
                    duration: announceConcerned.dataValues.duration,
                    price: announceConcerned.dataValues.price,
                    announceId: announceId,
                    entityId: entityId,
                    statusId: 6 //Corresponding to accepted status
                }).catch(function(e){
                    console.log(e);
                });
                if(appointment){
                    res.status(201).json(appointment);
                } else {
                    res.sendStatus(404);
                }
            } catch(e) {
                console.log(e);
                res.sendStatus(500);
            }
        } else {
            res.status(400).json("Annonce inexistante");
        }
    }
}

/**
 * @swagger
 *  components:
 *      requestBodies:
 *          UpdateAppointment:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: ID du rendez-vous
 *                              statusId:
 *                                  type: integer
 *                                  description: 6= Openned, 7= Accepted, 8= Denied, 9= Canceled
 */
module.exports.update = async(req, res) => {
    const {id, statusId} = req.body;

    try{
        const appointment = await Appointment.findOne({where: {id: id}});
        
        if(appointment){
            const statusFound = await Status.findOne({where: {id : statusId, type: "appointment"}});

            if(statusFound){
                try{
                    await Appointment.update({
                        statusId: statusId
                    },{
                        where: {
                            id: id
                        }
                    });
                    res.sendStatus(204);
                } catch(e) {
                    console.log(e);
                    res.sendStatus(500);
                }
            } else {
                res.status(400).json("ID status invalide");
            }
        } else {
            res.sendStatus(404);
        }
    } catch(error){
        res.sendStatus(500);
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      AppointmentDeleted:
 *          description: Rendez-vous supprimé
 *  requestBodies:
 *      DeleteAppointment:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          id:
 *                              type: integer
 */
module.exports.delete = async(req, res) => {
    const {id} = req.body;
    try{
        await Appointment.destroy({
            where: {
                id: id
            }
        });
        res.sendStatus(204);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}