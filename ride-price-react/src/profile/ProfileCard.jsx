import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';


const DEFAULT_BEHIND_GRADIENT =
  'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';

const DEFAULT_INNER_GRADIENT =
  'linear-gradient(145deg, rgba(96,73,110,0.55) 0%, rgba(113,196,255,0.27) 100%)';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20
};

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = x =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ProfileCardComponent = ({
  avatarUrl = '/divya.png',
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Divyakanth',
  title = 'AI Developer • Buffalo, NY',
  handle = 'divya',
  status = 'Online',
  contactText = 'Contact Me',
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  // --- Animation logic (unchanged) ---
  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null;

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const width = card.clientWidth;
      const height = card.clientHeight;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1
        )}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };

      Object.entries(properties).forEach(([property, value]) =>
        wrap.style.setProperty(property, value)
      );
    };

    const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const eased = easeInOutCubic(progress);

        const currentX = adjust(eased, 0, 1, startX, targetX);
        const currentY = adjust(eased, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) rafId = requestAnimationFrame(animationLoop);
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    e => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(
        e.clientX - rect.left,
        e.clientY - rect.top,
        card,
        wrap
      );
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    e => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        e.offsetX,
        e.offsetY,
        card,
        wrap
      );
      wrap.classList.remove('active');
      card.classList.remove('active');
    },
    [animationHandlers]
  );

  const handleDeviceOrientation = useCallback(
    e => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;

      const { beta, gamma } = e;
      if (!beta || !gamma) return;

      animationHandlers.updateCardTransform(
        card.clientHeight / 2 + gamma * mobileTiltSensitivity,
        card.clientWidth / 2 +
          (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const deviceOrientationHandler = handleDeviceOrientation;
    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
        window.DeviceMotionEvent.requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };

    card.addEventListener('pointerenter', handlePointerEnter);
    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', handlePointerLeave);
    card.addEventListener('click', handleClick);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      card.removeEventListener('pointerenter', handlePointerEnter);
      card.removeEventListener('pointermove', handlePointerMove);
      card.removeEventListener('pointerleave', handlePointerLeave);
      card.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers, handlePointerEnter, handlePointerLeave, handlePointerMove, handleDeviceOrientation, enableTilt, enableMobileTilt]);

  // --- Styling ---
  const cardStyle = useMemo(
    () => ({
      '--icon': iconUrl ? `url(${iconUrl})` : 'none',
      '--grain': grainUrl ? `url(${grainUrl})` : 'none',
      '--behind-gradient': showBehindGradient
        ? behindGradient ?? DEFAULT_BEHIND_GRADIENT
        : 'none',
      '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT
    }),
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
          <img className="avatar" src="/divya.png" alt="Divyakanth avatar"
              loading="lazy"
            />
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img
                      src={miniAvatarUrl || avatarUrl}
                      alt={`${name} mini avatar`}
                      loading="lazy"
                    />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <button
                  className="pc-contact-btn"
                  onClick={handleContactClick}
                  type="button"
                >
                  {contactText}
                </button>
              </div>
            )}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
