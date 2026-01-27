import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animatePosterCard = (element: HTMLElement, index: number) => {
  const ctx = gsap.context(() => {
    gsap.set(element, {
      opacity: 0,
      y: 80,
      rotateX: -25,
      scale: 0.8,
    });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.9,
      delay: index * 0.15,
      ease: 'back.out(1.4)',
    });
  });
  return ctx;
};

export const animatePosterHover = (card: HTMLElement) => {
  const timeline = gsap.timeline();

  timeline.to(card, {
    scale: 1.08,
    y: -15,
    duration: 0.4,
    ease: 'power2.out',
  }, 0);

  timeline.to(
    card,
    {
      boxShadow: '0 40px 100px rgba(0, 0, 0, 0.4)',
      duration: 0.4,
    },
    0
  );

  const overlay = card.querySelector('.poster-overlay');
  if (overlay) {
    timeline.to(overlay, {
      opacity: 1,
      backdropFilter: 'blur(8px)',
      duration: 0.4,
    }, 0);
  }

  const badge = card.querySelector('.poster-badge');
  if (badge) {
    timeline.to(badge, {
      y: -10,
      duration: 0.4,
      ease: 'power2.out',
    }, 0);
  }

  return timeline;
};

export const animatePosterHoverReverse = (card: HTMLElement) => {
  const timeline = gsap.timeline();

  timeline.to(card, {
    scale: 1,
    y: 0,
    duration: 0.4,
    ease: 'power2.out',
  }, 0);

  timeline.to(
    card,
    {
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      duration: 0.4,
    },
    0
  );

  const overlay = card.querySelector('.poster-overlay');
  if (overlay) {
    timeline.to(overlay, {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      duration: 0.4,
    }, 0);
  }

  const badge = card.querySelector('.poster-badge');
  if (badge) {
    timeline.to(badge, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0);
  }

  return timeline;
};

export const animateFormEntry = (form: HTMLElement) => {
  const timeline = gsap.timeline();

  const backdrop = form.querySelector('.form-backdrop');
  const content = form.querySelector('.form-container');
  const inputs = form.querySelectorAll('.form-input-group');

  if (backdrop) {
    timeline.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' },
      0
    );
  }

  if (content) {
    timeline.fromTo(
      content,
      {
        opacity: 0,
        scale: 0.85,
        y: 60,
        rotateX: -20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'back.out(1.5)',
      },
      0.1
    );
  }

  if (inputs.length > 0) {
    timeline.fromTo(
      inputs,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      0.4
    );
  }

  return timeline;
};

export const animateFormExit = (form: HTMLElement) => {
  const timeline = gsap.timeline();

  const content = form.querySelector('.form-container');
  const backdrop = form.querySelector('.form-backdrop');

  if (content) {
    timeline.to(content, {
      opacity: 0,
      scale: 0.85,
      y: 40,
      rotateX: 10,
      duration: 0.4,
      ease: 'power2.in',
    });
  }

  if (backdrop) {
    timeline.to(backdrop, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.2');
  }

  return timeline;
};

export const animateReelCard = (element: HTMLElement, index: number) => {
  const ctx = gsap.context(() => {
    gsap.set(element, {
      opacity: 0,
      x: 100,
      scale: 0.9,
    });

    gsap.to(element, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.7,
      delay: index * 0.15,
      ease: 'power3.out',
    });
  });
  return ctx;
};

export const animateReelHover = (reel: HTMLElement) => {
  const timeline = gsap.timeline();

  timeline.to(reel, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out',
  }, 0);

  timeline.to(
    reel,
    {
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
      duration: 0.3,
    },
    0
  );

  const playButton = reel.querySelector('.reel-play-button');
  if (playButton) {
    timeline.to(playButton, {
      scale: 1.15,
      opacity: 1,
      duration: 0.3,
      ease: 'back.out(1.5)',
    }, 0);
  }

  return timeline;
};

export const animateReelHoverReverse = (reel: HTMLElement) => {
  const timeline = gsap.timeline();

  timeline.to(reel, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  }, 0);

  timeline.to(
    reel,
    {
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      duration: 0.3,
    },
    0
  );

  const playButton = reel.querySelector('.reel-play-button');
  if (playButton) {
    timeline.to(playButton, {
      scale: 1,
      opacity: 0.8,
      duration: 0.3,
    }, 0);
  }

  return timeline;
};

export const animateSectionEntrance = (sectionRef: HTMLElement) => {
  if (!sectionRef) return null;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

  timeline
    .fromTo(
      '.events-title',
      { y: 60, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo(
      '.events-description',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    );

  return timeline;
};

export const animateInputFocus = (input: HTMLInputElement) => {
  const parent = input.parentElement;
  if (parent) {
    gsap.to(parent, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
};

export const animateInputBlur = (input: HTMLInputElement) => {
  const parent = input.parentElement;
  if (parent) {
    gsap.to(parent, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
};

export const animateSuccessMessage = (element: HTMLElement) => {
  const timeline = gsap.timeline();

  timeline.fromTo(
    element,
    { opacity: 0, scale: 0.9, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }
  );

  timeline.to(
    element,
    { opacity: 0, scale: 0.9, y: -20, duration: 0.5, ease: 'power2.in' },
    '+=2.5'
  );
};

export const animateButtonClick = (button: HTMLElement) => {
  const timeline = gsap.timeline();

  timeline.to(button, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.in',
  });

  timeline.to(button, {
    scale: 1,
    duration: 0.2,
    ease: 'back.out(1.5)',
  });

  return timeline;
};

export const createGlassEffect = (element: HTMLElement, colorScheme: any) => {
  gsap.set(element, {
    backdropFilter: 'blur(10px)',
    background: `rgba(255, 255, 255, 0.1)`,
  });
};