import { sveltekit } from '@sveltejs/kit/vite'
import copy from 'rollup-plugin-copy'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    unocss(),
    // copy({
    //   targets: [
    //     {
    //       src: 'models/best.onnx',
    //       dest: 'model/a.onnx',
    //     },
    //   ],
    // }),

  ],
})
