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
  var rect = el.getBoundingClientRect();
  var top = rect.top;
  var bottom = rect.bottom;
  return {
    top: top,
    bottom: bottom
  };
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
    ".picture-02",
    ".where",
    ".picture-03",
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
      if (navSection == window.currentSection) {
        navSection.nav.style.color = "#f5918e";
      } else {
        navSection.nav.style.color = "grey";
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
};

// var vTb = getTopBottom(
//   document.body.querySelector(`.navigation ${section}`)
// );
// var color, left, borderWidth;
// switch (section) {
//   case ".welcome":
//     color = "#dfe3eb";
//     left = "85px";
//     borderWidth = "10px 10px 10px 0";
//     break;
//   case ".picture-01":
//     color = "transparent";
//     left = "95px";
//     borderWidth = "0 0 0 0";
//     break;
//   case ".where":
//     color = "#f5918e";
//     left = "85px";
//     borderWidth = "10px 10px 10px 0";
//     break;
//   case ".picture-02":
//     color = "transparent";
//     left = "95px";
//     borderWidth = "0 0 0 0";
//     break;
//   case ".guide":
//     color = "#f8bf9d";
//     left = "85px";
//     borderWidth = "10px 10px 10px 0";
//     break;
//   case ".picture-03":
//     color = "transparent";
//     left = "95px";
//     borderWidth = "0 0 0 0";
//     break;
//   case ".registry":
//     color = "#697e95";
//     left = "85px";
//     borderWidth = "10px 10px 10px 0";
//     break;
//   default:
//     break;
// }

// dot.style.borderWidth = borderWidth;
// dot.style.left = left;

// dot.style.borderColor = `transparent ${color} transparent transparent`;
