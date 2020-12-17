
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../model/sequelize');
const Category = require('../model/category')(sequelize, DataTypes);

module.exports.all = async(req, res) => {
    try{
        const category = await Category.findAll();
        if(category !== null){
            res.json(category);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(500);
    }
}

module.exports.get = async(req, res) => {
    const name = req.params.name;
    try{
        const catFound = await Category.findOne({
            where:{
                name: name
            }
        });
        if(catFound !== null){
            res.json(catFound);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        res.sendStatus(500);
    }
}

