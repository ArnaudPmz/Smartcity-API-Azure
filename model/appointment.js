const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 
const Status = require('./status');

module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('appointment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            autoIncrementIdentity: true,
            primaryKey: true,
        },
        date: {
            type:DataTypes.DATE,
            validate: {
                isDate: true
            }
        },
        duration: DataTypes.STRING,
        price: {
            type: DataTypes.REAL,
            defaultValue: null,
            validate: {
                min: 0
            }
        },
        announceId: DataTypes.INTEGER,
        entityId: DataTypes.INTEGER,
        statusId: DataTypes.INTEGER
    }, {
        timestamps: false,
        freezeTableName: true
    });

    //Appointment.hasOne(Status, { sourceKey: 'statusId', foreignKey: 'id', as: 'status' });
    //Status.hasMany(Appointment, { sourceKey: 'id', foreignKey: 'statusId', as: 'appointments' });

    return Appointment;
};