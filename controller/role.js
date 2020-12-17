const { DataTypes } = require('sequelize');
const sequelize = require('../model/sequelize');
const Role = require('../model/role')(sequelize, DataTypes);

module.exports.allRoles = async(req, res) => {
    try{
        const roles = await Role.findAll();
        if(roles !== null){
            res.json(roles);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(500);
    }
}