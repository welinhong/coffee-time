<template>
  <div class="form-container">
    <div class="label">
      <slot name="label"></slot>
    </div>
    <div class="value">
      <slot name="value"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormContainer'
}
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
  margin-bottom: 20px;
  .label {
    flex: 1;
    max-width: 150px;
  }
  .value {
    flex: 3;
  }
}
</style>
