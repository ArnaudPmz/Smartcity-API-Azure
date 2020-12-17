
const { DataTypes } = require('sequelize');
const sequelize = require('../model/sequelize');
const Entity = require('../model/entity')(sequelize, DataTypes);
const Announce = require('../model/announce')(sequelize, DataTypes);
const Category = require('../model/category')(sequelize, DataTypes);
const Entity_Role = require('../model/entity_role')(sequelize, DataTypes);
const Role = require('../model/role')(sequelize, DataTypes);
const Commentary = require('../model/commentary')(sequelize, DataTypes);
const Appointment = require('../model/appointment')(sequelize, DataTypes);
const Address = require('../model/address')(sequelize, DataTypes);
const utils = require('../utils/utils');

require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

module.exports.allEntity = async(req, res) => {
    try{
        const entity = await Entity.findAll({
            include: [{
                model: Role
            },{
                model: Commentary,
                as: 'written_comments'
            },{
                model: Commentary,
                as: 'received_comments'
            },{
                model: Appointment
            },{
                model: Address
            }]
        });
        if(entity !== null){
            res.json(entity);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(500);
    }
}

module.exports.getEntity = async(req, res) => {
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const entityFound = await Entity.findOne({
                where:{
                    id: id
                }, include: [{
                    model: Role
                },{
                    model: Commentary,
                    as: 'written_comments'
                },{
                    model: Commentary,
                    as: 'received_comments'
                },{
                    model: Appointment
                },{
                    model: Address
                }]
            });
            if(entityFound !== null){
                res.json(entityFound);
            } else {
                res.sendStatus(404);
            }
        }
    } catch(error) {
        res.sendStatus(500);
    }
}

/**
 *@swagger
 *components:
 *  requestBodies:
 *      ConnectClient:
 *          description: Identifiants de connexion
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                          password:
 *                              type: string
 *                              format: password
 */
module.exports.login = async(req, res) => {
    const {email, password} = req.body;
    if(email === undefined || password === undefined){
        res.sendStatus(400);
    } else {
        try{
            const entity = await Entity.findOne({
                where: {
                    email: email
                }, include: [{
                    model: Role
                },{
                    model: Commentary,
                    as: 'written_comments'
                },{
                    model: Commentary,
                    as: 'received_comments'
                },{
                    model: Appointment
                },{
                    model: Address
                }]
            });
            if(entity !== null){
                const compareHash = await utils.compareHash(password, entity.password);
                if(compareHash){
                    const roles = await Entity_Role.findAll({where: { entityId: entity.id }});
                    if(roles.some(role => role.roleName === 'manager')){
                        //manager token
                        const {id} = entity;
                        const payload = {status: "manager", value: {id, email}};
                        const token = jwt.sign(
                            payload,
                            process.env.SECRET_TOKEN,
                            {expiresIn: '4h'}
                        );
                        const data = {
                            user: entity.dataValues,
                            token: token
                        }   
                        res.json(data);
                    } else {
                        //user token
                        const {id} = entity;
                        const payload = {status: "user", value: {id, email}};
                        const token = jwt.sign(
                            payload,
                            process.env.SECRET_TOKEN,
                            {expiresIn: '4h'}
                        );
                        const data = {
                            user: entity.dataValues,
                            token: token
                        }   
                        res.json(data);
                    }
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(404);
            }
        } catch(e){
            console.log(e);
            res.sendStatus(500);
        }
    }
}


/**
 *@swagger
 *components:
 *  responses:
 *      ClientCreated:
 *          description: le client a été créé
 *  requestBodies:
 *      CreateClient:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                          firstname:
 *                              type: string
 *                          lastname: 
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 */
module.exports.create = async(req, res) => {
    const {email, firstname, lastname, password} = req.body;
    if(email === undefined || firstname === undefined || password === undefined){
        res.sendStatus(400);
    } else {
        try{
            let passwordFormat = await utils.passwordFormat(password);
            if(passwordFormat){
                const emailExist = await Entity.count({where: { email: email } });
                if(emailExist === 0){
                    const entity = await Entity.create({
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        password: await utils.getHash(password)
                    });
                    if(entity){
                        //user token
                        const {id} = entity;
                        const payload = {status: "user", value: {id, email}};
                        const token = jwt.sign(
                            payload,
                            process.env.SECRET_TOKEN,
                            {expiresIn: '4h'}
                        );
                        const data = {
                            user: entity.dataValues,
                            token: token
                        }   
                        res.status(201).json(data);
                        //res.json(entity);
                    } else {
                        res.sendStatus(500);
                    }
                } else {
                    res.status(400).send("Email déjà utilisé");
                }
            } else {
                res.status(400).send("Format de mot de passe incorrect");
            }
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
}

module.exports.getAnnounces = async(req, res) => {
    const {id} = req.params;
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const announces = await Announce.findAll({
                where:{
                    entityId: id
                }, include: [{
                    model: Category,
                    as: 'category'
                }, {
                    model: Entity,
                    as: 'author'
                },{
                    model: Appointment,
                    as: 'appointments'
                }]
            });
            if(announces !== null){
                res.json(announces);
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
 *      responses:
 *          ClientUpdated:
 *              description: le client a été mis à jour
 *      requestBodies:
 *          ClientAUpdate:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              email:
 *                                  type: string
 *                                  format: email
 *                              firstname:
 *                                  type: string
 *                              lastname:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                                  format: password
 *                              description:
 *                                  type: string
 *                              phoneNumber:
 *                                  type: string
 */

module.exports.update = async(req, res) => {
    const {id, email, firstname, lastname, password, description, phoneNumber} = req.body;
    const newData = {};
    const entity = await Entity.findOne({where: {id: id}});
    
    newData.email = email ? email : entity.email;
    newData.firstname = firstname ? firstname : entity.firstname;
    newData.lastname = lastname ? lastname : entity.lastname;
    newData.password = password ? await utils.getHash(password) : entity.password;
    newData.description = description ? description : entity.description;
    newData.phoneNumber = phoneNumber ? phoneNumber : entity.phoneNumber;

    try{
        await Entity.update({
            email: newData.email,
            firstname: newData.firstname,
            lastname: newData.lastname,
            password: newData.password,
            description: newData.description,
            phoneNumber: newData.phoneNumber
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
}


/**
 *@swagger
 *components:
 *  responses:
 *      ClientDeleted:
 *          description: le client a été supprimé
 *  requestBodies:
 *      DeleteClient:
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
        await Entity.destroy({
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