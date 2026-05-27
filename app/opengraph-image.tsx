import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Zainul Mutaqin — Developer Portfolio'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1e1e2e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
          border: '10px solid #313244',
          position: 'relative',
        }}
      >
        {/* Decorative corner taglines */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            color: '#6c7086',
            fontSize: '16px',
            fontFamily: 'monospace',
          }}
        >
          // portfolio.zainulmutaqin
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            color: '#6c7086',
            fontSize: '16px',
            fontFamily: 'monospace',
          }}
        >
          6.2088° S, 106.8456° E
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#cdd6f4',
              letterSpacing: '-2px',
            }}
          >
            Zainul Mutaqin
          </div>

          <div
            style={{
              fontSize: '32px',
              color: '#a6adc8',
              maxWidth: '800px',
              lineHeight: '1.4',
            }}
          >
            Building on the web. Exploring the terminal.{' '}
            <span style={{ color: '#cba6f7' }}>Curious about what's next.</span>
          </div>
        </div>

        {/* Badges */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['Full-Stack', 'Linux', 'React', 'Next.js'].map((badge) => (
            <div
              key={badge}
              style={{
                background: '#181825',
                color: '#cba6f7',
                border: '1px solid #313244',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '18px',
                fontFamily: 'monospace',
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
