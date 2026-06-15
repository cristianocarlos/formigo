### Configurar tailwind

```css
@source "../../node_modules/@cristianocarlos/formigo/dist/**/*.{js}";

@theme {
    --color-formigo--theme: #0066b4;
}

@utility formigo--z-input-lateral {
    z-index: 1;
}

@utility formigo--z-input-picker {
    z-index: 5;
}

@utility formigo--z-dialog {
    z-index: 7;
}

@utility formigo--button-primary {
    @apply from-blue-700 via-blue-800 to-blue-900 focus:ring-blue-500 dark:focus:ring-blue-600 rounded-lg bg-linear-to-r px-4 py-2.5 text-center leading-5 text-white hover:bg-linear-to-br focus:ring-4 focus:outline-none;
}

@utility formigo--input-label {
    @apply block;
    @apply w-fit;
    @apply mb-0.5;
    @apply text-xs;
    @apply leading-none;
    @apply font-semibold;
    @apply text-gray-500;
    @apply after:content-['.']; /* pra label vazia blocar igual */
    @apply after:text-transparent;
}

@utility formigo--element {
    @apply relative mb-4 text-base leading-none;
}

@utility formigo--message-warning {
    @apply rounded border border-yellow-200 bg-yellow-100 p-4 text-yellow-800;
}

@utility formigo--row {
    @apply flex gap-2 max-sm:flex-wrap max-sm:gap-0 [&>div]:flex-1 max-sm:[&>div]:basis-full;
}
```
