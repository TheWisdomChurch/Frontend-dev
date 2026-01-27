'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/components/utils/hooks/redux';
import { FlexboxLayout } from '@/components/layout';
import { H2, H3, H4, BaseText, Caption } from '@/components/text';
import { Button } from '@/components/utils/buttons';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  CheckCircle,
  Clock,
  Package,
  CreditCard,
  Building,
  Truck,
  User,
  MapPin,
  Mail,
  Phone,
  Printer,
  Share2,
  Download,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// Order status types
type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
type PaymentMethod = 'transfer' | 'online' | 'delivery';
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface OrderDetails {
  orderId: string;
  orderDate: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  bankDetails?: {
    customerAccountName: string;
    customerBankName: string;
    paymentSlipUrl?: string;
  };
}

const OrderConfirmation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { colorScheme } = useTheme();
  const cartItems = useAppSelector(state => state.cart.items);
  const cartTotal = useAppSelector(state => state.cart.total);

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const labelColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.borderLight;
  const successColor = colorScheme.success;
  const warningColor = colorScheme.warning;
  const infoColor = colorScheme.info;

  // Mock order status timeline
  const statusSteps = [
    { id: 'pending', label: 'Order Placed', icon: Clock, active: true },
    { id: 'processing', label: 'Processing', icon: Package, active: false },
    { id: 'shipped', label: 'Shipped', icon: Truck, active: false },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, active: false },
  ];

  // Fetch order details (will be replaced with API call)
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // In a real app, this would be an API call to fetch order by ID
        // For now, we'll create mock data based on URL params and cart state

        // Get payment method from localStorage or default to 'transfer'
        const storedPaymentMethod =
          (localStorage.getItem('lastPaymentMethod') as PaymentMethod) ||
          'transfer';
        const storedCustomerInfo = JSON.parse(
          localStorage.getItem('customerInfo') || '{}'
        );
        const storedBankDetails = JSON.parse(
          localStorage.getItem('bankDetails') || '{}'
        );

        const mockOrder: OrderDetails = {
          orderId: orderId || 'WH-' + Date.now().toString(36).toUpperCase(),
          orderDate: new Date().toISOString(),
          status: 'pending',
          paymentMethod: storedPaymentMethod,
          paymentStatus:
            storedPaymentMethod === 'delivery' ? 'pending' : 'processing',
          subtotal: cartTotal,
          deliveryFee:
            storedPaymentMethod === 'delivery'
              ? Math.max(1000, cartTotal * 0.1)
              : 0,
          total: parseFloat(amount || cartTotal.toString()),
          items: cartItems,
          customer: {
            firstName: storedCustomerInfo.firstName || 'John',
            lastName: storedCustomerInfo.lastName || 'Doe',
            email: storedCustomerInfo.email || 'customer@example.com',
            phone: storedCustomerInfo.phone || '+2348012345678',
            address: storedCustomerInfo.address,
            city: storedCustomerInfo.city,
            state: storedCustomerInfo.state,
            zipCode: storedCustomerInfo.zipCode,
          },
          bankDetails:
            storedPaymentMethod === 'transfer' ? storedBankDetails : undefined,
        };

        setOrderDetails(mockOrder);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, amount, cartItems, cartTotal]);

  // Payment method display config
  const paymentMethodConfig = {
    transfer: {
      icon: Building,
      label: 'Bank Transfer',
      color: infoColor,
      description: 'Transfer to our bank account',
    },
    online: {
      icon: CreditCard,
      label: 'Online Payment',
      color: successColor,
      description: 'Paid with card/digital wallet',
    },
    delivery: {
      icon: Truck,
      label: 'Pay on Delivery',
      color: warningColor,
      description: 'Pay when order arrives',
    },
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle print
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  // Handle share
  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Order Confirmation - ${orderDetails?.orderId}`,
          text: `I just placed an order at Wisdom House! Order ID: ${orderDetails?.orderId}`,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Order link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Handle download receipt
  const handleDownloadReceipt = () => {
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => {
      const receiptContent = `
        WISDOM HOUSE STORE
        Order Receipt
        =====================
        Order ID: ${orderDetails?.orderId}
        Date: ${orderDetails ? formatDate(orderDetails.orderDate) : ''}
        
        Customer Information:
        ${orderDetails?.customer.firstName} ${orderDetails?.customer.lastName}
        ${orderDetails?.customer.email}
        ${orderDetails?.customer.phone}
        ${orderDetails?.customer.address ? `${orderDetails.customer.address}, ${orderDetails.customer.city}, ${orderDetails.customer.state} ${orderDetails.customer.zipCode}` : ''}
        
        Payment Method: ${orderDetails?.paymentMethod.toUpperCase()}
        Payment Status: ${orderDetails?.paymentStatus.toUpperCase()}
        
        Items:
        ${orderDetails?.items.map(item => `${item.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity} - â‚¦${(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toLocaleString()}`).join('\n')}
        
        Subtotal: â‚¦${orderDetails?.subtotal.toLocaleString()}
        ${orderDetails?.deliveryFee ? `Delivery Fee: â‚¦${orderDetails.deliveryFee.toLocaleString()}` : ''}
        Total: â‚¦${orderDetails?.total.toLocaleString()}
        
        Thank you for your order!
        =====================
      `;

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Order_${orderDetails?.orderId}_Receipt.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FlexboxLayout direction="column" align="center" gap="lg">
          <Loader2
            className="w-12 h-12 animate-spin"
            style={{ color: colorScheme.primary }}
          />
          <H3 style={{ color: textColor }}>Loading Order Details...</H3>
        </FlexboxLayout>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FlexboxLayout direction="column" align="center" gap="lg">
          <AlertCircle
            className="w-16 h-16"
            style={{ color: colorScheme.error }}
          />
          <H3 style={{ color: textColor }}>Order Not Found</H3>
          <Caption style={{ color: labelColor }}>
            The order you're looking for doesn't exist or has been removed.
          </Caption>
          <Button
            variant="primary"
            onClick={() => router.push('/')}
            style={{
              backgroundColor: colorScheme.primary,
              color: colorScheme.black,
            }}
          >
            Return to Home
          </Button>
        </FlexboxLayout>
      </div>
    );
  }

  const paymentConfig = paymentMethodConfig[orderDetails.paymentMethod];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-section {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Header with Success Message */}
      <div className="text-center mb-8 print-section">
        <FlexboxLayout direction="column" align="center" gap="sm">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle
              className="w-10 h-10"
              style={{ color: successColor }}
            />
          </div>
          <H2
            fontFamily="bricolage"
            style={{ color: successColor }}
            weight="bold"
          >
            Order Confirmed!
          </H2>
          <Caption className="text-lg" style={{ color: labelColor }}>
            Thank you for your purchase
          </Caption>
          <BaseText weight="semibold" style={{ color: textColor }}>
            Order ID: {orderDetails.orderId}
          </BaseText>
          <Caption style={{ color: labelColor }}>
            {formatDate(orderDetails.orderDate)}
          </Caption>
        </FlexboxLayout>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center no-print">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          disabled={isPrinting}
          style={{
            borderColor: borderColor,
            color: textColor,
          }}
        >
          <FlexboxLayout align="center" gap="xs">
            {isPrinting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>Print Receipt</span>
          </FlexboxLayout>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          disabled={isSharing}
          style={{
            borderColor: borderColor,
            color: textColor,
          }}
        >
          <FlexboxLayout align="center" gap="xs">
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span>Share Order</span>
          </FlexboxLayout>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          style={{
            borderColor: borderColor,
            color: textColor,
          }}
        >
          <FlexboxLayout align="center" gap="xs">
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download Receipt</span>
          </FlexboxLayout>
        </Button>
      </div>

      {/* Status Timeline */}
      <div
        className="rounded-2xl p-6 mb-6 shadow-lg border print-section"
        style={{
          backgroundColor: cardBackground,
          borderColor: borderColor,
        }}
      >
        <H3 className="text-lg font-bold mb-6" style={{ color: textColor }}>
          Order Status
        </H3>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-8 top-10 bottom-10 w-0.5"
            style={{ backgroundColor: borderColor }}
          />

          <div className="space-y-8">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCurrentStep = orderDetails.status === step.id;
              const isCompleted =
                index <
                statusSteps.findIndex(s => s.id === orderDetails.status);

              return (
                <FlexboxLayout key={step.id} align="center" gap="md">
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isCurrentStep ? 'animate-pulse' : ''
                      }`}
                      style={{
                        backgroundColor:
                          isCompleted || isCurrentStep
                            ? `${successColor}20`
                            : `${labelColor}20`,
                        border: `2px solid ${
                          isCompleted || isCurrentStep
                            ? successColor
                            : borderColor
                        }`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{
                          color:
                            isCompleted || isCurrentStep
                              ? successColor
                              : labelColor,
                        }}
                      />
                    </div>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle
                          className="w-6 h-6"
                          style={{ color: successColor }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <BaseText
                      weight="bold"
                      className="text-base mb-1"
                      style={{
                        color:
                          isCompleted || isCurrentStep ? textColor : labelColor,
                      }}
                    >
                      {step.label}
                    </BaseText>
                    <Caption style={{ color: labelColor }}>
                      {isCurrentStep
                        ? 'Your order is currently at this stage'
                        : isCompleted
                          ? 'Completed'
                          : 'Pending'}
                    </Caption>
                  </div>
                </FlexboxLayout>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div
            className="rounded-2xl p-6 shadow-lg border print-section"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
            }}
          >
            <H3
              className="text-lg font-bold mb-6 flex items-center gap-2"
              style={{ color: textColor }}
            >
              <Package className="w-5 h-5" />
              Order Summary
            </H3>

            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div
                  key={index}
                  className="pb-4 border-b"
                  style={{ borderColor: `${borderColor}40` }}
                >
                  <FlexboxLayout justify="between" align="start">
                    <div className="flex-1">
                      <BaseText weight="semibold" style={{ color: textColor }}>
                        {item.name}
                      </BaseText>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Caption
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: `${infoColor}15`,
                            color: infoColor,
                          }}
                        >
                          {item.selectedSize}
                        </Caption>
                        <Caption
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: `${warningColor}15`,
                            color: warningColor,
                          }}
                        >
                          {item.selectedColor}
                        </Caption>
                        <Caption
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: `${borderColor}30`,
                            color: labelColor,
                          }}
                        >
                          Qty: {item.quantity}
                        </Caption>
                      </div>
                    </div>
                    <BaseText weight="bold" style={{ color: textColor }}>
                      â‚¦
                      {(
                        parseFloat(item.price.replace(/[^\d.]/g, '')) *
                        item.quantity
                      ).toLocaleString()}
                    </BaseText>
                  </FlexboxLayout>
                </div>
              ))}

              <div className="space-y-3 pt-4">
                <FlexboxLayout justify="between">
                  <Caption style={{ color: labelColor }}>Subtotal</Caption>
                  <BaseText weight="semibold">
                    â‚¦{orderDetails.subtotal.toLocaleString()}
                  </BaseText>
                </FlexboxLayout>

                {orderDetails.deliveryFee > 0 && (
                  <FlexboxLayout justify="between">
                    <Caption style={{ color: labelColor }}>
                      Delivery Fee
                    </Caption>
                    <BaseText weight="semibold">
                      â‚¦{orderDetails.deliveryFee.toLocaleString()}
                    </BaseText>
                  </FlexboxLayout>
                )}

                <div
                  className="pt-4 border-t"
                  style={{ borderColor: borderColor }}
                >
                  <FlexboxLayout justify="between">
                    <BaseText weight="bold" className="text-lg">
                      Total Amount
                    </BaseText>
                    <div className="text-right">
                      <BaseText
                        weight="bold"
                        className="text-2xl"
                        style={{ color: colorScheme.primary }}
                      >
                        â‚¦{orderDetails.total.toLocaleString()}
                      </BaseText>
                      {orderDetails.deliveryFee > 0 && (
                        <Caption
                          className="text-sm mt-1"
                          style={{ color: labelColor }}
                        >
                          Includes â‚¦{orderDetails.deliveryFee.toLocaleString()}{' '}
                          delivery fee
                        </Caption>
                      )}
                    </div>
                  </FlexboxLayout>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div
            className="rounded-2xl p-6 shadow-lg border print-section"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
            }}
          >
            <H3
              className="text-lg font-bold mb-6 flex items-center gap-2"
              style={{ color: textColor }}
            >
              <CreditCard className="w-5 h-5" />
              Payment Information
            </H3>

            <div className="space-y-4">
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: `${paymentConfig.color}10` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${paymentConfig.color}20` }}
                >
                  <paymentConfig.icon
                    className="w-5 h-5"
                    style={{ color: paymentConfig.color }}
                  />
                </div>
                <div>
                  <BaseText weight="bold" style={{ color: textColor }}>
                    {paymentConfig.label}
                  </BaseText>
                  <Caption style={{ color: labelColor }}>
                    {paymentConfig.description}
                  </Caption>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Caption
                    className="text-sm mb-1"
                    style={{ color: labelColor }}
                  >
                    Payment Status
                  </Caption>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        orderDetails.paymentStatus === 'completed'
                          ? 'bg-green-500'
                          : orderDetails.paymentStatus === 'processing'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                      }`}
                    />
                    <BaseText
                      weight="semibold"
                      className="capitalize"
                      style={{
                        color:
                          orderDetails.paymentStatus === 'completed'
                            ? successColor
                            : orderDetails.paymentStatus === 'processing'
                              ? warningColor
                              : labelColor,
                      }}
                    >
                      {orderDetails.paymentStatus}
                    </BaseText>
                  </div>
                </div>

                <div>
                  <Caption
                    className="text-sm mb-1"
                    style={{ color: labelColor }}
                  >
                    Order Status
                  </Caption>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        orderDetails.status === 'delivered'
                          ? 'bg-green-500'
                          : orderDetails.status === 'shipped'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                      }`}
                    />
                    <BaseText
                      weight="semibold"
                      className="capitalize"
                      style={{
                        color:
                          orderDetails.status === 'delivered'
                            ? successColor
                            : orderDetails.status === 'shipped'
                              ? infoColor
                              : warningColor,
                      }}
                    >
                      {orderDetails.status}
                    </BaseText>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details */}
              {orderDetails.paymentMethod === 'transfer' &&
                orderDetails.bankDetails && (
                  <div
                    className="p-4 rounded-xl mt-4"
                    style={{
                      backgroundColor: isDarkMode
                        ? colorScheme.opacity.info10
                        : colorScheme.opacity.info5,
                      border: `1px solid ${infoColor}40`,
                    }}
                  >
                    <H4
                      className="text-sm font-bold mb-3 flex items-center gap-2"
                      style={{ color: infoColor }}
                    >
                      <Building className="w-4 h-4" />
                      Your Bank Transfer Details
                    </H4>
                    <div className="space-y-2">
                      <FlexboxLayout justify="between">
                        <Caption style={{ color: labelColor }}>
                          Account Name:
                        </Caption>
                        <BaseText weight="semibold">
                          {orderDetails.bankDetails.customerAccountName}
                        </BaseText>
                      </FlexboxLayout>
                      <FlexboxLayout justify="between">
                        <Caption style={{ color: labelColor }}>
                          Bank Name:
                        </Caption>
                        <BaseText weight="semibold">
                          {orderDetails.bankDetails.customerBankName}
                        </BaseText>
                      </FlexboxLayout>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div
            className="rounded-2xl p-6 shadow-lg border print-section"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
            }}
          >
            <H3
              className="text-lg font-bold mb-6 flex items-center gap-2"
              style={{ color: textColor }}
            >
              <User className="w-5 h-5" />
              Customer Information
            </H3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colorScheme.primary}15` }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: colorScheme.primary }}
                  />
                </div>
                <div>
                  <BaseText weight="bold" style={{ color: textColor }}>
                    {orderDetails.customer.firstName}{' '}
                    {orderDetails.customer.lastName}
                  </BaseText>
                  <Caption style={{ color: labelColor }}>
                    Primary Contact
                  </Caption>
                </div>
              </div>

              <div className="space-y-3">
                <FlexboxLayout align="center" gap="sm">
                  <Mail className="w-4 h-4" style={{ color: labelColor }} />
                  <Caption style={{ color: textColor }}>
                    {orderDetails.customer.email}
                  </Caption>
                </FlexboxLayout>

                <FlexboxLayout align="center" gap="sm">
                  <Phone className="w-4 h-4" style={{ color: labelColor }} />
                  <Caption style={{ color: textColor }}>
                    {orderDetails.customer.phone}
                  </Caption>
                </FlexboxLayout>

                {/* Shipping Address */}
                {orderDetails.customer.address && (
                  <div
                    className="pt-3 border-t"
                    style={{ borderColor: `${borderColor}40` }}
                  >
                    <FlexboxLayout align="start" gap="sm" className="mb-2">
                      <MapPin
                        className="w-4 h-4 mt-0.5"
                        style={{ color: labelColor }}
                      />
                      <div>
                        <Caption
                          weight="semibold"
                          className="text-sm mb-1"
                          style={{ color: textColor }}
                        >
                          Shipping Address
                        </Caption>
                        <div className="space-y-1">
                          <Caption style={{ color: labelColor }}>
                            {orderDetails.customer.address}
                          </Caption>
                          <Caption style={{ color: labelColor }}>
                            {orderDetails.customer.city},{' '}
                            {orderDetails.customer.state}{' '}
                            {orderDetails.customer.zipCode}
                          </Caption>
                        </div>
                      </div>
                    </FlexboxLayout>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div
            className="rounded-2xl p-6 shadow-lg border print-section"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
            }}
          >
            <H3 className="text-lg font-bold mb-6" style={{ color: textColor }}>
              What's Next?
            </H3>

            <div className="space-y-4">
              {orderDetails.paymentMethod === 'transfer' && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building className="w-3 h-3 text-blue-500" />
                  </div>
                  <div>
                    <BaseText
                      weight="semibold"
                      className="text-sm mb-1"
                      style={{ color: textColor }}
                    >
                      Payment Verification
                    </BaseText>
                    <Caption className="text-xs" style={{ color: labelColor }}>
                      Our team will verify your bank transfer within 24 hours.
                      You'll receive a confirmation email.
                    </Caption>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3 h-3 text-green-500" />
                </div>
                <div>
                  <BaseText
                    weight="semibold"
                    className="text-sm mb-1"
                    style={{ color: textColor }}
                  >
                    Order Confirmation Email
                  </BaseText>
                  <Caption className="text-xs" style={{ color: labelColor }}>
                    We've sent a confirmation email to{' '}
                    {orderDetails.customer.email} with your order details.
                  </Caption>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-yellow-500" />
                </div>
                <div>
                  <BaseText
                    weight="semibold"
                    className="text-sm mb-1"
                    style={{ color: textColor }}
                  >
                    Processing Time
                  </BaseText>
                  <Caption className="text-xs" style={{ color: labelColor }}>
                    Orders are processed within 24-48 hours. You'll receive
                    updates via email and SMS.
                  </Caption>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3 h-3 text-purple-500" />
                </div>
                <div>
                  <BaseText
                    weight="semibold"
                    className="text-sm mb-1"
                    style={{ color: textColor }}
                  >
                    Need Help?
                  </BaseText>
                  <Caption className="text-xs" style={{ color: labelColor }}>
                    Contact our support team at +234-XXX-XXXX or email
                    support@wisdomhouse.com
                  </Caption>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-3 no-print">
            <Button
              variant="primary"
              size="lg"
              curvature="full"
              onClick={() => router.push('/')}
              style={{
                backgroundColor: colorScheme.primary,
                color: colorScheme.black,
              }}
              className="w-full"
            >
              Continue Shopping
            </Button>

            <Button
              variant="outline"
              size="lg"
              curvature="full"
              onClick={() => router.push('/orders')}
              style={{
                borderColor: borderColor,
                color: textColor,
              }}
              className="w-full"
            >
              View All Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Print Notice */}
      <div className="mt-8 text-center no-print">
        <Caption style={{ color: labelColor }}>
          Keep this confirmation for your records. You can print this page or
          save it as PDF.
        </Caption>
      </div>
    </div>
  );
};

export default OrderConfirmation;

