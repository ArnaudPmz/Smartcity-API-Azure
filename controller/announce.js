const { DataTypes } = require('sequelize');
const sequelize = require('../model/sequelize');
const Announce = require('../model/announce')(sequelize, DataTypes);
const Category = require('../model/category')(sequelize, DataTypes);
//const Entity_Role = require('../model/entity_role')(sequelize, DataTypes);
const Entity = require('../model/entity')(sequelize, DataTypes);
const DateFormat = require('../utils/date');
const Appointment = require('../model/appointment')(sequelize, DataTypes);

module.exports.all = async(req, res) => {
    try {
        /*
        const category = await Category.findAll({
            include: {
                model: Announce,
                as: 'announces'
            }
        });
        console.log(category);
        */

        await Announce.findAll({
            include: [{
                model: Category,
                as: 'category'
            }, {
                model: Entity,
                as: 'author'
            }, {
                model: Appointment,
                as: 'appointments'
            }]
        }).then((announces) => {
            if(announces !== null){
                res.json(announces);
            } else {
                res.sendStatus(404);
            }
        });
        
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

module.exports.getAnnounce = async(req, res) => {
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try {
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const announce = await Announce.findOne({
                where: { 
                    id: id
                },
                include: [{
                    model: Category,
                    as: 'category'
                }, {
                    model: Entity,
                    as: 'author'
                }, {
                    model: Appointment,
                    as: 'appointments'
                }]
            });
            if(announce !== null){
                res.json(announce);
            } else {
                res.sendStatus(404);
            }
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

module.exports.getAnnounceAppointments = async(req, res) => {
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try {
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const announce = await Announce.findOne({ where: { id: id }});
            if(announce){
                const appointments = await Appointment.findAll({
                    where: { 
                        announceId: id
                    }
                });
                res.json(appointments);
            } else {
                res.sendStatus(404);
            }
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}

/**
 * @swagger
 *  components:
 *      requestBodies:
 *          UpdateAnnounce:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              title:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              date:
 *                                  type: string
 *                                  format: date-time
 *                              duration:
 *                                  type: string
 *                              price:
 *                                  type: number
 *                                  format: float
 *                              categoryName:
 *                                  type: string
 *                              entityId:
 *                                  type: integer
 *                              statusId:
 *                                  type: integer
 */
module.exports.update = async(req, res) => {
    const { id, title, description, date, duration, price, categoryName, entityId, statusId } = req.body;
    const newData = {};
    const dateTransformed = null;
    if(date !== undefined){
        dateTransformed = await DateFormat.transform(date);
        if(!DateFormat.laterDate(dateTransformed)) { 
            res.sendStatus(400);
        }
    } else {
        const announce = Announce.findOne({where: { id: id} });
        if(announce){
            newData.title = title ? title : announce.title;
            newData.description = description ? description : announce.description;
            newData.date = dateTransformed ? dateTransformed : announce.date;
            newData.duration = duration ? duration : announce.duration;
            newData.price = price ? price : announce.price;
            newData.categoryName = categoryName ? categoryName : announce.categoryName;
            newData.entityId = entityId ? entityId : announce.entityId;
            newData.statusId = statusId ? statusId : announce.statusId;

            try {
                Announce.update({
                    title: newData.title,
                    description: newData.description,
                    date: newData.date,
                    duration: newData.duration,
                    price: newData.price,
                    categoryName: newData.categoryName,
                    entityId: newData.entityId,
                    statusId: newData.statusId
                }, {
                    where: {
                        id: id
                    }
                }).catch(function(e){
                    e.errors.map(e => console.log(e.message));
                });

                res.sendStatus(204);
            } catch(e) {
                console.log(e);
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(404);
        }
    }
}

/**
 * @swagger
 *  components:
 *      requestBodies:
 *          CreateAnnounce:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              title:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              date:
 *                                  type: string
 *                                  format: date-time
 *                              duration:
 *                                  type: integer
 *                              price:
 *                                  type: number
 *                                  format: float
 *                              city:
 *                                  type: string
 *                              categoryName:
 *                                  type: string
 *                              entityId:
 *                                  type: integer
 */
module.exports.create = async(req, res) => {
    const {title, description, date, duration, price, city, categoryName, entityId} = req.body;
    if(title === undefined || description === undefined || date === undefined || duration === undefined || entityId === undefined || city === undefined || categoryName === undefined){
        res.sendStatus(400);
    } else {
        const dateTransformed = await DateFormat.transform(date);
        if(!DateFormat.laterDate(dateTransformed)) { 
            res.sendStatus(400);
        } else {
            try{
                const announce = await Announce.create({
                    title: title,
                    description: description,
                    date: dateTransformed, 
                    duration: duration,
                    price: price,
                    city: city,
                    categoryName: categoryName, 
                    entityId: entityId,
                    statusId: 1
                }).catch(function(e){
                    e.errors.map(e => console.log(e.message));
                });
                if(announce){
                    res.status(201).json(announce);
                } else {
                    res.sendStatus(404);
                }
            } catch(e) {
                console.log(e);
                res.sendStatus(500);
            }
        }
    }

}


/**
 *@swagger
 *components:
 *  requestBodies:
 *      DeleteAnnounce:
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
        const response = await Announce.destroy({
            where: {
                id: id
            }
        });
        if(response){
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}