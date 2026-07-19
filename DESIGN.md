---
name: Macro Dashboard v2 (Impeccable Context)
colors:
  surface: '#131a2b'
  surface-dim: '#030d24'
  surface-bright: '#102a5b'
  surface-container-lowest: '#000000'
  surface-container-low: '#021231'
  surface-container: '#04183c'
  surface-container-high: '#071e46'
  surface-container-highest: '#072354'
  on-surface: '#e7ebf3'
  on-surface-variant: '#a8b3c7'
  inverse-surface: '#faf8ff'
  inverse-on-surface: '#4b556f'
  outline: '#5f74a9'
  outline-variant: '#304778'
  surface-tint: '#afc6ff'
  primary: '#afc6ff'
  on-primary: '#003c8b'
  primary-container: '#0d60d2'
  on-primary-container: '#ffffff'
  inverse-primary: '#005ac8'
  secondary: '#22c55e'
  on-secondary: '#004b1e'
  secondary-container: '#00461b'
  on-secondary-container: '#41da70'
  tertiary: '#f0a824'
  on-tertiary: '#603f00'
  tertiary-container: '#fdb330'
  on-tertiary-container: '#543700'
  error: '#f04b4b'
  on-error: '#490006'
  error-container: '#871f21'
  on-error-container: '#ff9993'
  primary-fixed: '#4a88fb'
  primary-fixed-dim: '#3a7bed'
  on-primary-fixed: '#000000'
  on-primary-fixed-variant: '#001336'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#5bf083'
  on-secondary-fixed: '#004a1d'
  on-secondary-fixed-variant: '#006a2d'
  tertiary-fixed: '#fdb330'
  tertiary-fixed-dim: '#eda521'
  on-tertiary-fixed: '#382400'
  on-tertiary-fixed-variant: '#5f3f00'
  primary-dim: '#4f8cff'
  secondary-dim: '#38d36a'
  tertiary-dim: '#eda521'
  error-dim: '#c54d4a'
  background: '#0b0f19'
  on-background: '#dde5ff'
  surface-variant: '#232d45'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  data-number:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  section-gap: 48px
  card-gap: 16px
  card-padding: 24px
  row-height-compact: 44px
---

# Design System (Macro Dashboard v2)

Hệ thống thiết kế theo cấu trúc `impeccable` dành cho dự án local. Mọi Component (Card, Top Menu, Sparkline) phải tuân thủ nghiêm ngặt bảng màu và typography ở trên.
- **Top Menu**: Dùng border đáy màu `primary` thay vì background highlight.
- **Cards**: Border `surface-variant`, không drop-shadow nặng, hover bằng `primary-dim/40`.
- **Status Dots**: Dùng `secondary`, `tertiary`, `error` để biểu thị trạng thái (8px circle).
