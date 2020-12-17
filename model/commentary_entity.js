const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 

module.exports = (sequelize, DataTypes) => {
    const Commentary_Entity = sequelize.define('commentary_entity', {
        commentaryId: {
            type: DataTypes.INTEGER,
            autoIncrementIdentity: true,
            primaryKey: true
        },
        authorEntityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        targetEntityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        updatedAt: false,
        createdAt: false,
        freezeTableName: true
    });

    return Commentary_Entity;
};