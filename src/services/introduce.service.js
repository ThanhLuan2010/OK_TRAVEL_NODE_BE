const logger = require("../config/logger");
const sequelize = require("../config/database");
const { v4: uuid_v4 } = require("uuid");
const { responseListData, responseData } = require("../utils/responseFormat");

const createIntroduce = async (data) => {
  try {
    const blogId = uuid_v4();
    const query = `INSERT INTO introduce_entity
        (id, title, created_at, description, image, type)
        VALUES (:id, :title, :created_at, :description, :image, :type)`;
    await sequelize.query(query, {
      replacements: {
        id: blogId,
        created_at: new Date(),
        title: data.title,
        description: data.description,
        image: data.image,
        type: data.type,
      },
    });
    return blogId;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
  }
};

const updateIntroduce = async (id, data) => {
  try {
    await sequelize.query(
      `UPDATE introduce_entity
    SET
        title = :title,
        description = :description,
        image = :image,
        type = :type
    WHERE id = :id`,
      {
        replacements: {
          title: data.title,
          description: data.description,
          type: data.type,
          image: data.image,
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

const deleteIntroduce = async (id) => {
  try {
    const query = `
    DELETE FROM introduce_entity
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

const getIntroduce = async (type) => {
  try {
    const faq = await sequelize.query(
      `SELECT *
        FROM introduce_entity
      WHERE type = :type
        `,
      {
        replacements: {
          type: type,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    return faq;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
    // return responseListData([], 0, 0, 0, 0);
    return {}
  }
};

const findIntroduceById = async (id) => {
  try {
    const query = `SELECT *
        FROM introduce_entity
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

const findIntroduceByType = async (type) => {
  try {
    const query = `SELECT *
        FROM introduce_entity
        WHERE type = '${type}'`;

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
  createIntroduce,
  updateIntroduce,
  deleteIntroduce,
  getIntroduce,
  findIntroduceById,
  findIntroduceByType
};
