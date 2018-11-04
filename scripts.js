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

let discoverTab = function(dot) {
  [".welcome", ".guide", ".where", ".registry"].forEach(function(section) {
    if (isVisable(document.body.querySelector(`.stage ${section}`))) {
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

      dot.style.borderColor = `transparent ${color} transparent transparent`;

      dot.style.top = vTb.top + "px";
    }
  });
};

window.onload = function() {
  var dot = document.body.querySelector(".navigation .dot");

  discoverTabDebounced = debounce(function() {
    discoverTab(dot);
  }, 100);

  //   window.onscroll = function() {
  //     discoverTabDebounced();
  //   };

  setInterval(discoverTabDebounced, 250);
};
