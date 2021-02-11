'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const { nanoid } = require('nanoid');

    await queryInterface.bulkInsert('Videos', [{
      watchId: nanoid(15),
      title: "John's Interesting Knowledge Ep.1",
      description: "John tells us about some new and interesting things!",
      views: 0,
      likes: 0,
      dislikes: 0,
      originalFileName: "test.mp4",
      published: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Videos', null, {});
  }
};
