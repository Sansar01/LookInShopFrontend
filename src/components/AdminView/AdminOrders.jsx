import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import AdminOrderDetail from './AdminOrderDetail'
import { Dialog } from '../ui/dialog'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin } from '@/store/admin/order-slice'
import { resetOrderDetails } from '@/store/shop/order-slice'

function AdminOrders() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const { orderList, orderDetails } = useSelector(state => state.adminOrder)
    const dispatch = useDispatch()

    const handleFetchOrderDetails = (getId) => {
        dispatch(getOrderDetailsForAdmin(getId))
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin())
    }, [dispatch])

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true)
    }, [orderDetails])

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0
                            ? orderList.map((orderItem) => (
                                <TableRow>
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${orderItem?.orderStatus === "confirmed"
                                                ? "bg-green-500"
                                                : orderItem?.orderStatus === "rejected"
                                                    ? "bg-red-600"
                                                    : "bg-black"
                                                }`}
                                        >
                                            {orderItem?.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Dialog
                                            open={openDetailsDialog}
                                            onOpenChange={() => {
                                                setOpenDetailsDialog(false);
                                                dispatch(resetOrderDetails());
                                            }}
                                        >
                                            <Button
                                                onClick={() =>
                                                    handleFetchOrderDetails(orderItem?._id)
                                                }
                                            >
                                                View Details
                                            </Button>
                                            <AdminOrderDetail orderDetails={orderDetails} />
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                            : null}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default AdminOrders