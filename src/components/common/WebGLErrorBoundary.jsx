import React from 'react';

/**
 * WebGLErrorBoundary
 * Wraps any 3D Canvas scene. If WebGL is unavailable or the scene throws,
 * renders a static CSS gradient fallback with the same story text.
 */

function WebGLFallback({ missionName, gradientColors, storyText }) {
  const from = gradientColors?.[0] ?? '#1a1a2e';
  const to = gradientColors?.[1] ?? '#0B0D11';

  return (
    <div
      role="img"
      aria-label={`${missionName ?? 'Mission'} scene — static fallback (WebGL unavailable)`}
      style={{
        width: '100%',
        height: '100vh',
        height: '100svh',
        height: '100dvh',
        minHeight: '100svh',
        background: `radial-gradient(ellipse at 50% 60%, ${from} 0%, ${to} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.6875rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(168,179,194,0.6)',
          marginBottom: '1.2rem',
        }}
      >
        3D SCENE UNAVAILABLE · STATIC MODE
      </p>
      {storyText && (
        <p
          style={{
            fontFamily: 'var(--font-editorial, Georgia, serif)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 300,
            color: '#F4F6F8',
            lineHeight: 1.65,
            maxWidth: '640px',
            margin: 0,
          }}
        >
          {storyText}
        </p>
      )}
    </div>
  );
}

export default class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    this.handleContextLost = (e) => {
      e.preventDefault();
      console.warn('[WebGLErrorBoundary] WebGL context lost detected');
      this.setState({ hasError: true });
    };
    window.addEventListener('webglcontextlost', this.handleContextLost, true);
  }

  componentWillUnmount() {
    if (this.handleContextLost) {
      window.removeEventListener('webglcontextlost', this.handleContextLost, true);
    }
  }

  componentDidCatch(error, info) {
    // Non-fatal — just log so the team can investigate
    console.warn('[WebGLErrorBoundary] 3D scene error caught:', error?.message ?? error, info?.componentStack ?? '');
  }

  render() {
    if (this.state.hasError) {
      return (
        <WebGLFallback
          missionName={this.props.missionName}
          gradientColors={this.props.gradientColors}
          storyText={this.props.storyText}
        />
      );
    }
    return this.props.children;
  }
}
