const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../model/user.model.js');
const { response } = require('express');

router.post('/register', async (req, res) => {
    console.log (req.body);
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashPassword;

    User.create(req.body).then((result) => {
        res.send({
            id: result._id,
            username: result.username,
            name: result.name,
            flag:true
        });
    }).catch((err) => {
        console.log(err.keyPattern);
        res.status(409).send({
            flag: false,
            message: "user already exists"
        });
    });
});

router.post('/login', async (req, res) => {
    const user = await User.findOne().where('username').equals(req.body.username);

    if (!user) {
        return res.status(404).send({
            message: 'Invalid username',
            flag: false
        });
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'Invalid password',
            flag:false
        });
    }

    res.send({
        id: user._id,
        username: user.username,
        name: user.name,
        flag: true
    });

});

router.get('/get/shop-cart-items/:id', async (req, res) => {
    const user = await User.findById(req.params.id).then(result => {
        if (!result) {
            return res.status(401).send({ message: 'login please' });
        } else {
            return res.status(200).send(result.shopcart);
        }
    });
});

router.post('/addshopcart', function(req, res) {
    const item = {
        product: req.body.product,
        price: req.body.price
    }
    User.findOneAndUpdate({_id: req.body.id}, { $push: { shopcart: item } })
    .then(response => {
        res.status(200).send(response);
    }).catch(err => {
        res.status(500).send({
            flag:false,
            message: err
        });
    });
});

router.post('/shop/delete', (req, res)=>{
    var index = req.body.index;
    if(index != 0){
    User.updateOne(
        { _id: req.body.id },
        [
            {
              $set: {
                shopcart: {
                  $concatArrays: [
                    { $slice: ['$shopcart', 0, req.body.index] },
                    { $slice: ['$shopcart', { $add: [req.body.index, 1] }, { $size: '$shopcart' }] }
                  ]
                }
              }
            }
          ]
      )
      .then(updatedDocument => {
        console.log('Updated Document:', updatedDocument);
        res.send(updatedDocument);
      })
      .catch(error => {
        console.error('Error updating document:', error);
      });
    } else {
        User.updateOne({_id: req.body.id}, {$set: {shopcart: []}}).then((resa) => {console.log(resa)}).catch((error) => {console.log(error)});
    }
} );


router.post('/orders/create', (req, res) => {
    const order_info = {
        products: req.body.product,
        total_price: req.body.total,
        delivery_address: req.body.address,
        payment_method: req.body.payment,
        payment_by: req.body.payment_ID
    }
    console.log(order_info);
    User.findOneAndUpdate({_id: req.body.id}, { $set: { shopcart:[] }}).then((ans)=>{console.log(ans);});
    User.findOneAndUpdate({_id: req.body.id}, { $push: { order: order_info } })
    .then(response => {
        console.log(response);
        res.status(200).send(response);
    }).catch(err => {
        res.status(500).send({
            flag:false,
            message: err
        });
    });
});

router.get('/order-history/id/:id', (req, res) => {
    User.findById(req.params.id).exec().then((user) => { res.send(user.order) }).catch(err => { res.sendStatus(404) });
})

module.exports = router;