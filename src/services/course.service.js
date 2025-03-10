const logger = require("../config/logger");
const sequelize = require("../config/database");
const { v4: uuid_v4 } = require("uuid");
const { responseListData } = require("../utils/responseFormat");

const createCourse = async (data) => {
  try {
    const blogId = uuid_v4();
    const query = `INSERT INTO course_entity
        (id, title, created_at, description, videoUrl, thumnail)
        VALUES (:id, :title, :created_at, :description, :videoUrl, :thumnail)`;
    await sequelize.query(query, {
      replacements: {
        id: blogId,
        created_at: new Date(),
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        thumnail: data.thumnail,
      },
    });

    return blogId;
  } catch (e) {
    logger.error(`ERR : ${e.message}`);
  }
};

const updateCourse = async (id, data) => {
  try {
    await sequelize.query(
      `UPDATE course_entity
    SET
        title = :title,
        description = :description,
        videoUrl = :videoUrl,
        thumnail = :thumnail
    WHERE id = :id`,
      {
        replacements: {
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
          thumnail: data.thumnail,
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

const deleteCourse = async (id) => {
  try {
    const query = `
    DELETE FROM course_entity
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

const listCourse = async (filter) => {
  try {
    const faq = await sequelize.query(
      `SELECT *
        FROM course_entity
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

const findCourseById = async (id) => {
  try {
    const query = `SELECT *
        FROM course_entity
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
  createCourse,
  updateCourse,
  deleteCourse,
  listCourse,
  findCourseById,
};
