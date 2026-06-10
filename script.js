/* ========================================
   MUSTAFA SALEEM — PORTFOLIO SCRIPTS
   Enhanced Interactive Edition
   ======================================== */

// ===== PRELOADER =====
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => preloader.remove(), 500);
    }, 2000);
  });
})();

// ===== CUSTOM CURSOR =====
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  const dot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth trailing animation
  function animateCursor() {
    // Glow follows with delay (soft trailing)
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';

    // Dot follows tighter
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale up on hovering interactive elements
  document.querySelectorAll('a, button, .project-card, .blog-card, .skill-tag, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      glow.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    });
  });

  // Hide custom cursor on mobile
  if ('ontouchstart' in window) {
    glow.style.display = 'none';
    dot.style.display = 'none';
  }
})();


// ===== PARTICLE CANVAS BACKGROUND =====
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  let clickBurst = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // Click to burst particles
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      clickBurst.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * (2 + Math.random() * 2),
        vy: Math.sin(angle) * (2 + Math.random() * 2),
        life: 1,
        size: Math.random() * 3 + 1
      });
    }
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.baseSpeedX = (Math.random() - 0.5) * 0.4;
      this.baseSpeedY = (Math.random() - 0.5) * 0.4;
      this.speedX = this.baseSpeedX;
      this.speedY = this.baseSpeedY;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction — attract gently toward cursor
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Push away with a gentle attraction ring
          if (dist < 60) {
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          } else {
            this.x += (dx / dist) * force * 0.3;
            this.y += (dy / dist) * force * 0.3;
          }
        }
      }

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticleArray() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 150);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    // Draw lines from mouse to nearby particles
    if (mouse.x !== null) {
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const opacity = (1 - dist / 180) * 0.25;
          ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });
    }
  }

  function drawClickBurst() {
    clickBurst.forEach((b, i) => {
      b.x += b.vx;
      b.y += b.vy;
      b.life -= 0.02;
      b.vx *= 0.97;
      b.vy *= 0.97;

      ctx.fillStyle = `rgba(0, 245, 255, ${b.life * 0.8})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
      ctx.fill();
    });
    clickBurst = clickBurst.filter(b => b.life > 0);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    drawClickBurst();
    requestAnimationFrame(animate);
  }

  initParticleArray();
  animate();

  window.addEventListener('resize', () => {
    initParticleArray();
  });
})();


// ===== TYPING EFFECT =====
(function initTyping() {
  const roles = [
    'Cybersecurity Engineering Student',
    'Backend Developer',
    'Database Enthusiast',
    'Vulnerability Researcher',
    'Flutter Developer',
    'Researcher'
  ];

  const el = document.getElementById('typing-text');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
        return;
      }
    } else {
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 35 : 65;
    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
})();


// ===== NAVBAR SCROLL =====
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
})();


// ===== MOBILE NAV TOGGLE =====
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });
})();


// ===== SCROLL REVEAL (IntersectionObserver) =====
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();


// ===== SKILL TAGS ANIMATION =====
(function initSkillTags() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parentTags = entry.target.querySelectorAll('.skill-tag');
        parentTags.forEach((tag, i) => {
          setTimeout(() => {
            tag.classList.add('visible');
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  document.querySelectorAll('.skill-category').forEach(cat => {
    observer.observe(cat);
  });
})();


// ===== 3D TILT EFFECT ON CARDS =====
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .blog-card, .skill-category');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

      // Move internal glow
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      card.style.setProperty('--glow-x', glowX + '%');
      card.style.setProperty('--glow-y', glowY + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();


// ===== MAGNETIC BUTTONS =====
(function initMagnetic() {
  const magnetics = document.querySelectorAll('.magnetic, .btn');

  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();


// ===== HERO PARALLAX ON MOUSE MOVE =====
(function initParallax() {
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');

  if (!hero || !heroContent) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroContent.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroContent.style.transform = 'translate(0, 0)';
  });
})();


// ===== SMOOTH SCROLL for anchor links =====
// Only apply to same-page hash links, NOT to mailto: or external links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ===== STAT COUNTER ANIMATION =====
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const finalText = el.textContent;
        const finalNum = parseInt(finalText);

        if (!isNaN(finalNum)) {
          const suffix = finalText.replace(finalNum, '');
          let current = 0;
          const step = Math.max(1, Math.floor(finalNum / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= finalNum) {
              current = finalNum;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(n => observer.observe(n));
})();


// ===== SCROLL PROGRESS BAR =====
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.classList.add('scroll-progress');
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  });
})();


// ===== BACK TO TOP BUTTON =====
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ===== TERMINAL TYPING ANIMATION =====
(function initTerminalTyping() {
  const lines = document.querySelectorAll('.terminal-body p');
  if (!lines.length) return;

  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(5px)';
    line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
          }, i * 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const terminal = document.querySelector('.terminal-avatar');
  if (terminal) observer.observe(terminal);
})();


// ===== KONAMI CODE EASTER EGG =====
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;

  const easterTerminal = document.getElementById('easter-terminal');
  const easterBody = document.getElementById('easter-terminal-body');
  const easterInput = document.getElementById('easter-input');
  const easterClose = document.getElementById('easter-close');

  if (!easterTerminal) return;

  // Konami code listener
  document.addEventListener('keydown', (e) => {
    if (easterTerminal.classList.contains('active')) return;

    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        openTerminal();
        pos = 0;
      }
    } else {
      pos = 0;
    }
  });

  function openTerminal() {
    easterTerminal.classList.add('active');
    setTimeout(() => easterInput.focus(), 100);
  }

  function closeTerminal() {
    easterTerminal.classList.remove('active');
  }

  easterClose.addEventListener('click', closeTerminal);
  easterTerminal.addEventListener('click', (e) => {
    if (e.target === easterTerminal) closeTerminal();
  });

  // Terminal commands
  const commands = {
    help: () => `Available commands:
  <span style="color:#00F5FF">whoami</span>     — who is this?
  <span style="color:#00F5FF">skills</span>     — list skills
  <span style="color:#00F5FF">projects</span>   — list projects
  <span style="color:#00F5FF">contact</span>    — contact info
  <span style="color:#00F5FF">hack</span>       — try hacking the mainframe
  <span style="color:#00F5FF">secret</span>     — ???
  <span style="color:#00F5FF">clear</span>      — clear terminal
  <span style="color:#00F5FF">exit</span>       — close terminal`,

    whoami: () => `<span style="color:#28c840">Mustafa Saleem</span>
  Cybersecurity Engineering Student
  Backend Developer & Database Enthusiast
  GitHub: <a href="https://github.com/qxzy-24" target="_blank" style="color:#00F5FF">@qxzy-24</a>`,

    skills: () => `<span style="color:#28c840">Languages:</span> Python, C++, Dart, JavaScript, SQL
<span style="color:#28c840">Backend:</span> MySQL, Firebase, REST APIs
<span style="color:#28c840">Tools:</span> Flutter, Git, GitHub, Antigravity, MATLAB, Docker
<span style="color:#28c840">Security:</span> Network Security, Pen Testing, Vulnerability Research
<span style="color:#28c840">Networking:</span> TCP/IP, VLAN, ACL, Wireshark`,

    projects: () => `<span style="color:#28c840">1.</span> GitHub Scout Bot — AI security scanner Telegram bot
<span style="color:#28c840">2.</span> SysWatcher — System monitoring daemon
<span style="color:#28c840">3.</span> Unfound Registry — Full-stack missing artwork app
<span style="color:#28c840">4.</span> Open Player — Flutter music player`,

    contact: () => `<span style="color:#28c840">Email:</span> eng.mustafasaleem@gmail.com
<span style="color:#28c840">GitHub:</span> github.com/qxzy-24
<span style="color:#28c840">LinkedIn:</span> linkedin.com/in/mustafa-muthana-8b8383334/`,

    hack: () => {
      const lines = [
        'Initiating breach sequence...',
        'Scanning ports: 22, 80, 443, 8080...',
        'Port 443 — OPEN',
        'Attempting SQL injection... ACCESS DENIED',
        'Trying buffer overflow... FIREWALL DETECTED',
        'Deploying zero-day exploit...',
        '<span style="color:#ff5f57">ERROR: Nice try! This system is hardened. 🛡️</span>'
      ];
      return lines.join('\n');
    },

    secret: () => `<span style="color:#ffbd2e">🎉 You found the secret! Here's a fun fact:</span>
This portfolio was built with zero frameworks — 
just pure HTML, CSS, and vanilla JavaScript.
Powered by Antigravity AI. ⚡`,

    clear: () => 'CLEAR',
    exit: () => 'EXIT'
  };

  easterInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const cmd = easterInput.value.trim().toLowerCase();
    easterInput.value = '';

    if (!cmd) return;

    // Show the typed command
    const cmdLine = document.createElement('p');
    cmdLine.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">${cmd}</span>`;
    easterBody.appendChild(cmdLine);

    // Execute command
    const handler = commands[cmd];
    if (handler) {
      const result = handler();
      if (result === 'CLEAR') {
        easterBody.innerHTML = '<p class="t-output" style="color:#28c840">Terminal cleared.</p>';
        return;
      }
      if (result === 'EXIT') {
        closeTerminal();
        return;
      }
      const output = document.createElement('pre');
      output.style.cssText = 'font-family:inherit;font-size:inherit;white-space:pre-wrap;color:var(--text-secondary);margin-bottom:4px;';
      output.innerHTML = result;
      easterBody.appendChild(output);
    } else {
      const err = document.createElement('p');
      err.style.color = '#ff5f57';
      err.textContent = `command not found: ${cmd}`;
      easterBody.appendChild(err);
    }

    easterBody.scrollTop = easterBody.scrollHeight;
  });
})();


// ===== TEXT SCRAMBLE ON SKILL TAG HOVER =====
(function initScramble() {
  const chars = '!@#$%^&*()_+-={}[]|;:<>?/~`ABCDEFabcdef0123456789';
  const tags = document.querySelectorAll('.skill-tag');

  tags.forEach(tag => {
    const original = tag.textContent;

    tag.addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        tag.textContent = original
          .split('')
          .map((char, i) => {
            if (i < iterations) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iterations += 1;
        if (iterations > original.length) {
          clearInterval(interval);
          tag.textContent = original;
        }
      }, 30);
    });
  });
})();
