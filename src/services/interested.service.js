const logger = require('../config/logger');
const sequelize = require('../config/database');
const { v4: uuid_v4 } = require('uuid');
const formatDateTime = require('../utils/formatDateTime');
const { responseListData } = require('../utils/responseFormat');
const { ENTITY } = require('../constant/entity.constant');

const list = async (account_id) => {
  try {
    const sql1 = sequelize.query(
      `SELECT * FROM interested_service_entity
        WHERE account_id = :account_id AND type = :type
        ORDER BY created_at DESC`,
      {
        replacements: {
          account_id,
          type: ENTITY.HOTEL,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    const sql2 = sequelize.query(
      `SELECT * FROM interested_service_entity
        WHERE account_id = :account_id AND type = :type
        ORDER BY created_at DESC`,
      {
        replacements: {
          account_id,
          type: ENTITY.TOUR,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    const sql3 = sequelize.query(
      `SELECT * FROM interested_service_entity
        WHERE account_id = :account_id AND type = :type
        ORDER BY created_at DESC`,
      {
        replacements: {
          account_id,
          type: ENTITY.JOURNEY,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );
    const sql4 = sequelize.query(
      `SELECT * FROM interested_service_entity
        WHERE account_id = :account_id AND type = :type
        ORDER BY created_at DESC`,
      {
        replacements: {
          account_id,
          type: ENTITY.PLAY_ZONE,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    const [hotels, tours, journeys, playZones] = await Promise.all([sql1, sql2, sql3, sql4]);

    const result = {};
    result[ENTITY.HOTEL] = hotels.map(({ is_delete, ...rest }) => rest);
    result[ENTITY.TOUR] = tours.map(({ is_delete, ...rest }) => rest);
    result[ENTITY.JOURNEY] = journeys.map(({ is_delete, ...rest }) => rest);
    result[ENTITY.PLAY_ZONE] = playZones.map(({ is_delete, ...rest }) => rest);

    return result;
  } catch (e) {
    logger.error(`ERR list: ${e.message}`);
    const result = {};
    result[ENTITY.HOTEL] = [];
    result[ENTITY.TOUR] = [];
    result[ENTITY.JOURNEY] = [];
    result[ENTITY.PLAY_ZONE] = [];
    return result;
  }
};

// if interested -> not; if not -> interested
// return 0 -> error
// return 1 -> interested
// return 2 -> no interested
// return 3 -> invalid service
const action = async (account_id, objData) => {
  try {
    let data = await sequelize.query(
      `SELECT *
        FROM interested_service_entity
        WHERE account_id = :account_id AND type = :type AND ref_id = :ref_id`,
      {
        replacements: {
          account_id,
          type: objData.type,
          ref_id: objData.ref_id,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    if (data && data.length > 0) {
      // delete interested
      await sequelize.query(
        `DELETE FROM interested_service_entity
        WHERE account_id = :account_id AND type = :type  AND ref_id = :ref_id`,
        {
          replacements: {
            account_id,
            type: objData.type,
            ref_id: objData.ref_id,
          },
          type: sequelize.QueryTypes.DELETE,
        }
      );

      return 2;
    }

    // check valid services
    data = await sequelize.query(
      `SELECT *
        FROM ${objData.type}_entity
        WHERE id = :id AND is_delete = 0`,
      {
        replacements: {
          id: objData.ref_id,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    if (data && data.length > 0) {
      await sequelize.query(
        `INSERT INTO interested_service_entity
        (id, created_at, is_delete, last_modified_date, account_id, ref_id, type) VALUES
        (:id, :created_at, :is_delete, :last_modified_date, :account_id, :ref_id, :type)`,
        {
          replacements: {
            id: uuid_v4(),
            created_at: new Date(),
            is_delete: 0,
            last_modified_date: new Date(),
            account_id,
            ref_id: objData.ref_id,
            type: objData.type,
          },
        }
      );

      return 1;
    }

    return 3;
  } catch (e) {
    logger.error(`ERR action interested: ${e.message}`);
    return 0;
  }
};

module.exports = {
  list,
  action,
};
