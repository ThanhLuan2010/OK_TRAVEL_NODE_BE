const logger = require('../config/logger');
const sequelize = require('../config/database');
const { v4: uuid_v4 } = require('uuid');
const { responseListData } = require('../utils/responseFormat');
const { CONVERSATION_TYPE } = require('../constant/conversation.constant');
const { userService } = require('./index');

const findOneConversationMemberByTwoEmail = async (email1, email2) => {
  try {
    const data = await sequelize.query(
      `SELECT cme1.conversation_id
        FROM conversation_member_entity cme1
        JOIN conversation_member_entity cme2
        ON cme1.conversation_id = cme2.conversation_id
        WHERE cme1.email = :email1 AND cme2.email = :email2`,
      {
        replacements: { email1, email2 },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    if (data && data[0]) {
      return data[0].conversation_id;
    }
  } catch (e) {
    logger.error(`ERR findOneConversationMemberByTwoEmail: ${e.message}`);
  }
};

const detailConversation = async (conversation_id, limitMessage = 50) => {
  try {
    const conversationQuery = sequelize.query(
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
        WHERE ce.id = :conversation_id AND ce.is_delete = :is_delete`,
      {
        replacements: { conversation_id, is_delete: false },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    const messageQuery = sequelize.query(
      `SELECT *
        FROM conversation_message_entity
        WHERE conversation_id = :conversation_id AND is_delete = :is_delete
        ORDER BY created_at
        LIMIT :limitMessage`,
      {
        replacements: { conversation_id, is_delete: false, limitMessage },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    const [conversation, messages] = await Promise.all([conversationQuery, messageQuery]);
    const result = conversation[0];
    result.messages = messages;
    return result;
  } catch (e) {
    logger.error(`ERR detailConversation: ${e.message}`);
  }
};

const findOneOrCreateNewConversationPersonal = async (email1, email2) => {
  let conversation_id = await findOneConversationMemberByTwoEmail(email1, email2);

  // exists conversation
  if (conversation_id) {
    const result = await detailConversation(conversation_id);
    return result;
  }

  // create new conversation
  conversation_id = uuid_v4();

  const account1 = await userService.getUserByEmail(email1);
  const account2 = await userService.getUserByEmail(email2);

  if (!account1 || !account2) {
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const createConversation = sequelize.query(
      `INSERT INTO conversation_entity
         (id, created_at, is_delete, last_modified_date, lasted_message, lasted_sender_name, name, picture, type)
         VALUES (:id, :created_at, :is_delete, :last_modified_date, :lasted_message, :lasted_sender_name, :name,
                 :picture, :type)`,
      {
        replacements: {
          id: conversation_id,
          created_at: new Date(),
          is_delete: 0,
          last_modified_date: new Date(),
          lasted_message: '',
          lasted_sender_name: '',
          name: '',
          picture: '',
          type: CONVERSATION_TYPE.PERSONAL,
        },
        transaction,
      }
    );

    const createMember1 = sequelize.query(
      `INSERT INTO conversation_member_entity
         (id, created_at, is_delete, last_modified_date, account_id, conversation_id, email, is_owner)
         VALUES (:id, :created_at, :is_delete, :last_modified_date, :account_id, :conversation_id, :email, :is_owner)`,
      {
        replacements: {
          id: uuid_v4(),
          created_at: new Date(),
          is_delete: 0,
          last_modified_date: new Date(),
          account_id: account1.id,
          conversation_id,
          email: email1,
          is_owner: false,
        },
        transaction,
      }
    );

    const createMember2 = sequelize.query(
      `INSERT INTO conversation_member_entity
         (id, created_at, is_delete, last_modified_date, account_id, conversation_id, email, is_owner)
         VALUES (:id, :created_at, :is_delete, :last_modified_date, :account_id, :conversation_id, :email, :is_owner)`,
      {
        replacements: {
          id: uuid_v4(),
          created_at: new Date(),
          is_delete: 0,
          last_modified_date: new Date(),
          account_id: account2.id,
          conversation_id,
          email: email2,
          is_owner: false,
        },
        transaction,
      }
    );

    await Promise.all([createConversation, createMember1, createMember2]);

    await transaction.commit();

    const result = await detailConversation(conversation_id);
    return result;
  } catch (e) {
    await transaction.rollback();
    logger.error(`ERR findOneOrCreateNewConversationPersonal: ${e.message}`);
  }
};

const findListConversation = async (account_id, page = 1, limit = 20) => {
  try {
    const totalCount = await sequelize.query(
      `SELECT COUNT(*) as total
       FROM conversation_entity ce
       LEFT JOIN conversation_member_entity cme
       ON ce.id = cme.conversation_id
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
        GROUP BY ce.id
        ORDER BY ce.last_modified_date DESC
        LIMIT :limit OFFSET :offset`,
      {
        replacements: { account_id, is_delete: false, limit, offset: +(limit * (page - 1)) },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    // nodeCacheService.setMemberConversation(account_id, conversations);

    return responseListData(conversations, totalCount.length, page, limit, conversations.length);
  } catch (e) {
    logger.error(`ERR findListConversation: ${e.message}`);
    return responseListData([], 0, 0, 0, 0);
  }
};

const findListMessage = async (conversation_id, account_id, page, limit) => {
  try {
    const messages = await sequelize.query(
      `SELECT *
        FROM conversation_message_entity
        WHERE conversation_id = :conversation_id AND is_delete = 0
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          conversation_id,
          limit,
          offset: +(limit * (page - 1)),
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    return messages;
  } catch (e) {
    logger.error(`ERR findListMessage: ${e.message}`);
    return [];
  }
};

const newMessage = async (account, data) => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.query(
      `INSERT INTO conversation_message_entity
        (id, created_at, last_modified_date, is_delete, account_id, conversation_id, message, message_type)
        VALUES (:id, :created_at, :last_modified_date, :is_delete, :account_id, :conversation_id, :message, :message_type)`,
      {
        replacements: {
          id: uuid_v4(),
          created_at: new Date(),
          last_modified_date: new Date(),
          is_delete: 0,
          account_id: account.account_id,
          conversation_id: data.conversation_id,
          message: data.message,
          message_type: data.message_type,
        },
        transaction,
      }
    );

    await sequelize.query(
      `UPDATE conversation_entity SET
        last_modified_date = :last_modified_date,
        lasted_message = :lasted_message,
        lasted_sender_name = :lasted_sender_name
        WHERE id = :id`,
      {
        replacements: {
          last_modified_date: new Date(),
          lasted_message: data.message,
          lasted_sender_name: account.last_name,
          id: data.conversation_id,
        },
        transaction,
      }
    );

    await transaction.commit();
    return true;
  } catch (e) {
    await transaction.rollback();
    logger.error(`ERR newMessage: ${e.message}`);
    return false;
  }
};

module.exports = {
  findOneConversationMemberByTwoEmail,
  detailConversation,
  findOneOrCreateNewConversationPersonal,
  findListConversation,
  findListMessage,
  newMessage,
};
