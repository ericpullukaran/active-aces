import React from "react"

type Props = { className?: string }

export default function Logo({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 401.25 263.89"
      className={className}
    >
      <defs>
        <clipPath id="clippath">
          <path fill="none" strokeWidth="0" d="M0 0H401.22V263.89H0z"></path>
        </clipPath>
        <linearGradient
          id="linear-gradient"
          x1="102.21"
          x2="303.14"
          y1="134.16"
          y2="134.16"
          gradientTransform="matrix(1 0 0 -1 0 266.1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#00aeef" stopOpacity="0.1"></stop>
          <stop offset="0.02" stopColor="#00b0e9" stopOpacity="0.14"></stop>
          <stop offset="0.12" stopColor="#00bfc9" stopOpacity="0.34"></stop>
          <stop offset="0.22" stopColor="#00ccad" stopOpacity="0.51"></stop>
          <stop offset="0.33" stopColor="#00d795" stopOpacity="0.66"></stop>
          <stop offset="0.44" stopColor="#00e182" stopOpacity="0.79"></stop>
          <stop offset="0.56" stopColor="#00e873" stopOpacity="0.88"></stop>
          <stop offset="0.69" stopColor="#00ed69" stopOpacity="0.95"></stop>
          <stop offset="0.82" stopColor="#00f062" stopOpacity="0.99"></stop>
          <stop offset="1" stopColor="#00f161"></stop>
        </linearGradient>
      </defs>
      <g strokeWidth="0" clipPath="url(#clippath)">
        <path
          fill="url(#linear-gradient)"
          d="M124.24 263.89c-2.32 0-4.68-.36-7.02-1.15-11.53-3.84-17.73-16.26-13.85-27.73L177.8 14.92C180.78 6.13 188.99.16 198.32 0c9.53-.2 17.73 5.56 20.99 14.25l82.44 220.1c4.25 11.33-1.55 23.93-12.94 28.15-11.4 4.22-24.08-1.54-28.31-12.87l-60.76-162.2-54.63 161.53c-3.09 9.14-11.68 14.92-20.87 14.92z"
        ></path>
        <path
          fill="#6ceaad"
          d="M329.53 184.28c-1.01 0-2.01-.1-3.03-.3l-44.82-8.89c-53.79-10.66-108.33-10.66-162.13 0l-44.82 8.89c-8.33 1.65-16.46-3.73-18.13-12.03-1.66-8.3 3.75-16.37 12.1-18.02l44.82-8.89c57.79-11.45 116.39-11.45 174.18 0l44.82 8.89c8.35 1.65 13.76 9.72 12.1 18.02-1.46 7.28-7.9 12.33-15.1 12.33h.01zM33.73 142.24l-1.49.28c-4.78.9-7.91 5.48-7.01 10.22l10.74 56.42c.9 4.75 5.51 7.87 10.28 6.97l1.49-.28c4.78-.9 7.91-5.48 7.01-10.22l-10.74-56.42c-.9-4.75-5.51-7.87-10.28-6.97zM8.67 159.84l-1.49.28c-4.78.9-7.91 5.48-7.01 10.22l5.7 29.95c.9 4.75 5.51 7.87 10.28 6.97l1.49-.28c4.78-.9 7.91-5.48 7.01-10.22l-5.7-29.95c-.9-4.75-5.51-7.87-10.28-6.97zM353.48 210.86l1.49.28c4.77.9 9.38-2.22 10.28-6.97l10.74-56.42c.9-4.75-2.23-9.32-7.01-10.22l-1.49-.28c-4.77-.9-9.38 2.22-10.28 6.97l-10.74 56.42c-.9 4.75 2.23 9.32 7.01 10.22zM383.62 206.36l1.49.28c4.78.9 9.38-2.22 10.28-6.97l5.7-29.95c.9-4.75-2.23-9.32-7.01-10.22l-1.49-.28c-4.77-.9-9.38 2.22-10.28 6.97l-5.7 29.95c-.9 4.75 2.23 9.32 7.01 10.22z"
        ></path>
      </g>
    </svg>
  )
}
