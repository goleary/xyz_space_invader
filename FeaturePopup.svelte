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

  {#each summaryProps as [prop, value, propStack]}
    <tr class="propRow">
      <td style="width: 50px;" class:active="prop === featureProp" on:click="fire('selectProp', { prop, propStack })">
        <b>{@html Array((propStack.length - 1) * 2).fill('&nbsp;').join('')}{propStack[propStack.length-1]}</b>
      </td>
      <td style="word-break: break-all;" class:active="value === featurePropValue" on:click="fire('selectValue', { prop, propStack, value })">
        {typeof value !== 'object' ? value : ''}
      </td>
    </tr>
  {/each}

  {#if geoName!== null}
    <tr>
      <td>Location</td>
      <td>{geoName}</td>
    </tr>
  {/if}

  {#if extendedProps.length && summaryProps.length}
    <tr><td colspan="2"><hr></td></tr>
  {/if}

  {#each extendedProps as [prop, value, propStack]}
    <tr class="propRow">
      <td style="width: 50px;" class:active="prop === featureProp" on:click="fire('selectProp', { prop, propStack })">
        <b>{@html Array((propStack.length - 1) * 2).fill('&nbsp;').join('')}{propStack[propStack.length-1]}</b>
      </td>
      <td style="word-break: break-all;" class:active="value === featurePropValue" on:click="fire('selectValue', { prop, propStack, value })">
        {typeof value !== 'object' ? value : ''}
      </td>
    </tr>
  {/each}

  {#if !featurePinned && feature}
    <tr><td colspan="2"><i>Click to see all {Object.keys(feature.properties).length} properties</i></td></tr>
  {/if}
</div>

<script>

import { parseNestedObject, lookupProperty } from './utils';

export default {
  data() {
    return {
      featurePinned: false
    }
  },

  computed: {
    summaryProps: ({ feature, featureProp, featurePropStack }) => {
      if (feature == null) {
        return [];
      }
      function addCommas(nStr){
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
      }
      const formatDollar = (amount)=>`$${addCommas(amount.toFixed(2))}`;

      const addFeatureProp = (['id', 'name'].indexOf(featureProp) === -1);
      let propValue = lookupProperty(feature.properties, featurePropStack);
      if(featureProp.indexOf('cost')!== -1 
      || featureProp.indexOf('wage')!== -1
      || featureProp.indexOf('earn')!== -1){
        propValue = formatDollar(propValue);
      }
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
        .map(r => [r.prop, r.obj, r.propStack])
        .filter(([p]) => ['id', 'name'/*, featureProp*/].indexOf(p) === -1)
        .filter(x => x[0] && x[1]) // only include props that had values
        // alpha sort, @ properties at bottom
        .sort(([a], [b]) => a[0] === '@' ? 1 : b[0] === '@' ? -1 : a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
    }
  }

};

</script>
