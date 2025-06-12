require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer"
], (Map, MapView, GeoJSONLayer) => {

  // 1) Дефинираме слой с градовете
  const citiesLayer = new GeoJSONLayer({
    url: "./data/Gradove.json",
    title: "Градове",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: "blue",
        size: 8
      }
    },
    popupTemplate: {
      title: "{Name_bg}",
      content: `
        <b>Община:</b> {Mun_name}<br>
        <b>Описание:</b> {Descr_bg}
      `
    }
  });

  // 2) Слой с пътищата
  const roadsLayer = new GeoJSONLayer({
    url: "./data/Putishta.json",
    title: "Пътища",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        color: "red",
        width: 2
      }
    }
  });

  // 3) Създаваме картата и добавяме слоевете
  const map = new Map({
    basemap: "topo-vector",
    layers: [citiesLayer, roadsLayer]
  });

  // 4) Създаваме изглед
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [23.3, 42.7],
    zoom: 7
  });

  // 5) Функции за бутоните
  document.getElementById("toggleCities").addEventListener("click", () => {
    citiesLayer.visible = !citiesLayer.visible;
  });
  document.getElementById("toggleRoads").addEventListener("click", () => {
    roadsLayer.visible = !roadsLayer.visible;
  });
  document.getElementById("zoomIn").addEventListener("click", () => {
    view.zoom += 1;
  });
  document.getElementById("zoomOut").addEventListener("click", () => {
    view.zoom -= 1;
  });

  // 6) Когато изгледът и слоевете са готови, зареждаме данните за таблицата
  view.when(() => {
    // query всички обекти от citiesLayer
    citiesLayer.queryFeatures().then(result => {
      const tbody = document.querySelector("#cityTable tbody");
      result.features.forEach(feature => {
        const props = feature.attributes;
        // Name_bg и Descr_bg
        const name = props.Name_bg || props.name || "";
        const descr = props.Descr_bg || props.Descr_bg || "";
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${name}</td><td>${descr}</td>`;
        tbody.appendChild(tr);
      });
    });
  });

});