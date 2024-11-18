import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardContent, CardHeader } from "../ui/card";
import { useActionData } from "react-router-dom";
import CommonForm from "../common/CommonForm";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, editAddress, fetchAllAddress } from "@/store/shop/address-slice";
import { useToast } from "@/hooks/use-toast";
import AddressCard from "./AddressCard";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, currentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  const handleManageAddress = (e) => {
    e.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null ? dispatch(editAddress({
      userId: user?.id,
      addressId: currentEditedId,
      formData
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddress({ userId: user?.id }));
        setCurrentEditedId(null)
        setFormData(initialAddressFormData)
        toast({
          title: 'Address updated successfully'
        })
      }
    }) : dispatch(
      addNewAddress({
        ...formData,
        userId: user?.id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Address added succesfully",
        });
        dispatch(fetchAllAddress({ userId: user?.id }));
        setFormData(initialAddressFormData);
      }
    });
  };

  const handleEditAddress = (getCurrentAddress) => {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  };

  const handleDeleteAddress = (getCurrentAddressId) => {
    dispatch(
      deleteAddress({
        userId: user?.id,
        addressId: getCurrentAddressId._id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Address deleted successfully",
        });
        dispatch(fetchAllAddress({ userId: user?.id }));
      }
    });
  };

  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  };

  useEffect(() => {
    dispatch(fetchAllAddress({ userId: user?.id }));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
            <AddressCard
              currentSelectedAddress={currentSelectedAddress}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
