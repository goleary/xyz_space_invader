<style>

.propRow > td {
  padding: 2px;
}

.propRow > td:hover {
  background-color: rgba(240, 240, 240, 0.75);
  cursor: pointer;
}

.propRow > td.active {
  background-color: lightyellow;
}

</style>

<div style="{featurePinned ? 'height: 200px; overflow: auto;' : ''}">
  <table>
  {#if geoName!== null}
    <tr>
      <td>Location</td>
      <td>{formatGeo(geoName)}</td>
    </tr>
  {/if}

  {#each summaryProps as [prop, value, propStack]}
    <tr class="propRow">
      <td style="width: 150px;" class:active="prop === featureProp" on:click="fire('selectProp', { prop, propStack })">
        <b>{@html Array((propStack.length - 1) * 2).fill('&nbsp;').join('')}{propMap[propStack[propStack.length-1]]||propStack[propStack.length-1]}</b>
      </td>
      <td style="word-break: break-all;" class:active="value === featurePropValue" on:click="fire('selectValue', { prop, propStack, value })">
        {typeof value !== 'object' ? value : ''}
      </td>
    </tr>
  {/each}



  {#if extendedProps.length && summaryProps.length}
    <tr><td colspan="2"><hr></td></tr>
  {/if}

  {#each extendedProps as [prop, value, propStack]}
    {#if propMap[prop]}

    <tr class="propRow">
      <td style="width: 50px;" class:active="prop === featureProp" on:click="fire('selectProp', { prop, propStack })">
        <b>{@html Array((propStack.length - 1) * 2).fill('&nbsp;').join('')}{propMap[propStack[propStack.length-1]]||propStack[propStack.length-1]}</b>
      </td>
      <td style="word-break: break-all;" class:active="value === featurePropValue" on:click="fire('selectValue', { prop, propStack, value })">
        {typeof value !== 'object' ? value : ''}
      </td>
    </tr>
    {/if}
  {/each}

  {#if !featurePinned && feature}
    <tr><td colspan="2"><i>Click to see all {Object.keys(feature.properties).length} properties</i></td></tr>
  {/if}
</div>

<script>

import { 
  parseNestedObject,
  lookupProperty,
  formatProp,
  formatGeo,
  propMap } from './utils';

export default {
  data() {
    return {
      featurePinned: false,
      propMap : {
        ...propMap,
        location: 'Location'
      },
      formatGeo
    }
  },
  computed: {
    summaryProps: ({ feature, featureProp, featurePropStack }) => {
      if (feature == null) {
        return [];
      }

      const addFeatureProp = (['id', 'name'].indexOf(featureProp) === -1);
      let propValue = lookupProperty(feature.properties, featurePropStack);
      propValue = formatProp(featureProp, propValue);
      const props = [
          ['id', feature.properties.id, ['id']],
          ['name', feature.properties.name, ['name']],
          addFeatureProp ? [featureProp, propValue || 'null', featurePropStack] : []
        ]
        .filter(x => x[0] && x[1]); // only include props that had values
        return props;
    },
    geoName : ({feature})=>{
      if (feature && feature.properties && feature.properties.geography) {
        return feature.properties.geography;
      }
      return null;
    },

    extendedProps: ({ feature, featureProp, featurePinned }) => {
      if (!featurePinned || feature == null) {
        return [];
      }

      return parseNestedObject(feature.properties)
        .map(r => [r.prop, formatProp(r.prop,r.obj), r.propStack])
        .filter(([p]) => ['id', 'name'/*, featureProp*/].indexOf(p) === -1)
        .filter(x => x[0] && x[1]) // only include props that had values
        // alpha sort, @ properties at bottom
        .sort(([a], [b]) => a[0] === '@' ? 1 : b[0] === '@' ? -1 : a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
    }
  }

};

</script>
