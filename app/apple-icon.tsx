import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function AppleIcon() {
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
            background: 'rgba(255,255,255,0.55)',
            borderRadius: '42px',
            color: '#0f172a',
            display: 'flex',
            fontSize: 104,
            fontStyle: 'normal',
            fontWeight: 800,
            height: 138,
            justifyContent: 'center',
            letterSpacing: '-0.08em',
            lineHeight: 1,
            textAlign: 'center',
            width: 138,
          }}
        >
          H
        </div>
      </div>
    ),
    size,
  )
}