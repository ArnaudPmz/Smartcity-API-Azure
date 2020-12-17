const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
        name: {
            type:DataTypes.STRING,
            primaryKey: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    
    return Category;
};