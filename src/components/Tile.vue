<template>
  <div class="tile" :class="getClass()" />
</template>

<script lang="ts" setup>
interface TileProps {
  type: number;
}

const props = defineProps<TileProps>();

const getClass = () => {
  switch (props.type) {
    case 4: // End
      return 'current';
    case 1: // Wall
      return 'wall';
    case 2: // Start
      return 'start';
    case 3: // End
      return 'end';
    default: // Path by default
      return 'path';
  }
};
</script>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Tile',
});
</script>

<style lang="scss" scoped>
.tile {
  height: 25px;
  width: 25px;
  display: inline-block;
}
.wall {
  background-color: #191919;
}
.start {
  background-color: $positive;
}
.end {
  background-color: $negative;
}
.current {
  background-color: $primary;
}
.path {
}
</style>
