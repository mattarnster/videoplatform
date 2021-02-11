'use strict';

const bcrypt = require('bcrypt');

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
   var hashed = "";
   
   await bcrypt.hash("password", 12, (err, enc) =>  {
     hashed = enc
   });

   await queryInterface.bulkInsert('Users', [{
     firstName: "John",
     lastName: "Doe",
     email: "john@doe.com",
     channelName: "John's Interesting Stuff",
     password: hashed,
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
    await queryInterface.bulkDelete('Users', null, {});
  }
};
