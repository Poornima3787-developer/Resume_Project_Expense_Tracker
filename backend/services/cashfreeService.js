require('dotenv').config({ path: __dirname + '/../.env' });

const axios = require('axios');

const CF_BASE = 'https://sandbox.cashfree.com/pg'; 

const HEADERS = {
  'x-client-id':     process.env.CASHFREE_APP_ID,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY,
  'x-api-version':   '2022-09-01',
  'Content-Type':    'application/json',
};

exports.createOrder = async (orderId, orderAmount, orderCurrency = 'INR', customerID, customerPhone) => {
    
  try {
    const payload = {
      order_id:          orderId,
      order_amount:      orderAmount,
      order_currency:    orderCurrency,
      customer_details: {
        customer_id:     customerID,
        customer_phone:  customerPhone,
      },
      order_meta: {
        return_url:      `http://localhost:3000/payment-status/${orderId}`,
        notify_url:      `http://localhost:3000/webhook`,  
        payment_methods: 'cc,dc,upi',
      },
      order_expiry_time: new Date(Date.now() + 60*60*1000).toISOString(),
    };

    const { data } = await axios.post(
      `${CF_BASE}/orders`,
      payload,
      { headers: HEADERS }
    );
    return data.payment_session_id || data.payment_link;
  } catch (err) {
    console.error('Error creating order:', err.response?.data || err.message);
    throw err;
  }
};

exports.getPaymentStatus = async (orderId) => {
  try {
    const { data } = await axios.get(
      `${CF_BASE}/orders/${orderId}/payments`,
      { headers: HEADERS }
    );

    // Depending on API version:
    const status = data.sub_orders?.[0]?.payment_status || data.payment_status;
    if (status === 'SUCCESS') return 'SUCCESS';
    if (status === 'PENDING') return 'PENDING';
    return 'FAILED';
  } catch (err) {
    console.error('Error fetching order status:', err.response?.data || err.message);
    throw err;
  }
};


