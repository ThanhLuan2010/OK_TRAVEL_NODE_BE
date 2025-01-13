const logger = require("../config/logger");
const sequelize = require("../config/database");
const { responseListData } = require("../utils/responseFormat");

// data: { title, description, icon, url, images[], is_delete, is_hidden }
const addSuggessPlace = async (body) => {
  const transaction = await sequelize.transaction();
  try {
    const places = await sequelize.query(
      `SELECT *
        FROM travel_place_entity
        WHERE id = :id LIMIT 1`,
      {
        replacements: {
          id: body.placeId,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    if (places?.length > 0) {
      if (places[0]?.is_suggess) {
        await sequelize.query(
          `UPDATE travel_place_entity
          SET is_suggess = false
          WHERE id = :id;`,
          {
            replacements: {
              id: body.placeId,
            },
          }
        );
        return { ...places[0], is_suggess: false };
      } else {
        await sequelize.query(
          `UPDATE travel_place_entity
          SET is_suggess = true
          WHERE id = :id;`,
          {
            replacements: {
              id: body.placeId,
            },
          }
        );
        return { ...places[0], is_suggess: true };
      }
    } else {
      return false;
    }

    await transaction.commit();
    return true;
  } catch (e) {
    await transaction.rollback();
    logger.error(`ERR add suggess: ${e.message}`);
    return false;
  }
};

const listSuggessPlace = async (filter) => {
  try {
    const totalCount = await sequelize.query(
      `SELECT COUNT(*) as total
        FROM travel_place_entity
        WHERE is_suggess = true`,
      {
        replacements: {},
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    const places = await sequelize.query(
      `SELECT *
        FROM travel_place_entity
        WHERE is_suggess = true
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          limit: parseInt(filter.limit),
          offset: +(parseInt(filter.limit) * (parseInt(filter.page) - 1)),
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    return responseListData(
      places,
      totalCount[0].total,
      filter.page,
      filter.limit,
      places.length
    );
  } catch (e) {
    logger.error(`ERR list suggess place: ${e.message}`);
    return responseListData([], 0, 0, 0, 0);
  }
};

module.exports = {
  addSuggessPlace,
  listSuggessPlace,
};
