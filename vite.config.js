import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html';
import importToCDN from 'vite-plugin-cdn-import';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import vitCompression from 'vite-plugin-compression';
import federation from '@originjs/vite-plugin-federation';
import inspect from 'vite-plugin-inspect';

const cdnUrl = {
  css: { eleCss: '//cdn.jsdelivr.net/npm/element-plus/dist/index.css' },
  js: {
    vue: '//cdn.jsdelivr.net/npm/vue@3.5.21/dist/vue.global.prod.js',
    elementPlus: '//cdn.jsdelivr.net/npm/element-plus',
  },
};
const generateHtmlTags = (mode) => {
  // 开发环境使用本地依赖
  if (mode !== 'production') return '';
  let str = '';
  for (const key in cdnUrl.css) {
    str += `<link rel="stylesheet" href="${cdnUrl.css[key]}">`;
  }
  for (const key in cdnUrl.js) {
    str += `<script src="${cdnUrl.js[key]}" defer></script>`;
  }
  return str;
};

// 图片资源输出到 imgs 目录
const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.icon'];
export default defineConfig(({ mode }) => {
  // 加载 .env 文件，根据不同环境注入变量
  const env = loadEnv(mode, process.cwd());
  // 生成需要注入到 html 模板的标签
  const injectScripts = generateHtmlTags(mode);
  console.log('当前环境', mode, env);
  return {
    // 插件配置
    plugins: [
      inspect(),
      // 配置联邦插件
      // 用于在主机应用中加载远程应用的代码
      federation({
        name: 'host-app',
        remotes: {
          remote_app: 'http://localhost:5173/assets/remoteEntry.js',
        },
        shared: ['vue', 'vue-router', 'pinia'],
      }),
      vue(), // Vue 3 支持
      legacy({
        // 兼容旧浏览器
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      // 注入cdn链接等到html模板
      createHtmlPlugin({
        minify: true, // 压缩 HTML
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'Vite App ++', // 注入 HTML 变量
            // injectScripts: injectScripts // 注入自定义标签
          },
        },
      }),
      // 通过 CDN 加载依赖
      importToCDN({
        modules: [
          { name: 'vue', var: 'Vue', path: cdnUrl.js.vue },
          {
            name: 'element-plus',
            var: 'ElementPlus',
            path: cdnUrl.js.elementPlus,
            css: cdnUrl.css.eleCss,
          },
        ],
        prodUrl: '', // 生产环境下的 CDN 地址前缀，可选，默认从 path 中获取
        devUrl: '', // 开发环境下的 CDN 地址前缀，可选，默认从 path 中获取
      }),
      // 生产环境启用 gzip 压缩
      vitCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用压缩
        threshold: 1024 * 10, // 只有大于该值的资源会被压缩，单位为字节
        deleteOriginFile: false, // 是否删除原始文件
        algorithm: 'gzip', // 压缩算法
        ext: '.gz', // 生成的压缩包后缀
        compressionOptions: {}, // 传递给压缩算法的选项
      }),
      // 打包分析
      visualizer({
        filename: './dist/stats.html', // 分析图生成的文件名
        open: false, // 打包后自动打开分析图
        gzipSize: true,
        brotliSize: true,
      }),
    ],

    // 服务端开发服务器配置
    server: {
      host: '0.0.0.0', // 允许外部访问
      port: 3000, // 端口
      // open: true, // 启动后自动打开浏览器
      https: false, // 是否启用 https
      proxy: {
        // 代理 API 请求到后端
        '/api': {
          target: 'http://192.168.110.55:9052',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // 构建相关配置
    build: {
      outDir: 'dist', // 输出目录
      assetsDir: 'assets', // 关闭默认 static 目录，手动控制输出
      sourcemap: false, // 是否生成 source map
      minify: 'terser', // 使用 terser 进行压缩
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console
          drop_debugger: true, // 移除 debugger
        },
      },
      rollupOptions: {
        // 外部依赖不会被打包进最终产物
        external: ['element-plus', 'vue'],
        input: {
          main: path.resolve(__dirname, 'index.html'), // 多入口可扩展
        },
        output: {
          // format: 'umd', // 输出格式
          // inlineDynamicImports: false, // 不合并动态导入的模块
          manualChunks(id) {
            // 将 node_modules 中的依赖单独打包
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // JS 输出到 js 目录，CSS 输出到 css 目录
          entryFileNames: 'js/[name].[hash].js', // 入口 JS 文件名
          chunkFileNames: 'js/[name].[hash].js', // 代码分割 JS 文件名
          assetFileNames: (assetInfo) => {
            // console.log(assetInfo.name, 'assetInfo');
            // 根据资源类型输出到不同目录
            if (/\.css$/.test(assetInfo.name)) {
              return '[ext]/[name].[hash][extname]';
            }
            if (imgExts.some((ext) => assetInfo.name.endsWith(ext))) {
              return 'imgs/[name]-[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
          globals: {
            ElementPlus: 'element-plus',
            Vue: 'vue',
          }, // UMD 构建时外部依赖的全局变量名
        },
      },
      // lib: {
      //   entry: './src/compileCom.js',
      //   name: 'vue3-comp',
      // },
    },

    // 路径别名配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 使用 @ 代表 src 目录
      },
      extensions: ['.js', '.vue', '.json', '.ts'], // 导入时可省略后缀
    },

    // CSS 相关配置
    css: {
      preprocessorOptions: {
        scss: {
          // 全局 SCSS 变量、mixin 自动注入
          // additionalData: `@import "@/style/variables.scss";`,
        },
      },
      modules: {
        // CSS Modules 命名规则
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },

    // 环境变量前缀，只有以 VITE_ 开头的变量会暴露给客户端
    envPrefix: 'VITE_',

    // 依赖优化配置
    optimizeDeps: {
      include: ['vue', 'vue-router'], // 预构建依赖
      exclude: [], // 排除项
    },

    // 生产环境静态资源公共路径
    base: env.VITE_PUBLIC_PATH || '/',

    // 预览服务器配置
    preview: {
      port: 5000,
      open: true,
    },
  };
});
