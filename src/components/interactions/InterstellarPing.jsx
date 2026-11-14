import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function InterstellarPing() {
  const containerRef = useRef(null);
  const wavePacketRef = useRef(null);

  const [selectedCommand, setSelectedCommand] = useState('QUERY_MAGNETOMETER');
  const [transmissionState, setTransmissionState] = useState('IDLE'); // 'IDLE' | 'UPLINK' | 'AT_VOYAGER' | 'DOWNLINK' | 'COMPLETED'
  const [simulatedTimeHours, setSimulatedTimeHours] = useState(0);
  const [receivedTelemetry, setReceivedTelemetry] = useState(null);

  const commands = [
    {
      id: 'QUERY_MAGNETOMETER',
      label: 'Query Magnetometer (MAG)',
      instrument: 'Magnetometer (Active Instrument 1 of 2)',
      payload: 'Request vector magnetic field reading in interstellar medium.',
      expectedReply: 'B-Field: 0.48 nT, steady galactic field alignment. Zero solar wind signature.'
    },
    {
      id: 'QUERY_PLASMA',
      label: 'Query Plasma Waves (PWS)',
      instrument: 'Plasma Wave Subsystem (Active Instrument 2 of 2)',
      payload: 'Request interstellar electron plasma density oscillations.',
      expectedReply: 'Plasma density: ~0.08 cm⁻³ (40x higher than inside heliosphere). Boundary locked.'
    },
    {
      id: 'QUERY_RTG_POWER',
      label: 'Query RTG Power Margin',
      instrument: 'Radioisotope Thermoelectric Generators',
      payload: 'Request plutonium-238 radioactive decay telemetry.',
      expectedReply: 'RTG output: ~220 Watts (decaying ~4W/year). 8 of 10 science instruments safely offline.'
    }
  ];

  // GSAP animation for signal pulse travel
  const handleTransmit = () => {
    if (transmissionState !== 'IDLE' && transmissionState !== 'COMPLETED') return;

    setTransmissionState('UPLINK');
    setReceivedTelemetry(null);
    setSimulatedTimeHours(0);

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline();

      // Uplink to Voyager 1 (0 -> 24 hours)
      tl.to(wavePacketRef.current, {
        left: '94%',
        duration: 2.2,
        ease: 'power1.inOut',
        onUpdate: function() {
          const progress = this.progress();
          setSimulatedTimeHours(+(progress * 24).toFixed(1));
        },
        onComplete: () => {
          setTransmissionState('AT_VOYAGER');
        }
      })
      // Downlink back to Madrid DSN (24 -> 48 hours)
      .to(wavePacketRef.current, {
        left: '4%',
        duration: 2.2,
        delay: 0.4,
        ease: 'power1.inOut',
        onStart: () => {
          setTransmissionState('DOWNLINK');
        },
        onUpdate: function() {
          const progress = this.progress();
          setSimulatedTimeHours(+(24 + progress * 24).toFixed(1));
        },
        onComplete: () => {
          setTransmissionState('COMPLETED');
          const cmd = commands.find((c) => c.id === selectedCommand);
          setReceivedTelemetry(cmd.expectedReply);
        }
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Instant execution without animation loops
      setSimulatedTimeHours(48.0);
      setTransmissionState('COMPLETED');
      const cmd = commands.find((c) => c.id === selectedCommand);
      setReceivedTelemetry(cmd.expectedReply);
    });
  };

  const resetSimulation = () => {
    setTransmissionState('IDLE');
    setSimulatedTimeHours(0);
    setReceivedTelemetry(null);
    if (wavePacketRef.current) {
      gsap.set(wavePacketRef.current, { left: '4%' });
    }
  };

  useEffect(() => {
    if (wavePacketRef.current) {
      gsap.set(wavePacketRef.current, { left: '4%' });
    }
  }, []);

  const activeCmdObj = commands.find((c) => c.id === selectedCommand);

  return (
    <section 
      ref={containerRef}
      aria-label="Voyager 1 Speed of Light Telemetry Latency Simulator"
      style={{
        backgroundColor: 'var(--color-surface-charcoal)',
        border: '1px solid var(--color-surface-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        marginTop: 'var(--space-md)'
      }}
    >
      {/* Header & Mandatory Simplified Model Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-md)' }}>
        <span className="badge-tag badge-tag--model">
          SIMPLIFIED TEACHING MODEL: SPEED-OF-LIGHT TELEMETRY LATENCY
        </span>
        <span className="badge-tag" style={{ color: 'var(--color-amber-bright)', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          DSN 70-METER DISH LINK
        </span>
      </div>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <h3 className="text-headline-3" style={{ marginBottom: '4px' }}>
          Follow the Signal: Interstellar Telemetry Delay
        </h3>
        <p className="text-body" style={{ fontSize: '0.9375rem', maxWidth: '820px' }}>
          Radio waves travel at the speed of light ($299,792\text{ km/s}$). Select an engineering or science command and transmit it to Voyager 1 across <strong>25.9 billion kilometers</strong> (1 light-day). Observe why real-time control is physically impossible.
        </p>
      </div>

      {/* Main Celestial Radio Traverse Track */}
      <div 
        style={{
          backgroundColor: '#0A0D12',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg) var(--space-md)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 'var(--space-md)'
        }}
      >
        {/* Scale Benchmarks across Solar System */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-muted-slate)', marginBottom: 'var(--space-lg)' }}>
          <div>
            <strong style={{ color: 'var(--color-regolith-white)' }}>EARTH (MADRID DSN)</strong>
            <div>0 KM · 0 SEC</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span>MARS</span>
            <div>12.5 MIN</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span>JUPITER</span>
            <div>43 MIN</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span>SATURN</span>
            <div>1.2 HR</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span>HELIOPAUSE</span>
            <div>18 HR</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong style={{ color: 'var(--color-amber-bright)' }}>VOYAGER 1</strong>
            <div>25.9B KM · 24 HR</div>
          </div>
        </div>

        {/* Carrier Beam Guideline */}
        <div style={{ position: 'relative', height: '14px', margin: 'var(--space-sm) 0' }}>
          <div style={{ position: 'absolute', top: '6px', left: 0, right: 0, height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          {/* Animated Wave Packet */}
          <div 
            ref={wavePacketRef}
            style={{
              position: 'absolute',
              top: '1px',
              left: '4%',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: transmissionState === 'UPLINK' ? 'var(--color-status-beacon)' : 'var(--color-amber-bright)',
              boxShadow: '0 0 12px 2px rgba(245, 158, 11, 0.8)',
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        {/* Status Callout Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
          <div className="font-telemetry" style={{ fontSize: '0.8125rem', color: 'var(--color-telemetry-silver)' }}>
            STATUS: {transmissionState === 'IDLE' && 'READY AT GROUND STATION'}
            {transmissionState === 'UPLINK' && 'UPLINKING AT SPEED OF LIGHT (299,792 KM/S)...'}
            {transmissionState === 'AT_VOYAGER' && 'RECEIVED BY 3.7M HIGH-GAIN DISH · EXECUTING COMMAND...'}
            {transmissionState === 'DOWNLINK' && 'DOWNLINKING SCIENTIFIC TELEMETRY TO EARTH...'}
            {transmissionState === 'COMPLETED' && 'TELEMETRY RECEIVED & VERIFIED BY MADRID DSN 70M DISH'}
          </div>

          <div className="font-telemetry" style={{ fontSize: '1rem', color: 'var(--color-amber-bright)', fontWeight: 600 }}>
            SIMULATED LIGHT TIME: {simulatedTimeHours.toFixed(1)} / 48.0 HOURS
          </div>
        </div>
      </div>

      {/* Command Selector & Telemetry Terminal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        
        {/* Command Options */}
        <div>
          <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: '8px' }}>
            STEP 1: SELECT TELEMETRY COMMAND
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {commands.map((cmd) => {
              const isSelected = selectedCommand === cmd.id;
              return (
                <button
                  key={cmd.id}
                  onClick={() => setSelectedCommand(cmd.id)}
                  disabled={transmissionState === 'UPLINK' || transmissionState === 'DOWNLINK'}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    backgroundColor: isSelected ? 'var(--color-surface-elevated)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--color-deep-gold)' : 'var(--color-surface-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: 600, color: isSelected ? 'var(--color-regolith-white)' : 'var(--color-telemetry-silver)', fontSize: '0.875rem' }}>
                    {cmd.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)', marginTop: '2px' }}>
                    {cmd.instrument}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 'var(--space-md)' }}>
            <button
              onClick={handleTransmit}
              disabled={transmissionState === 'UPLINK' || transmissionState === 'DOWNLINK'}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--color-deep-gold)',
                borderRadius: 'var(--radius-sm)',
                color: '#0B0D11',
                fontWeight: 700,
                fontSize: '0.9375rem',
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
            >
              TRANSMIT COMMAND (48-HOUR ROUND TRIP) →
            </button>
          </div>
        </div>

        {/* Real Decrypted Science Payload Display */}
        <div 
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-surface-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: '8px' }}>
              DSN CARRIER TERMINAL · 2295.000 MHz
            </div>

            <div style={{ marginBottom: 'var(--space-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>OUTGOING UPLINK PAYLOAD</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-regolith-white)', fontWeight: 500 }}>
                {activeCmdObj?.payload}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-surface-border)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)', marginBottom: '4px' }}>DECRYPTED SCIENCE DOWNLINK (REPLY)</div>
              {receivedTelemetry ? (
                <div style={{ color: 'var(--color-status-active)', fontSize: '0.875rem', lineHeight: 1.6, fontWeight: 500 }}>
                  ✦ {receivedTelemetry}
                </div>
              ) : (
                <div style={{ color: 'var(--color-muted-slate)', fontSize: '0.8125rem', fontStyle: 'italic' }}>
                  Awaiting signal return across 25.9 billion km...
                </div>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-surface-border)', paddingTop: '8px', marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>
              1 Light-Day = 25.902 Billion km
            </span>
            <button
              onClick={resetSimulation}
              className="badge-tag"
              style={{ cursor: 'pointer', fontSize: '0.6875rem' }}
            >
              ⟲ Reset Signal
            </button>
          </div>
        </div>

      </div>

      {/* Educational Takeaway Callout */}
      <div 
        style={{
          marginTop: 'var(--space-md)',
          backgroundColor: 'rgba(217, 119, 6, 0.08)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '0.8125rem',
          color: 'var(--color-telemetry-silver)'
        }}
      >
        <strong style={{ color: 'var(--color-amber-bright)' }}>Educational Takeaway:</strong> A spacecraft can continue its scientific journey far beyond its original planetary mission. Because a radio transmission takes 24 hours to reach Voyager 1 and 24 hours to return, engineers must plan commands two full days in advance.
      </div>
    </section>
  );
}
