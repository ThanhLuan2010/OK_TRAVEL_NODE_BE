const logger = require("../config/logger");
const sequelize = require("../config/database");
const { v4: uuid_v4 } = require("uuid");
const formatDateTime = require("../utils/formatDateTime");
const { responseListData } = require("../utils/responseFormat");

// data: { blog_category_id, title, description, content, url }
const createFaq = async (data) => {
  try {
    const blogId = uuid_v4();
    const query = `INSERT INTO faq_entity
        (id, answer, created_at, question)
        VALUES (:id, :answer, :created_at, :question)`;
    await sequelize.query(query, {
      replacements: {
        id: blogId,
        created_at: new Date(),
        question: data.question,
        answer: data.answer,
      },
    });

    return blogId;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
  }
};

// data: { blog_category_id, title, description, content, url, is_delete, is_hidden }
const updateFaq = async (id, data) => {
  try {
    await sequelize.query(
      `UPDATE faq_entity
    SET
        answer = :answer,
        question = :question
    WHERE id = :id`,
      {
        replacements: {
          answer: data.answer,
          question: data.question,
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

const deleteFaq = async (id) => {
  try {
    const query = `
    DELETE FROM faq_entity
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

const listFaq = async (filter) => {
  try {
    const faq = await sequelize.query(
      `SELECT *
        FROM faq_entity
        ORDER BY created_at DESC`,
      {
        replacements: {},
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    return faq;
  } catch (e) {
    logger.error(`ERR listAdminBlog: ${e.message}`);
    return responseListData([], 0, 0, 0, 0);
  }
};

const findFaqById = async (id) => {
  try {
    const query = `SELECT *
        FROM faq_entity
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
  createFaq,
  updateFaq,
  deleteFaq,
  listFaq,
  findFaqById,
};
