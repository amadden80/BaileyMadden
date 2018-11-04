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

  return isBetween(elTB.top, viewport * -0.9, viewport * 0.9);
};

window.pauseLocationScanning = false;
function setLocationHandlers() {
  [".welcome", ".where", ".guide", ".registry"].forEach(function(section) {
    (function() {
      let nav = document.body.querySelector(`.navigation ${section}`);
      let sectionScoped = section;
      nav.addEventListener("click", function(e) {
        window.pauseLocationScanning = true;
        let sectionEl = document.body.querySelector(`.stage ${sectionScoped}`);
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

window.currentSecion = ".welcome";
let discoverTab = function(dot) {
  [".welcome", ".guide", ".where", ".registry"].forEach(function(section) {
    if (isVisable(document.body.querySelector(`.stage ${section}`))) {
      if (window.currentSecion != section) {
        window.currentSecion = section;
        var vTb = getTopBottom(
          document.body.querySelector(`.navigation ${section}`)
        );
        var color;
        switch (section) {
          case ".welcome":
            color = "#dfe3eb";
            break;
          case ".where":
            color = "#f5918e";
            break;
          case ".guide":
            color = "#f8bf9d";
            break;
          case ".registry":
            color = "#697e95";
            break;
          default:
            break;
        }

        dot.style.borderWidth = "0 0 0 0";
        dot.style.left = "95px";
        setTimeout(() => {
          dot.style.borderWidth = "10px 10px 10px 0";
          dot.style.left = "85px";
        }, 1000);

        dot.style.borderColor = `transparent ${color} transparent transparent`;

        dot.style.top = vTb.top + "px";
      }
    }
  });
};

window.onload = function() {
  var dot = document.body.querySelector(".navigation .dot");

  setLocationHandlers();

  discoverTabDebounced = debounce(function() {
    setTimeout(function() {
      discoverTab(dot);
    }, 0);
  }, 100);

  //   window.onscroll = function() {
  //     discoverTabDebounced();
  //   };

  setInterval(function() {
    if (!window.pauseLocationScanning) {
      discoverTabDebounced();
    }
  }, 250);
};
