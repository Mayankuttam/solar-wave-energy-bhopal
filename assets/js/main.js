/**
 * SOLAR WAVE ENERGY - MAIN APPLICATION JAVASCRIPT
 * Bhopal, Madhya Pradesh | PM Surya Ghar Approved EPC
 * High Performance, Zero Dependencies (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Mobile Drawer Navigation
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (menuClose) menuClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 3. Sticky Header Elevation on Scroll
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader.classList.add('shadow-sm');
    } else {
      mainHeader.classList.remove('shadow-sm');
    }
  }, { passive: true });

  // 4. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Stat Counter Animation
  const statElements = document.querySelectorAll('[data-target-count]');
  let animatedStats = false;

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statElements.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target-count'));
          const isDecimal = target % 1 !== 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('en-IN');

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              stat.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) statObserver.observe(statsSection);

  // 6. Interactive Solar Savings Calculator
  const billSlider = document.getElementById('bill-slider');
  const billValueDisplay = document.getElementById('bill-value-display');
  const calcCapacity = document.getElementById('calc-capacity');
  const calcArea = document.getElementById('calc-area');
  const calcUnits = document.getElementById('calc-units');
  const calcMonthlySavings = document.getElementById('calc-monthly-savings');
  const calcLifetimeSavings = document.getElementById('calc-lifetime-savings');
  const calcSubsidy = document.getElementById('calc-subsidy');
  const calcNetCost = document.getElementById('calc-net-cost');
  const calcWhatsappBtn = document.getElementById('calc-whatsapp-btn');

  function calculateSolarSavings() {
    if (!billSlider) return;
    const monthlyBill = parseInt(billSlider.value, 10);
    billValueDisplay.textContent = '₹' + monthlyBill.toLocaleString('en-IN');

    // Madhya Pradesh MPMKVVCL Bhopal Average Tariff: ~₹7.20 / unit
    const monthlyUnits = Math.round(monthlyBill / 7.2);
    
    // 1 kW yields ~120 units/month in Bhopal (approx 4 kWh/kW/day * 30 days)
    let rawCapacity = monthlyUnits / 120;
    let kw = 1;
    if (rawCapacity <= 1.3) kw = 1;
    else if (rawCapacity <= 2.3) kw = 2;
    else if (rawCapacity <= 3.4) kw = 3;
    else if (rawCapacity <= 4.4) kw = 4;
    else if (rawCapacity <= 5.5) kw = 5;
    else if (rawCapacity <= 7.5) kw = 7;
    else if (rawCapacity <= 10.5) kw = 10;
    else kw = Math.round(rawCapacity);

    // Physical Requirements & Generation
    const roofArea = kw * 85; // approx 85-90 sq.ft per kW
    const generatedUnits = kw * 120;
    const monthlySavings = Math.min(monthlyBill, Math.round(generatedUnits * 7.2));
    const annualSavings = monthlySavings * 12;
    const lifetimeSavings = annualSavings * 25;

    // PM Surya Ghar Central Direct Bank Transfer (DBT) Subsidy
    let subsidy = 0;
    if (kw === 1) subsidy = 30000;
    else if (kw === 2) subsidy = 60000;
    else subsidy = 78000; // max cap for residential rooftop

    // Average Market Benchmark EPC Cost in Bhopal & MP
    const grossCost = kw * 62000;
    const netCost = Math.max(18000, grossCost - subsidy);

    // Update UI elements
    if (calcCapacity) calcCapacity.textContent = kw + ' kW';
    if (calcArea) calcArea.textContent = roofArea.toLocaleString('en-IN') + ' sq.ft.';
    if (calcUnits) calcUnits.textContent = generatedUnits.toLocaleString('en-IN') + ' kWh';
    if (calcMonthlySavings) calcMonthlySavings.textContent = '₹' + monthlySavings.toLocaleString('en-IN');
    if (calcLifetimeSavings) calcLifetimeSavings.textContent = '₹' + (lifetimeSavings / 100000).toFixed(2) + ' Lakhs';
    if (calcSubsidy) calcSubsidy.textContent = '₹' + subsidy.toLocaleString('en-IN');
    if (calcNetCost) calcNetCost.textContent = '₹' + netCost.toLocaleString('en-IN');

    // Update WhatsApp link with calculated parameters
    if (calcWhatsappBtn) {
      const msg = encodeURIComponent(
        `Hello Solar Wave Energy! I calculated my rooftop solar feasibility for my home/office in Bhopal.\n\n` +
        `• Current Monthly Bill: ₹${monthlyBill.toLocaleString('en-IN')}\n` +
        `• Recommended System Size: ${kw} kW\n` +
        `• Estimated Subsidy: ₹${subsidy.toLocaleString('en-IN')}\n` +
        `• Est. 25-Year Savings: ₹${(lifetimeSavings / 100000).toFixed(2)} Lakhs\n\n` +
        `Please arrange a free rooftop site inspection at my property.`
      );
      calcWhatsappBtn.href = `https://wa.me/919754912806?text=${msg}`;
    }
  }

  if (billSlider) {
    billSlider.addEventListener('input', calculateSolarSavings);
    calculateSolarSavings(); // Initial run
  }

  // 7. Project Filter Tabs
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active styling
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-sm');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      });
      btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      btn.classList.add('bg-amber-500', 'text-slate-950', 'shadow-sm');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 8. FAQ Accordion Toggle (Only 1 item open at a time)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // 9. Contact / Lead Form Submission to WhatsApp
  const quoteForm = document.getElementById('solar-quote-form');
  const formSuccess = document.getElementById('form-success-banner');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quote-name').value.trim();
      const phone = document.getElementById('quote-phone').value.trim();
      const area = document.getElementById('quote-area').value.trim();
      const bill = document.getElementById('quote-bill').value;
      const type = document.getElementById('quote-type').value;

      if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
      }

      const msg = encodeURIComponent(
        `*New Solar Inquiry from Website*\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Location in Bhopal: ${area || 'Bhopal Region'}\n` +
        `• Monthly Bill: ${bill}\n` +
        `• Property Type: ${type}\n\n` +
        `Please contact me for site inspection and PM Surya Ghar subsidy details.`
      );

      // Open WhatsApp directly
      window.open(`https://wa.me/919754912806?text=${msg}`, '_blank');

      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        quoteForm.reset();
        setTimeout(() => {
          formSuccess.classList.add('hidden');
        }, 8000);
      }
    });
  }
});
