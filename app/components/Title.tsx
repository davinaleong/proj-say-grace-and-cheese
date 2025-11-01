'use client'

export default function Title() {
    return (
        <div style={{
          marginBottom: '0.5rem',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="800" height="200" viewBox="0 0 800 200">
            <defs>
              <path 
                id="curve" 
                d="M 75,150 Q 400,30 725,150" 
                fill="none" 
                stroke="none"
              />
            </defs>
            <text 
              fontSize="56" 
              fontFamily="Barriecito, cursive" 
              fontWeight="bold"
              fill="#1c1c4a"
              letterSpacing="4"
            >
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                Say Grace and Cheese
              </textPath>
            </text>
          </svg>
        </div>
    )
}