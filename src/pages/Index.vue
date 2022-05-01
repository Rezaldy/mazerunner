<template>
  <q-page padding class="flex justify-center items-center">
    <div id="indexpage">
      <matrix/>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Matrix from 'components/Matrix.vue';
export default defineComponent({
  // name: 'PageName'
  name: 'Index',
  components: {Matrix},
});
</script>
