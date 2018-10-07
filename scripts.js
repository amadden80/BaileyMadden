function generateBoxOfBars(numVert, numHorz) {
  var verts = (numVert + "").split("").map(d => parseInt(d));
  var horzs = (numHorz + "").split("").map(d => parseInt(d));

  const box = document.createElement("div");
  box.className = "box";

  for (let i = 0; i < verts.length; i++) {
    const numVert = verts[i];
    const vertBox = document.createElement("div");
    vertBox.className = "vert-box";
    vertBox.style = `width:${100 / verts.length}%`;
    for (let i = 0; i < numVert; i++) {
      const bar = document.createElement("div");
      bar.className = "vert-bar";

      setTimeout(() => {
        vertBox.appendChild(bar);
      }, i * 100);
    }
    box.appendChild(vertBox);
  }

  const horzBox = document.createElement("div");
  horzBox.className = "horz-box";

  for (let i = 0; i < horzs.length; i++) {
    const numhorz = horzs[i];
    const horzBox = document.createElement("div");
    horzBox.className = "horz-box";
    horzBox.style = `height:${100 / horzs.length}%;top:${(100 / horzs.length) *
      i}%`;
    for (let i = 0; i < numhorz; i++) {
      const bar = document.createElement("div");
      bar.className = "horz-bar";
      setTimeout(() => {
        horzBox.appendChild(bar);
      }, i * 100);
    }
    box.appendChild(horzBox);
  }
  return box;
}

window.onload = function() {
  // Lines
  const body = document.querySelector("body");

  const linesGroups = [
    generateBoxOfBars(6, 11),
    generateBoxOfBars(7, 8),
    generateBoxOfBars(19, 15)
  ];
  linesGroups.forEach(group => {
    body.appendChild(group);
  });

  setTimeout(() => {
    linesGroups.forEach(group => {
      body.removeChild(group);
    });

    const circle = document.createElement("div");
    circle.className = "circle";

    function circleTextLine(text) {
      const circleT = document.createElement("p");
      circleT.className = "circle-text";
      circleT.innerText = text;
      return circleT;
    }

    circle.appendChild(circleTextLine("Save The Date"));
    circle.appendChild(circleTextLine("6.7.19"));

    body.appendChild(circle);
  }, 5000);
};
