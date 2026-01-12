const mongoose = require('mongoose');
const Order = require('./backend/models/Order');

mongoose.connect('mongodb://localhost:27017/Mark').then(async () => {
    const order = await Order.findOne().sort({ createdAt: -1 });
    console.log(JSON.stringify(order, null, 2));
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
