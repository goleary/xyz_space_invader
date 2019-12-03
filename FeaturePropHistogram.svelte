<div>
  <h4>Legend {#if propName} for {propName} {/if}</h4>
  <table style="width: 100%">
    {#if outsideRange[0]}
      <tr>
        <td style="width: 65%">
          <div style="width: 100%; height: 15px; background:{ `linear-gradient(90deg, ${minColor}, ${minColor})`}">&nbsp;</div>
        </td>
        <td style="width: 35%">&lt; {format(propType, minFilter, step)}</td>
      </tr>
    {/if}

    {#each quantiles as { from, to, fromColor, toColor, count, percent }}
      <tr>
        <td style="width: 65%">
          <div style="width: 100%; height: 15px;
            background: {
              (fromColor && toColor) ? `linear-gradient(90deg, ${fromColor}, ${toColor})` : 'lightblue'
            }
          ">&nbsp;</div>
        </td>
        <td style="width: 35%">{format(propType, from, step)} ⇢ {format(propType, to, step)}</td>
      </tr>
    {/each}

    {#if outsideRange[1]}
      <tr>
        <td>
          <div style="width: 100%; height: 15px; background:{ `linear-gradient(90deg, ${maxColor}, ${maxColor})`}">&nbsp;</div>
        </td>
        <td style="width: 35%">&gt; {format(propType, maxFilter+1, step)}</td>
      </tr>
    {/if}
  </table>
</div>

<script>

import { parseNumber, formatNumber, formatDollars, formatPercent } from './utils';

export default {
  data() {
    return {
      numQuantiles: 10,
      minFilter: null,
      maxFilter: null,
      propType: 'number',
      propName: null
    }
  },

  computed: {
    range: ({ minFilter, maxFilter }) => maxFilter+1 - minFilter,
    step: ({ numQuantiles, range }) => range / numQuantiles,
    minColor:({minFilter, valueColorFunction})=>valueColorFunction(minFilter),
    maxColor:({maxFilter, valueColorFunction})=>valueColorFunction(maxFilter),
    // track values above and below the filter range
    outsideRange: ({ minFilter, maxFilter, valueCounts }) => {
      let below = 0, above = 0;
      valueCounts.forEach(([value, count]) => {
        value = parseNumber(value);
        if (value < minFilter) {
          below += count;
        }
        else if (value > maxFilter) {
          above += count;
        }
      });
      return [below, above];
    },

    // calculate buckets for data by range and number of quantiles
    quantiles: ({ numQuantiles, minFilter, range, step, valueCounts, valueColorFunction }) => {
      if (!valueCounts || !range) {
        return [];
      }

      // add up the things in each bucket
      const bucket = [];
      for (let i = 0; i < numQuantiles; i++) {
        bucket[i] = valueCounts.reduce((total, [value, count]) => {
          value = parseNumber(value);
          if ((value >= (step * i) + minFilter) && (value < (step * (i+1)) + minFilter)) {
            total += count;
          }
          return total;
         }, 0);
      }

      const quantileMax = Math.max(...bucket);
      const quantilePercent = bucket.map(x => x / quantileMax);

      return quantilePercent.map((x, index) =>  {
        const count = bucket[index];
        const columns = Math.ceil(x*numQuantiles);

        const from = (index*step + minFilter);
        const to = ((index+1)*step + minFilter);
        const percent = columns / numQuantiles * 100;
        const fromColor = valueColorFunction(from);
        const toColor = valueColorFunction(to);

        return {
          from,
          to,
          fromColor,
          toColor,
          count,
          percent
        };
      });
    }
  },
  helpers: {
    format (propType,value, step){
      if(propType === "dollars")
        return formatDollars(value);
      if(propType === "percent")
        return formatPercent(value);
      else return formatNumber(value)
      /*
      else {
        if (Math.floor(value) === value) {
          return value.toFixed(0); // show integers as integers
        }
        // adapt the number of digits displayed to the data resolution
        const digits = Math.max(0, Math.ceil(Math.log10(1/step)))
        return value.toFixed(digits);
      }
      */
    }
  }
};

</script>
