import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function LebanonMap({ cases }) {
  const [geoData, setGeoData] = useState(null);
  // View states: "total" | "carriers" | "infected"
  const [viewMode, setViewMode] = useState("total");

  useEffect(() => {
    fetch("/geoBoundaries-LBN-ADM1_simplified.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  const normalizeRegion = (geoJsonName) => {
    const regionMap = {
      "Mont-Lebanon": "Mount Lebanon",
      Beqaa: "Bekaa",
      Aakkar: "Akkar",
      Beirut: "Beirut",
      "Keserwan-Jbeil": "Keserwan-Jbeil",
      North: "North",
      "Baalbek-Hermel": "Baalbek-Hermel",
      South: "South",
      Nabatieh: "Nabatieh",
    };
    return regionMap[geoJsonName] || geoJsonName;
  };

  const getColor = (regionName) => {
    const regionData = cases?.[regionName];
    if (!regionData) return "#D5E8D4";

    let value = 0;
    if (viewMode === "total") value = regionData.total;
    if (viewMode === "carriers") value = regionData.carriers;
    if (viewMode === "infected") value = regionData.infected;

    if (viewMode === "total") {
      if (value >= 9) return "#7f0000";
      if (value >= 7) return "#b30000";
      if (value >= 4) return "#e34a33";
      if (value >= 1) return "#fdbb84";
      return "#D5E8D4";
    } else {
      if (value >= 5) return "#990000";
      if (value >= 4) return "#d7301f";
      if (value >= 3) return "#ef6548";
      if (value >= 1) return "#fdbb84";
      return "#D5E8D4";
    }
  };

  const style = (feature) => {
    const regionName = normalizeRegion(feature.properties.shapeName);
    return {
      fillColor: getColor(regionName),
      weight: 1.5,
      color: "#334155",
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const regionName = normalizeRegion(feature.properties.shapeName);
    const regionData = cases?.[regionName] || {
      carriers: 0,
      infected: 0,
      total: 0,
    };

    // 🎛️ Dynamic Tooltip Generator based on selected layer mode
    let statsHTML = "";

    if (viewMode === "carriers") {
      statsHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #cbd5e1;">Carriers (AS):</span>
          <span style="font-weight: 700; color: #fbbf24; font-size: 12px;">${regionData.carriers}</span>
        </div>
      `;
    } else if (viewMode === "infected") {
      statsHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #cbd5e1;">Affected (SS):</span>
          <span style="font-weight: 700; color: #f87171; font-size: 12px;">${regionData.infected}</span>
        </div>
      `;
    } else {
      // "total" view mode shows the complete summary breakdown
      statsHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: #94a3b8;">Carriers (AS):</span>
          <span style="font-weight: 700; color: #fbbf24; font-size: 12px;">${regionData.carriers}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #94a3b8;">Affected (SS):</span>
          <span style="font-weight: 700; color: #f87171; font-size: 12px;">${regionData.infected}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 800; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 6px; font-size: 12px; margin-top: 4px;">
          <span>Total Cases:</span>
          <span style="color: ${regionData.total > 0 ? "#ff8787" : "#4ade80"};">${regionData.total}</span>
        </div>
      `;
    }

    const tooltipContent = `
      <div style="
        background: rgba(15, 23, 42, 0.98);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 11px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255,255,255,0.15);
        pointer-events: none;
        min-width: 170px;
      ">
        <div style="font-size: 13px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px; margin-bottom: 8px;">
          📍 ${regionName} Governate
        </div>
        ${statsHTML}
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: "top",
      offset: [0, -10],
      opacity: 1,
    });

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 2.5, color: "#000000", fillOpacity: 0.9 });
        e.target.openTooltip();
      },
      mouseout: (e) => {
        e.target.setStyle({ weight: 1.5, color: "#334155", fillOpacity: 0.8 });
        e.target.closeTooltip();
      },
    });
  };

  const keyIdentity = `${viewMode}-${geoData ? "ready" : "pending"}`;

  return (
    <div className="w-full h-full relative">
      {/* 🎛️ Floating Map Layer Toggles (Top Left) */}
      <div className="absolute top-4 left-4 z-[1001] bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-xl border border-gray-200 flex flex-col space-y-1.5 max-w-xs">
        <span className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wider">
          Toggle Map View
        </span>
        <div className="flex bg-gray-100/90 p-0.5 rounded-lg border border-gray-200/40">
          <button
            onClick={() => setViewMode("total")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "total" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
          >
            Combined Total
          </button>
          <button
            onClick={() => setViewMode("carriers")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "carriers" ? "bg-white shadow-sm text-amber-600" : "text-gray-500 hover:text-gray-900"}`}
          >
            Carriers (AS)
          </button>
          <button
            onClick={() => setViewMode("infected")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "infected" ? "bg-white shadow-sm text-red-600" : "text-gray-500 hover:text-gray-900"}`}
          >
            Affected (SS)
          </button>
        </div>
      </div>

      {/* Full-bleed Map Viewport Canvas */}
      <MapContainer
        center={[33.8547, 35.8623]}
        zoom={9}
        zoomControl={true}
        className="w-full h-full"
        style={{ height: "100vh", width: "100vw", zIndex: 1 }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {geoData && (
          <GeoJSON
            key={keyIdentity}
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
