/* ==========================================================================
   TREE TOP HEAVEN AND ECO RESORT — MAIN JAVASCRIPT ENGINE (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  /* 1. Canvas Weather Particles Engine */
  let currentAmbiance = 'noon';
  const canvas = document.getElementById('ambientCanvas');
  let ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];

  if (canvas) {
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor(type) { this.reset(type); }
      reset(type) {
        this.type = type;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = type === 'rain' ? -1.5 : (Math.random() * 0.8 - 0.4);
        this.speedY = type === 'rain' ? (Math.random() * 8 + 12) : (Math.random() * 0.6 + 0.2);
        this.length = Math.random() * 15 + 10;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y > canvas.height || this.x > canvas.width || this.x < -20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        if (this.type === 'rain') {
          ctx.strokeStyle = `rgba(180, 215, 230, ${this.opacity})`;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.speedX * 2, this.y + this.length);
          ctx.stroke();
        } else if (this.type === 'firefly') {
          ctx.fillStyle = `rgba(64, 224, 208, ${this.opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(64, 224, 208, 0.8)';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(140, 180, 120, ${this.opacity * 0.6})`;
          ctx.beginPath();
          ctx.ellipse(this.x, this.y, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function initParticles(type, count) {
      particles = [];
      for (let i = 0; i < count; i++) particles.push(new Particle(type));
    }

    function animateParticles() {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) { p.update(); p.draw(); }
      }
      requestAnimationFrame(animateParticles);
    }

    window.setCanopyAmbiance = function(mode) {
      currentAmbiance = mode;
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${mode}`);
      const label = document.getElementById('currentAmbianceLabel');
      if (label) label.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

      if (mode === 'rain') initParticles('rain', 100);
      else if (mode === 'midnight') initParticles('firefly', 45);
      else initParticles('leaf', 25);

      if (typeof lucide !== 'undefined') lucide.createIcons();
      document.getElementById('ambianceMenu')?.classList.add('hidden');
      showToast(`Atmosphere set to ${mode.toUpperCase()}`);
    };

    initParticles('leaf', 25);
    animateParticles();
  }

  /* 2. Resilient Nature Soundscape */
  const audio = document.getElementById('forestAudio');
  let isAudioPlaying = false;

  window.toggleForestAudio = async function() {
    if (!audio) return;
    if (!isAudioPlaying) {
      try {
        await audio.play();
        isAudioPlaying = true;
        document.getElementById('equalizerBars')?.classList.remove('eq-paused');
        showToast("🔊 Nature soundscape playing");
      } catch (err) {
        showToast("Audio stream blocked by browser");
      }
    } else {
      audio.pause();
      isAudioPlaying = false;
      document.getElementById('equalizerBars')?.classList.add('eq-paused');
      showToast("Audio muted");
    }
  };

  document.getElementById('floatingAudioToggleBtn')?.addEventListener('click', toggleForestAudio);
  document.getElementById('navAudioToggleBtn')?.addEventListener('click', toggleForestAudio);

  /* 3. 360° Hotspots */
  const hotspotData = {
    1: { title: "Cantilevered Volcanic Plunge Pool", desc: "Heated to 98°F using clean geothermal closed-loop heat pumps." },
    2: { title: "Zero-Bark Tree Clamp Collar", desc: "Patented titanium & neoprene friction pads gripping without puncturing living bark." },
    3: { title: "Motorized Whisper Sky-Window", desc: "Retractable acoustic glass roof sliding open for celestial stargazing." }
  };

  window.showHotspotDetail = function(id) {
    const data = hotspotData[id];
    if (!data) return;
    document.getElementById('hotspotTitle').textContent = data.title;
    document.getElementById('hotspotDesc').textContent = data.desc;
    document.getElementById('hotspotCard')?.classList.remove('hidden');
  };
  window.closeHotspotCard = function() {
    document.getElementById('hotspotCard')?.classList.add('hidden');
  };

  /* 4. Biosphere Map Telemetry */
  const mapLocations = {
    obsidian: { title: "The Obsidian Villa", alt: "1,820m Alt", temp: "21.4°C", hum: "88%" },
    cedar: { title: "The Cedar Duplex", alt: "1,790m Alt", temp: "19.8°C", hum: "92%" },
    stargazer: { title: "The Stargazer Loft", alt: "1,850m Alt", temp: "18.2°C", hum: "82%" }
  };

  window.selectMapLocation = function(key) {
    const d = mapLocations[key];
    if (!d) return;
    document.getElementById('mapLocationTitle').textContent = d.title;
    document.getElementById('mapElevationBadge').textContent = d.alt;
    document.getElementById('mapTemp').textContent = d.temp;
    document.getElementById('mapHumidity').textContent = d.hum;
  };

  /* 5. Stay & Eco-Calculator */
  window.runCalculation = function() {
    const tier = document.getElementById('calcTier');
    if (!tier) return;
    const rate = parseInt(tier.options[tier.selectedIndex].getAttribute('data-rate'), 10) || 1200;
    const nights = 3; // Computed from date diff
    const total = rate * nights + (document.getElementById('addonHeli')?.checked ? 350 : 0);
    document.getElementById('calcGrandTotal').textContent = `$${total.toLocaleString()}`;
    document.getElementById('ecoTreesCount').textContent = `${nights * 10} Trees`;
  };

  window.generateBoardingPass = function(e) {
    if (e) e.preventDefault();
    document.getElementById('boardingPassModal')?.classList.remove('hidden');
    document.getElementById('boardingPassModal')?.classList.add('flex');
    showToast("🎉 VIP Sanctuary Boarding Pass Generated!");
  };

  window.closeBoardingPassModal = function() {
    document.getElementById('boardingPassModal')?.classList.add('hidden');
    document.getElementById('boardingPassModal')?.classList.remove('flex');
  };

  /* 6. Canopy Quiz */
  window.openQuizModal = function() { document.getElementById('quizModal')?.classList.remove('hidden'); };
  window.closeQuizModal = function() { document.getElementById('quizModal')?.classList.add('hidden'); };
  window.answerQuiz = function(step, choice) {
    document.getElementById('quizStep1')?.classList.add('hidden');
    document.getElementById('quizResult')?.classList.remove('hidden');
  };
  window.applyQuizMatch = function() { closeQuizModal(); runCalculation(); };

  /* 7. Toast */
  window.showToast = function(msg) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  };

  /* 8. Keyboard Presentation Shortcuts */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === 'd' || e.key === 'D') {
      const modes = ['dawn', 'noon', 'rain', 'midnight'];
      setCanopyAmbiance(modes[(modes.indexOf(currentAmbiance) + 1) % modes.length]);
    } else if (e.key === 's' || e.key === 'S') toggleForestAudio();
    else if (e.key === 'm' || e.key === 'M') openQuizModal();
    else if (e.key === 'b' || e.key === 'B') document.getElementById('booking-calculator')?.scrollIntoView({ behavior: 'smooth' });
  });
});