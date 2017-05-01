const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const Transaction = mongoose.model('Transaction');

const operationTypes = ['income', 'outcome'];

exports.newTransactionPage = (req, res) => {
    const user = req.user;

    Wallet.findOne({_id: req.params.walletId}, (err, wallet) => {
        if(!wallet) {
            res.redirect('/404');
            return
        }

        if (!wallet._user.equals(user._id)) {
            res.redirect('/wallets');
            return;
        }

        const actionUrl = `/wallets/${wallet._id}/new-transaction`;

        res.render('new-transaction', {operationTypes, wallet, actionUrl})
    });

};

exports.create = function (req, res) {
    const user = req.user;

    console.log('Wallet id: ', req.params.walletId);

    Wallet
        .findOne({_id: req.params.walletId}, (err, wallet) => {

            if(!wallet) {
                res.redirect('/404');
                return
            }

            if (!wallet._user.equals(user._id)) {
                res.redirect('/wallets');
                return;
            }

            const transactionParams = {
                operation: req.body.operation,
                value: req.body.value,
                comment: req.body.comment,
                wallet: wallet._id
            };

            const transaction = new Transaction(transactionParams);

            if (transaction.operation === 'income') {
                wallet.balance += transaction.value;
            }

            if (transaction.operation === 'outcome') {
                wallet.balance -= transaction.value;
            }

            transaction.save(() => {
                wallet.save(() => {
                    res.redirect('/wallets/' + wallet._id);
                });
            });

        });
};