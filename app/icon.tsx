import { ImageResponse } from 'next/og'

export const size = {
  width: 256,
  height: 256,
}

export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0b1020 0%, #4f46e5 55%, #22d3ee 100%)',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            border: '10px solid rgba(255,255,255,0.2)',
            borderRadius: '56px',
            color: '#f8fafc',
            display: 'flex',
            fontSize: 148,
            fontStyle: 'normal',
            fontWeight: 800,
            height: 196,
            justifyContent: 'center',
            letterSpacing: '-0.08em',
            lineHeight: 1,
            textAlign: 'center',
            width: 196,
          }}
        >
          H
        </div>
      </div>
    ),
    size,
  )
}