import React, { FC } from 'react'

interface IconProps {
  className?: string
}

export const WalletIcon: FC<IconProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9521 13.2681H0.97363C0.436511 13.2681 0 12.8043 0 12.2336V1.76636C0 1.19567 0.436511 0.731873 0.97363 0.731873H13.9521C14.4893 0.731873 14.9257 1.19567 14.9257 1.76636V4.10084H10.2669C9.91804 4.10084 9.57727 4.17498 9.2576 4.31808C8.94928 4.45601 8.67181 4.65601 8.43488 4.90773C8.19798 5.15946 8.00973 5.45429 7.87991 5.78187C7.7436 6.12153 7.67545 6.4836 7.67545 6.85429V7.14567C7.67545 7.51636 7.74522 7.87842 7.87991 8.21808C8.00973 8.54567 8.19796 8.84051 8.43488 9.09223C8.6718 9.34394 8.94928 9.54394 9.2576 9.68187C9.57727 9.82672 9.91804 9.89911 10.2669 9.89911H14.9257V12.2336C14.9257 12.8043 14.4893 13.2681 13.9521 13.2681ZM15.2698 5.13519C15.6738 5.13519 16 5.48174 16 5.91106V8.08862C16 8.51793 15.6738 8.86449 15.2698 8.86449H14.9258H10.2669C9.37282 8.86449 8.64909 8.09554 8.64909 7.14554V6.85416C8.64909 5.90416 9.37281 5.13519 10.2669 5.13519H14.9258H15.2698ZM9.6714 6.99899C9.6714 7.50418 10.056 7.91278 10.5314 7.91278C11.0069 7.91278 11.3915 7.50418 11.3915 6.99899C11.3915 6.49381 11.0069 6.08519 10.5314 6.08519C10.056 6.08519 9.6714 6.49381 9.6714 6.99899Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const BentoBoxIcon: FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.8824 0H6.11765V4.70586H8.23529C9.40301 4.70586 10.3529 5.6558 10.3529 6.82351V8.94116H16V2.11765C16 0.949933 15.0501 0 13.8824 0ZM8.23529 6.11811H6.11765V8.94165H8.94119V6.824C8.94119 6.43478 8.62452 6.11811 8.23529 6.11811ZM0 13.8823V10.3529H7.52941V16H2.11765C0.949933 16 0 15.0501 0 13.8823ZM8.94118 10.3529V16H13.8824C15.0501 16 16 15.0501 16 13.8823V10.3529H8.94118ZM0 2.11765C0 0.949933 0.949933 0 2.11765 0H4.70586V8.94116H0V2.11765Z"
        fill="currentColor"
      />
    </svg>
  )
}