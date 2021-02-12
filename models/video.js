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
      // define association here
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
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};