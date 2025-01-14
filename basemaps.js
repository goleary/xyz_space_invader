export function getBasemapScene(basemap) {
  return basemaps[basemap];
}

export function getBasemapName(basemap) {
  // if the basemap looks like a number, return name from by index number
  // this is mostly for backwards compatibility, could be removed in future
  const index = parseInt(basemap);
  if (typeof index === 'number' && !isNaN(index)) {
    return Object.keys(basemaps)[index];
  }

  // otherwise just return the name
  return basemap;
}

export function getDefaultBasemapName() {
  return Object.keys(basemaps)[0];
}

export function getNextBasemap(basemap) {
  // return (index + 1) % Object.keys(basemaps).length;
  const names = Object.keys(basemaps);
  const index = names.indexOf(basemap);
  if (index > -1) {
    return names[(index + 1) % names.length]; // return next basemap if current one found
  }
  return names[0]; // otherwise just return first basemap
}

// add the base path of the current page to the URL
function addBasePath(url) {
  let base =
    window.location.origin + window.location.origin.indexOf("localhost") === -1
      ? window.location.pathname
      : "";
  if (base.slice(-1) !== "/") {
    base += "/";
  }
  return base + url;
}

// skeletal structure of Invader viz scene, merged on top of underlying basemap, extended at run-time
// based on current viz settings
const xyzTangramBaseScene = addBasePath('tangram_xyz_scene.yaml');

// this gets merged into basemaps to change 'mapzen' vector tile source definitions to their XYZ HERE equivalent
// TODO: this does not yet override terrain/normal tiles for hillshading
const xyzTilezenSourceOverride = {
  sources: {
    mapzen: {
      url: 'https://xyz.api.here.com/tiles/osmbase/512/all/{z}/{x}/{y}.mvt',
      url_params: {
        'access_token': 'global.xyz_access_token'
      }
    }
  }
};

// each basemap can reference one of these font presets for labels, or define its own inline instead
const labelFontPresets = {
  // for dark basemaps
  dark: {
    fill: [.9, .9, .1],
    size: '12px',
    stroke: {
      color: 'black',
      width: '4px'
    }
  },
  // for light basemaps
  light: {
    fill: 'darkred',
    size: '12px',
    stroke: {
      color: 'white',
      width: '4px'
    }
  }
};

export const basemaps = {
  'xyz-pixel': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-pixel/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-pixel-dark': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-pixel-dark/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-pixel-pastel': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-pixel-pastel/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-dots': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-dots/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-dots-dark': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-dots-dark/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-bw-texture': {
    import: [
      'https://raw.githubusercontent.com/sensescape/bw-texture/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-grid': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-grid/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-grid-dark': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-grid-dark/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-grid-color': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-grid-color/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-elevation-dots': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-elevation-dots/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-studio-spring-soft': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-studio-spring-soft/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-studio-spring-bright': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-studio-spring-bright/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
  'xyz-studio-miami-day': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-studio-miami-day/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
   'xyz-studio-light': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-studio-light/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },
    'xyz-studio-dark': {
    import: [
      'https://raw.githubusercontent.com/sensescape/xyz-studio-dark/master/scene.yaml',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: [1, 0, 0, 0.5] } } },
      _xyz_dots: { draw: { points: { color: [0, 0, 1, 0.5] } } }
    },
    ...xyzTilezenSourceOverride
  },

  'mapzen-refill-dark': {
    import: [
      'https://www.nextzen.org/carto/refill-style/refill-style.zip',
      'https://www.nextzen.org/carto/refill-style/themes/color-gray-gold.zip',
      'https://www.nextzen.org/carto/refill-style/themes/label-4.zip',
      // 'https://www.nextzen.org/carto/refill-style/themes/terrain-shading-dark.zip',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    layers: {
      _xyz_lines: { draw: { _lines: { color: 'global.featureColorDefault' } } },
      _xyz_dots: { draw: { points: { color: 'global.featureColorDefault' } } }
    },
    ...xyzTilezenSourceOverride
  },
  'mapzen-refill': {
    import: [
      'https://www.nextzen.org/carto/refill-style/refill-style.zip',
      'https://www.nextzen.org/carto/refill-style/themes/label-4.zip',
      'https://www.nextzen.org/carto/refill-style/themes/terrain-shading-dark.zip',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    ...xyzTilezenSourceOverride
  },
  'mapzen-walkabout': {
    import: [
      'https://www.nextzen.org/carto/walkabout-style/walkabout-style.zip',
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.light
    },
    ...xyzTilezenSourceOverride
  },
  'none': {
    import: [
      xyzTangramBaseScene
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    scene: {
      background: {
        color: [0, 0, 0]
      }
    }
  },
  'satellite': {
    import: [
      'https://www.nextzen.org/carto/refill-style/refill-style.zip',
      xyzTangramBaseScene,
      addBasePath('satellite.yaml'),
    ],
    global: {
      featureLabelFont: labelFontPresets.dark
    },
    ...xyzTilezenSourceOverride
  }
};
