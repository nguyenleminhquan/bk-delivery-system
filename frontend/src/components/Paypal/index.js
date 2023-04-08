import React from 'react'
import { PayPalButtons } from "@paypal/react-paypal-js";

function Paypal({ money_amount, handleCreateOrder, closePopup }) {
    const currency = "USD";
    const style = { "layout": "vertical" };

    return (
        <div>
            <p>Nhấn vào đây để thanh toán</p>
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[money_amount, currency, style]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency,
                                        value: (money_amount / 23465).toFixed(2),
                                    },
                                },
                            ],
                        })
                        .then((orderId) => {
                            return orderId;
                        });
                }}
                onApprove={function (data, actions) {
                    return actions.order.capture().then(function (msg) {
                        handleCreateOrder();
                        closePopup();
                    });
                }}
            />
        </div>
    )
}

export default Paypal