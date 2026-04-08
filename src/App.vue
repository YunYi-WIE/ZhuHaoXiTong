<template>
  <router-view />
</template>

<style>
/* 清除默认内外边距，保证占满全屏 */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  overflow-x: hidden;
  background: #fff;
}
</style>