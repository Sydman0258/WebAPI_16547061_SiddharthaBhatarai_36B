export default function OrderItems({ order }: { order: any }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Items</h2>
                <div className="divide-y divide-gray-50">
                    {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-3 text-sm">
                            <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            <span className="font-semibold text-gray-900">Rs. {(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>Rs. {order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span>Rs. {order.deliveryFee?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-base text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-red-600">Rs. {order.total?.toFixed(2)}</span>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-4 text-sm text-gray-500">
                <p><span className="font-semibold text-gray-700">Delivery Address:</span> {order.deliveryAddress}</p>
                {order.notes && <p className="mt-1"><span className="font-semibold text-gray-700">Notes:</span> {order.notes}</p>}
            </div>
        </div>
    );
}