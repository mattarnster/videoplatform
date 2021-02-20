'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Video, {
        foreignKey: 'userId'
      });
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    channelName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};