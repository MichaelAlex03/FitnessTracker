const stripePayment = async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
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
        currency: 'eur',
        customer: customer.id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        customerSessionClientSecret: customerSession.client_secret,
        customer: customer.id,
        publishableKey: 'pk_test_51JGZUXCQQLgS1lWmCBVEf4pjszDxVHe21vosctxUAgJZw2RZjH9R0FXTRBzrlDRWLDYDnxyDlDY9elMZbADNXcim00yf790JCh'
    });
}