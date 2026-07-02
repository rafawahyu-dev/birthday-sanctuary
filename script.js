/* ==========================================================================
   SANCTUARY — script.js
   Handles: floating heart background, landing page interactions,
   envelope + typing animation, polaroid reveal, and heart confetti.
   ========================================================================== */

/* ---------------------------------------------------------------------
   1. FLOATING HEARTS BACKGROUND
   Runs on every page that has a #heartsField element.
   Generates small heart glyphs that drift upward forever.
--------------------------------------------------------------------- */
function initFloatingHearts() {
  const field = document.getElementById('heartsField');
  if (!field) return;

  const HEART_COUNT = 26;

  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.5 ? '❤' : '♡';

    // Randomize size, position, speed and drift for a natural, non-uniform field
    const size = 10 + Math.random() * 18; // 10px - 28px
    const left = Math.random() * 100; // vw percentage
    const duration = 10 + Math.random() * 12; // 10s - 22s
    const delay = Math.random() * 18; // stagger start times
    const drift = (Math.random() * 120 - 60) + 'px'; // horizontal sway

    heart.style.left = left + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = delay + 's';
    heart.style.setProperty('--drift', drift);

    field.appendChild(heart);
  }
}

/* ---------------------------------------------------------------------
   2. LANDING PAGE LOGIC
   Handles the "Open My Wish" button: starts music, fades to black,
   shows "Loading Memories..." then navigates to letter.html.
--------------------------------------------------------------------- */
function initLandingPage() {
  const openBtn = document.getElementById('openWishBtn');
  const overlay = document.getElementById('transitionOverlay');
  const music = document.getElementById('bgMusic');

  if (!openBtn) return; // not on the landing page

  openBtn.addEventListener('click', () => {
    // Start music only after this user gesture (satisfies browser autoplay rules)
    if (music) {
      music.volume = 0.75;
      music.play().catch(() => {
        // Autoplay might still be blocked on some browsers; fail silently,
        // the letter page will attempt to resume playback too.
      });
    }

    // Disable the button so it can't be clicked twice mid-transition
    openBtn.disabled = true;

    // Fade to black, then navigate once the transition has visually completed
    overlay.classList.add('is-active');

    setTimeout(() => {
      window.location.href = 'letter.html';
    }, 2200);
  });
}

/* ---------------------------------------------------------------------
   3. LETTER PAGE LOGIC
   Handles: resuming music, the typing animation, the polaroid reveal,
   and triggering the heart confetti burst.
--------------------------------------------------------------------- */
function initLetterPage() {
  const letterText = document.getElementById('letterText');
  if (!letterText) return; // not on the letter page

  const cursor = document.getElementById('typingCursor');
  const polaroid = document.getElementById('polaroid');
  const goBackBtn = document.getElementById('goBackBtn');
  const music = document.getElementById('bgMusic');

  // Try to keep the music playing as we arrive on this page
  if (music) {
    music.volume = 0.75;
    music.play().catch(() => {
      /* if still blocked, the user can enable audio manually via browser controls */
    });
  }

  // Full letter content, written with real line breaks preserved via CSS `white-space: pre-line`
  const letterContent =
`Happy Birthday,
Sanctuary. ❤️

Today is all about you.

I hope this new chapter of your life brings you
more peace than worries,
more laughter than tears,
and more beautiful memories than yesterday.

Thank you...
for once becoming someone
who made a part of my life feel special.

Time has taken us to different paths,
yet I still hope life is kind to you.

May you always be surrounded
by people who truly appreciate you,
dreams that keep you inspired,
and moments that make your heart feel at home.

No matter where life leads us,
I sincerely wish you nothing
but happiness.

Happy Birthday,
and take good care of yourself.

— Rafael ❤️

Some people become memories.
Some memories become a sanctuary.`;

  // The envelope + paper animation finishes around 2.4s (see style.css timings),
  // so typing begins right after the letter card has faded in.
  const TYPING_START_DELAY = 2600;

  setTimeout(() => {
    typeText(letterContent, letterText, cursor, () => {
      // Typing finished — wait 2s, then reveal the polaroid photo
      setTimeout(() => {
        if (polaroid) polaroid.classList.add('is-visible');

        // Wait another 2s, then launch the heart confetti burst
        setTimeout(() => {
          launchHeartConfetti();
          if (goBackBtn) goBackBtn.classList.add('is-visible');
        }, 2000);
      }, 2000);
    });
  }, TYPING_START_DELAY);

  // "Go Back" returns to the landing page
  if (goBackBtn) {
    goBackBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

/**
 * Human-like typewriter effect.
 * Uses variable delay per character (slightly slower after punctuation,
 * slightly randomized) so it doesn't feel mechanical.
 */
function typeText(fullText, targetEl, cursorEl, onComplete) {
  let index = 0;

  function typeNextChar() {
    if (index >= fullText.length) {
      if (cursorEl) cursorEl.classList.add('is-hidden');
      if (onComplete) onComplete();
      return;
    }

    const char = fullText[index];
    targetEl.textContent += char;
    index++;

    // Base human-like typing speed with natural randomness
    let delay = 32 + Math.random() * 34; // ~32ms - 66ms per character

    // Slightly longer pause after sentence-ending punctuation and line breaks
    if (char === '.' || char === ',' || char === '!' || char === '?') {
      delay += 180;
    }
    if (char === '\n') {
      delay += 120;
    }

    setTimeout(typeNextChar, delay);
  }

  typeNextChar();
}

/* ---------------------------------------------------------------------
   4. HEART CONFETTI
   Canvas-based burst of pink & white hearts (not generic colorful confetti).
--------------------------------------------------------------------- */
function launchHeartConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = ['#f9a8d4', '#fbcfe8', '#ffffff', '#f472b6'];
  const PARTICLE_COUNT = 70;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() * 200 - 100),
      y: window.innerHeight / 2 + (Math.random() * 100 - 50),
      size: 8 + Math.random() * 14,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: -(4 + Math.random() * 10),
      gravity: 0.18 + Math.random() * 0.08,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      fade: 0.006 + Math.random() * 0.006
    });
  }

  function drawHeart(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(p.opacity, 0);
    ctx.fillStyle = p.color;

    const s = p.size / 20;
    ctx.beginPath();
    ctx.moveTo(0, 4 * s);
    ctx.bezierCurveTo(-10 * s, -6 * s, -20 * s, 4 * s, 0, 16 * s);
    ctx.bezierCurveTo(20 * s, 4 * s, 10 * s, -6 * s, 0, 4 * s);
    ctx.fill();
    ctx.restore();
  }

  let frame = 0;
  const MAX_FRAMES = 260;

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.fade;
      drawHeart(p);
    });

    frame++;
    if (frame < MAX_FRAMES) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      window.removeEventListener('resize', resizeCanvas);
    }
  }

  requestAnimationFrame(animate);
}

/* ---------------------------------------------------------------------
   INIT — runs once the DOM is ready
--------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initLandingPage();
  initLetterPage();
});
