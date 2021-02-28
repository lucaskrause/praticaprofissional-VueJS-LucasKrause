<template>
  <div class="sidebar"
       :data-background-color="backgroundColor"
       :data-active-color="activeColor">
    <div class="sidebar-wrapper" id="style-3">
      <div class="logo">
        <a href="#" class="simple-text">
            <div class="logo-img">
                <img src="../../assets/logo.png" alt="">
            </div>
          {{title}}
        </a>
      </div>
      <ul class="nav">
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        title: "CLUBE SINCOFOZ",
        backgroundColor: "black",
        activeColor: "success",
    };
  },
  methods: {
  },
};
</script>
<style>
</style>
