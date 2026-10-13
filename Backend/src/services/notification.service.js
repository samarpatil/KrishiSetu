const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  relatedOrder,
  relatedProduct,
}) => {
  return Notification.create({
    recipient,
    type,
    title,
    message,
    relatedOrder,
    relatedProduct,
  });
};

const notifyOrderCreated = async (order) => {
  return createNotification({
    recipient: order.seller,
    type: "order",
    title: "New Order Received",
    message: `You received a new order worth ₹${order.totalAmount}.`,
    relatedOrder: order._id,
    relatedProduct: order.product,
  });
};

const notifyOrderAccepted = async (order) => {
  return createNotification({
    recipient: order.buyer,
    type: "order",
    title: "Order Accepted",
    message: "Your order has been accepted by the seller.",
    relatedOrder: order._id,
    relatedProduct: order.product,
  });
};

const notifyOrderCompleted = async (order) => {
  return createNotification({
    recipient: order.buyer,
    type: "order",
    title: "Order Completed",
    message: "Your order has been completed successfully.",
    relatedOrder: order._id,
    relatedProduct: order.product,
  });
};

module.exports = {
  createNotification,
  notifyOrderCreated,
  notifyOrderAccepted,
  notifyOrderCompleted,
};
