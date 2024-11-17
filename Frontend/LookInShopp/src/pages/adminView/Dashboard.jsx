import React from 'react'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/AdminView/ImageUpload';
import { addFeatureImage, getFeatureImages } from '@/store/common-slice';

function Dashboard() {

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const dispatch = useDispatch();

const handleUploadFeatureImage = ()=>{
  dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
    if (data?.payload?.success) {
      dispatch(getFeatureImages());
      setImageFile(null);
      setUploadedImageUrl("");
    }
  });
}

useEffect(() => {
  dispatch(getFeatureImages());
}, [dispatch]);

  return (
    <div>
      <ImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button 
      onClick={handleUploadFeatureImage} 
      className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default Dashboard