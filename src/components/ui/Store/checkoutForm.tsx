'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useAppSelector, useAppDispatch } from '@/components/utils/hooks/redux';
import { clearCart } from '@/lib/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import Button from '@/components/utils/CustomButton';
import { FlexboxLayout } from '@/components/layout';
import { H3, H4, BaseText, SmallText, Caption } from '@/components/text';
import { useTheme } from '@/components/contexts/ThemeContext';
import {
  CreditCard,
  Building,
  Truck,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  User,
  Banknote,
} from 'lucide-react';

// Payment method types
type PaymentMethod = 'transfer' | 'online' | 'delivery';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: PaymentMethod;
  paymentSlip?: File | null;
  customerAccountName?: string;
  customerBankName?: string;
}

// Online Payment Modal Component (matches ProductModal design)
const OnlinePaymentModal = ({
  isOpen,
  onClose,
  onSelectTransfer,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectTransfer: () => void;
}) => {
  const { colorScheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const modalBackground = colorScheme.black;
  const textColor = colorScheme.primary;
  const subtitleTextColor = colorScheme.white;
  const borderColor = colorScheme.primary;

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // FULL SCROLL LOCK
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'auto';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const tl = gsap.timeline();
      if (isMobile) {
        tl.fromTo(
          modalRef.current,
          { y: '100%', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
        );
      } else {
        tl.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
      }
    }
  }, [isOpen, isMobile]);

  const handleClose = () => {
    if (modalRef.current) {
      if (isMobile) {
        gsap.to(modalRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose,
        });
      } else {
        gsap.to(modalRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose,
        });
      }
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-3 ${isMobile ? 'pb-0' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          w-full mx-auto overflow-hidden border shadow-xl
          ${isMobile ? 'rounded-t-2xl rounded-b-none max-h-[85vh]' : 'rounded-2xl max-w-md max-h-[85vh]'}
        `}
        style={{ backgroundColor: modalBackground, borderColor: borderColor }}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          {/* Modal Header */}
          <div
            className="relative h-12 flex items-center justify-center border-b px-4"
            style={{ borderColor: borderColor }}
          >
            <button
              onClick={handleClose}
              className={`absolute ${isMobile ? 'top-2.5 right-2.5 p-1' : 'top-2.5 right-2.5 p-1'}`}
              style={{ backgroundColor: colorScheme.opacity.primary10 }}
            >
              <X className="w-3 h-3" style={{ color: textColor }} />
            </button>

            <H4
              fontFamily="bricolage"
              className="text-base"
              style={{ color: textColor }}
              useThemeColor={false}
              weight="bold"
            >
              Service Unavailable
            </H4>
          </div>

          {/* Modal Content */}
          <div
            className={`overflow-y-auto ${isMobile ? 'p-4 max-h-[calc(85vh-7rem)]' : 'p-5 max-h-[calc(85vh-8rem)]'}`}
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                </div>

                <SmallText
                  weight="semibold"
                  className="text-sm mb-1"
                  style={{ color: textColor }}
                >
                  Online Payment Temporarily Unavailable
                </SmallText>

                <Caption
                  className="text-xs mb-3"
                  style={{ color: subtitleTextColor }}
                >
                  Our online payment gateway is currently undergoing
                  maintenance. Please use our bank transfer option or pay on
                  delivery.
                </Caption>
              </div>

              <div className="space-y-2">
                <FlexboxLayout align="center" gap="sm">
                  <div className="w-4 h-4 rounded-full bg-blue-400/20 flex items-center justify-center flex-shrink-0">
                    <Building className="w-2.5 h-2.5 text-blue-400" />
                  </div>
                  <Caption
                    className="text-xs"
                    style={{ color: subtitleTextColor }}
                  >
                    <strong>Bank Transfer:</strong> Transfer to our account and
                    upload payment proof
                  </Caption>
                </FlexboxLayout>

                <FlexboxLayout align="center" gap="sm">
                  <div className="w-4 h-4 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-2.5 h-2.5 text-yellow-400" />
                  </div>
                  <Caption
                    className="text-xs"
                    style={{ color: subtitleTextColor }}
                  >
                    <strong>Pay on Delivery:</strong> Pay with cash or card when
                    your order arrives
                  </Caption>
                </FlexboxLayout>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className={`border-t p-3 ${isMobile ? '' : ''}`}
            style={{ borderColor: borderColor }}
          >
            <FlexboxLayout direction="column" gap="xs">
              <Button
                variant="primary"
                size="md"
                curvature="xl"
                onClick={() => {
                  handleClose();
                  onSelectTransfer();
                }}
                className="w-full py-2"
                style={{
                  backgroundColor: colorScheme.primary,
                  color: colorScheme.black,
                }}
              >
                <SmallText weight="semibold" className="text-sm">
                  Use Bank Transfer
                </SmallText>
              </Button>

              <Button
                variant="outline"
                size="md"
                curvature="xl"
                onClick={handleClose}
                className="w-full py-2"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                }}
              >
                <SmallText weight="medium" className="text-sm">
                  Close
                </SmallText>
              </Button>
            </FlexboxLayout>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const CheckoutForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const { colorScheme } = useTheme();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'transfer',
    paymentSlip: null,
    customerAccountName: '',
    customerBankName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Generate unique order ID (combination of timestamp and random string)
  const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `WH-${timestamp}-${randomStr}`;
  };

  const [orderId] = useState(generateOrderId());

  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const cardBackground = isDarkMode ? colorScheme.surface : colorScheme.white;
  const inputBackground = isDarkMode
    ? colorScheme.surfaceVariant
    : colorScheme.gray[50];
  const inputBorderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.borderLight;
  const textColor = isDarkMode ? colorScheme.white : colorScheme.black;
  const labelColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode ? colorScheme.border : colorScheme.borderLight;

  // Delivery fee (10% of total, min 1000)
  const deliveryFee = Math.max(1000, total * 0.1);
  const grandTotal =
    formData.paymentMethod === 'delivery' ? total + deliveryFee : total;

  // Payment method options
  const paymentMethods = [
    {
      id: 'transfer',
      title: 'Bank Transfer',
      description: 'Transfer to our account and upload proof',
      icon: Building,
      color: colorScheme.info,
      fee: 0,
    },
    {
      id: 'online',
      title: 'Online Payment',
      description: 'Pay instantly with card or digital wallet',
      icon: CreditCard,
      color: colorScheme.success,
      fee: 0,
    },
    {
      id: 'delivery',
      title: 'Pay on Delivery',
      description: 'Pay when your order arrives (Delivery fee applies)',
      icon: Truck,
      color: colorScheme.warning,
      fee: deliveryFee,
    },
  ];

  // Bank details
  const bankDetails = {
    bankName: 'Keystone Bank',
    accountName: 'Wisdom House Store',
    accountNumber: '1012879868',
  };

  useEffect(() => {
    // Reset payment slip and customer bank details when switching methods
    if (formData.paymentMethod !== 'transfer') {
      setFormData(prev => ({
        ...prev,
        paymentSlip: null,
        customerAccountName: '',
        customerBankName: '',
      }));
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentSlip;
        delete newErrors.customerAccountName;
        delete newErrors.customerBankName;
        return newErrors;
      });
    }
  }, [formData.paymentMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          paymentSlip: 'Please upload a JPG, PNG, or PDF file',
        }));
        return;
      }

      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          paymentSlip: 'File size must be less than 5MB',
        }));
        return;
      }

      setFormData(prev => ({ ...prev, paymentSlip: file }));
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentSlip;
        return newErrors;
      });

      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields: (keyof FormData)[] = [
      'firstName',
      'lastName',
      'email',
      'phone',
    ];

    // Basic form validation (always required)
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (Nigerian format)
    if (
      formData.phone &&
      !/^(\+234|0)[789]\d{9}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      errors.phone = 'Please enter a valid Nigerian phone number';
    }

    // Shipping address validation (only required for delivery)
    if (formData.paymentMethod === 'delivery') {
      const shippingFields: (keyof FormData)[] = [
        'address',
        'city',
        'state',
        'zipCode',
      ];
      shippingFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = 'This field is required for delivery';
        }
      });
    }

    // Payment method specific validations
    if (formData.paymentMethod === 'transfer') {
      if (!formData.paymentSlip) {
        errors.paymentSlip = 'Please upload your payment slip';
      }
      if (!formData.customerAccountName?.trim()) {
        errors.customerAccountName =
          'Please enter the account name used for transfer';
      }
      if (!formData.customerBankName?.trim()) {
        errors.customerBankName =
          'Please enter the bank name used for transfer';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save ALL necessary data to localStorage BEFORE clearing cart
      const orderData = {
        orderId,
        formData,
        items,
        subtotal: total,
        total: grandTotal,
        deliveryFee: formData.paymentMethod === 'delivery' ? deliveryFee : 0,
        status: 'pending',
        orderDate: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem('lastOrderData', JSON.stringify(orderData));
      localStorage.setItem('lastPaymentMethod', formData.paymentMethod);
      localStorage.setItem(
        'customerInfo',
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        })
      );

      if (formData.paymentMethod === 'transfer') {
        localStorage.setItem(
          'bankDetails',
          JSON.stringify({
            customerAccountName: formData.customerAccountName,
            customerBankName: formData.customerBankName,
          })
        );
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Order submitted:', orderData);

      // Clear cart and redirect to confirmation with order data
      dispatch(clearCart());
      router.push(
        `/order-confirmation?orderId=${orderId}&amount=${grandTotal}`
      );
    } catch (error) {
      console.error('Order submission failed:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: 'Failed to submit order. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  const isFormValid = Object.keys(formErrors).length === 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Order ID Display */}
      <div
        className="rounded-2xl p-4 mb-6 shadow-lg border"
        style={{
          backgroundColor: cardBackground,
          borderColor: borderColor,
        }}
      >
        <FlexboxLayout justify="between" align="center">
          <div>
            <Caption className="text-sm mb-1" style={{ color: labelColor }}>
              Order Reference
            </Caption>
            <BaseText weight="bold" style={{ color: textColor }}>
              {orderId}
            </BaseText>
          </div>
          <div className="text-right">
            <Caption className="text-sm mb-1" style={{ color: labelColor }}>
              Keep this for reference
            </Caption>
            <BaseText
              weight="semibold"
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: colorScheme.opacity.primary10,
                color: colorScheme.primary,
              }}
            >
              #ORDER-REF
            </BaseText>
          </div>
        </FlexboxLayout>
      </div>

      {/* Online Payment Modal */}
      {showOnlinePaymentModal && (
        <OnlinePaymentModal
          isOpen={showOnlinePaymentModal}
          onClose={() => setShowOnlinePaymentModal(false)}
          onSelectTransfer={() => {
            setFormData(prev => ({ ...prev, paymentMethod: 'transfer' }));
          }}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
          }}
        >
          <H3 className="text-xl font-bold mb-6" style={{ color: textColor }}>
            Contact Information
          </H3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['firstName', 'lastName', 'email', 'phone'].map(field => (
              <div key={field}>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: labelColor }}
                >
                  {field === 'firstName'
                    ? 'First Name *'
                    : field === 'lastName'
                      ? 'Last Name *'
                      : field === 'email'
                        ? 'Email *'
                        : 'Phone *'}
                </label>
                <input
                  type={
                    field === 'email'
                      ? 'email'
                      : field === 'phone'
                        ? 'tel'
                        : 'text'
                  }
                  name={field}
                  required
                  value={formData[field as keyof FormData] as string}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                    formErrors[field] ? 'border-red-500' : ''
                  }`}
                  style={{
                    backgroundColor: inputBackground,
                    borderColor: formErrors[field]
                      ? colorScheme.error
                      : inputBorderColor,
                    color: textColor,
                  }}
                  placeholder={
                    field === 'phone'
                      ? 'e.g., 08012345678 or +2348012345678'
                      : ''
                  }
                />
                {formErrors[field] && (
                  <Caption className="text-red-500 text-xs mt-1">
                    {formErrors[field]}
                  </Caption>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Payment Method Selection */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
          }}
        >
          <H3 className="text-xl font-bold mb-6" style={{ color: textColor }}>
            Payment Method
          </H3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              const isSelected = formData.paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    if (method.id === 'online') {
                      setShowOnlinePaymentModal(true);
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        paymentMethod: method.id as PaymentMethod,
                      }));
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    isSelected ? 'ring-2 ring-offset-2' : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    backgroundColor: inputBackground,
                    borderColor: isSelected ? method.color : borderColor,
                    borderWidth: isSelected ? '2px' : '1px',
                    color: textColor,
                    ...(isSelected && {
                      boxShadow: `0 0 0 2px ${method.color}20`,
                    }),
                  }}
                >
                  <FlexboxLayout align="center" gap="sm" className="mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${method.color}15` }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: method.color }}
                      />
                    </div>
                    <SmallText weight="bold" className="text-base">
                      {method.title}
                    </SmallText>
                  </FlexboxLayout>
                  <Caption className="text-sm mb-2">
                    {method.description}
                  </Caption>
                  {method.fee > 0 && (
                    <Caption
                      weight="semibold"
                      className="text-sm"
                      style={{ color: method.color }}
                    >
                      + ₦{method.fee.toLocaleString()} fee
                    </Caption>
                  )}
                </button>
              );
            })}
          </div>

          {/* Payment Method Details */}
          {formData.paymentMethod === 'transfer' && (
            <div className="space-y-6">
              {/* Bank Details */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: isDarkMode
                    ? colorScheme.opacity.info10
                    : colorScheme.opacity.info5,
                  border: `1px solid ${colorScheme.info}40`,
                }}
              >
                <H4
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: colorScheme.info }}
                >
                  <Building className="w-5 h-5" />
                  Bank Transfer Details
                </H4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Caption
                        className="text-sm mb-1"
                        style={{ color: labelColor }}
                      >
                        Bank Name
                      </Caption>
                      <BaseText weight="semibold">
                        {bankDetails.bankName}
                      </BaseText>
                    </div>
                    <div>
                      <Caption
                        className="text-sm mb-1"
                        style={{ color: labelColor }}
                      >
                        Account Name
                      </Caption>
                      <BaseText weight="semibold">
                        {bankDetails.accountName}
                      </BaseText>
                    </div>
                    <div>
                      <Caption
                        className="text-sm mb-1"
                        style={{ color: labelColor }}
                      >
                        Account Number
                      </Caption>
                      <BaseText weight="semibold" className="text-lg">
                        {bankDetails.accountNumber}
                      </BaseText>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl mt-2"
                    style={{
                      backgroundColor: isDarkMode
                        ? colorScheme.opacity.warning10
                        : colorScheme.opacity.warning5,
                      border: `1px solid ${colorScheme.warning}40`,
                    }}
                  >
                    <FlexboxLayout align="center" gap="sm" className="mb-2">
                      <AlertCircle
                        className="w-4 h-4"
                        style={{ color: colorScheme.warning }}
                      />
                      <Caption
                        weight="semibold"
                        className="text-sm"
                        style={{ color: colorScheme.warning }}
                      >
                        Important Instructions
                      </Caption>
                    </FlexboxLayout>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: labelColor }}
                    >
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: colorScheme.success }}
                        />
                        <span>
                          Transfer the exact amount:{' '}
                          <strong>₦{grandTotal.toLocaleString()}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: colorScheme.success }}
                        />
                        <span>
                          Use the account name:{' '}
                          <strong>{bankDetails.accountName}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: colorScheme.success }}
                        />
                        <span>
                          Take a screenshot/snapshot of your transfer
                          confirmation
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: colorScheme.success }}
                        />
                        <span>
                          Upload the payment slip below with your bank details
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Customer Bank Details & Upload */}
              <div>
                <H4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Bank Details & Payment Proof
                </H4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Account Name *
                      </label>
                      <input
                        type="text"
                        name="customerAccountName"
                        value={formData.customerAccountName || ''}
                        onChange={handleInputChange}
                        placeholder="Enter the account name you used for transfer"
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                          formErrors.customerAccountName ? 'border-red-500' : ''
                        }`}
                        style={{
                          backgroundColor: inputBackground,
                          borderColor: formErrors.customerAccountName
                            ? colorScheme.error
                            : inputBorderColor,
                          color: textColor,
                        }}
                      />
                      {formErrors.customerAccountName && (
                        <Caption className="text-red-500 text-xs mt-1">
                          {formErrors.customerAccountName}
                        </Caption>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Bank Name *
                      </label>
                      <input
                        type="text"
                        name="customerBankName"
                        value={formData.customerBankName || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., First Bank, GTBank, Access Bank"
                        className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                          formErrors.customerBankName ? 'border-red-500' : ''
                        }`}
                        style={{
                          backgroundColor: inputBackground,
                          borderColor: formErrors.customerBankName
                            ? colorScheme.error
                            : inputBorderColor,
                          color: textColor,
                        }}
                      />
                      {formErrors.customerBankName && (
                        <Caption className="text-red-500 text-xs mt-1">
                          {formErrors.customerBankName}
                        </Caption>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Slip/Proof *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="paymentSlip"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                      />
                      <label
                        htmlFor="paymentSlip"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:border-yellow-400 ${
                          formErrors.paymentSlip ? 'border-red-500' : ''
                        }`}
                        style={{
                          backgroundColor: inputBackground,
                          borderColor: formErrors.paymentSlip
                            ? colorScheme.error
                            : borderColor,
                        }}
                      >
                        {formData.paymentSlip ? (
                          <>
                            <CheckCircle
                              className="w-8 h-8 mb-2"
                              style={{ color: colorScheme.success }}
                            />
                            <BaseText weight="semibold" className="text-center">
                              {formData.paymentSlip.name}
                            </BaseText>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            )}
                            <Caption
                              className="text-xs mt-1"
                              style={{ color: labelColor }}
                            >
                              Click to change file
                            </Caption>
                          </>
                        ) : (
                          <>
                            <Upload
                              className="w-8 h-8 mb-2"
                              style={{ color: labelColor }}
                            />
                            <BaseText weight="semibold" className="text-center">
                              Click to upload payment slip
                            </BaseText>
                            <Caption
                              className="text-sm mt-1"
                              style={{ color: labelColor }}
                            >
                              Upload screenshot/snapshot of your transfer
                            </Caption>
                            <Caption
                              className="text-xs mt-1"
                              style={{ color: labelColor }}
                            >
                              JPG, PNG or PDF (max 5MB)
                            </Caption>
                          </>
                        )}
                      </label>
                    </div>
                    {formErrors.paymentSlip && (
                      <Caption className="text-red-500 text-xs mt-1">
                        {formErrors.paymentSlip}
                      </Caption>
                    )}

                    <Caption
                      className="text-xs mt-2"
                      style={{ color: labelColor }}
                    >
                      <strong>What to upload:</strong> Screenshot of successful
                      transfer, bank transfer receipt, or mobile banking
                      confirmation showing amount, date, and our account
                      details.
                    </Caption>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'delivery' && (
            <div
              className="p-6 rounded-2xl mb-6"
              style={{
                backgroundColor: isDarkMode
                  ? colorScheme.opacity.warning10
                  : colorScheme.opacity.warning5,
                border: `1px solid ${colorScheme.warning}40`,
              }}
            >
              <H4
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ color: colorScheme.warning }}
              >
                <Truck className="w-5 h-5" />
                Pay on Delivery Details
              </H4>
              <div className="space-y-3">
                <FlexboxLayout align="center" gap="sm">
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: colorScheme.success }}
                  />
                  <Caption>
                    You can pay with <strong>cash</strong> or{' '}
                    <strong>card</strong> when your order arrives
                  </Caption>
                </FlexboxLayout>
                <FlexboxLayout align="center" gap="sm">
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: colorScheme.success }}
                  />
                  <Caption>
                    Our delivery agent will bring a POS machine for card
                    payments
                  </Caption>
                </FlexboxLayout>
                <FlexboxLayout align="center" gap="sm">
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: colorScheme.success }}
                  />
                  <Caption>
                    Delivery within 3-5 business days in Lagos, 7-10 days
                    elsewhere
                  </Caption>
                </FlexboxLayout>

                <div className="mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                  <FlexboxLayout align="center" gap="sm">
                    <Banknote
                      className="w-4 h-4"
                      style={{ color: colorScheme.warning }}
                    />
                    <Caption
                      weight="semibold"
                      style={{ color: colorScheme.warning }}
                    >
                      Delivery Fee: ₦{deliveryFee.toLocaleString()} added to
                      your total
                    </Caption>
                  </FlexboxLayout>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Shipping Address (Only for delivery) */}
        {formData.paymentMethod === 'delivery' && (
          <div
            className="rounded-2xl p-6 shadow-lg border"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
            }}
          >
            <H3 className="text-xl font-bold mb-6" style={{ color: textColor }}>
              Shipping Address
            </H3>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: labelColor }}
                >
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                    formErrors.address ? 'border-red-500' : ''
                  }`}
                  style={{
                    backgroundColor: inputBackground,
                    borderColor: formErrors.address
                      ? colorScheme.error
                      : inputBorderColor,
                    color: textColor,
                  }}
                />
                {formErrors.address && (
                  <Caption className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </Caption>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['city', 'state', 'zipCode'].map(field => (
                  <div key={field}>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: labelColor }}
                    >
                      {field === 'city'
                        ? 'City *'
                        : field === 'state'
                          ? 'State *'
                          : 'ZIP Code *'}
                    </label>
                    <input
                      type="text"
                      name={field}
                      required
                      value={formData[field as keyof FormData] as string}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${
                        formErrors[field] ? 'border-red-500' : ''
                      }`}
                      style={{
                        backgroundColor: inputBackground,
                        borderColor: formErrors[field]
                          ? colorScheme.error
                          : inputBorderColor,
                        color: textColor,
                      }}
                    />
                    {formErrors[field] && (
                      <Caption className="text-red-500 text-xs mt-1">
                        {formErrors[field]}
                      </Caption>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Order Summary */}
        <div
          className="rounded-2xl p-6 shadow-lg border"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
          }}
        >
          <H3 className="text-xl font-bold mb-6" style={{ color: textColor }}>
            Order Summary
          </H3>

          <div className="space-y-4">
            <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
              <Caption
                className="text-sm font-medium mb-1"
                style={{ color: labelColor }}
              >
                Order ID
              </Caption>
              <BaseText weight="bold" style={{ color: textColor }}>
                {orderId}
              </BaseText>
              <Caption className="text-xs mt-1" style={{ color: labelColor }}>
                Please save this reference for future inquiries
              </Caption>
            </div>

            {items.map(item => (
              <FlexboxLayout key={item.id} justify="between" align="center">
                <div className="flex-1">
                  <BaseText weight="semibold" style={{ color: textColor }}>
                    {item.name}
                  </BaseText>
                  <Caption className="text-sm" style={{ color: labelColor }}>
                    {item.selectedSize} • {item.selectedColor} • Qty:{' '}
                    {item.quantity}
                  </Caption>
                </div>
                <BaseText weight="bold" style={{ color: textColor }}>
                  ₦
                  {(
                    parseFloat(item.price.replace(/[^\d.]/g, '')) *
                    item.quantity
                  ).toLocaleString()}
                </BaseText>
              </FlexboxLayout>
            ))}

            <div
              className="space-y-3 border-t pt-4"
              style={{ borderColor: borderColor }}
            >
              <FlexboxLayout justify="between">
                <Caption style={{ color: labelColor }}>Subtotal</Caption>
                <BaseText weight="semibold">₦{total.toLocaleString()}</BaseText>
              </FlexboxLayout>

              {formData.paymentMethod === 'delivery' && (
                <FlexboxLayout justify="between">
                  <Caption style={{ color: labelColor }}>Delivery Fee</Caption>
                  <BaseText weight="semibold">
                    ₦{deliveryFee.toLocaleString()}
                  </BaseText>
                </FlexboxLayout>
              )}

              <FlexboxLayout
                justify="between"
                className="pt-3 border-t"
                style={{ borderColor: borderColor }}
              >
                <BaseText weight="bold" className="text-lg">
                  Total Amount:
                </BaseText>
                <div className="text-right">
                  <BaseText
                    weight="bold"
                    className="text-2xl"
                    style={{ color: colorScheme.primary }}
                  >
                    ₦{grandTotal.toLocaleString()}
                  </BaseText>
                  {formData.paymentMethod === 'delivery' && (
                    <Caption
                      className="text-sm mt-1"
                      style={{ color: labelColor }}
                    >
                      Includes ₦{deliveryFee.toLocaleString()} delivery fee
                    </Caption>
                  )}
                </div>
              </FlexboxLayout>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        {formErrors.submit && (
          <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <FlexboxLayout align="center" gap="sm">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
              <Caption className="text-red-600 dark:text-red-400">
                {formErrors.submit}
              </Caption>
            </FlexboxLayout>
          </div>
        )}
        // In your CheckoutForm component, update the submit button:
        <Button
          type="submit"
          variant="primary"
          size="lg"
          curvature="full"
          elevated={true}
          disabled={!isFormValid || isSubmitting}
          className="w-full transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor:
              isFormValid && !isSubmitting
                ? colorScheme.primary
                : colorScheme.textTertiary,
            color: colorScheme.black,
          }}
        >
          {isSubmitting ? (
            <FlexboxLayout align="center" gap="sm">
              <Loader2 className="w-5 h-5 animate-spin" />
              Confirming Your Order...
            </FlexboxLayout>
          ) : (
            `Confirm Order - ₦${grandTotal.toLocaleString()}`
          )}
        </Button>
        {/* Form validation notice */}
        {!isFormValid && (
          <Caption
            className="text-center text-sm"
            style={{ color: colorScheme.warning }}
          >
            Please fill in all required fields correctly to complete your order.
          </Caption>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
