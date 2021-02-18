const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config() // Env variables

const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();
const DOMAIN = 'http://localhost:3000/checkout'

// Middlewares
app.use(bodyParser.json())

// Retrieve all products from stripe API
// const getAllProducts = async () => {
//     products = await stripe.products.list({
//         limit: 3,
//     });
// }
// getAllProducts();

// Routes
app.get('/ping', (req, res) => {
    res.send("pong")
});

app.post('/purchase', async (req, res) => {
    if (!req.body.cart) {
        res.status(400).send("Bad format")
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.cart.map(product => {
                return {
                    price: product.id,
                    quantity: product.qty
                }
            }),
            mode: 'payment',
            success_url: `${DOMAIN}?success=true`,
            cancel_url: `${DOMAIN}?canceled=true`,
        });

        res.json({ id: session.id });

    } catch (e) {
        res.status(400).json({ error: e.raw.message });
    }

})

app.listen(3000, console.log(`Server running on 3000`));
