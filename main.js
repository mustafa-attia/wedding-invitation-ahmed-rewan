(function () {
  // ============================================
  // REDUCED MOTION
  // ============================================

  var reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ============================================
  // LOCK PAGE
  // ============================================

  document.documentElement.classList.add("locked");

  // ============================================
  // GSAP INITIAL HERO STATE
  // ============================================

  if (window.gsap) {
    gsap.set(".hero-el", {
      opacity: 0,
      y: 26,
    });
  }

  // ============================================
  // ALBUM + LIGHTBOX
  // ============================================

  var albumCards = document.querySelectorAll(".album-card");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  albumCards.forEach(function (card) {
    card.addEventListener("click", function () {
      var image = card.getAttribute("data-image");

      if (!image || !lightbox || !lightboxImg) return;

      lightboxImg.src = image;

      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";

      if (!reduced && window.gsap) {
        gsap.fromTo(
          lightboxImg,
          {
            scale: 0.82,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
          }
        );
      }
    });
  });

  function closeLightbox() {
    if (!lightbox) return;

    if (!reduced && window.gsap && lightboxImg) {
      gsap.to(lightboxImg, {
        scale: 0.88,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.3,
        ease: "power2.in",
        onComplete: function () {
          lightbox.classList.remove("active");
          lightbox.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
          lightboxImg.src = "";
        },
      });
    } else {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      if (lightboxImg) {
        lightboxImg.src = "";
      }
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      lightbox &&
      lightbox.classList.contains("active")
    ) {
      closeLightbox();
    }
  });

  // ============================================
  // FLORAL LOADER SVG
  // ============================================

  var svgNS = "http://www.w3.org/2000/svg";

  var ringOuter = document.getElementById("ringOuter");
  var ringInner = document.getElementById("ringInner");

  function addRingItem(
    targetGroup,
    cx,
    cy,
    angle,
    symbolId,
    isBloom,
    scale,
    delayMs
  ) {
    if (!targetGroup) return;

    var g = document.createElementNS(svgNS, "g");

    g.setAttribute(
      "class",
      "ring-item " + (isBloom ? "bloom" : "leaf")
    );

    g.setAttribute(
      "transform",
      "translate(" +
        cx +
        "," +
        cy +
        ") rotate(" +
        angle +
        ") scale(" +
        scale +
        ")"
    );

    g.style.setProperty("--d", delayMs + "ms");

    var use = document.createElementNS(svgNS, "use");

    use.setAttribute("href", symbolId);
    use.setAttribute("x", "-20");
    use.setAttribute("y", "-20");
    use.setAttribute("width", "40");
    use.setAttribute("height", "40");

    g.appendChild(use);
    targetGroup.appendChild(g);
  }

  // ============================================
  // INNER RING
  // ============================================

  var N_inner = 12;

  for (var j = 0; j < N_inner; j++) {
    var a2 = j * (360 / N_inner);
    var r2 = (a2 * Math.PI) / 180;

    var sym = j % 2 === 0 ? "#bloom" : "#leaf";

    addRingItem(
      ringInner,
      190 + 110 * Math.sin(r2),
      190 - 110 * Math.cos(r2),
      a2,
      sym,
      j % 2 === 0,
      0.65,
      reduced ? 0 : j * 35
    );
  }

  // ============================================
  // OUTER RING
  // ============================================

  var N_outer = 18;
  var OUTER_BASE = 450;

  for (var i = 0; i < N_outer; i++) {
    var angle = i * (360 / N_outer);
    var rad = (angle * Math.PI) / 180;

    var isBloom = i % 3 !== 2;

    var symbolId = isBloom
      ? i % 2 === 0
        ? "#bloom"
        : "#rose"
      : "#leaf";

    addRingItem(
      ringOuter,
      190 + 168 * Math.sin(rad),
      190 - 168 * Math.cos(rad),
      angle,
      symbolId,
      isBloom,
      isBloom ? 0.9 : 0.7,
      reduced ? 0 : OUTER_BASE + i * 40
    );
  }

  // ============================================
  // LOADER VARIABLES
  // ============================================

  var loader = document.getElementById("loader");
  var circle = document.getElementById("loaderCircle");
  var flash = document.getElementById("loaderFlash");

  var bgMusic = document.getElementById("bgMusic");
  var musicBtn = document.getElementById("musicToggle");

  var entered = false;
  var isPlaying = false;

  // ============================================
  // AUDIO
  // ============================================

  function playAudio() {
    if (!bgMusic) return;

    bgMusic
      .play()
      .then(function () {
        isPlaying = true;

        if (musicBtn) {
          musicBtn.classList.add("playing");
        }
      })
      .catch(function (err) {
        console.log(
          "Audio playback waiting for user interaction or missing file:",
          err
        );
      });
  }

  function toggleAudio() {
    if (!bgMusic) return;

    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;

      if (musicBtn) {
        musicBtn.classList.remove("playing");
      }
    } else {
      playAudio();
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", toggleAudio);
  }

  // ============================================
  // LOADER ENTER
  // ============================================

  function enter() {

    if (entered) return;

    entered = true;

    if (loader) {
      loader.classList.add("ignite");
    }
    if (!reduced && window.gsap) {
  gsap.timeline()
    .to("#loaderCircle", {
      scale: 1.08,
      duration: 0.7,
      ease: "power2.inOut",
    })
    .to("#loaderCircle", {
      scale: 0.96,
      duration: 0.5,
      ease: "power2.inOut",
    })
    .to("#loaderCircle", {
      scale: 1.18,
      duration: 0.7,
      ease: "power4.in",
    });

  gsap.to(".ring-item", {
    rotation: "+=360",
    duration: 4,
    stagger: 0.02,
    ease: "power2.inOut",
  });

  gsap.to("#ringInner", {
    rotation: -360,
    transformOrigin: "190px 190px",
    duration: 8,
    ease: "none",
  });

  gsap.to("#ringOuter", {
    rotation: 360,
    transformOrigin: "190px 190px",
    duration: 12,
    ease: "none",
  });
}

    playAudio();

    var wait = reduced
      ? 250
      : OUTER_BASE + N_outer * 40 + 1100;

    setTimeout(function () {
      if (flash) {
        flash.style.opacity = "1";
      }

      setTimeout(function () {
        if (flash) {
          flash.style.opacity = "0";
        }

        if (loader) {
          loader.style.opacity = "0";
          loader.style.visibility = "hidden";
        }

        document.documentElement.classList.remove("locked");
        document.documentElement.classList.add("entered");

        if (window.gsap) {
          gsap.to(".hero-el", {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.01 : 1.1,
            stagger: reduced ? 0 : 0.12,
            ease: "power3.out",
          });
        }

        // Refresh ScrollTrigger after loader disappears
        if (window.ScrollTrigger) {
          setTimeout(function () {
            ScrollTrigger.refresh();
          }, 100);
        }
      }, 300);
    }, wait);
  }

  if (circle) {
    circle.addEventListener("click", enter);

    circle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    });
  }

  // ============================================
  // COUNTDOWN
  // ============================================

  var target = new Date("2026-11-23T16:00:00");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function setVal(id, val) {
    var el = document.getElementById(id);

    if (!el) return;

    var v = pad(val);

    if (el.textContent !== v) {
      el.textContent = v;

      if (!reduced) {
        el.classList.remove("pulse");

        void el.offsetWidth;

        el.classList.add("pulse");
      }
    }
  }

  function tick() {
    var diff = Math.max(0, target - new Date());

    setVal(
      "days",
      Math.floor(diff / 86400000)
    );

    setVal(
      "hours",
      Math.floor(
        (diff % 86400000) / 3600000
      )
    );

    setVal(
      "mins",
      Math.floor(
        (diff % 3600000) / 60000
      )
    );

    setVal(
      "secs",
      Math.floor(
        (diff % 60000) / 1000
      )
    );
  }

  tick();

  setInterval(tick, 1000);

  // ============================================
  // ROTATING ARABIC QUOTES
  // ============================================

  var lyrics = [
    "«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا»",
    "«كل قصة حب جميلة، ولكن قصتنا هي الأجمل لقلبي.»",
    "«في كل العالم، لا يوجد قلب لي مثل قلبك.»",
    "«قلبان في رحلة عمر واحدة تجمعهما المودة والرحمة.»",
  ];

  var li = 0;
  var lyricEl = document.getElementById("lyricText");

  if (lyricEl) {
    setInterval(function () {
      li = (li + 1) % lyrics.length;

      if (reduced) {
        lyricEl.textContent = lyrics[li];
        return;
      }

      if (window.gsap) {
        gsap.to(lyricEl, {
          opacity: 0,
          y: 10,
          filter: "blur(5px)",
          duration: 0.35,
          ease: "power2.in",
          onComplete: function () {
            lyricEl.textContent = lyrics[li];

            gsap.fromTo(
              lyricEl,
              {
                opacity: 0,
                y: -10,
                filter: "blur(5px)",
              },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.5,
                ease: "power3.out",
              }
            );
          },
        });
      }
    }, 5500);
  }

  // ============================================
  // PHOTO 3D TILT
  // ============================================

  var photo = document.querySelector(".photo-frame");

  if (
    photo &&
    !reduced &&
    window.matchMedia("(pointer:fine)").matches
  ) {
    photo.addEventListener("mousemove", function (e) {
      var r = photo.getBoundingClientRect();

      var px =
        (e.clientX - r.left) / r.width - 0.5;

      var py =
        (e.clientY - r.top) / r.height - 0.5;

      photo.style.transform =
        "perspective(700px) rotateX(" +
        py * -7 +
        "deg) rotateY(" +
        px * 7 +
        "deg)";
    });

    photo.addEventListener("mouseleave", function () {
      photo.style.transform = "";
    });
  }

  // ============================================
  // CINEMATIC SCROLL ANIMATIONS
  // ============================================

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.defaults({
      ease: "power3.out",
      duration: 1.1,
    });

    // ==========================================
    // GENERIC REVEAL
    // ==========================================

    gsap.utils.toArray(".reveal").forEach(function (el) {
      if (reduced) {
        gsap.set(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });

        return;
      }

      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 70,
          scale: 0.96,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 60%",
            toggleActions:
              "play none none reverse",
          },
        }
      );
    });

    // ==========================================
    // SECTION TITLES
    // ==========================================

    gsap.utils
      .toArray(".section-title")
      .forEach(function (title) {
        if (reduced) {
          gsap.set(title, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          });

          return;
        }

        gsap.fromTo(
          title,
          {
            opacity: 0,
            y: 45,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.25,
            ease: "power4.out",
            scrollTrigger: {
              trigger: title,
              start: "top 86%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      });

    // ==========================================
    // INVITATION / CONTENT CARDS
    // ==========================================

    var cards = gsap.utils.toArray(
      ".invitation-card, .countdown, .venue-card, .story-card"
    );

    cards.forEach(function (card) {
      if (reduced) {
        gsap.set(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
        });

        return;
      }

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 80,
          scale: 0.94,
          rotateX: 8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions:
              "play none none reverse",
          },
        }
      );
    });

    // ==========================================
    // CINEMATIC IMAGE REVEAL
    // ==========================================

    gsap.utils
      .toArray(
        ".photo-frame img, .venue img, .album-img-wrapper img"
      )
      .forEach(function (img) {
        if (reduced) {
          gsap.set(img, {
            scale: 1,
          });

          return;
        }

        gsap.fromTo(
          img,
          {
            scale: 1.18,
          },
          {
            scale: 1,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      });

    // ==========================================
    // IMAGE PARALLAX
    // ==========================================

    gsap.utils
      .toArray(
        ".photo-frame img, .venue img, .parallax-img"
      )
      .forEach(function (img) {
        if (reduced) return;

        gsap.to(img, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

    // ==========================================
    // HERO PARALLAX
    // ==========================================

    var hero = document.querySelector("#hero");

    if (hero && !reduced) {
      gsap.to(
        hero.querySelectorAll(".hero-el"),
        {
          y: -80,
          opacity: 0.35,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
    }

    // ==========================================
    // HERO PHOTO MOVEMENT
    // ==========================================

    var heroPhoto =
      document.querySelector(".photo-frame");

    if (heroPhoto && !reduced) {
      gsap.to(heroPhoto, {
        y: -110,
        scale: 1.04,
        rotation: -1,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    }

    // ==========================================
    // COUNTDOWN
    // ==========================================

    var countdown =
      document.querySelector(".countdown");

    if (countdown && !reduced) {
      var countdownItems =
        countdown.querySelectorAll(
          ".countdown-item, .time-box, .countdown-box"
        );

      if (countdownItems.length) {
        gsap.fromTo(
          countdownItems,
          {
            opacity: 0,
            y: 50,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: countdown,
              start: "top 82%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      }
    }

    // ==========================================
    // ALBUM
    // ==========================================

    var album = document.querySelector("#album");

    if (album && !reduced) {
      var albumCards =
        gsap.utils.toArray(".album-card");

      gsap.set(albumCards, {
        opacity: 0,
        y: 100,
        scale: 0.82,
        rotation: 0,
        filter: "blur(6px)",
      });

      ScrollTrigger.create({
        trigger: album,
        start: "top 75%",
        once: true,

        onEnter: function () {
          gsap.to(albumCards, {
            opacity: 1,
            y: 0,
            scale: 1,

            rotation: function (index, target) {
              return (
                parseFloat(
                  target.style.getPropertyValue("--rot")
                ) || 0
              );
            },

            filter: "blur(0px)",

            duration: 1.15,

            stagger: {
              each: 0.12,
              from: "random",
            },

            ease: "back.out(1.25)",
          });
        },
      });

      // ========================================
      // ALBUM FLOATING
      // ========================================

      albumCards.forEach(function (card, index) {
        var baseRotation =
          parseFloat(
            card.style.getPropertyValue("--rot")
          ) || 0;

        gsap.to(card, {
          y: index % 2 === 0 ? -12 : 12,

          rotation:
            baseRotation +
            (index % 2 === 0 ? -1.5 : 1.5),

          duration: 3 + index * 0.15,

          repeat: -1,
          yoyo: true,

          ease: "sine.inOut",

          delay: index * 0.08,
        });
      });
    }

    // ==========================================
    // ALBUM IMAGE PARALLAX
    // ==========================================

    gsap.utils
      .toArray(".album-img-wrapper img")
      .forEach(function (img) {
        if (reduced) return;

        gsap.to(img, {
          yPercent: -10,
          scale: 1.06,
          ease: "none",

          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

    // ==========================================
    // VENUE
    // ==========================================

    var venue = document.querySelector("#venue");

    if (venue && !reduced) {
      var venueImage =
        venue.querySelector("img");

      if (venueImage) {
        gsap.fromTo(
          venueImage,
          {
            scale: 1.2,
            y: 50,
          },
          {
            scale: 1,
            y: 0,
            duration: 1.8,
            ease: "power3.out",

            scrollTrigger: {
              trigger: venue,
              start: "top 85%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
      }
    }

    // ==========================================
    // FLORAL DECORATIONS
    // ==========================================

    gsap.utils
      .toArray(
        ".corner-floral, .floral-corner, .decorative-flower, .floral-decoration"
      )
      .forEach(function (flower, index) {
        if (reduced) return;

        gsap.to(flower, {
          y: index % 2 === 0 ? -35 : 35,

          rotation:
            index % 2 === 0 ? 4 : -4,

          ease: "none",

          scrollTrigger: {
            trigger:
              flower.closest("section") ||
              flower,

            start: "top bottom",
            end: "bottom top",

            scrub: 2,
          },
        });
      });

    // ==========================================
    // TEXT STAGGER
    // ==========================================

    gsap.utils
      .toArray(
        ".invitation-content p, .venue-content p, .section-subtitle"
      )
      .forEach(function (text) {
        if (reduced) return;

        gsap.fromTo(
          text,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",

            scrollTrigger: {
              trigger: text,
              start: "top 90%",

              toggleActions:
                "play none none reverse",
            },
          }
        );
      });

    // ==========================================
    // GOLD LINES
    // ==========================================

    gsap.utils
      .toArray(
        ".gold-line, .section-line, .divider"
      )
      .forEach(function (line) {
        if (reduced) {
          gsap.set(line, {
            scaleX: 1,
          });

          return;
        }

        gsap.fromTo(
          line,
          {
            scaleX: 0,
            transformOrigin: "center",
          },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",

            scrollTrigger: {
              trigger: line,
              start: "top 90%",

              toggleActions:
                "play none none reverse",
            },
          }
        );
      });

    // ==========================================
    // SCROLL PROGRESS
    // ==========================================

    var progress =
      document.querySelector(".scroll-progress");

    if (progress && !reduced) {
      gsap.to(progress, {
        scaleX: 1,
        transformOrigin: "left center",

        ease: "none",

        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.2,
        },
      });
    }

    // ==========================================
    // REFRESH
    // ==========================================

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });

    setTimeout(function () {
      ScrollTrigger.refresh();
    }, 500);
  }

  // ============================================
  // LENIS SMOOTH SCROLL
  // ============================================

  if (window.Lenis && !reduced) {
    var lenis = new Lenis({
      duration: 1.25,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    function raf(time) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if (window.ScrollTrigger) {
      lenis.on(
        "scroll",
        ScrollTrigger.update
      );
    }
  }
})();