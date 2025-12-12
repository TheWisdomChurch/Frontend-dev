'use client';

import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback,
  useLayoutEffect,
  useMemo
} from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, ChevronRight } from 'lucide-react';
import { useAppDispatch } from '@/components/utils/hooks/redux';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { Product } from '@/lib/types';
import { Button } from '@/components/utils/buttons';
import {
  H4,
  BodyMD,
  RegularText,
  MediumText,
  Caption,
} from '@/components/text';
import { FlexboxLayout } from '@/components/layout';
import { useTheme } from '@/components/contexts/ThemeContext';
import { useWindowSize } from '@/components/utils/hooks/useWindowSize';
import { responsive } from '@/lib/responsivee';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { colorScheme } = useTheme();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const viewport: ViewportSize = useMemo(() => {
    if (!windowSize.width) return 'mobile';
    if (windowSize.width < 640) return 'mobile';
    if (windowSize.width < 1024) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);



  const colors = useMemo(() => ({
    background: colorScheme.black,
    text: {
      primary: colorScheme.primary,
      secondary: colorScheme.white,
      muted: 'rgba(255, 255, 255, 0.7)'
    },
    button: {
      background: colorScheme.primary,
      text: colorScheme.black,
      hover: colorScheme.opacity || colorScheme.primary
    },
    border: {
      default: colorScheme.border,
      active: colorScheme.primary,
      input: colorScheme.border
    },
    imageBg: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.2)',
    backdrop: 'rgba(0, 0, 0, 0.7)'
  }), [colorScheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
    }
  }, [product]);

  useLayoutEffect(() => {
    if (isOpen && mounted) {
      const scrollY = window.scrollY;
      const body = document.body;
      
      const originalStyles = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        height: body.style.height,
        touchAction: body.style.touchAction
      };

      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.height = '100%';
      body.style.touchAction = 'none';

      document.documentElement.dataset.scrollY = scrollY.toString();

      return () => {
        Object.entries(originalStyles).forEach(([key, value]) => {
          body.style[key as any] = value;
        });

        const scrollYValue = parseInt(document.documentElement.dataset.scrollY || '0');
        window.scrollTo(0, scrollYValue);
        delete document.documentElement.dataset.scrollY;
      };
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen || !product || !modalRef.current || !backdropRef.current) return;

    const modal = modalRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.4 }
    });

    if (viewport === 'mobile') {
      tl.fromTo(backdrop, 
        { opacity: 0 },
        { opacity: 1 }
      )
      .fromTo(modal,
        { y: '100%', opacity: 0 },
        { y: 0, opacity: 1 },
        '<'
      );
    } else {
      tl.fromTo(backdrop,
        { opacity: 0 },
        { opacity: 1 }
      )
      .fromTo(modal,
        { 
          scale: 0.9, 
          opacity: 0,
          y: 20 
        },
        { 
          scale: 1, 
          opacity: 1,
          y: 0 
        },
        '<'
      );
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, product, viewport]);

  const handleClose = useCallback(() => {
    if (!modalRef.current || !backdropRef.current || isClosing) return;
    
    setIsClosing(true);
    const modal = modalRef.current;
    const backdrop = backdropRef.current;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.in', duration: 0.3 },
      onComplete: () => {
        setIsClosing(false);
        onClose();
      }
    });

    if (viewport === 'mobile') {
      tl.to(modal, { y: '100%', opacity: 0 })
        .to(backdrop, { opacity: 0 }, '<');
    } else {
      tl.to(modal, { scale: 0.95, opacity: 0, y: 20 })
        .to(backdrop, { opacity: 0 }, '<');
    }
  }, [onClose, viewport, isClosing]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedSize || !selectedColor) return;
    
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize,
        selectedColor,
        quantity,
      })
    );
    
    handleClose();
  }, [product, selectedSize, selectedColor, quantity, dispatch, handleClose]);

  const handleIncrement = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  if (!mounted || !isOpen || !product) return null;

  return createPortal(
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      style={{ 
        backgroundColor: colors.backdrop,
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        ref={modalRef}
        className={`
          w-full overflow-hidden border shadow-2xl
          ${responsive.modal[viewport]}
          ${viewport === 'mobile' ? 'pb-0' : ''}
        `}
        style={{ 
          backgroundColor: colors.background, 
          borderColor: colors.border.default 
        }}
        onClick={e => e.stopPropagation()}
      >
        {viewport === 'mobile' && (
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            aria-hidden="true"
          >
            <div 
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: colors.text.primary }}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          <div className={`relative ${responsive.image[viewport]}`}>
            <div 
              className="relative w-full h-full overflow-hidden"
              style={{ backgroundColor: colors.imageBg }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
              />
              <div 
                className="absolute inset-0"
                style={{ 
                  background: `linear-gradient(to bottom, transparent 70%, ${colors.overlay})`,
                  pointerEvents: 'none'
                }}
              />
            </div>

            <button
              onClick={handleClose}
              className={`
                absolute top-3 right-3 z-20 rounded-full p-2
                transition-all duration-200 hover:scale-110
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
                shadow-md
                ${viewport === 'mobile' ? 'p-1.5' : 'p-2'}
              `}
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.border.default,
                borderWidth: '1px'
              }}
              aria-label="Close modal"
            >
              <X 
                className={viewport === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}
                style={{ color: colors.text.primary }}
              />
            </button>
          </div>

          <div 
            className={`
              overflow-y-auto flex-1
              ${responsive.padding[viewport]}
              ${responsive.gap[viewport]}
            `}
          >
            <div className={`flex flex-col ${responsive.gap[viewport]}`}>
              <div>
                <div
                  className={`mb-2 ${responsive.heading[viewport]} font-bold leading-tight`}
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                </div>
                <BodyMD
                  className={`${responsive.body[viewport]} leading-relaxed`}
                  style={{ color: colors.text.muted }}
                  useThemeColor={false}
                >
                  {product.description}
                </BodyMD>
              </div>

              <FlexboxLayout align="center" gap="sm" wrap="wrap">
                <MediumText
                  className={`font-bold ${responsive.price[viewport]}`}
                  style={{ color: colors.text.primary }}
                  useThemeColor={false}
                >
                  {product.price}
                </MediumText>
                {product.originalPrice && (
                  <RegularText
                    className={`${responsive.body[viewport]} line-through`}
                    style={{ color: colors.text.muted }}
                    useThemeColor={false}
                  >
                    {product.originalPrice}
                  </RegularText>
                )}
              </FlexboxLayout>

              <div>
                <MediumText
                  className={`block mb-3 ${responsive.body[viewport]} font-medium`}
                  style={{ color: colors.text.primary }}
                  useThemeColor={false}
                >
                  Select Size
                </MediumText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        rounded-lg border transition-all px-4 py-2
                        hover:scale-[1.02] active:scale-[0.98]
                        focus:outline-none focus:ring-2 focus:ring-offset-1
                        ${viewport === 'mobile' ? 'text-xs px-3 py-1.5' : 'text-sm'}
                        ${selectedSize === size 
                          ? 'ring-2 ring-offset-1' 
                          : 'hover:border-opacity-70'
                        }
                      `}
                      style={{
                        backgroundColor: selectedSize === size 
                          ? `${colors.button.background}20` 
                          : 'transparent',
                        borderColor: selectedSize === size
                          ? colors.border.active
                          : colors.border.input,
                        color: selectedSize === size
                          ? colors.text.primary
                          : colors.text.secondary,
                        borderWidth: '1px'
                      }}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              <div>
                <MediumText
                  className={`block mb-3 ${responsive.body[viewport]} font-medium`}
                  style={{ color: colors.text.primary }}
                  useThemeColor={false}
                >
                  Select Color
                </MediumText>
                <FlexboxLayout gap="sm" className="flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        rounded-lg border transition-all px-4 py-2
                        hover:scale-[1.02] active:scale-[0.98]
                        focus:outline-none focus:ring-2 focus:ring-offset-1
                        ${viewport === 'mobile' ? 'text-xs px-3 py-1.5' : 'text-sm'}
                        ${selectedColor === color 
                          ? 'ring-2 ring-offset-1' 
                          : 'hover:border-opacity-70'
                        }
                      `}
                      style={{
                        backgroundColor: selectedColor === color 
                          ? `${colors.button.background}20` 
                          : 'transparent',
                        borderColor: selectedColor === color
                          ? colors.border.active
                          : colors.border.input,
                        color: selectedColor === color
                          ? colors.text.primary
                          : colors.text.secondary,
                        borderWidth: '1px'
                      }}
                      aria-pressed={selectedColor === color}
                    >
                      {color}
                    </button>
                  ))}
                </FlexboxLayout>
              </div>

              <div>
                <MediumText
                  className={`block mb-3 ${responsive.body[viewport]} font-medium`}
                  style={{ color: colors.text.primary }}
                  useThemeColor={false}
                >
                  Quantity
                </MediumText>
                <FlexboxLayout align="center" gap="lg" className="flex-wrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDecrement}
                      className={`
                        rounded-full border flex items-center justify-center
                        transition-all hover:scale-105 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-offset-1
                        ${viewport === 'mobile' ? 'w-8 h-8' : 'w-9 h-9'}
                      `}
                      style={{ 
                        borderColor: colors.border.input,
                        borderWidth: '1px'
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus
                        className={viewport === 'mobile' ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                        style={{ color: colors.text.secondary }}
                      />
                    </button>
                    <MediumText
                      className={`
                        text-center font-semibold min-w-[2rem]
                        ${viewport === 'mobile' ? 'text-lg' : 'text-xl'}
                      `}
                      style={{ color: colors.text.primary }}
                      useThemeColor={false}
                    >
                      {quantity}
                    </MediumText>
                    <button
                      onClick={handleIncrement}
                      className={`
                        rounded-full border flex items-center justify-center
                        transition-all hover:scale-105 active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-offset-1
                        ${viewport === 'mobile' ? 'w-8 h-8' : 'w-9 h-9'}
                      `}
                      style={{ 
                        borderColor: colors.border.input,
                        borderWidth: '1px'
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus
                        className={viewport === 'mobile' ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                        style={{ color: colors.text.secondary }}
                      />
                    </button>
                  </div>
                  <Caption
                    className={`${viewport === 'mobile' ? 'text-xs' : 'text-sm'}`}
                    style={{ color: colors.text.muted }}
                    useThemeColor={false}
                  >
                    <span className="font-medium">{product.stock}</span> in stock
                  </Caption>
                </FlexboxLayout>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size={viewport === 'mobile' ? 'md' : 'lg'}
                  curvature="xl"
                  elevated={true}
                  leftIcon={
                    <ShoppingBag 
                      className={viewport === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} 
                    />
                  }
                  rightIcon={<ChevronRight className="ml-1 w-4 h-4" />}
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor}
                  className={`
                    w-full transition-all
                    hover:scale-[1.02] active:scale-[0.98]
                    ${responsive.button[viewport]}
                    ${(!selectedSize || !selectedColor) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  style={{
                    backgroundColor: colors.button.background,
                    color: colors.button.text,
                  }}
                >
                  <MediumText 
                    className={`font-semibold ${viewport === 'mobile' ? 'text-sm' : 'text-base'}`}
                    useThemeColor={false}
                  >
                    Add to Cart • {product.price}
                  </MediumText>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;