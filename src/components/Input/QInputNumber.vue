<template>
  <q-input
    ref="inputRef"
    v-model="formattedValue"
    :dense="dense"
    :disable="disabled"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :label="label"
    :prefix="prefix"
    :suffix="suffix"
  >
    <slot name="default"/>
  </q-input>
</template>

<script>
import {useCurrencyInput} from "vue-currency-input";
import {watch} from "vue";

export default {
  name: "QCurrencyInput",
  props: {
    label: String,
    errorMessage: {
      type: String,
      default: null
    },
    dense: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [Number, String],
      default: 0
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const {
      inputRef,
      formattedValue,
      setValue,
    } = useCurrencyInput({
      currency: 'USD',
      symbol: 'Rp.',
      hideCurrencySymbolOnFocus: true,
      hideNegligibleDecimalDigitsOnFocus: true,
      hideGroupingSeparatorOnFocus: false,
      currencyDisplay: 'hidden'
    });

    watch(
      () => props.modelValue,
      (value) => {
        if (value) {
          setValue(value);
        }
      }
    );

    return {inputRef, formattedValue};
  },
};
</script>
