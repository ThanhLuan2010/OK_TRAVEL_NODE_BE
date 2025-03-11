const logger = require("../config/logger");
const sequelize = require("../config/database");
const { v4: uuid_v4 } = require("uuid");
const { responseData } = require("../utils/responseFormat");

const createPartner = async (data) => {
  try {
    const blogId = uuid_v4();
    const query = `INSERT INTO partner_entity
        (id, image, created_at, link)
        VALUES (:id, :image, :created_at, :link)`;
    await sequelize.query(query, {
      replacements: {
        id: blogId,
        created_at: new Date(),
        link: data.link,
        image: data.image,
      },
    });

    return blogId;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
  }
};

const updatePartner = async (id, data) => {
  try {
    await sequelize.query(
      `UPDATE partner_entity
    SET
        image = :image,
        link = :link
    WHERE id = :id`,
      {
        replacements: {
          image: data.image,
          link: data.link,
          id: id,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return true;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
    return false;
  }
};

const deletePartner = async (id) => {
  try {
    const query = `
    DELETE FROM partner_entity
    WHERE id = :id`;

    await sequelize.query(query, {
      replacements: {
        id: id,
      },
      type: sequelize.QueryTypes.DELETE,
    });

    return true;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
    return false;
  }
};

const listPartner = async () => {
  try {
    const faq = await sequelize.query(
      `SELECT *
        FROM partner_entity
        ORDER BY created_at DESC`,
      {
        replacements: {},
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    return faq;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
    return responseData({}, "");
  }
};

const findPartnerById = async (id) => {
  try {
    const query = `SELECT *
        FROM partner_entity
        WHERE id = '${id}'`;

    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    return data[0];
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
  }
};

module.exports = {
  createPartner,
  updatePartner,
  deletePartner,
  listPartner,
  findPartnerById,
};
