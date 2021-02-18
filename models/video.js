'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Video.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  };
  Video.init({
    userId: DataTypes.INTEGER,
    watchId: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER,
    views: DataTypes.INTEGER,
    originalFileName: DataTypes.STRING,
    transcoded: DataTypes.BOOLEAN,
    published: {
      type: DataTypes.BOOLEAN,
      get() {
        const rawValue = this.getDataValue('published');
        return (rawValue ? true : false);
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue('createdAt');
        const date = new Date(rawValue).toLocaleDateString();
        return date;
      }
    }
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};