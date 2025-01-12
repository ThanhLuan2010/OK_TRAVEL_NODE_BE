const logger = require('../config/logger');
const { setNodeCache, getNodeCache, delNodeCache } = require('../config/nodeCache');
const sequelize = require('../config/database');

const setMemberConversation = (account_id, listConversation) => {
  try {
    const result = [];
    listConversation.forEach((conversation) => {
      result.push(conversation.id);
    });

    setNodeCache(`${account_id}_member_chat`, result, 30 * 60);
  } catch (e) {
    logger.error(`ERR addMemberConversation: ${e.message}`);
  }
};

const getMemberConversation = async (account_id) => {
  try {
    let data = getNodeCache(`${account_id}_member_chat`);
    if (!data) {
      const conversations = await sequelize.query(
        `SELECT ce.*,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', cme.id,
                  'account_id', cme.account_id,
                  'email', ae.email,
                  'first_name', ae.first_name,
                  'last_name', ae.last_name,
                  'gender', ae.gender,
                  'image_url', ae.image_url,
                  'phone_number', ae.phone_number)
                ) AS members
        FROM conversation_entity ce
        LEFT JOIN conversation_member_entity cme
        ON ce.id = cme.conversation_id
        LEFT JOIN account_entity ae
        ON cme.account_id = ae.id
        WHERE ce.id IN (
          SELECT conversation_id
          FROM conversation_member_entity
          WHERE account_id = :account_id
        ) AND ce.is_delete = :is_delete
        GROUP BY ce.id`,
        {
          replacements: { account_id, is_delete: false },
          type: sequelize.QueryTypes.SELECT,
          raw: true,
        }
      );
      setMemberConversation(account_id, conversations);
    }
    data = getNodeCache(`${account_id}_member_chat`);
    return data;
  } catch (e) {
    logger.error(`ERR getMemberConversation: ${e.message}`);
  }
};

const delMemberConversation = async (account_id) => {
  try {
    delNodeCache(`${account_id}_member_chat`);
  } catch (e) {
    logger.error(`ERR delMemberConversation: ${e.message}`);
  }
};

// conversation { ..., members: [] }
const setConversation = (conversation) => {
  try {
    setNodeCache(`${conversation.id}_conversation`, conversation, 10 * 60);
  } catch (e) {
    logger.error(`ERR addMemberConversation: ${e.message}`);
  }
};

// return conversation { ..., member_{account_id}: {} }
const getConversation = async (conversation_id) => {
  try {
    let data = getNodeCache(`${conversation_id}_conversation`);
    if (!data) {
      const [conversation] = await sequelize.query(
        `SELECT ce.*,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', cme.id,
                  'account_id', cme.account_id,
                  'email', ae.email,
                  'first_name', ae.first_name,
                  'last_name', ae.last_name,
                  'gender', ae.gender,
                  'image_url', ae.image_url,
                  'phone_number', ae.phone_number)
                ) AS members
        FROM conversation_entity ce
        LEFT JOIN conversation_member_entity cme
        ON ce.id = cme.conversation_id
        LEFT JOIN account_entity ae
        ON cme.account_id = ae.id
        WHERE ce.id = :conversation_id AND ce.is_delete = :is_delete
        GROUP BY ce.id`,
        {
          replacements: { conversation_id, is_delete: false },
          type: sequelize.QueryTypes.SELECT,
          raw: true,
        }
      );
      if (conversation) {
        setConversation(conversation);
      }
    }
    data = getNodeCache(`${conversation_id}_conversation`);
    return data;
  } catch (e) {
    logger.error(`ERR addMemberConversation: ${e.message}`);
  }
};

module.exports = {
  setMemberConversation,
  getMemberConversation,
  delMemberConversation,
  setConversation,
  getConversation,
};
