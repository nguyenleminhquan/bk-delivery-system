export * from './enums';

export const OrderStatus = {
    WAITING: 'waiting',
    ACCEPTED: 'accepted',
    PICKED: 'picked',
    ARRIVED_SEND_STOCK: 'arrived_send_stock',
    ON_VEHICLE: 'on_vehicle',
    COMING_DEST_STOCK: 'coming_dest_stock',
    ARRIVED_DEST_STOCK: 'arrived_dest_stock',
    DELIVERING: 'delivering',
    SUCCESS: 'success',
    CANCEL: 'cancel'
}

export const CreateOrderSection = {
    SENDER: 'Người gửi',
    RECEIVER: 'Người nhận',
    PRODUCT: 'Sản phẩm',
    PAYMENT: 'Thanh toán',
    NOTE: 'Ghi chú'
}
