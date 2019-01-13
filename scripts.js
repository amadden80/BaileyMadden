function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var getTopBottom = function(el) {
  if (el) {
    var rect = el.getBoundingClientRect();
    var top = rect.top;
    var bottom = rect.bottom;
    return {
      top: top,
      bottom: bottom
    };
  } else {
    return {
      top: 0,
      bottom: 0
    };
  }
};

var isBetween = function(value, top, bottom) {
  return value > top && value < bottom;
};

var isVisable = function(el) {
  var elTB = getTopBottom(el);

  var viewport = document.documentElement.clientHeight;

  return isBetween(elTB.top, viewport * -0.51, viewport * 0.51);
};

window.pauseLocationScanning = false;
window.currentSection = null;

function setLocationHandlers() {
  [".welcome", ".where", ".guide", ".registry"].forEach(function(section) {
    (function() {
      var nav = document.body.querySelector(`.navigation ${section}`);
      var sectionScoped = section;
      nav.addEventListener("click", function(e) {
        window.pauseLocationScanning = true;
        var sectionEl = document.body.querySelector(`.stage ${sectionScoped}`);
        var secRect = getTopBottom(sectionEl);

        setTimeout(function() {
          window.scrollTo({
            top: window.scrollY + secRect.top,
            left: 0,
            behavior: "smooth"
          });
        }, 0);

        setTimeout(() => {
          window.pauseLocationScanning = false;
        }, 500);
      });
    })();
  });
}

var discoverTab = function(dot) {
  var navSections = [
    ".welcome",
    ".picture-01",
    ".guide",
    ".where",
    ".registry"
  ].map(function(section) {
    return {
      nav: document.body.querySelector(`.navigation ${section}`),
      section: document.body.querySelector(`.stage ${section}`)
    };
  });

  var currentSection = navSections.filter(function(navSection) {
    return isVisable(navSection.section);
  })[0];

  if (window.currentSection != currentSection) {
    window.currentSection = currentSection;
    navSections.forEach(function(navSection) {
      if (navSection && navSection.nav) {
        if (navSection == window.currentSection) {
          navSection.nav.style.color = "#3b4559";
        } else {
          navSection.nav.style.color = "#bbc7d7";
        }
      }
    });
  }
};

window.onload = function() {
  var dot = document.body.querySelector(".navigation .dot");

  setLocationHandlers();

  discoverTabDebounced = debounce(function() {
    setTimeout(function() {
      discoverTab(dot);
    }, 0);
  }, 100);

  setInterval(function() {
    if (!window.pauseLocationScanning) {
      discoverTabDebounced();
    }
  }, 250);

  function clickIt(el) {
    var evObj = document.createEvent("Events");
    evObj.initEvent("click", true, false);
    el.dispatchEvent(evObj);
  }

  var imgs = Array.from(document.getElementsByClassName("selectable-image"));
  var currentImageIdx = null;

  function loadImage(idx) {
    currentImageIdx = idx;

    var img;
    if (idx < 0) {
      currentImageIdx = imgs.length - 1;
      img = imgs[currentImageIdx];
    } else if (idx > imgs.length - 1) {
      currentImageIdx = 0;
      img = imgs[currentImageIdx];
    }

    img = imgs[currentImageIdx];

    document.getElementById("picture-viewer").style.display = "block";
    document.getElementById("picture-viewer-content").src = img.src;
    document.getElementById("picture-caption").innerHTML = img.alt;
  }

  document.getElementById("picture-left").addEventListener("click", function() {
    loadImage(currentImageIdx - 1);
  });

  document
    .getElementById("picture-right")
    .addEventListener("click", function() {
      loadImage(currentImageIdx + 1);
    });

  for (var index = 0; index < imgs.length; index++) {
    (function() {
      var idx = index;
      var img = imgs[idx];
      img.addEventListener("click", function(e) {
        loadImage(idx);
      });
    })();
  }

  document
    .getElementById("close-picture-viewer")
    .addEventListener("click", function() {
      document.getElementById("picture-viewer").style.display = "none";
    });

  var imgs = Array.from(document.getElementsByClassName("selectable-image"));
  var currentHeroIdx = 0;
  var transitionNumber = 0;

  setTimeout(function() {
    setInterval(function() {
      transitionNumber++;

      var leaveId = !(transitionNumber % 2) ? "hero-even" : "hero-odd";
      var changeId = transitionNumber % 2 ? "hero-even" : "hero-odd";

      currentHeroIdx++;
      currentHeroIdx = currentHeroIdx % imgs.length;

      document.getElementById(changeId).style.background =
        "url(" + imgs[currentHeroIdx].src + ")";
      document.getElementById(changeId).style.backgroundRepeat = "no-repeat";
      document.getElementById(changeId).style.backgroundAttachment = "fixed";
      document.getElementById(changeId).style.backgroundPositionX = "center";
      document.getElementById(changeId).style.backgroundPositionY = "top";
      document.getElementById(changeId).style.backgroundSize = "cover";
      document.getElementById(changeId).style.height = "height: 100%";
      document.getElementById(changeId).style.opacity = 1;
      document.getElementById(leaveId).style.opacity = 0;
    }, 5000);
  }, 1000);
};
