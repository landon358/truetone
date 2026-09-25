/* TrueTone Interiors - shared site data and shell logic.
   Every page's Component pulls its header, footer and nav from here,
   so links and contact details are edited in one place. */
window.TTSite = (function () {
  var PHONE = '517.331.6876';
  var TEL = 'tel:+15173316876';
  var EMAIL = 'truetoneinteriors@gmail.com';
  var AREA = 'Lansing · Holt · Mid Michigan';

  var FACEBOOK = 'https://www.facebook.com/people/TrueTone-Interiors/61577254798084/';
  var TIKTOK = 'https://www.tiktok.com/@truetone_jr517';
  var NEXTDOOR = 'https://nextdoor.com/pages/truetone-interiors-lansing-mi/';

  /* Primary nav. `key` matches the `page` each file passes to vals(). */
  var NAV = [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'services', label: 'Services', href: 'services.html' },
    { key: 'work', label: 'Work', href: 'work.html' },
    { key: 'reviews', label: 'Reviews', href: 'reviews.html' },
    { key: 'about', label: 'About', href: 'about.html' }
  ];

  var FOOT = [
    { key: 'explore', title: 'Explore', links: [
      ['Home', 'index.html'], ['Services', 'services.html'], ['Work', 'work.html'],
      ['Reviews', 'reviews.html'], ['About', 'about.html'], ['Free Estimate', 'contact.html']
    ] },
    { key: 'connect', title: 'Connect', links: [
      ['Facebook', FACEBOOK], ['TikTok', TIKTOK], ['Nextdoor', NEXTDOOR],
      ['Join the crew', 'mailto:' + EMAIL + '?subject=Join%20the%20crew']
    ] },
    { key: 'contact', title: 'Contact', links: [
      [PHONE, TEL], [EMAIL, 'mailto:' + EMAIL], [AREA, 'contact.html']
    ] }
  ];

  /* Work and review content is shared: home shows a slice, the inner pages show all. */
  var WORK = [
    { src: 'img/great-room.jpg', alt: 'Vaulted great room repainted', title: 'Great room', note: 'Vaulted ceilings' },
    { src: 'img/fireplace.jpg', alt: 'Living room and fireplace in Accessible Beige', title: 'Fireplace wall', note: 'SW Accessible Beige' },
    { src: 'img/frosted-fern.jpg', alt: 'Kitchen after wallpaper removal in Frosted Fern', title: 'Kitchen refresh', note: 'SW Frosted Fern' },
    { src: 'img/honey-bees.jpg', alt: 'Living room in warm Honey Bees yellow', title: 'Living room', note: 'SW Honey Bees' },
    { src: 'img/cabinet-after.jpg', alt: 'Refinished two tone kitchen cabinets', title: 'Cabinet refinish', note: 'Two tone' },
    { src: 'img/deck.jpg', alt: 'Deck repaired and stained Moss Olive', title: 'Deck repair & stain', note: 'Moss Olive' }
  ];

  var REVIEWS = [
    { quote: 'Meticulous about cleaning up and treating all of your belongings with care. I got three estimates and his quote was the lowest by far.', name: 'Joy S.', job: 'Whole interior' },
    { quote: 'A flawless paint job that brought every room to life. The lines were crisp and the colors applied evenly.', name: 'Brianna', job: 'Interior' },
    { quote: 'Outstanding job, high quality work and paint. I am sure this paint job will last far longer than others I have had done.', name: 'Julie S.', job: 'Front porch' }
  ];

  var SERVICES = ['Interior painting', 'Cabinets', 'Wallpaper removal', 'Drywall repair', 'Exterior / deck', 'Rental turnover'];

  return {
    PHONE: PHONE, TEL: TEL, EMAIL: EMAIL, AREA: AREA,
    FACEBOOK: FACEBOOK, TIKTOK: TIKTOK, NEXTDOOR: NEXTDOOR,
    WORK: WORK, REVIEWS: REVIEWS, SERVICES: SERVICES,

    /* Header show/hide on scroll, narrow breakpoint, and motion boot.
       Lifted verbatim from the original single page build. */
    mount: function (c) {
      c._onResize = function () {
        var n = window.innerWidth < 900;
        if (n !== c.state.narrow) c.setState({ narrow: n, open: n ? c.state.open : false });
      };
      window.addEventListener('resize', c._onResize);
      c._onResize();
      c._lastY = window.scrollY;
      c._onScroll = function () {
        var y = window.scrollY, d = y - c._lastY;
        if (Math.abs(d) < 6) return;
        var hide = d > 0 && y > 140;
        c._lastY = y;
        if (hide !== c.state.hideHeader) c.setState({ hideHeader: hide });
      };
      window.addEventListener('scroll', c._onScroll, { passive: true });
      this.boot(c, 0);
      /* Safety net: if a reveal never fires, un-hide anything already on screen. */
      c._guard = setInterval(function () {
        document.querySelectorAll('[data-anim], [data-intro]').forEach(function (el) {
          if (!el.dataset.mswDone) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight) { el.style.opacity = '1'; el.style.transform = 'none'; el.style.clipPath = 'none'; }
          }
        });
      }, 1200);
    },

    boot: function (c, n) {
      var self = this;
      if (window.MSWMotion) { window.MSWMotion.init({ motion: c.props.motion !== undefined ? c.props.motion : true }); return; }
      if (n > 60) { document.documentElement.classList.add('anim-off'); return; }
      setTimeout(function () { self.boot(c, n + 1); }, 60);
    },

    updated: function (c) {
      clearTimeout(c._re);
      c._re = setTimeout(function () {
        if (window.MSWMotion) window.MSWMotion.init({ motion: c.props.motion !== undefined ? c.props.motion : true });
      }, 120);
    },

    unmount: function (c) {
      window.removeEventListener('resize', c._onResize);
      window.removeEventListener('scroll', c._onScroll);
      clearInterval(c._guard); clearTimeout(c._re);
      document.body.style.overflow = '';
      if (window.MSWMotion) window.MSWMotion.kill();
    },

    /* Everything the shared header/footer markup binds to.
       `page` is the NAV key of the current page, used for the active link colour. */
    vals: function (c, page) {
      var s = c.state;
      var fo = s.footOpen || {};
      var setOpen = function (open) {
        document.body.style.overflow = open ? 'hidden' : '';
        c.setState({ open: open });
      };
      return {
        headerY: s.hideHeader && !s.open ? 'translateY(-100%)' : 'none',
        footPad: s.narrow ? '96px' : 'clamp(30px,3vw,44px)',
        nav: NAV.map(function (n) {
          return { label: n.label, href: n.href, color: n.key === page ? '#E3B04B' : '#F5F0E6' };
        }),
        footGroups: FOOT.map(function (g) {
          var open = !s.narrow || !!fo[g.key];
          return {
            title: g.title, open: open,
            icon: s.narrow ? (open ? '−' : '+') : '',
            cursor: s.narrow ? 'pointer' : 'default',
            links: g.links.map(function (l) { return { label: l[0], href: l[1] }; }),
            toggle: function () {
              if (!s.narrow) return;
              c.setState(function (st) {
                var next = Object.assign({}, st.footOpen || {});
                next[g.key] = !next[g.key];
                return { footOpen: next };
              });
            }
          };
        }),
        wide: !s.narrow,
        narrow: s.narrow,
        open: s.open,
        toggle: function () { setOpen(!s.open); },
        close: function () { setOpen(false); },
        phone: PHONE, tel: TEL, email: EMAIL, area: AREA,
        facebook: FACEBOOK
      };
    }
  };
})();
