const logger = require("../config/logger");
const sequelize = require("../config/database");
const { v4: uuid_v4 } = require("uuid");
const { verifyJWT } = require("../middlewares/jwtAuth");
const { MESSAGE_TYPE } = require("../constant/booking.contant");
const ApiError = require("../utils/ApiError");

const bookingHotel = async (req) => {
  const { id } = await verifyJWT(req);
  const transaction = await sequelize.transaction();
  const data = req.body;
  try {
    const bookingId = uuid_v4();

    const queryHotelId = `SELECT *
    FROM oktravel.room_type_entity
    where id = '${data?.roomTypeID}'`;

    const hotel = await sequelize.query(queryHotelId, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });
    if (
      hotel[0]?.max_booking_room < data?.quantityRoom ||
      hotel[0]?.max_adult < data?.number_adult ||
      hotel[0]?.max_children < data?.number_children
    ) {
      throw new ApiError(400, "Số lượng phòng còn trống không đủ");
    }

    const providerQuery = `SELECT *
    FROM oktravel.hotel_entity
    where id = '${hotel[0]?.hotel_id}'`;

    const provider = await sequelize.query(providerQuery, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const queryService = `SELECT *
    FROM room_service_entity
    where id = '${data?.serviceId}'`;

    const service = await sequelize.query(queryService, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const systemConfigQuery = `SELECT *
    FROM system_config_entity`;

    const systemConfig = await sequelize.query(systemConfigQuery, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    const price_no_tax = service[0]?.price
      ? (hotel[0]?.price_details + service[0]?.price) * data?.quantityRoom
      : hotel[0]?.price_details * data?.quantityRoom;
    const price_tax = (price_no_tax * systemConfig[0]?.vat_fee) / 100;
    const totalPrice = price_no_tax + price_tax;
    const commissionFee = (totalPrice * hotel[0]?.commission_rate) / 100;
    const tradingFee = (totalPrice * systemConfig[0]?.platform_fee) / 100;
    const totalFee = commissionFee + tradingFee;

    const query = `INSERT INTO booking_entity
        (account_custumer_id, account_proivider_id, booking_date, booking_status, booking_type, code, commission_fee, created_at, custumer_email,
        custumer_name, custumer_phone, discount_price, id, is_delete, last_modified_date, price_tax, price_no_tax, total_fee, total_price, trading_fee, voucher_code)
        VALUES (:account_custumer_id, :account_proivider_id, :booking_date, :booking_status, :booking_type, :code, :commission_fee, :created_at, :custumer_email,
        :custumer_name, :custumer_phone, :discount_price, :id, :is_delete, :last_modified_date, :price_tax, :price_no_tax, :total_fee, :total_price, :trading_fee, :voucher_code)`;
    await sequelize.query(query, {
      replacements: {
        account_custumer_id: id,
        account_proivider_id: provider[0]?.account_id,
        booking_date: new Date(),
        booking_status: MESSAGE_TYPE.PENDING,
        booking_type: "HOTTEL",
        code: uuid_v4(),
        commission_fee: commissionFee,
        created_at: new Date(),
        custumer_email: data.email,
        custumer_name: data?.name,
        custumer_phone: data?.phone,
        discount_price: 0,
        id: bookingId,
        is_delete: false,
        last_modified_date: new Date(),
        price_tax: price_tax,
        price_no_tax: price_no_tax,
        total_fee: totalFee,
        total_price: totalPrice,
        trading_fee: tradingFee,
        voucher_code: data?.voucher || null,
      },
      transaction,
    });

    const queryRoomBooking = `INSERT INTO room_booking_entity
    (id, check_in_date, check_out_date, quantity_room, status, booking_id, room_type_id, service_id, number_adult, number_children)
    VALUES (:id, :check_in_date, :check_out_date, :quantity_room, :status, :booking_id, :room_type_id, :service_id, :number_adult, :number_children)`;

    await sequelize.query(queryRoomBooking, {
      replacements: {
        id: uuid_v4(),
        check_in_date: new Date(data?.checkInTime)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        check_out_date: new Date(data?.checkOutTime)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        quantity_room: data?.quantityRoom,
        status: null,
        booking_id: bookingId,
        room_type_id: data?.roomTypeID,
        service_id: data?.serviceId,
        number_children: data?.number_children,
        number_adult: data?.number_adult,
      },
      transaction,
    });
    await transaction.commit();
    return bookingId;
  } catch (e) {
    await transaction.rollback();
    logger.error(`ERR createNewBlogCategory: ${e.message}`);
    throw new ApiError(e.code, e.message);
  }
};

const bookingTour = async (req) => {
  const { id } = await verifyJWT(req);
  const transaction = await sequelize.transaction();
  const {
    email,
    name,
    note,
    phone,
    start_date,
    number_adult,
    number_children,
    tour_id,
  } = req.body;
  try {
    const bookingId = uuid_v4();

    const queryTourPrice = `SELECT *
    FROM tour_price_entity
    WHERE tour_id = '${tour_id}'
    AND '${start_date}' BETWEEN start_date AND end_date`;

    const tourPrice = await sequelize.query(queryTourPrice, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });
    if (tourPrice.length <= 0) {
      throw new ApiError(400, "Tour đã quá hạn đặt");
    }

    const query = `INSERT INTO custumer_contact_entity
    (created_at, id, email, full_name, phone_number, start_date, total_adult, total_child, total_price, note, was_process)
    VALUES (:created_at, :id, :email, :full_name, :phone_number, :start_date, :total_adult, :total_child, :total_price, :note, :was_process)`;
    await sequelize.query(query, {
      replacements: {
        created_at: new Date(),
        id: bookingId,
        email: email,
        full_name: name,
        phone_number: phone,
        start_date: start_date,
        total_adult: number_adult,
        total_child: number_children,
        total_price:
          tourPrice[0]?.adult_ticket_price * number_adult +
          tourPrice[0]?.child_ticket_price * number_children,
        note: note,
        was_process:0
      },
      transaction,
    });
    await transaction.commit();
    return bookingId;
  } catch (e) {
    await transaction.rollback();
    logger.error(`ERR createNewBlogCategory: ${e.message}`);
    throw new ApiError(e.code, e.message);
  }
};

module.exports = {
  bookingHotel,
  bookingTour,
};
