import mongoose from 'mongoose'; // Import Mongoose if not imported already

const cartSchema = new mongoose.Schema({
    token: {
      type: String,
    },
    line_items: [
      {
        id: {
          type: Number,
        },
        properties: {
          type: Object
        },
        price: {
          type: Number
        },
        line_price:{
          type: Number
        },
        quantity:{
          type: Number
        }
      },
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart; // Export the Cart model as the default export
