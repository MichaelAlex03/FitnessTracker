const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const createStripeIntent = async (req, res) => {

    const { email } = req.body
    let customer;

    const customers = await stripe.customers.list({ email, limit: 1});
    if (customers.length > 1) {
        customer = customers.data[0].id;
    } else {
        customer = await stripe.customers.create({ email })
    }



    const customerSession = await stripe.customerSessions.create({
        customer: customer.id,
        components: {
            mobile_payment_element: {
                enabled: true,
                features: {
                    payment_method_save: 'enabled',
                    payment_method_redisplay: 'enabled',
                    payment_method_remove: 'enabled'
                }
            },
        },
    });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'usd',
        customer: customer.id,
    });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        customerSessionClientSecret: customerSession.client_secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
}

module.exports = { createStripeIntent }