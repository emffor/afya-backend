'use strict';

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [String],
  total: Number,
  orderDate: Date,
});
const Order = mongoose.model('Order', orderSchema);

module.exports.processSales = async (event) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
        },
      },
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify(result[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 }),
    };
  } catch (error) {
    console.error('Erro na função Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao processar os dados' }),
    };
  }
};
