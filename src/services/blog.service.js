const logger = require('../config/logger');
const sequelize = require('../config/database');
const { v4: uuid_v4 } = require('uuid');
const formatDateTime = require('../utils/formatDateTime');
const { responseListData } = require('../utils/responseFormat');

// data: { title, description, icon, url, images[] }
const createNewBlogCategory = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const blogCategoryId = uuid_v4();

    const query = `INSERT INTO blog_category_entity
        (id, title, created_at, last_modified_date, is_delete, description, icon, is_hidden, url)
        VALUES (:id, :title, :created_at, :last_modified_date, :is_delete, :description, :icon, :is_hidden, :url)`;

    await sequelize.query(query, {
      replacements: {
        id: blogCategoryId,
        title: data.title,
        created_at: new Date(),
        last_modified_date: new Date(),
        is_delete: 0,
        description: data.description,
        icon: data.icon,
        is_hidden: 0,
        url: data.url,
      },
      transaction,
    });

    if (data.images && data.images.length > 0) {
      const date = formatDateTime(new Date());
      const values = data.images
        .map((image, index) => `('${uuid_v4()}', '${image}', '${date}', '${date}', 0, '${blogCategoryId}', ${index + 1})`)
        .join(', ');

      const query = `INSERT INTO blog_category_image_entity
        (id, image, created_at, last_modified_date, is_delete, blog_category_id, order_number) VALUES ${values}`;

      await sequelize.query(query, {}, transaction);
    }

    await transaction.commit();

    return blogCategoryId;
  } catch (e) {
    await transaction.rollback();
    logger.error(`ERR createNewBlogCategory: ${e.message}`);
  }
};

