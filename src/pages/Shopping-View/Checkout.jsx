import CartItemsContent from "@/components/Shopping-View/CartItemsContent";
import img from "../../assets/images/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Address from "@/components/Shopping-View/Address";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

function Checkout() {

  const { user } = useSelector(state => state.auth)
  const { cartItems } = useSelector(state => state.shopCart)
  const { approvalUrl } = useSelector(state => state.shopOrder)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart, setIsPaymentStart] = useState(false)
  const { toast } = useToast();
  const dispatch = useDispatch();

  const totalCartAmount = cartItems.items && cartItems.items.length > 0 ?
    cartItems.items.reduce((sum, currentItem) => sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem.quantity, 0) : 0

  const handleInitiatePaypalPayment = () => {

    if(cartItems.items.length === 0)
    {
      toast({
        title: "Your cart is empty.Please add items to proceed",
        variant:'desctructive'
      })
    }

    if(currentSelectedAddress === null)
    {
      toast({
        title:'Please select one address to proceed...',
        variant:'destructive'
      })
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map(singleCartItem => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
        quantity: singleCartItem?.quantity
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        phone: currentSelectedAddress?.phone,
        pincode: currentSelectedAddress?.pincode,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      totalAmount: totalCartAmount,
      paymentId: '',
      payerId: '',
    }

      dispatch(createNewOrder(orderData)).then((data) => {
        if (data?.payload?.success) {
          setIsPaymentStart(true)
          setCurrentSelectedAddress(null)
        }
        else {
          setIsPaymentStart(false)
          setCurrentSelectedAddress(null)
        }
      })

  }

  if (approvalUrl) {
    window.location.href = approvalUrl;
  }
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          currentSelectedAddress={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
              <CartItemsContent cartItem={item} />
            ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout