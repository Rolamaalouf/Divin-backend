"use client";

import { useUpdateCartItem } from "../hooks/useCartHooks";
import { toast } from "react-toastify";

const CartItemList = ({ items = [], onDelete, onClearCart }) => {
  const { mutate: updateCartItem } = useUpdateCartItem();

  const handleUpdateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return toast.error("Quantity must be greater than 0");

    updateCartItem(
      { id: cartItemId, quantity },
      {
        onSuccess: () => toast.success("Cart item updated!"),
        onError: (err) =>
          toast.error(err.response?.data?.message || "Failed to update cart item"),
      }
    );
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * (item.Product?.price || 0),
    0
  );

  return (
    <div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">Cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 mb-4 border-b pb-4"
            >
              {/* Image Wrapper similar to ProductList */}
              <div className="w-[100px] h-[100px] flex items-center justify-center overflow-hidden bg-white rounded border">
                <div className="w-full h-full p-2">
                  <img
                    src={
                      item.Product?.image && item.Product.image.length > 0
                        ? item.Product.image[0]
                        : "/placeholder.jpg"
                    }
                    alt={item.Product?.name || "Product image"}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <p className="font-medium mb-1">{item.Product?.name || "Unnamed Product"}</p>
                <p className="text-sm text-gray-600 mb-1">
                  ${item.Product?.price?.toFixed(2) || "0.00"} × {item.quantity}
                </p>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(item.id, Number(e.target.value))
                  }
                  className="w-16 mt-1 px-2 py-1 border rounded text-sm"
                  min={1}
                />
              </div>

              <button
                onClick={() => onDelete(item.id)}
                className="text-red-600 text-sm hover:underline ml-auto"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-3">
            <p className="font-semibold">Total: ${totalPrice.toFixed(2)}</p>
            <button
              onClick={onClearCart}
              className="mt-2 w-full bg-red-500 text-white py-1.5 rounded hover:bg-red-600 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItemList;
