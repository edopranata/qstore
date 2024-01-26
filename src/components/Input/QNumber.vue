<template>
  <q-field
    :autofocus="autofocus"
    :bg-color="bgColor"
    :borderless="borderless"
    :bottom-slots="bottomSlots"
    :clearIcon="clearIcon"
    :clearable="clearable"
    :color="color"
    :dense="dense"
    :disable="disable"
    :filled="filled"
    :hide-bottom-space="hideBottomSpace"
    :hide-hint="hideHint"
    :hint="hint"
    :label="label"
    :label-color="labelColor"
    :label-slot="labelSlot"
    :loading="loading"
    :model-value="maskedValue"
    :outlined="outlined"
    :prefix="prefix"
    :readonly="readonly"
    :rounded="rounded"
    :square="square"
    :stack-label="stackLabel"
    :standout="standout"
    :suffix="suffix"
    class="q-number"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template v-slot:control="{ id, modelValue, emitValue }">
      <input
        :id="id"
        v-number="options"
        :disabled="disable"
        :placeholder="placeholder"
        :readonly="readonly"
        :value="modelValue"
        autocomplete="off"
        class="q-field__input"
        type="text"
        @blur="onBlur($event, emitValue)"
        @change="onChange($event, emitValue)"
        @focus="onInput($event, emitValue)"
        @input="onInput($event, emitValue)"
      />
    </template>
    <template v-for="slot in scopedSlots" v-slot:[slot]="props">
      <slot :name="slot" v-bind="props" v-bind:props="props"></slot>
    </template>
  </q-field>
</template>

<script>

import {NumberFormat} from "@coders-tm/vue-number-format";

export default {
  props: {
    modelValue: [String, Number],
    placeholder: {
      type: String,
      default: "0.00",
    },
    options: {
      type: Object,
      default: () => ({
        precision: 2,
        minimumFractionDigits: 2,
      })
    },
    label: String,
    stackLabel: Boolean,
    hint: String,
    hideHint: Boolean,
    prefix: String,
    suffix: String,

    labelColor: String,
    color: String,
    bgColor: String,

    filled: Boolean,
    outlined: Boolean,
    borderless: Boolean,
    standout: [Boolean, String],

    square: Boolean,

    loading: Boolean,

    labelSlot: Boolean,

    bottomSlots: Boolean,
    hideBottomSpace: Boolean,

    rounded: Boolean,
    dense: Boolean,

    clearable: Boolean,
    clearIcon: String,

    disable: Boolean,
    readonly: Boolean,

    autofocus: Boolean,
    masked: Boolean,
  },
  data() {
    return {
      canEmit: false,
      maskedValue: this.modelValue,
      unmaskedValue: null
    }
  },
  emits: ["update:model-value"],
  methods: {
    onInput(event) {
      const {target} = event
      this.maskedValue = target.value
      this.unmaskedValue = target.unmasked
      this.canEmit = true
    },
    onChange(event, emitValue) {
      emitValue(this.emittedValue)
    },
    onBlur(event, emitValue) {
      if (this.canEmit && this.emittedValue !== this.modelValue) {
        emitValue(this.emittedValue)
      }
    },
    number() {
      return new NumberFormat(this.options)
    }
  },
  computed: {
    scopedSlots() {
      return Object.keys(this.$slots);
    },
    emittedValue() {
      if (this.masked) {
        return this.maskedValue
      }
      return this.unmaskedValue
    }
  },
  watch: {
    modelValue: {
      deep: true,
      handler(val) {
        const number = this.number().format(val)
        if (number !== this.maskedValue) {
          this.maskedValue = number
        }
      }
    }
  },
};
</script>
