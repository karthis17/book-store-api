const router = require('express').Router();
const controller = require('../controller/user.controller');

router.post('/register', async (req, res) => {
    console.log(req.body);

    try {
        const user = await controller.registerUser(req.body);
        res.status(200).send(user);
    }

    catch (err) {
        res.status(420).send({
            flag: 'error',
            message: 'Error registering user'
        });
    }

});

router.post('/login', async (req, res) => {

    try {
        const user = await controller.loginUser(req.body);
        console.log(user);
        res.send(user);
    }

    catch (err) {
        res.status(500).send({
            flag: false,
            message: "Internal error."
        });
    }

});

router.get('/get/shop-cart-items/:id', async (req, res) => {
    try {
        const item = await controller.getShopcartItem(req.params.id);
        res.send(item);
    }

    catch (err) {
        console.log(err);
        res.status(500).send({
            flag: false,
            message: "Internal error."
        });
    }
});

router.post('/addshopcart', async (req, res) => {

    try {
        await controller.addItemOtCart(req.body.id, req.body.product, req.body.price);
        res.send({
            flag: true,
            message: "Added"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            flag: false,
            message: "Internal error."
        });
    }

});

router.post('/shop/delete', async (req, res) => {

    try {
        let message = await controller.deleteItemFromCart(req.body.id, req.body.index)
        res.send({
            flag: true,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            flag: false,
            message: "Internal error."
        });

    }
});


router.post('/orders/create', async (req, res) => {

    try {
        const message = await controller.addOrder(req.body);
        res.send({
            flag: true,
            message: message
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/order-history/id/:id', async (req, res) => {

    try {
        let order = await controller.getOrderHistory(req.params.id);
        res.send(order);
    }

    catch (error) {
        res.status(400).send(error);
    }

})

module.exports = router;