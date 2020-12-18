
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../model/sequelize');
const Entity = require('../model/entity')(sequelize, DataTypes);
const Address = require('../model/address')(sequelize, DataTypes);

module.exports.all = async(req, res) => {
    try{
        const address = await Address.findAll();
        if(address !== null){
            res.json(address);
        } else {
            res.sendStatus(404);
        }
    } catch(error){
        res.sendStatus(500);
    }
}

module.exports.get = async(req, res) => {
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const addressFound = await Address.findOne({
                where:{
                    id: id
                }
            });
            if(addressFound !== null){
                res.json(addressFound);
            } else {
                res.sendStatus(404);
            }
        }
    } catch(error){
        res.sendStatus(500);
    }
}


/**
 * @swagger
 *  components:
 *      requestBodies:
 *          CreateAddress:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              userId:
 *                                  type: integer
 *                              street:
 *                                  type: string
 *                              city:
 *                                  type: string
 *                              zipCode:
 *                                  type: string
 */
module.exports.create = async(req, res) => {
    const {userId, street, city, zipCode} = req.body;
    console.log(req.body);
    let address = null;
    if(userId === undefined || street === undefined || city === undefined || zipCode === undefined){
        res.sendStatus(400);
    } else {
        try{
            const entityFound = await Entity.findOne({ where: {id : userId }}); 
            if(entityFound && entityFound.addressId !== null){
                throw new Error("User already have an address");
            }
            await sequelize.transaction( {
                deferrable: Sequelize.Deferrable.SET_DEFERRED
            }, async (t) => {
                address = await Address.create({
                    street: street,
                    city: city,
                    zipCode: zipCode
                }, {
                    transaction: t
                });
                //.null contain id of potential address ?
                if(address){
                    console.log(address.null);
                    const userFound = await Entity.update({
                        addressId: address.null
                    }, {
                        where: {
                            id: userId
                        }, 
                        transaction: t
                    });
                    console.log(userFound);
                    if(userFound[0] === 0){
                        throw new Error("User id not valid");
                    }
                }
            });
            //Transaction committed successfully
            res.status(201).json({id: address.null});
        } catch (e) {
            //Transaction has already been rolled back automatically by Sequelize
            if(e.message === "User id not valid"){
                res.status(404).json({ error: e.message });
            } else if(e.message === "User already have an address") {
                res.status(409).json({ error: e.message });
            } else {
                console.log(e);
                res.sendStatus(500);
            }
        }
    }
}



/**
 * @swagger
 *  components:
 *      requestBodies:
 *          UpdateAddress:
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: ID de l'adresse
 *                              street:
 *                                  type: string
 *                              city:
 *                                  type: string
 *                              zipCode:
 *                                  type: string
 */
module.exports.update = async(req, res) => {
    const {id, street, city, zipCode} = req.body;
    const newData = {};

    try{
        const address = await Address.findOne({where: {id: id}});
        
        if(address){
            newData.street = street ? street : address.street;
            newData.city = city ? city : address.city;
            newData.zipCode = zipCode ? zipCode : address.zipCode;

            try{
                await Address.update({
                    street: newData.street,
                    city: newData.city,
                    zipCode: newData.zipCode
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
            res.sendStatus(400);
        }
    } catch(error){
        res.sendStatus(500);
    }
}


/**
 *@swagger
 *components:
 *  requestBodies:
 *      DeleteAddress:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          id:
 *                              type: integer
 */
module.exports.delete = async(req, res) => {
    //Delete reference in entity before delete address row
    const {id} = req.body;
    try{
        await Entity.update({
            addressId: null
        }, {
            where: {
                addressId: id
            }
        });

        try{
            const response = await Address.destroy({
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
    } catch(error){
        res.sendStatus(500);
    }
}
