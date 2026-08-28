'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppSelector, useAppDispatch } from '@/shared/utils/hooks/redux';
import { clearCart } from '@/lib/store/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/utils/buttons';
import { Flex } from '@/shared/ui/Flex';
import { H3, H4, BaseText, SmallText, Caption } from '@/shared/text';
import { storeClient } from '@/lib/api/storeClient';
import {
  CreditCard,
  Building,
  Truck,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Banknote,
} from 'lucide-react';
const OnlinePaymentModal = dynamic(() => import('./OnlinePaymentModal'), {
  ssr: false,
});
import { LocationFields, PhoneNumberField } from '@/shared/ui/forms';
import {
  DEFAULT_PHONE_COUNTRY,
  isValidNationalPhone,
  toE164,
} from '@/lib/validation/phone';
import type { CountryCode } from 'libphonenumber-js';

type PaymentMethod = 'transfer' | 'online' | 'delivery';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: PaymentMethod;
  paymentSlip?: File | null;
  customerAccountName?: string;
  customerBankName?: string;
}

const CheckoutForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: DEFAULT_PHONE_COUNTRY,
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
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(
    DEFAULT_PHONE_COUNTRY
  );

  const [checkoutAttempt] = useState(() => ({
    idempotencyKey: crypto.randomUUID(),
    checkoutToken: crypto.randomUUID(),
  }));

  const deliveryFee = Math.max(1000, total * 0.1);
  const grandTotal =
    formData.paymentMethod === 'delivery' ? total + deliveryFee : total;

  const paymentMethods = [
    {
      id: 'transfer',
      title: 'Bank Transfer',
      description: 'Transfer to our account and upload proof',
      icon: Building,
      color: 'var(--status-info)',
      fee: 0,
    },
    {
      id: 'online',
      title: 'Online Payment',
      description: 'Currently under maintenance',
      icon: CreditCard,
      color: 'var(--status-success)',
      fee: 0,
      disabled: true,
    },
    {
      id: 'delivery',
      title: 'Pay on Delivery',
      description: 'Pay when your order arrives (Delivery fee applies)',
      icon: Truck,
      color: 'var(--status-warning)',
      fee: deliveryFee,
    },
  ];

  const bankDetails = {
    bankName: 'Keystone Bank',
    accountName: 'Wisdom Church Store',
    accountNumber: '1012879868',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
      ];
      const maxSize = 5 * 1024 * 1024;

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

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !isValidNationalPhone(formData.phone, phoneCountry)) {
      errors.phone = 'Enter a valid phone number for the selected country';
    }

    if (formData.paymentMethod === 'delivery') {
      const shippingFields: (keyof FormData)[] = [
        'address',
        'country',
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
      const orderPayload = {
        ...checkoutAttempt,
        items,
        subtotal: total,
        total: grandTotal,
        deliveryFee: formData.paymentMethod === 'delivery' ? deliveryFee : 0,
        paymentMethod: formData.paymentMethod,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: toE164(formData.phone, phoneCountry) || formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        bankDetails:
          formData.paymentMethod === 'transfer'
            ? {
                customerAccountName: formData.customerAccountName,
                customerBankName: formData.customerBankName,
              }
            : undefined,
      };

      let order = await storeClient.createOrder(orderPayload);
      if (
        formData.paymentMethod === 'transfer' &&
        formData.paymentSlip &&
        order.paymentStatus !== 'proof_submitted'
      ) {
        try {
          const paymentSlipUrl = await storeClient.uploadPaymentSlip(
            formData.paymentSlip
          );
          order = await storeClient.submitPaymentProof(
            order.orderId,
            paymentSlipUrl
          );
        } catch {
          setFormErrors(prev => ({
            ...prev,
            submit: `Order ${order.orderId} was saved, but payment proof could not be attached. Retry to continue safely.`,
          }));
          setIsSubmitting(false);
          return;
        }
      }

      dispatch(clearCart());
      router.push(
        `/order-confirmation?orderId=${encodeURIComponent(order.orderId)}`
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

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 bg-white/[0.04] text-white ${
      formErrors[field] ? 'border-[var(--status-error)]' : 'border-white/[0.14]'
    }`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Order ID Display */}
      <div className="rounded-2xl p-4 mb-6 shadow-lg border bg-white/[0.04] border-white/[0.14]">
        <Flex justify="between" align="center">
          <div>
            <Caption className="text-sm mb-1 text-white/60">
              Order Reference
            </Caption>
            <BaseText weight="bold" className="text-white">
              Assigned securely after checkout
            </BaseText>
          </div>
          <div className="text-right">
            <Caption className="text-sm mb-1 text-white/60">
              Keep this for reference
            </Caption>
            <BaseText
              weight="semibold"
              className="text-xs px-3 py-1 rounded-full bg-[var(--app-primary-10)] text-[var(--app-primary)]"
            >
              #ORDER-REF
            </BaseText>
          </div>
        </Flex>
      </div>

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
        <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.04] border-white/[0.14]">
          <H3 className="text-xl font-bold mb-6 text-white">
            Contact Information
          </H3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['firstName', 'lastName', 'email'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2 text-white/60">
                  {field === 'firstName'
                    ? 'First Name *'
                    : field === 'lastName'
                      ? 'Last Name *'
                      : field === 'email'
                        ? 'Email *'
                        : 'Phone *'}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  required
                  value={formData[field as keyof FormData] as string}
                  onChange={handleInputChange}
                  className={inputClass(field)}
                  placeholder=""
                />
                {formErrors[field] && (
                  <Caption className="text-[var(--status-error)] text-xs mt-1">
                    {formErrors[field]}
                  </Caption>
                )}
              </div>
            ))}
            <PhoneNumberField
              id="checkout-phone"
              label="Phone"
              required
              country={phoneCountry}
              number={formData.phone}
              onCountryChange={setPhoneCountry}
              onNumberChange={phone => {
                setFormData(prev => ({ ...prev, phone }));
                setFormErrors(prev => ({ ...prev, phone: '' }));
              }}
              inputClassName={inputClass('phone')}
              selectClassName={inputClass('phoneCountry')}
              labelClassName="text-sm font-medium text-white/60"
              error={formErrors.phone}
            />
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.04] border-white/[0.14]">
          <H3 className="text-xl font-bold mb-6 text-white">Payment Method</H3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              const isSelected = formData.paymentMethod === method.id;

              return (
                <Button
                  key={method.id}
                  type="button"
                  variant="ghost"
                  aria-disabled={method.disabled}
                  onClick={() => {
                    if (method.id === 'online') {
                      setShowOnlinePaymentModal(true);
                      return;
                    }

                    const nextMethod = method.id as PaymentMethod;

                    setFormData(prev => ({
                      ...prev,
                      paymentMethod: nextMethod,
                      ...(nextMethod !== 'transfer'
                        ? {
                            paymentSlip: null,
                            customerAccountName: '',
                            customerBankName: '',
                          }
                        : {}),
                    }));

                    if (nextMethod !== 'transfer') {
                      setFormErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.paymentSlip;
                        delete newErrors.customerAccountName;
                        delete newErrors.customerBankName;
                        return newErrors;
                      });
                    }
                  }}
                  className={`relative p-4 rounded-2xl !justify-start text-left text-white bg-white/[0.04] ${
                    method.disabled
                      ? 'opacity-55 border border-white/[0.14]'
                      : isSelected
                        ? 'border-2 ring-2 ring-offset-2'
                        : 'border border-white/[0.14] hover:scale-[1.02]'
                  }`}
                  // eslint-disable-next-line no-restricted-syntax
                  style={
                    !method.disabled && isSelected
                      ? {
                          borderColor: method.color,
                          boxShadow: `0 0 0 2px ${method.color}20`,
                        }
                      : undefined
                  }
                >
                  {method.disabled && (
                    <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-eyebrow font-bold uppercase tracking-[0.08em] text-white/60">
                      Coming soon
                    </span>
                  )}
                  <Flex align="center" gap="sm" className="mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      // eslint-disable-next-line no-restricted-syntax
                      style={{ backgroundColor: `${method.color}15` }}
                    >
                      <Icon
                        className="w-5 h-5"
                        // eslint-disable-next-line no-restricted-syntax
                        style={{ color: method.color }}
                      />
                    </div>
                    <SmallText weight="bold" className="text-base">
                      {method.title}
                    </SmallText>
                  </Flex>
                  <Caption className="text-sm mb-2">
                    {method.description}
                  </Caption>
                  {method.fee > 0 && (
                    <Caption
                      weight="semibold"
                      className="text-sm"
                      // eslint-disable-next-line no-restricted-syntax
                      style={{ color: method.color }}
                    >
                      + NGN {method.fee.toLocaleString()} fee
                    </Caption>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Bank Transfer Details */}
          {formData.paymentMethod === 'transfer' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-blue-500/[0.06] border border-blue-500/25">
                <H4 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-500">
                  <Building className="w-5 h-5" />
                  Bank Transfer Details
                </H4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Caption className="text-sm mb-1 text-white/60">
                        Bank Name
                      </Caption>
                      <BaseText weight="semibold">
                        {bankDetails.bankName}
                      </BaseText>
                    </div>
                    <div>
                      <Caption className="text-sm mb-1 text-white/60">
                        Account Name
                      </Caption>
                      <BaseText weight="semibold">
                        {bankDetails.accountName}
                      </BaseText>
                    </div>
                    <div>
                      <Caption className="text-sm mb-1 text-white/60">
                        Account Number
                      </Caption>
                      <BaseText weight="semibold" className="text-lg">
                        {bankDetails.accountNumber}
                      </BaseText>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl mt-2 bg-yellow-500/[0.06] border border-yellow-500/25">
                    <Flex align="center" gap="sm" className="mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <Caption
                        weight="semibold"
                        className="text-sm text-yellow-500"
                      >
                        Important Instructions
                      </Caption>
                    </Flex>
                    <ul className="space-y-2 text-sm text-white/60">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                        <span>
                          Transfer the exact amount:{' '}
                          <strong>NGN {grandTotal.toLocaleString()}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                        <span>
                          Use the account name:{' '}
                          <strong>{bankDetails.accountName}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                        <span>
                          Take a screenshot/snapshot of your transfer
                          confirmation
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
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
                        className={inputClass('customerAccountName')}
                      />
                      {formErrors.customerAccountName && (
                        <Caption className="text-[var(--status-error)] text-xs mt-1">
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
                        className={inputClass('customerBankName')}
                      />
                      {formErrors.customerBankName && (
                        <Caption className="text-[var(--status-error)] text-xs mt-1">
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
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:border-yellow-400 bg-white/[0.04] ${
                          formErrors.paymentSlip
                            ? 'border-[var(--status-error)]'
                            : 'border-white/[0.14]'
                        }`}
                      >
                        {formData.paymentSlip ? (
                          <>
                            <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                            <BaseText weight="semibold" className="text-center">
                              {formData.paymentSlip.name}
                            </BaseText>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <div className="mt-2 h-2 w-48 rounded-full bg-[var(--app-dark-3)]">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  // eslint-disable-next-line no-restricted-syntax
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            )}
                            <Caption className="text-xs mt-1 text-white/60">
                              Click to change file
                            </Caption>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-white/60" />
                            <BaseText weight="semibold" className="text-center">
                              Click to upload payment slip
                            </BaseText>
                            <Caption className="text-sm mt-1 text-white/60">
                              Upload screenshot/snapshot of your transfer
                            </Caption>
                            <Caption className="text-xs mt-1 text-white/60">
                              JPG, PNG or PDF (max 5MB)
                            </Caption>
                          </>
                        )}
                      </label>
                    </div>
                    {formErrors.paymentSlip && (
                      <Caption className="text-[var(--status-error)] text-xs mt-1">
                        {formErrors.paymentSlip}
                      </Caption>
                    )}

                    <Caption className="text-xs mt-2 text-white/60">
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

          {/* Pay on Delivery Details */}
          {formData.paymentMethod === 'delivery' && (
            <div className="p-6 rounded-2xl mb-6 bg-yellow-500/[0.06] border border-yellow-500/25">
              <H4 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-500">
                <Truck className="w-5 h-5" />
                Pay on Delivery Details
              </H4>
              <div className="space-y-3">
                <Flex align="center" gap="sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Caption>
                    You can pay with <strong>cash</strong> or{' '}
                    <strong>card</strong> when your order arrives
                  </Caption>
                </Flex>
                <Flex align="center" gap="sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Caption>
                    Our delivery agent will bring a POS machine for card
                    payments
                  </Caption>
                </Flex>
                <Flex align="center" gap="sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Caption>
                    Delivery within 3-5 business days in Lagos, 7-10 days
                    elsewhere
                  </Caption>
                </Flex>

                <div className="mt-4 rounded-xl bg-yellow-900/20 p-4">
                  <Flex align="center" gap="sm">
                    <Banknote className="w-4 h-4 text-yellow-500" />
                    <Caption weight="semibold" className="text-yellow-500">
                      Delivery Fee: NGN {deliveryFee.toLocaleString()} added to
                      your total
                    </Caption>
                  </Flex>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Address (Only for delivery) */}
        {formData.paymentMethod === 'delivery' && (
          <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.04] border-white/[0.14]">
            <H3 className="text-xl font-bold mb-6 text-white">
              Shipping Address
            </H3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-2 text-white/60"
                >
                  Address *
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  required
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={inputClass('address')}
                />
                {formErrors.address && (
                  <Caption className="text-[var(--status-error)] text-xs mt-1">
                    {formErrors.address}
                  </Caption>
                )}
              </div>

              <LocationFields
                required
                value={{
                  country: formData.country,
                  state: formData.state,
                  city: formData.city,
                }}
                onChange={location =>
                  setFormData(prev => ({ ...prev, ...location }))
                }
                errors={formErrors}
                selectClassName={inputClass('location')}
              />
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium mb-2 text-white/60"
                >
                  ZIP / Postal code *
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className={inputClass('zipCode')}
                />
                {formErrors.zipCode ? (
                  <Caption className="mt-1 text-xs text-[var(--status-error)]">
                    {formErrors.zipCode}
                  </Caption>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="rounded-2xl p-6 shadow-lg border bg-white/[0.04] border-white/[0.14]">
          <H3 className="text-xl font-bold mb-6 text-white">Order Summary</H3>

          <div className="space-y-4">
            <div className="mb-4 rounded-card bg-[var(--app-dark-3)] p-3">
              <Caption className="text-sm font-medium mb-1 text-white/60">
                Order ID
              </Caption>
              <BaseText weight="bold" className="text-white">
                Assigned by the store when your order is saved
              </BaseText>
              <Caption className="text-xs mt-1 text-white/60">
                Please save this reference for future inquiries
              </Caption>
            </div>

            {items.map(item => (
              <Flex key={item.id} justify="between" align="center">
                <div className="flex-1">
                  <BaseText weight="semibold" className="text-white">
                    {item.name}
                  </BaseText>
                  <Caption className="text-sm text-white/60">
                    {item.selectedSize} | {item.selectedColor} | Qty:{' '}
                    {item.quantity}
                  </Caption>
                </div>
                <BaseText weight="bold" className="text-white">
                  NGN{' '}
                  {(
                    parseFloat(item.price.replace(/[^\d.]/g, '')) *
                    item.quantity
                  ).toLocaleString()}
                </BaseText>
              </Flex>
            ))}

            <div className="space-y-3 border-t border-white/[0.14] pt-4">
              <Flex justify="between">
                <Caption className="text-white/60">Subtotal</Caption>
                <BaseText weight="semibold">
                  NGN {total.toLocaleString()}
                </BaseText>
              </Flex>

              {formData.paymentMethod === 'delivery' && (
                <Flex justify="between">
                  <Caption className="text-white/60">Delivery Fee</Caption>
                  <BaseText weight="semibold">
                    NGN {deliveryFee.toLocaleString()}
                  </BaseText>
                </Flex>
              )}

              <Flex
                justify="between"
                className="pt-3 border-t border-white/[0.14]"
              >
                <BaseText weight="bold" className="text-lg">
                  Total Amount:
                </BaseText>
                <div className="text-right">
                  <BaseText
                    weight="bold"
                    className="text-2xl text-[var(--app-primary)]"
                  >
                    NGN {grandTotal.toLocaleString()}
                  </BaseText>
                  {formData.paymentMethod === 'delivery' && (
                    <Caption className="text-sm mt-1 text-white/60">
                      Includes NGN {deliveryFee.toLocaleString()} delivery fee
                    </Caption>
                  )}
                </div>
              </Flex>
            </div>
          </div>
        </div>

        {formErrors.submit && (
          <div className="rounded-card border border-[var(--status-error)]/40 bg-[var(--status-error)]/10 p-4">
            <Flex align="center" gap="sm">
              <AlertCircle className="h-5 w-5 text-[var(--status-error)]" />
              <Caption className="text-[var(--status-error)]">
                {formErrors.submit}
              </Caption>
            </Flex>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          curvature="full"
          elevated={true}
          disabled={!isFormValid || isSubmitting}
          className="w-full transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <Flex align="center" gap="sm">
              <Loader2 className="w-5 h-5 animate-spin" />
              Confirming Your Order...
            </Flex>
          ) : (
            `Confirm Order - NGN ${grandTotal.toLocaleString()}`
          )}
        </Button>

        {!isFormValid && (
          <Caption className="text-center text-sm text-yellow-500">
            Please fill in all required fields correctly to complete your order.
          </Caption>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
