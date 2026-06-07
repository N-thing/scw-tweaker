import { defineConfig } from 'vite';
import path from 'path';
import webExtension from 'vite-plugin-web-extension';

function generateManifest() {
  const target = process.env.TARGET || 'chrome'
  const isFirefox = target === 'firefox'

  const manifest = {
    manifest_version: 3,
    name: 'SCW Tweaker',
    permissions: [
      'storage',
      'unlimitedStorage'
    ],
    version: '0.1',
    action: {
      default_popup: 'src/popup/popup.html',
    },
    content_scripts: [
      {
        js: ['src/main.js'],
        // css: ["src/style/main.css"],
        matches: ['https://z.service-company.biz/*'],
      }
    ],
  }

  // Разделение логики фоновых скриптов под разные браузеры
  if (isFirefox) {
    manifest.browser_specific_settings = {
      gecko: { 
        id: 'scw-tweaker@n-thing.net',
        data_collection_permissions: {
          required: ["none"]
        }
      },
      
    }
  } else {
    manifest.data_collection_permissions = { do_not_collect: true }
  }

  return manifest
}

export default defineConfig(() => {
  const target = process.env.TARGET || 'chrome';
  const isFirefox = target === 'firefox';

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/style'),
      },
    },
    build: {
      outDir: path.resolve(__dirname, `dist/${target}`),
      write: true,
      emptyOutDir: true, // Очищать папку dist перед перезаписью
      sourcemap: false,
    },
    css: {
      devSourcemap: false, // Отключает в режиме разработки, если тормозит dev-сервер
    },
    server: {
      watch: {
        usePolling: true, // Включает принудительный опрос файлов (помогает, если Vite на Windows/WSL пропускает изменения)
        ignored: ['!**/src/**'], // Указываем следить за всем, что внутри src
      },
    },
    plugins: [
      webExtension({
        manifest: generateManifest,
        browser: process.env.TARGET || 'chrome',
        webExtConfig: {
          firefoxProfile: path.resolve(__dirname, './firefox-profile'),
          profileCreateIfMissing: true,
          keepProfileChanges: true,
          startUrl: ['https://z.service-company.biz/#/home/tickets/view/1b097aa4-20e6-4b15-ba94-98a830caf62b/?ticketsSection&page=1']
        }
      }),
    ],
  }
})