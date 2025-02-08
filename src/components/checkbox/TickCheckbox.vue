<template>
  <view class="checkbox" @click="toggleCheck">
    <view
      class="checkbox-circle"
      :style="`border:${option.borderSize}px ${option.borderColor} solid;`"
    >
      <uni-icons
        type="checkmarkempty"
        :color="option.color"
        :size="option.size"
        v-show="modelValue"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const props = defineProps<{
  modelValue: boolean;
  size?: number;
  color?: string;
  borderSize?: number;
  borderColor?: string;
}>();

const option = ref({
  size: props.size || 16,
  color: props.color || "#007bff",
  borderSize: props.borderSize || 2,
  borderColor: props.borderColor || "#d9d9d9",
});

const emit = defineEmits(["update:modelValue", "click"]);

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

function toggleCheck() {
  checked.value = !checked.value;
  emit("click", !checked.value);
}
</script>

<style lang="scss" scoped>
.checkbox {
  .checkbox-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}
</style>
