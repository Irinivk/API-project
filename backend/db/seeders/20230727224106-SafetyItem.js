'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'SafetyItems';
   return queryInterface.bulkInsert(options, [
      {
        name: 'Smoke alarm',
        icon: "https://cdn2.iconfinder.com/data/icons/firefighting-fire-safety/64/44_fire-detector-smoke-alarm-512.png"
      },
      {
        name: 'First aid kit',
        icon: "https://www.iconpacks.net/icons/2/free-first-aid-kit-icon-3541-thumb.png"
      },
      {
        name: 'Fire extinguisher',
        icon: "https://cdn-icons-png.flaticon.com/512/4598/4598986.png"
      },
      {
        name: 'Carbon monoxide alarm',
        icon: "https://img.favpng.com/12/21/9/carbon-monoxide-detector-smoke-detector-computer-icons-scalable-vector-graphics-png-favpng-Cw8fYV4KktJBKPLcfjUNskbeU.jpg"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SafetyItems';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Smoke alarm", "First aid kit", "Fire extinguisher", "Carbon monoxide alarm"] }
    }, {});
  }
};
