const bcrypt = require('bcrypt');
const User = require('../model/user.model.js');

function getAllUsers() {
    return new Promise((resolve, reject) => {
        User.find().then((res) => {
            if (!res) {
                return reject(res);
            }
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    })
}

async function registerUser(user) {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(user.password, salt);

    user.password = hashPassword;

    return new Promise((resolve, reject) => {
        User.create(user).then((result) => {
            if (!result) {
                return reject(result);
            }
            resolve({
                id: result._id,
                username: result.username,
                name: result.name,
                message: 'register success',
                flag: true
            });
        }).catch((err) => {
            console.log(err.keyPattern);
            reject(err);
        });
    });

}

function loginUser(user) {

    return new Promise((resolve, reject) => {

        User.findOne().where('username').equals(user.username).then(async (result) => {
            if (!result) {
                return resolve({
                    message: 'Invalid username',
                    flag: false
                });
            }

            if (!await bcrypt.compare(user.password, result.password)) {
                return resolve({
                    message: 'Invalid password',
                    flag: false
                });
            }

            resolve({
                id: result._id,
                username: result.username,
                name: result.name,
                admin: result.admin,
                message: 'Successfully logged in',
                flag: true
            });
        }).catch(err => {
            console.log(err);
            reject(err);
        });

    });

}

function getShopcartItem(id) {

    return new Promise((resolve, reject) => {

        User.findById(id).then(result => {
            if (!result) {
                return reject(result);
            }
            resolve(result.shopcart);
        }).catch(err => {
            reject(err);
        });

    })

}

function addItemOtCart(id, product, price) {

    return new Promise((resolve, reject) => {

        User.findOneAndUpdate({ _id: id }, { $push: { shopcart: { product: product, price: price } } })
            .then(result => {
                if (!result) {
                    return reject(result);
                }
                resolve(result);
            }).catch(err => {
                reject({
                    flag: false,
                    message: err
                });
            });

    });
}

function deleteItemFromCart(id, index) {

    return new Promise((resolve, reject) => {
        if (index != 0) {
            User.updateOne(
                { _id: id },
                [
                    {
                        $set: {
                            shopcart: {
                                $concatArrays: [
                                    { $slice: ['$shopcart', 0, index] },
                                    { $slice: ['$shopcart', { $add: [index, 1] }, { $size: '$shopcart' }] }
                                ]
                            }
                        }
                    }
                ]
            )
                .then(updatedDocument => {
                    console.log('Updated Document:', updatedDocument);
                    resolve(updatedDocument);
                })
                .catch(error => {
                    console.error('Error updating document:', error);
                    reject(error);
                });
        } else {
            User.updateOne({ _id: id }, { $set: { shopcart: [] } }).then((resa) => {
                console.log(resa);
                resolve(resa);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        }
    });

}

function addOrder(order) {

    return new Promise(async (resolve, reject) => {

        const order_info = {
            products: order.product,
            total_price: order.total,
            delivery_address: order.address,
            payment_method: order.payment,
            payment_by: order.payment_ID
        }
        console.log(order_info);
        await deleteItemFromCart(order.id, 0);
        User.findOneAndUpdate({ _id: order.id }, { $push: { order: order_info } })
            .then(response => {
                console.log(response);
                resolve(response);
            }).catch(err => {
                reject({
                    flag: false,
                    message: err
                });
            });

    });
}

function getOrderHistory(id) {

    return new Promise((resolve, reject) => {

        User.findById(id).exec().then((user) => {
            resolve(user.order)
        })
            .catch(err => {
                reject({
                    flag: false,
                    menubar: err,
                });
            });


    });

}

module.exports = {
    registerUser,
    loginUser,
    getShopcartItem,
    addItemOtCart,
    deleteItemFromCart,
    addOrder,
    getOrderHistory,
    getAllUsers
}