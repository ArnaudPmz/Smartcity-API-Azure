const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 

module.exports = (sequelize, DataTypes) => {
    const Entity_Role = sequelize.define('entity_role', {
        entityId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        roleName: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Entity_Role;
};