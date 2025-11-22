import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import React from 'react'

interface PurchasePropPros {
    showPurchaseScreen: boolean,
    setShowPurchaseScreen: React.Dispatch<React.SetStateAction<boolean>>
}

const PurchaseProSubscription = ({ showPurchaseScreen, setShowPurchaseScreen }: PurchasePropPros) => {

    const axiosPrivate = useAxiosPrivate();

    const fetchPaymentSheetParams = async () => {
        
    }

    return (
        <div>PurchaseProSubscription</div>
    )
}

export default PurchaseProSubscription