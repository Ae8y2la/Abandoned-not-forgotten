import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function LunarRoverSim() {
  // Rover Navigation State (Dead-Reckoning)
  const [posX, setPosX] = useState(0); // km east of LM
  const [posY, setPosY] = useState(0); // km north of LM
  const [headingDeg, setHeadingDeg] = useState(45); // Heading relative to Lunar North
  const [odometerKm, setOdometerKm] = useState(0);
  const [batteryAh, setBatteryAh] = useState(242); // 2 x 121 Ah
  const [trail, setTrail] = useState([{ x: 0, y: 0 }]);
  const [notification, setNotification] = useState(null);

  // Constants
  const MAX_WALKBACK_KM = 5.0; // Real Apollo 15 max distance from Falcon was 5.0 km on EVA 2
  const canvasRef = useRef(null);

  // Dead-Reckoning Calculations (Mirroring NASA TN D-7469)
  const rangeToLm = Math.sqrt(posX * posX + posY * posY);
  // Bearing from rover back to Lunar Module (0, 0)
  let bearingToLmDeg = (Math.atan2(-posX, -posY) * 180) / Math.PI;
  if (bearingToLmDeg < 0) bearingToLmDeg += 360;

  // Move Rover
  const driveRover = useCallback((distanceDeltaKm, turnDeltaDeg = 0) => {
    setHeadingDeg((prev) => (prev + turnDeltaDeg + 360) % 360);

    if (distanceDeltaKm !== 0) {
      const rad = (headingDeg * Math.PI) / 180;
      const dx = distanceDeltaKm * Math.sin(rad);
      const dy = distanceDeltaKm * Math.cos(rad);

      setPosX((prevX) => {
        const nextX = prevX + dx;
        setPosY((prevY) => {
          const nextY = prevY + dy;
          setTrail((prevTrail) => {
            const last = prevTrail[prevTrail.length - 1];
            const distFromLast = Math.hypot(nextX - last.x, nextY - last.y);
            if (distFromLast > 0.08) {
              return [...prevTrail.slice(-60), { x: nextX, y: nextY }];
            }
            return prevTrail;
          });
          return nextY;
        });
        return nextX;
      });

      const absDist = Math.abs(distanceDeltaKm);
      setOdometerKm((prev) => {
        const nextOdo = +(prev + absDist).toFixed(2);
        // Check benchmarks
        if (prev < 10.3 && nextOdo >= 10.3) {
          setNotification("Milestone: Surpassed Apollo 15 EVA-1 Traverse (10.3 km)!");
        } else if (prev < 27.9 && nextOdo >= 27.9) {
          setNotification("Milestone: Reached Apollo 15 Total Surface Distance (27.9 km)!");
        }
        return nextOdo;
      });

      // Battery consumption (~0.8 Ah per km driven under 36V silver-zinc load)
      setBatteryAh((prev) => Math.max(12, +(prev - absDist * 0.8).toFixed(1)));
    }
  }, [headingDeg]);

  // Step drive for accessibility & quick comparison
  const stepDrive = (km) => {
    driveRover(km, 0);
  };

  const resetToFalcon = () => {
    setPosX(0);
    setPosY(0);
    setHeadingDeg(45);
    setOdometerKm(0);
    setBatteryAh(242);
    setTrail([{ x: 0, y: 0 }]);
    setNotification("Rover reset to Lunar Module 'Falcon' position.");
  };

  // Keyboard navigation listener (WASD / Arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent scrolling when using arrow keys inside simulation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
        }
      }

      switch (e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
          driveRover(0.15, 0);
          break;
        case 's':
        case 'S':
        case 'ArrowDown':
          driveRover(-0.1, 0);
          break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
          driveRover(0, -15);
          break;
        case 'd':
        case 'D':
        case 'ArrowRight':
          driveRover(0, 15);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [driveRover]);

  // Draw Tactical Navigation Display on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Coordinate mapping: 1 km = 36 pixels, center = Falcon (0, 0)
    const scale = 36;
    const cx = width / 2;
    const cy = height / 2;

    const toScreenX = (x) => cx + x * scale;
    const toScreenY = (y) => cy - y * scale;

    // Background: Dark lunar regolith
    ctx.fillStyle = '#0E1117';
    ctx.fillRect(0, 0, width, height);

    // Subtle coordinate grid (every 1 km)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = -8; x <= 8; x++) {
      ctx.beginPath();
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), height);
      ctx.stroke();
    }
    for (let y = -8; y <= 8; y++) {
      ctx.beginPath();
      ctx.moveTo(0, toScreenY(y));
      ctx.lineTo(width, toScreenY(y));
      ctx.stroke();
    }

    // Hadley Rille representation (canyon feature to the west)
    ctx.strokeStyle = 'rgba(168, 179, 194, 0.25)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(toScreenX(-2.5), toScreenY(6));
    ctx.bezierCurveTo(toScreenX(-3.0), toScreenY(2), toScreenX(-2.0), toScreenY(-1), toScreenX(-3.8), toScreenY(-6));
    ctx.stroke();

    ctx.fillStyle = 'rgba(168, 179, 194, 0.4)';
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.fillText("HADLEY RILLE (CANAL DEPTH: 300m)", toScreenX(-4.2), toScreenY(3));

    // Mons Hadley Delta (mountain front to the south)
    ctx.fillStyle = 'rgba(232, 144, 32, 0.3)';
    ctx.fillText("▲ MONS HADLEY DELTA (EVA-2 CLIMB)", toScreenX(-0.5), toScreenY(-3.8));
    ctx.fillText("● SPUR CRATER (GENESIS ROCK)", toScreenX(0.8), toScreenY(-2.9));

    // Walk-Back Safety Limit Circle (5.0 km radius)
    ctx.strokeStyle = 'rgba(232, 144, 32, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, MAX_WALKBACK_KM * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(232, 144, 32, 0.6)';
    ctx.fillText("5.0 KM WALK-BACK SAFETY RADIUS (PLSS OXYGEN LIMIT)", cx - 140, cy - MAX_WALKBACK_KM * scale - 8);

    // Rover Wheel Tracks (Trail)
    if (trail.length > 1) {
      ctx.strokeStyle = '#E89020';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toScreenX(trail[0].x), toScreenY(trail[0].y));
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(toScreenX(trail[i].x), toScreenY(trail[i].y));
      }
      ctx.stroke();
    }

    // Lunar Module 'Falcon' Base (Origin)
    ctx.fillStyle = '#60A5FA';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.fillText("LM FALCON (0, 0)", cx + 10, cy + 4);

    // Current Rover Marker
    const roverScreenX = toScreenX(posX);
    const roverScreenY = toScreenY(posY);

    // Direct Dead-Reckoning Vector back to Falcon
    if (rangeToLm > 0.2) {
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(roverScreenX, roverScreenY);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Rover icon & heading arrow
    ctx.save();
    ctx.translate(roverScreenX, roverScreenY);
    ctx.rotate((headingDeg * Math.PI) / 180);

    // Rover Chassis (Golden rectangular body)
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-7, -11, 14, 22);

    // 4 Wheels
    ctx.fillStyle = '#A8B3C2';
    ctx.fillRect(-10, -10, 3, 6);
    ctx.fillRect(7, -10, 3, 6);
    ctx.fillRect(-10, 4, 3, 6);
    ctx.fillRect(7, 4, 3, 6);

    // Heading Pointer
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(4, -11);
    ctx.lineTo(-4, -11);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [posX, posY, headingDeg, trail, rangeToLm]);

  return (
    <section 
      aria-label="Apollo 15 Lunar Rover Navigation Simulator"
      style={{
        backgroundColor: 'var(--color-surface-charcoal)',
        border: '1px solid var(--color-surface-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        marginTop: 'var(--space-md)'
      }}
    >
      {/* Simulation Header & Mandatory Educational Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
        <span className="badge-tag badge-tag--model">
          Simplified model · Dead-Reckoning Navigation & 5.0 km Walk-Back Limit
        </span>
        <span className="badge-tag" style={{ color: 'var(--color-telemetry-silver)' }}>
          NASA TN D-7469 ALGORITHM
        </span>
      </div>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <h3 className="text-headline-3" style={{ marginBottom: '4px' }}>
          Explore the Lunar Terrain: Drive the LRV
        </h3>
        <p className="text-body" style={{ fontSize: '0.9375rem' }}>
          Use <strong>WASD / Arrow Keys</strong> or the tactile controls below. Observe how the <strong>Directional Gyro</strong> and <strong>Odometers</strong> solve your bearing back to the Lunar Module. Keep an eye on your <strong>5.0 km Walk-Back Limit</strong>!
        </p>
      </div>

      {/* Main Simulation Layout: Tactical Nav Canvas + Telemetry HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 280px', gap: 'var(--space-md)', alignItems: 'start' }}>
        
        {/* Tactical Map Canvas */}
        <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-surface-border)' }}>
          <canvas
            ref={canvasRef}
            width={580}
            height={420}
            style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: '#0E1117' }}
            aria-label="Tactical coordinate map showing Lunar Module Falcon at center, Hadley Rille canyon to the west, Mons Hadley Delta to the south, and the current rover heading."
          />

          {/* Interactive Screen Overlay for Quick Reset */}
          <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
            <button
              onClick={resetToFalcon}
              className="badge-tag"
              style={{ background: 'rgba(20, 24, 32, 0.85)', cursor: 'pointer', border: '1px solid var(--color-surface-border)' }}
            >
              ⟲ Return to Falcon
            </button>
          </div>
        </div>

        {/* Telemetry Dashboard (Tabular Numerals) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <div 
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm)'
            }}
          >
            <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: '8px' }}>
              LRV SIGNAL PROCESSOR · TN D-7469
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>HEADING (GYRO)</div>
                <div className="font-telemetry" style={{ fontSize: '1.25rem', color: 'var(--color-regolith-white)', fontWeight: 600 }}>
                  {String(headingDeg).padStart(3, '0')}°
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>ODOMETER</div>
                <div className="font-telemetry" style={{ fontSize: '1.25rem', color: 'var(--color-amber-bright)', fontWeight: 600 }}>
                  {odometerKm.toFixed(2)} km
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>RANGE TO LM</div>
                <div className="font-telemetry" style={{ fontSize: '1.1rem', color: rangeToLm > 4.5 ? '#F87171' : 'var(--color-regolith-white)' }}>
                  {rangeToLm.toFixed(2)} km
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>BEARING TO LM</div>
                <div className="font-telemetry" style={{ fontSize: '1.1rem', color: '#60A5FA' }}>
                  {bearingToLmDeg.toFixed(0)}°
                </div>
              </div>
            </div>

            {/* Battery Level */}
            <div style={{ borderTop: '1px solid var(--color-surface-border)', paddingTop: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-telemetry-silver)', marginBottom: '4px' }}>
                <span>36V AG-ZN BATTERY</span>
                <span className="font-telemetry">{batteryAh.toFixed(1)} / 242 Ah</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{
                    width: `${(batteryAh / 242) * 100}%`,
                    height: '100%',
                    backgroundColor: batteryAh > 50 ? 'var(--color-status-active)' : '#F87171',
                    transition: 'width 200ms ease'
                  }}
                />
              </div>
            </div>

            {/* Walk-Back Safety Constraint Callout */}
            <div 
              style={{
                backgroundColor: rangeToLm > MAX_WALKBACK_KM ? 'rgba(239, 68, 68, 0.15)' : 'rgba(232, 144, 32, 0.08)',
                border: `1px solid ${rangeToLm > MAX_WALKBACK_KM ? '#EF4444' : 'rgba(232, 144, 32, 0.3)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                fontSize: '0.8125rem',
                lineHeight: 1.4
              }}
            >
              <div style={{ fontWeight: 600, color: rangeToLm > MAX_WALKBACK_KM ? '#F87171' : 'var(--color-amber-bright)', marginBottom: '2px' }}>
                {rangeToLm > MAX_WALKBACK_KM ? '⚠️ WALK-BACK LIMIT EXCEEDED' : '✓ WALK-BACK MARGIN SAFE'}
              </div>
              <p style={{ color: 'var(--color-telemetry-silver)', fontSize: '0.75rem', margin: 0 }}>
                {rangeToLm > MAX_WALKBACK_KM 
                  ? 'In a real mission, astronauts were barred from exceeding this radius: spacesuit oxygen would deplete before a hike back!'
                  : 'Range is within the 5.0 km radius Scott and Irwin could safely hike back on foot.'}
              </p>
            </div>
          </div>

          {/* Apollo 15 Real Traverses Comparison */}
          <div 
            style={{
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm)'
            }}
          >
            <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: '6px' }}>
              APOLLO 15 BENCHMARKS
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: odometerKm >= 10.3 ? 'var(--color-status-active)' : 'var(--color-telemetry-silver)' }}>
                <span>EVA 1 (Elbow Crater):</span>
                <span className="font-telemetry">10.3 km {odometerKm >= 10.3 ? '✓' : ''}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: odometerKm >= 12.5 ? 'var(--color-status-active)' : 'var(--color-telemetry-silver)' }}>
                <span>EVA 2 (Hadley Delta):</span>
                <span className="font-telemetry">12.5 km {odometerKm >= 12.5 ? '✓' : ''}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: odometerKm >= 5.1 ? 'var(--color-status-active)' : 'var(--color-telemetry-silver)' }}>
                <span>EVA 3 (Hadley Scarp):</span>
                <span className="font-telemetry">5.1 km {odometerKm >= 5.1 ? '✓' : ''}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--color-surface-border)', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: odometerKm >= 27.9 ? 'var(--color-amber-bright)' : 'var(--color-regolith-white)' }}>
                <span>Total Rover Traverse:</span>
                <span className="font-telemetry">27.9 km {odometerKm >= 27.9 ? '★ RECORD' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Drive Controls (Mouse, Touch & Accessibility Step Driving) */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--color-surface-border)'
        }}
      >
        {/* On-Screen Steering Joystick Buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => driveRover(0, -15)}
            aria-label="Steer rover left 15 degrees"
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-regolith-white)',
              fontSize: '0.875rem'
            }}
          >
            ◀ Turn Left
          </button>
          
          <button
            onClick={() => driveRover(0.2, 0)}
            aria-label="Drive rover forward 200 meters"
            style={{
              padding: '10px 18px',
              backgroundColor: 'var(--color-lunar-amber)',
              borderRadius: 'var(--radius-sm)',
              color: '#0B0D11',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            ▲ Drive Forward
          </button>

          <button
            onClick={() => driveRover(0, 15)}
            aria-label="Steer rover right 15 degrees"
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-regolith-white)',
              fontSize: '0.875rem'
            }}
          >
            Turn Right ▶
          </button>

          <button
            onClick={() => driveRover(-0.1, 0)}
            aria-label="Reverse rover backward 100 meters"
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-regolith-white)',
              fontSize: '0.875rem'
            }}
          >
            ▼ Reverse
          </button>
        </div>

        {/* Step Traversal Buttons (Accessibility & Reduced Motion) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>STEP ADVANCE:</span>
          <button
            onClick={() => stepDrive(1.0)}
            className="badge-tag"
            style={{ cursor: 'pointer', background: 'var(--color-surface-elevated)' }}
          >
            +1.0 km
          </button>
          <button
            onClick={() => stepDrive(5.0)}
            className="badge-tag"
            style={{ cursor: 'pointer', background: 'var(--color-surface-elevated)' }}
          >
            +5.0 km
          </button>
        </div>
      </div>

      {/* Live Accessibility Feedback */}
      <div 
        aria-live="polite" 
        style={{ marginTop: 'var(--space-xs)', fontSize: '0.8125rem', color: 'var(--color-amber-bright)', minHeight: '20px' }}
      >
        {notification}
      </div>
    </section>
  );
}
