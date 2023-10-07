/* eslint-disable import/no-extraneous-dependencies */
/*
 * Copyright (c) 2020-23 Prolincur Technologies LLP.
 * All Rights Reserved.
 */

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import banner from 'vite-plugin-banner'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    dts({ include: ['src'] }),
    cssInjectedByJsPlugin(),
    banner(
        'Copyright (c) 2021-23 Prolincur Technologies LLP.\nAll Rights Reserved.\n\n' +
        'Please check the provided LICENSE file for licensing details.\n' +
        '\n' +
        'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,\n' +
        'INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR\n' +
        'PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE\n' +
        'LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT\n' +
        'OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR\n' +
        'OTHER DEALINGS IN THE SOFTWARE.\n'
    ),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      formats: ['es'],
    },
    copyPublicDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'three',
      ],
      input: {
        app: './src/main.js',
      },
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
})