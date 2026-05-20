const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/bookingModel");
const Socket = require("../models/socketModel");

// console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);


exports.makeBookingPayment = async (req, res) => {
  
// console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

  try {
    const { stationId, socketId, date, bookTime } = req.body;
    const userId = req.userId;

    const socket = await Socket.findById(socketId);
    console.log("Socket price:", socket.pricePerHour);

    if (!socket) {
      return res.status(404).json({ message: "Socket not found" });
    }

    if (socket.status !== "OPEN") {
      return res.status(400).json({ message: "Socket not available" });
    }

    const existingBooking = await Booking.findOne({
      socketId,
      date,
      bookTime,
      status: "CONFIRMED"
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const newBooking = await Booking.create({
      userId,
      stationId,
      socketId,
      bookTime,
      date,
      status: "CONFIRMED"
    });
    console.log(newBooking);
    

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Station Booking' },
            unit_amount: socket.pricePerHour * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        bookingId: newBooking._id.toString()
      },
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
};


exports.getBookedSlots = async (req, res) => {
  try {
    const { socketId, date } = req.query;

    const bookings = await Booking.find({
      socketId,
      date,
      status: "CONFIRMED"
    });

    console.log(bookings);
    

    res.status(200).json(bookings);

  } catch (err) {
    console.error("Fetch slots error:", err);
    res.status(500).json({ message: "Failed to fetch slots" });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ userId })
      .populate("stationId")
      .populate("socketId")
      .sort({ createdAtŌ: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Fetch user bookings error:", err);
    res.status(500).json({ message: "Failed to fetch booking history" });
  }
};
