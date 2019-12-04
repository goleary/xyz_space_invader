export const PROP_TYPES = {
  STRING: 0,
  NUMERIC: 1
};

// format nested property name stack with dot (object) and bracket (array) notation
export function formatPropStack(propStack) {
  return propStack &&
    propStack
      .map((p, i) => {
        const n = parseInt(p);
        if (typeof n === 'number' && !isNaN(n)) {
          return `[${p}]`;
        }
        else {
          return `${i > 0 ? '.' : ''}${p}`;
        }
      })
      .join('');
}

// parse a (potentially) nested object, tracking the level and components of each property
export function parseNestedObject(obj, level = -1, prop = null, propStack = [], rows = []) {
  if (Array.isArray(obj)) {
    if (prop) {
      rows.push({ level, obj, prop: formatPropStack(propStack), propStack }); // header row
    }
    obj.forEach((x, i) => parseNestedObject(x, level + 1, i, [...propStack, i], rows));
  } else if (typeof obj === 'object' && obj != null) {
    if (prop) {
      rows.push({ level, obj, prop: formatPropStack(propStack), propStack }); // header row
    }
    for (const p in obj) {
      parseNestedObject(obj[p], level + 1, p, [...propStack, p], rows);
    }
  } else {
    rows.push({ level, obj, prop: formatPropStack(propStack), value: obj, propStack });
  }
  return rows;
}

// lookup value of a nested feature property
export function lookupProperty(properties, propStack) {
  return propStack && propStack.reduce((obj, prop) => obj && obj[prop] !== undefined ? obj[prop] : null, properties);
}

// stringify an object with JSON.stringify, but include functions as strings
export function stringifyWithFunctions (obj) {
  if (typeof obj === 'function') {
    return obj.toString();
  }

  return JSON.stringify(obj, function (k, v) {
    // Convert functions to strings
    return (typeof v === 'function') ? v.toString() : v;
  });
};

// More robust number parsing, try to get a floating point or integer value from a string
export function parseNumber(value) {
  // don't bother parsing these
  if (value == null || typeof value === 'object') {
    return value;
  }
  else if (typeof value === 'number') {
    return isNaN(value) ? undefined : value;
  }

  const m = value.match(/[-+]?([0-9]+,?)*\.?[0-9]+/); // get floating point or integer via regex
  const num = parseFloat(m && m[0].replace(/[,-\/]/g, '')); // strip formatter chars, e.g. '1,500' => '1500' (NB only works for US-style numbers)
  if (typeof num === 'number' && !isNaN(num)) {
    return num;
  }
}

// Can a minimum % of values in an array be parsed as numbers?
export function mostlyNumeric(values, threshold = 100) {
  if(!values) {
    return false;
  }

  const numeric = values
    .map(v => parseNumber(v))
    .filter(x => typeof x === 'number' && !isNaN(x) && Math.abs(x) !== Infinity)
    .length;
  return numeric / values.length >= (threshold / 100);
}

export const formatGeo=(geo)=>{
  if(!geo || geo.indexOf('ZCTA5') !== 0)
    return geo;
  return "Zipcode " +  geo.split(' ')[1];
}

export const formatDollars = n => "$" + formatNumber(n, 2);

// from https://stackoverflow.com/a/55987576/5186877
export const formatNumber = (n, d=0) => {
  try{
    if (n < 1e3) return n.toFixed(d);
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
  }
  catch(err){
    return n;
  }
};

export const formatPercent = n =>{
  let value = n;
  if(typeof value !== 'number')
    value = Number.parseFloat(n);
  if(value === NaN)
    return n;
  else return `${value.toFixed(1)}%`
}

export const isDollarProp = prop=> prop && (
  prop.indexOf('cost')!== -1 
  || prop.indexOf('wage')!== -1
  || prop.indexOf('earn')!== -1);

export const isPercentProp = prop=> prop && 
  prop.indexOf('p_')=== 0; 

export const getPropType = prop =>{
  if (isDollarProp(prop)) return 'dollars';
  else if (isPercentProp(prop)) return 'percent';
  else return 'number';
}

export const propMap= {
  mean_travel_time_m: {
    label: "1-way commute length (minutes)"
  },
  med_earn: {
    label: "Median yearly earnings"
  },
  commuters: {
    label: " # Commuters"
  },
  carpooled: {
    label: "# Carpoolers"
  },
  public_transit: {
    label: "# Public transit riders"
  },
  drove_alone: {
    label: "# Lone drivers"
  },
  walked: {
    label: "# Walkers"
  },
  wfh: {
    label: "# Work from home"
  },
  p_carpooled: {
    label: "% Carpoolers"
  },
  p_drove_alone: {
    label: "% Lone drivers"
  },
  p_walked: {
    label: "% Walkers"
  },
  p_public_transit: {
    label: "% Public transit riders"
  },
  p_wfh: {
    label: "% Work from home"
  },
  avg_hour_wage: {
    label: "Median hourly wage"
  },
  commute_cost_day_p: {
    label: "Individual daily commute cost"
  },
  commute_cost_year_p: {
    label: "Individual yearly commute cost",
    bold: true
  },
  commute_cost_day: {
    label: "Total daily commute cost"
  },
  commute_cost_year: {
    label: "Total yearly commute cost",
    bold: true
  },
};


export const formatProp = (prop, value)=>{
  if(isDollarProp(prop)){
    return formatDollars(value);
  }
  else if(isPercentProp(prop)){
    return formatPercent(value);
  }
  else if (typeof value === "number") {
    return formatNumber(value);
  }
  else return value;
}

export const setLayerSource = (geography)=> {
  let source;
  switch(geography){
    case 'zip':
      source = "_xyzspace"
      break;
    case 'counties':
    case 'county':
      source = '_county';
      break;
    case 'metro':
      source = '_metro';
      break;
    default:
      source = geography;
      break;
  }
  if(scene.config.layers._xyz_polygons.data.source !== source){
    console.log('updating layer source to: ', source);
    scene.config.layers._xyz_polygons.data.source = source;
    scene.config.layers._xyz_dots.data.source = source;
    scene.updateConfig();
    appUI.set({sourceLayer: source, featurePropValue:null});
  }
}