const detailBlogCategory = async (blogCategoryId) => {
  try {
    const query = `SELECT *
        FROM blog_category_entity
        WHERE id = '${blogCategoryId}'`;

    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const queryImages = `SELECT *
        FROM blog_category_image_entity
        WHERE blog_category_id = '${blogCategoryId}'
        ORDER BY order_number`;

    const images = await sequelize.query(queryImages, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const result = data[0];

    if (!result) {
      return;
    }

    result.is_delete = Buffer.isBuffer(result.is_delete) ? Boolean(result.is_delete.readUInt8(0)) : null;
    result.is_hidden = Buffer.isBuffer(result.is_hidden) ? Boolean(result.is_hidden.readUInt8(0)) : null;
    result.images = images.map((image) => {
      delete image.is_delete;
      return image;
    });

    return result;
  } catch (e) {
    logger.error(`ERR detailBlogCategory: ${e.message}`);
  }
};

const listBlogCategory = async () => {
  try {
    const query = `SELECT bc.*, bci.id as bci_id, bci.created_at as bci_created_at,
        bci.last_modified_date as bci_last_modified_date, bci.blog_category_id as bci_blog_category_id,
        bci.image as bci_image, bci.order_number as bci_order_number
        FROM blog_category_entity bc
        LEFT JOIN blog_category_image_entity bci
        ON bc.id = bci.blog_category_id AND bci.is_delete = 0
        WHERE bc.is_delete = 0 AND bc.is_hidden = 0
        ORDER BY bc.id, bci_order_number`;

    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const result = [];
    let bci_blog_category_id = '';
    let images = [];
    let category = {};
    for (let i = 0; i < data.length; i++) {
      if (bci_blog_category_id !== data[i].id) {
        if (i > 0) {
          result[result.length - 1].images = images;
          images = [];
        }
        category = {
          id: data[i].id,
          created_at: data[i].created_at,
          last_modified_date: data[i].last_modified_date,
          description: data[i].description,
          icon: data[i].icon,
          title: data[i].title,
          url: data[i].url,
        };
        result.push(category);

        bci_blog_category_id = data[i].bci_blog_category_id;
      }

      if (data[i].bci_id) {
        images.push({
          id: data[i].bci_id,
          created_at: data[i].bci_created_at,
          last_modified_date: data[i].bci_last_modified_date,
          blog_category_id: data[i].bci_blog_category_id,
          image: data[i].bci_image,
          order_number: data[i].bci_order_number,
        });
      }
    }

    result[result.length - 1].images = images;
    return result;
  } catch (e) {
    logger.error(`ERR listBlogCategory: ${e.message}`);
    return [];
  }
};

// data: { title, description, icon, url, images[], is_delete, is_hidden }
const updateBlogCategory = async (id, data) => {
  const transaction = await sequelize.transaction();

  try {
    const updateSql = `
    UPDATE blog_category_entity
    SET
        title = :title,
        description = :description,
        icon = :icon,
        url = :url,
        last_modified_date = :last_modified_date,
        is_delete = :is_delete,
        is_hidden = :is_hidden
    WHERE id = :id`;

    await sequelize.query(
      updateSql,
      {
        replacements: {
          title: data.title,
          description: data.description,
          icon: data.icon,
          url: data.url,
          last_modified_date: formatDateTime(new Date()),
          is_delete: data.is_delete,
          is_hidden: data.is_hidden,
          id: id,
        },
        type: sequelize.QueryTypes.UPDATE,
      },
      transaction
    );

    const deleteSqlImage = `
    DELETE FROM blog_category_image_entity
    WHERE blog_category_id = :blog_category_id`;

    await sequelize.query(
      deleteSqlImage,
      {
        replacements: {
          blog_category_id: id,
        },
        type: sequelize.QueryTypes.DELETE,
      },
      transaction
    );

    if (data.images && data.images.length > 0) {
      const date = formatDateTime(new Date());
      const values = data.images
        .map((image, index) => `('${uuid_v4()}', '${image}', '${date}', '${date}', 0, '${id}', ${index + 1})`)
        .join(', ');

      const insertSqlImage = `INSERT INTO blog_category_image_entity
        (id, image, created_at, last_modified_date, is_delete, blog_category_id, order_number) VALUES ${values}`;

      await sequelize.query(insertSqlImage, {}, transaction);
    }

    await transaction.commit();
    return true;
  } catch (e) {
    await transaction.rollback();
    logger.error(`ERR updateBlogCategory: ${e.message}`);
    return false;
  }
};

const findBlogCategoryById = async (id) => {
  try {
    const query = `SELECT *
        FROM blog_category_entity
        WHERE id = '${id}'`;

    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    return data[0];
  } catch (e) {
    logger.error(`ERR findBlogCategoryById: ${e.message}`);
  }
};

// filter { is_delete, is_hidden }
const listAdminBlogCategory = async (filter) => {
  try {
    const query = `SELECT bc.*, bci.id as bci_id, bci.created_at as bci_created_at,
        bci.last_modified_date as bci_last_modified_date,
        bci.blog_category_id as bci_blog_category_id, bci.is_delete as bci_is_delete,
        bci.image as bci_image, bci.order_number as bci_order_number
        FROM blog_category_entity bc
        LEFT JOIN blog_category_image_entity bci
        ON bc.id = bci.blog_category_id AND bci.is_delete = ${filter.is_delete}
        WHERE bc.is_delete = ${filter.is_delete} AND bc.is_hidden = ${filter.is_hidden}
        ORDER BY bc.id, bci_order_number`;

    const data = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const result = [];
    let bci_blog_category_id = '';
    let images = [];
    let category = {};
    for (let i = 0; i < data.length; i++) {
      if (bci_blog_category_id !== data[i].id) {
        if (i > 0) {
          result[result.length - 1].images = images;
          images = [];
        }
        category = {
          id: data[i].id,
          created_at: data[i].created_at,
          last_modified_date: data[i].last_modified_date,
          description: data[i].description,
          icon: data[i].icon,
          title: data[i].title,
          url: data[i].url,
          is_delete: Buffer.isBuffer(data[i].is_delete) ? Boolean(data[i].is_delete.readUInt8(0)) : null,
          is_hidden: Buffer.isBuffer(data[i].is_hidden) ? Boolean(data[i].is_hidden.readUInt8(0)) : null,
        };
        result.push(category);

        bci_blog_category_id = data[i].bci_blog_category_id;
      }

      if (data[i].bci_id) {
        images.push({
          id: data[i].bci_id,
          created_at: data[i].bci_created_at,
          last_modified_date: data[i].bci_last_modified_date,
          blog_category_id: data[i].bci_blog_category_id,
          image: data[i].bci_image,
          order_number: data[i].bci_order_number,
          is_delete: Buffer.isBuffer(data[i].bci_is_delete) ? Boolean(data[i].bci_is_delete.readUInt8(0)) : null,
        });
      }
    }

    result[result.length - 1].images = images;
    return result;
  } catch (e) {
    logger.error(`ERR listBlogCategory: ${e.message}`);
    return [];
  }
};

// ==============================================================================

const listBlog = async (filter) => {
  try {
    const totalCount = await sequelize.query(
      `SELECT COUNT(*) as total
        FROM blog_entity
        WHERE blog_category_id = :blog_category_id
        AND is_hidden = 0 AND is_delete = 0`,
      {
        replacements: {
          blog_category_id: filter.blog_category_id,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    const blogs = await sequelize.query(
      `SELECT *
        FROM blog_entity
        WHERE blog_category_id = :blog_category_id
        AND is_hidden = 0 AND is_delete = 0
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          blog_category_id: filter.blog_category_id,
          limit: filter.limit,
          offset: +(filter.limit * (filter.page - 1)),
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    blogs.map((blog) => {
      blog.is_delete = Buffer.isBuffer(blog.is_delete) ? Boolean(blog.is_delete.readUInt8(0)) : null;
      blog.is_hidden = Buffer.isBuffer(blog.is_hidden) ? Boolean(blog.is_hidden.readUInt8(0)) : null;
      return blog;
    });

    return responseListData(blogs, totalCount[0].total, filter.page, filter.limit, blogs.length);
  } catch (e) {
    logger.error(`ERR listBlog: ${e.message}`);
    return responseListData([], 0, 0, 0, 0);
  }
};

// data: { blog_category_id, title, description, content, url }
const createNewBlog = async (account_id, data) => {
  try {
    const blogId = uuid_v4();

    const query = `INSERT INTO blog_entity
        (id, title, created_at, last_modified_date, is_delete, description, content, is_hidden, url, account_id, blog_category_id)
        VALUES (:id, :title, :created_at, :last_modified_date, :is_delete, :description, :content, :is_hidden, :url, :account_id, :blog_category_id)`;

    await sequelize.query(query, {
      replacements: {
        id: blogId,
        created_at: new Date(),
        is_delete: 0,
        last_modified_date: new Date(),
        account_id,
        blog_category_id: data.blog_category_id,
        description: data.description,
        content: data.content,
        is_hidden: 0,
        title: data.title,
        url: data.url,
      },
    });

    return blogId;
  } catch (e) {
    logger.error(`ERR createNewBlog: ${e.message}`);
  }
};

const findBlogById = async (blogId) => {
  try {
    const data = await sequelize.query(
      `SELECT * FROM blog_entity
        WHERE id = :id`,
      {
        replacements: {
          id: blogId,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    return data[0];
  } catch (e) {
    logger.error(`ERR findBlogById: ${e.message}`);
  }
};

const detailBlog = async (blogId) => {
  try {
    const data = await sequelize.query(
      `SELECT * FROM blog_entity
        WHERE id = :id`,
      {
        replacements: {
          id: blogId,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    const result = data[0];

    if (!result) {
      return;
    }

    result.is_delete = Buffer.isBuffer(result.is_delete) ? Boolean(result.is_delete.readUInt8(0)) : null;
    result.is_hidden = Buffer.isBuffer(result.is_hidden) ? Boolean(result.is_hidden.readUInt8(0)) : null;

    return result;
  } catch (e) {
    logger.error(`ERR detailBlog: ${e.message}`);
  }
};

// data: { blog_category_id, title, description, content, url, is_delete, is_hidden }
const updateBlog = async (id, data) => {
  try {
    await sequelize.query(
      `UPDATE blog_entity
    SET
        title = :title,
        description = :description,
        content = :content,
        url = :url,
        last_modified_date = :last_modified_date,
        blog_category_id = :blog_category_id,
        is_delete = :is_delete,
        is_hidden = :is_hidden
    WHERE id = :id`,
      {
        replacements: {
          title: data.title,
          description: data.description,
          content: data.content,
          url: data.url,
          last_modified_date: formatDateTime(new Date()),
          blog_category_id: data.blog_category_id,
          is_delete: data.is_delete,
          is_hidden: data.is_hidden,
          id: id,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    return true;
  } catch (e) {
    logger.error(`ERR updateBlog: ${e.message}`);
    return false;
  }
};

const listAdminBlog = async (filter) => {
  try {
    const totalCount = await sequelize.query(
      `SELECT COUNT(*) as total
        FROM blog_entity
        WHERE blog_category_id = :blog_category_id
        AND is_hidden = :is_hidden AND is_delete = :is_delete`,
      {
        replacements: {
          blog_category_id: filter.blog_category_id,
          is_hidden: filter.is_hidden,
          is_delete: filter.is_delete,
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    const blogs = await sequelize.query(
      `SELECT *
        FROM blog_entity
        WHERE blog_category_id = :blog_category_id
        AND is_hidden = :is_hidden AND is_delete = :is_delete
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          blog_category_id: filter.blog_category_id,
          is_hidden: filter.is_hidden,
          is_delete: filter.is_delete,
          limit: filter.limit,
          offset: +(filter.limit * (filter.page - 1)),
        },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      }
    );

    blogs.map((blog) => {
      blog.is_delete = Buffer.isBuffer(blog.is_delete) ? Boolean(blog.is_delete.readUInt8(0)) : null;
      blog.is_hidden = Buffer.isBuffer(blog.is_hidden) ? Boolean(blog.is_hidden.readUInt8(0)) : null;
      return blog;
    });

    return responseListData(blogs, totalCount[0].total, filter.page, filter.limit, blogs.length);
  } catch (e) {
    logger.error(`ERR listAdminBlog: ${e.message}`);
    return responseListData([], 0, 0, 0, 0);
  }
};

module.exports = {
  createNewBlogCategory,
  detailBlogCategory,
  listBlogCategory,
  updateBlogCategory,
  findBlogCategoryById,
  listAdminBlogCategory,
  listBlog,
  createNewBlog,
  findBlogById,
  updateBlog,
  detailBlog,
  listAdminBlog,
};
