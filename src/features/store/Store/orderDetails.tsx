'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Flex } from '@/shared/ui/Flex';
import { H2, H3, H4, BaseText, Caption } from '@/shared/text';
import { Button } from '@/shared/utils/buttons';
import { CONTACT_INFO } from '@/shared/constants/contactInfo';
import { storeClient } from '@/lib/api/storeClient';
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

type OrderStatus =
  'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
    customerAccountName?: string;
    customerBankName?: string;
    paymentSlipUrl?: string;
  };
}

const OrderConfirmation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const orderId = searchParams.get('orderId');

  const statusSteps = [
    { id: 'pending', label: 'Order Placed', icon: Clock, active: true },
    { id: 'processing', label: 'Processing', icon: Package, active: false },
    { id: 'shipped', label: 'Shipped', icon: Truck, active: false },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, active: false },
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const storedOrder =
          (orderId ? await storeClient.getOrder(orderId) : null) ||
          (await storeClient.getLastOrder());

        if (!storedOrder) {
          setOrderDetails(null);
          return;
        }

        const resolvedPaymentStatus: PaymentStatus =
          storedOrder.paymentStatus === 'paid'
            ? 'completed'
            : storedOrder.paymentStatus === 'failed'
              ? 'failed'
              : storedOrder.paymentStatus === 'proof_submitted'
                ? 'processing'
                : 'pending';

        const mappedOrder: OrderDetails = {
          orderId: storedOrder.orderId,
          orderDate: storedOrder.orderDate,
          status: storedOrder.status,
          paymentMethod: storedOrder.paymentMethod as PaymentMethod,
          paymentStatus: resolvedPaymentStatus,
          subtotal: storedOrder.subtotal,
          deliveryFee: storedOrder.deliveryFee,
          total: storedOrder.total,
          items: storedOrder.items,
          customer: storedOrder.customer,
          bankDetails: storedOrder.bankDetails,
        };

        setOrderDetails(mappedOrder);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const paymentMethodConfig = {
    transfer: {
      icon: Building,
      label: 'Bank Transfer',
      color: 'var(--status-info)',
      description: 'Transfer to our bank account',
    },
    online: {
      icon: CreditCard,
      label: 'Online Payment',
      color: 'var(--status-success)',
      description: 'Paid with card/digital wallet',
    },
    delivery: {
      icon: Truck,
      label: 'Pay on Delivery',
      color: 'var(--status-warning)',
      description: 'Pay when order arrives',
    },
  };

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

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        title: `Order Confirmation - ${orderDetails?.orderId}`,
        text: `I just placed an order at Wisdom Church! Order ID: ${orderDetails?.orderId}`,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare?.(shareData)
      ) {
        await navigator.share(shareData);
        toast.success('Order shared.');
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      toast.success('Order link copied to clipboard.');
    } catch (error: unknown) {
      console.error('Error sharing:', error);
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        toast.error('Unable to share this order.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadReceipt = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const receiptContent = `
        WISDOM CHURCH STORE
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
        ${orderDetails?.items.map(item => `${item.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity} - NGN ${(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toLocaleString()}`).join('\n')}

        Subtotal: NGN ${orderDetails?.subtotal.toLocaleString()}
        ${orderDetails?.deliveryFee ? `Delivery Fee: NGN ${orderDetails.deliveryFee.toLocaleString()}` : ''}
        Total: NGN ${orderDetails?.total.toLocaleString()}

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
        <Flex direction="column" align="center" gap="lg">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--app-primary)]" />
          <H3 className="text-white">Loading Order Details...</H3>
        </Flex>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Flex direction="column" align="center" gap="lg">
          <AlertCircle className="w-16 h-16 text-[var(--status-error)]" />
          <H3 className="text-white">Couldn&apos;t load your order</H3>
          <Caption className="text-white/55">
            Something went wrong while fetching your order details. Please try
            again.
          </Caption>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Flex>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Flex direction="column" align="center" gap="lg">
          <AlertCircle className="w-16 h-16 text-[var(--status-error)]" />
          <H3 className="text-white">Order Not Found</H3>
          <Caption className="text-white/55">
            The order you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </Caption>
          <Button variant="primary" onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </Flex>
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
        <Flex direction="column" align="center" gap="sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-900/30">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <H2 className="text-green-500" weight="bold">
            Order Confirmed!
          </H2>
          <Caption className="text-lg text-white/55">
            Thank you for your purchase
          </Caption>
          <BaseText weight="semibold" className="text-white">
            Order ID: {orderDetails.orderId}
          </BaseText>
          <Caption className="text-white/55">
            {formatDate(orderDetails.orderDate)}
          </Caption>
        </Flex>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center no-print">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          disabled={isPrinting}
          className="border-white/[0.12] text-white"
        >
          <Flex align="center" gap="xs">
            {isPrinting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>Print Receipt</span>
          </Flex>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          disabled={isSharing}
          className="border-white/[0.12] text-white"
        >
          <Flex align="center" gap="xs">
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span>Share Order</span>
          </Flex>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          className="border-white/[0.12] text-white"
        >
          <Flex align="center" gap="xs">
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download Receipt</span>
          </Flex>
        </Button>
      </div>

      {/* Status Timeline */}
      <div className="rounded-2xl p-6 mb-6 shadow-lg border bg-white/[0.05] border-white/[0.12] print-section">
        <H3 className="text-lg font-bold mb-6 text-white">Order Status</H3>

        <div className="relative">
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-white/[0.12]" />

          <div className="space-y-8">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCurrentStep = orderDetails.status === step.id;
              const isCompleted =
                index <
                statusSteps.findIndex(s => s.id === orderDetails.status);
              const isActive = isCompleted || isCurrentStep;

              return (
                <Flex key={step.id} align="center" gap="md">
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                        isCurrentStep ? 'animate-pulse' : ''
                      } ${
                        isActive
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-white/[0.11] border-white/[0.12]'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${isActive ? 'text-green-500' : 'text-white/55'}`}
                      />
                    </div>
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <BaseText
                      weight="bold"
                      className={`text-base mb-1 ${isActive ? 'text-white' : 'text-white/55'}`}
                    >
                      {step.label}
                    </BaseText>
                    <Caption className="text-white/55">
                      {isCurrentStep
                        ? 'Your order is currently at this stage'
                        : isCompleted
                          ? 'Completed'
                          : 'Pending'}
                    </Caption>
                  </div>
                </Flex>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.05] border-white/[0.12] print-section">
            <H3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Package className="w-5 h-5" />
              Order Summary
            </H3>

            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="pb-4 border-b border-white/[0.07]">
                  <Flex justify="between" align="start">
                    <div className="flex-1">
                      <BaseText weight="semibold" className="text-white">
                        {item.name}
                      </BaseText>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Caption className="px-2 py-1 rounded-full text-xs bg-blue-500/15 text-blue-500">
                          {item.selectedSize}
                        </Caption>
                        <Caption className="px-2 py-1 rounded-full text-xs bg-yellow-500/15 text-yellow-500">
                          {item.selectedColor}
                        </Caption>
                        <Caption className="px-2 py-1 rounded-full text-xs bg-white/[0.08] text-white/55">
                          Qty: {item.quantity}
                        </Caption>
                      </div>
                    </div>
                    <BaseText weight="bold" className="text-white">
                      NGN{' '}
                      {(
                        parseFloat(item.price.replace(/[^\d.]/g, '')) *
                        item.quantity
                      ).toLocaleString()}
                    </BaseText>
                  </Flex>
                </div>
              ))}

              <div className="space-y-3 pt-4">
                <Flex justify="between">
                  <Caption className="text-white/55">Subtotal</Caption>
                  <BaseText weight="semibold">
                    NGN {orderDetails.subtotal.toLocaleString()}
                  </BaseText>
                </Flex>

                {orderDetails.deliveryFee > 0 && (
                  <Flex justify="between">
                    <Caption className="text-white/55">Delivery Fee</Caption>
                    <BaseText weight="semibold">
                      NGN {orderDetails.deliveryFee.toLocaleString()}
                    </BaseText>
                  </Flex>
                )}

                <div className="pt-4 border-t border-white/[0.12]">
                  <Flex justify="between">
                    <BaseText weight="bold" className="text-lg">
                      Total Amount
                    </BaseText>
                    <div className="text-right">
                      <BaseText
                        weight="bold"
                        className="text-2xl text-[var(--app-primary)]"
                      >
                        NGN {orderDetails.total.toLocaleString()}
                      </BaseText>
                      {orderDetails.deliveryFee > 0 && (
                        <Caption className="text-sm mt-1 text-white/55">
                          Includes NGN{' '}
                          {orderDetails.deliveryFee.toLocaleString()} delivery
                          fee
                        </Caption>
                      )}
                    </div>
                  </Flex>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.05] border-white/[0.12] print-section">
            <H3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </H3>

            <div className="space-y-4">
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                // eslint-disable-next-line no-restricted-syntax
                style={{ backgroundColor: `${paymentConfig.color}10` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ backgroundColor: `${paymentConfig.color}20` }}
                >
                  <paymentConfig.icon
                    className="w-5 h-5"
                    // eslint-disable-next-line no-restricted-syntax
                    style={{ color: paymentConfig.color }}
                  />
                </div>
                <div>
                  <BaseText weight="bold" className="text-white">
                    {paymentConfig.label}
                  </BaseText>
                  <Caption className="text-white/55">
                    {paymentConfig.description}
                  </Caption>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Caption className="text-sm mb-1 text-white/55">
                    Payment Status
                  </Caption>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        orderDetails.paymentStatus === 'completed'
                          ? 'bg-green-500'
                          : orderDetails.paymentStatus === 'processing'
                            ? 'bg-yellow-500'
                            : 'bg-[var(--app-subtle)]'
                      }`}
                    />
                    <BaseText
                      weight="semibold"
                      className={`capitalize ${
                        orderDetails.paymentStatus === 'completed'
                          ? 'text-green-500'
                          : orderDetails.paymentStatus === 'processing'
                            ? 'text-yellow-500'
                            : 'text-white/55'
                      }`}
                    >
                      {orderDetails.paymentStatus}
                    </BaseText>
                  </div>
                </div>

                <div>
                  <Caption className="text-sm mb-1 text-white/55">
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
                      className={`capitalize ${
                        orderDetails.status === 'delivered'
                          ? 'text-green-500'
                          : orderDetails.status === 'shipped'
                            ? 'text-blue-500'
                            : 'text-yellow-500'
                      }`}
                    >
                      {orderDetails.status}
                    </BaseText>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details */}
              {orderDetails.paymentMethod === 'transfer' &&
                orderDetails.bankDetails && (
                  <div className="p-4 rounded-xl mt-4 bg-blue-500/[0.06] border border-blue-500/25">
                    <H4 className="text-sm font-bold mb-3 flex items-center gap-2 text-blue-500">
                      <Building className="w-4 h-4" />
                      Your Bank Transfer Details
                    </H4>
                    <div className="space-y-2">
                      <Flex justify="between">
                        <Caption className="text-white/55">
                          Account Name:
                        </Caption>
                        <BaseText weight="semibold">
                          {orderDetails.bankDetails.customerAccountName}
                        </BaseText>
                      </Flex>
                      <Flex justify="between">
                        <Caption className="text-white/55">Bank Name:</Caption>
                        <BaseText weight="semibold">
                          {orderDetails.bankDetails.customerBankName}
                        </BaseText>
                      </Flex>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.05] border-white/[0.12] print-section">
            <H3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              Customer Information
            </H3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--app-primary)]/[0.15]">
                  <User className="w-5 h-5 text-[var(--app-primary)]" />
                </div>
                <div>
                  <BaseText weight="bold" className="text-white">
                    {orderDetails.customer.firstName}{' '}
                    {orderDetails.customer.lastName}
                  </BaseText>
                  <Caption className="text-white/55">Primary Contact</Caption>
                </div>
              </div>

              <div className="space-y-3">
                <Flex align="center" gap="sm">
                  <Mail className="w-4 h-4 text-white/55" />
                  <Caption className="text-white">
                    {orderDetails.customer.email}
                  </Caption>
                </Flex>

                <Flex align="center" gap="sm">
                  <Phone className="w-4 h-4 text-white/55" />
                  <Caption className="text-white">
                    {orderDetails.customer.phone}
                  </Caption>
                </Flex>

                {orderDetails.customer.address && (
                  <div className="pt-3 border-t border-white/[0.07]">
                    <Flex align="start" gap="sm" className="mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-white/55" />
                      <div>
                        <Caption
                          weight="semibold"
                          className="text-sm mb-1 text-white"
                        >
                          Shipping Address
                        </Caption>
                        <div className="space-y-1">
                          <Caption className="text-white/55">
                            {orderDetails.customer.address}
                          </Caption>
                          <Caption className="text-white/55">
                            {orderDetails.customer.city},{' '}
                            {orderDetails.customer.state}{' '}
                            {orderDetails.customer.zipCode}
                          </Caption>
                        </div>
                      </div>
                    </Flex>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.05] border-white/[0.12] print-section">
            <H3 className="text-lg font-bold mb-6 text-white">
              What&apos;s Next?
            </H3>

            <div className="space-y-4">
              {orderDetails.paymentMethod === 'transfer' && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-900/30">
                    <Building className="w-3 h-3 text-blue-500" />
                  </div>
                  <div>
                    <BaseText
                      weight="semibold"
                      className="text-sm mb-1 text-white"
                    >
                      Payment Verification
                    </BaseText>
                    <Caption className="text-xs text-white/55">
                      Our team will verify your bank transfer within 24 hours.
                      You&apos;ll receive a confirmation email.
                    </Caption>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-900/30">
                  <Mail className="w-3 h-3 text-green-500" />
                </div>
                <div>
                  <BaseText
                    weight="semibold"
                    className="text-sm mb-1 text-white"
                  >
                    Order Confirmation Email
                  </BaseText>
                  <Caption className="text-xs text-white/55">
                    We&apos;ve sent a confirmation email to{' '}
                    {orderDetails.customer.email} with your order details.
                  </Caption>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-900/30">
                  <Clock className="w-3 h-3 text-yellow-500" />
                </div>
                <div>
                  <BaseText
                    weight="semibold"
                    className="text-sm mb-1 text-white"
                  >
                    Processing Time
                  </BaseText>
                  <Caption className="text-xs text-white/55">
                    Orders are processed within 24-48 hours. You&apos;ll receive
                    updates via email and SMS.
                  </Caption>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-900/30">
                  <Phone className="w-3 h-3 text-purple-500" />
                </div>
                <div>
                  <BaseText
                    weight="semibold"
                    className="text-sm mb-1 text-white"
                  >
                    Need Help?
                  </BaseText>
                  <Caption className="text-xs text-white/55">
                    Contact our support team at {CONTACT_INFO.phone} or email{' '}
                    {CONTACT_INFO.email}
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
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      {/* Print Notice */}
      <div className="mt-8 text-center no-print">
        <Caption className="text-white/55">
          Keep this confirmation for your records. You can print this page or
          save it as PDF.
        </Caption>
      </div>
    </div>
  );
};

export default OrderConfirmation;
