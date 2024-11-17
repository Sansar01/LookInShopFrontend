import ImageUpload from "@/components/AdminView/ImageUpload.jsx";
import AdminProductTile from "@/components/AdminView/AdminProductTile";
import CommonForm from "@/components/common/CommonForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast, useToast } from "@/hooks/use-toast"
import { addProductFormElements } from "@/config";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewProducts, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/product-slice";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function Products() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [ImageLoadingState, setImageLoadingState] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null)
  const { productList } = useSelector(state => state.adminProduct)
  const dispatch = useDispatch();
  const { toast } = useToast()


  const onSubmit = (e) => {
    e.preventDefault();

    currentEditedId !== null ? dispatch(editProduct({ id: currentEditedId, formData })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts())
        setFormData(initialFormData)
        setOpenCreateProductsDialog(false)
        setCurrentEditedId(null)
      }
    }) :
      dispatch(addNewProducts({
        ...formData,
        image: uploadedImageUrl
      })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts())
          setOpenCreateProductsDialog(false)
          setImageFile(null)
          setFormData(initialFormData);
          toast({
            title: 'Product add successfully'
          })
        }
      })
  };

  const isFormValid = () => {
    return Object.keys(formData).map(key => formData[key] !== '').every(item => item)
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  const handleDelete = (getCurrentDeletId) => {
   dispatch(deleteProduct(getCurrentDeletId)).then((data)=>{
    if(data?.payload?.success){
      dispatch(fetchAllProducts());
    }
   })
 
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
            <AdminProductTile
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            ImageLoadingState={ImageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default Products;
