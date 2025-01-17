<template>
  <div>
    <!-- Word 预览 -->
    <template v-if="isWordFile">
      <div class="office-container">
        <div v-if="loading" class="loading-tip">
          <div class="loading-spinner"></div>
          <span>Word 文档加载中...</span>
        </div>
        <div v-if="error" class="error-tip">
          {{ error }}
          <button @click="retryLoading">重试</button>
        </div>
        <div class="preview-wrapper" v-show="!loading && !error">
          <vue-office-docx
            :src="fileUrl"
            @rendered="handleDocxLoadSuccess"
            @error="handleDocxLoadError"
          />
        </div>
      </div>
    </template>

    <!-- Excel 预览 -->
    <template v-else-if="['xls', 'xlsx'].includes(fileType.toLowerCase())">
      <div class="loading-tip">
        <span>正在跳转到 Excel 预览页面...</span>
      </div>
    </template>

    <!-- PPT 预览 -->
    <template v-else-if="isPPTFile">
      <div class="office-container">
        <div v-if="loading" class="loading-tip">
          <div class="loading-spinner"></div>
          <span>PPT 文件加载中...</span>
        </div>
        <div v-if="error" class="error-tip">
          {{ error }}
          <button @click="retryLoading">重试</button>
        </div>
        <div class="preview-wrapper" v-show="!loading && !error">
          <vue-office-pptx
            :src="fileUrl"
            :options="pptOptions"
            @rendered="handlePPTLoadSuccess"
            @error="handlePPTLoadError"
          />
        </div>
      </div>
    </template>

    <!-- PDF 预览 -->
    <template v-else-if="isPDFFile">
      <div class="pdf-container">
        <div v-if="loading" class="loading-tip">
          <div class="loading-spinner"></div>
          <span>PDF 加载中...</span>
        </div>
        <div v-if="error" class="error-tip">
          {{ error }}
          <button @click="retryLoading">重试</button>
        </div>
        <div v-show="!loading && !error" class="pdf-pages" ref="pdfContainer">
          <canvas v-for="(page, index) in pages" 
            :key="index"
            :id="`pdf-page-${index + 1}`"
            v-intersection-observer="() => loadPage(index + 1)"
            class="pdf-page"
          ></canvas>
        </div>
      </div>
    </template>

    <div v-else class="error-message">
      不支持的文件类型
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.entry'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficePptx from '@vue-office/pptx'

import '@vue-office/docx/lib/index.css'

// 使用本地的 Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

export default {
  name: 'FilePreview',
  components: {
    VueOfficeDocx,
    VueOfficePptx
  },
  data() {
    return {
      loading: false,
      error: null,
      pdfDoc: null,
      pages: [],
      scale: 1.5,
      pptOptions: {
        ppt: false
      },
      fileUrl: '',
      fileType: ''
    }
  },
  computed: {
    isWordFile() {
      return ['doc', 'docx'].includes(this.fileType.toLowerCase())
    },
    isPPTFile() {
      return ['ppt', 'pptx'].includes(this.fileType.toLowerCase())
    },
    isPDFFile() {
      return this.fileType.toLowerCase() === 'pdf'
    }
  },
  created() {
    // 从路由参数获取文件信息
    const { fileUrl, fileType } = this.$route.query
    if (!fileUrl || !fileType) {
      this.error = '缺少必要的文件信息'
      return
    }
    
    this.fileUrl = fileUrl
    this.fileType = fileType

    // 根据文件类型设置选项
    const lowerType = fileType.toLowerCase()
    if (this.isPPTFile) {
      this.pptOptions.ppt = lowerType === 'ppt'
    }
  },
  watch: {
    fileType: {
      immediate: true,
      handler(type) {
        const lowerType = type.toLowerCase()
        if (this.isPPTFile) {
          this.pptOptions.ppt = lowerType === 'ppt'
        }
        // Excel 文件跳转到专门的预览页
        if (['xls', 'xlsx'].includes(lowerType)) {
          this.$router.replace({
            name: 'ExcelPreview',
            query: { fileUrl: this.fileUrl }
          })
        }
      }
    }
  },
  mounted() {
    if (!this.error) {
      this.loading = true
      if (this.isPDFFile) {
        this.initPDFViewer()
      }
    }
  },
  beforeDestroy() {
    // 清理 PDF 资源
    if (this.pdfDoc) {
      this.pdfDoc.destroy()
    }
  },
  methods: {
    // PDF 相关方法
    async initPDFViewer() {
      this.loading = true
      this.error = null
      
      try {
        const loadingTask = pdfjsLib.getDocument(this.fileUrl)
        this.pdfDoc = await loadingTask.promise
        
        // 初始化页面数组
        this.pages = new Array(this.pdfDoc.numPages).fill(null)
        
        this.loading = false
      } catch (error) {
        console.error('PDF 加载失败:', error)
        this.loading = false
        this.error = '加载 PDF 文件失败，请检查文件是否可访问'
      }
    },
    async loadPage(pageNumber) {
      if (!this.pdfDoc || this.pages[pageNumber - 1] !== null) {
        return
      }

      try {
        const page = await this.pdfDoc.getPage(pageNumber)
        const viewport = page.getViewport({ scale: this.scale })
        
        const canvas = document.getElementById(`pdf-page-${pageNumber}`)
        const context = canvas.getContext('2d')
        
        canvas.height = viewport.height
        canvas.width = viewport.width
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }
        
        await page.render(renderContext).promise
        this.pages[pageNumber - 1] = true
      } catch (error) {
        console.error(`渲染第 ${pageNumber} 页失败:`, error)
      }
    },
    retryLoading() {
      this.loading = true
      this.error = null
      
      // 根据文件类型重新加载
      if (this.isPDFFile) {
        this.initPDFViewer()
      } else {
        // 对于其他类型的文件，重置状态即可
        // 因为 vue-office 组件会自动重新加载
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },

    // Word 相关方法
    handleDocxLoadSuccess() {
      console.log('Word 文档加载成功')
      this.loading = false
      this.error = null
    },
    handleDocxLoadError(error) {
      console.error('Word 文档加载失败:', error)
      this.loading = false
      this.error = '加载 Word 文档失败，请检查文件是否可访问'
    },

    // PPT 相关方法
    handlePPTLoadSuccess() {
      console.log('PPT 文件加载成功')
      this.loading = false
      this.error = null
    },
    handlePPTLoadError(error) {
      console.error('PPT 文件加载失败:', error)
      this.loading = false
      this.error = '加载 PPT 文件失败，请检查文件是否可访问'
    }
  },
  directives: {
    intersectionObserver: {
      inserted(el, binding) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                binding.value()
                observer.unobserve(el)
              }
            })
          },
          {
            rootMargin: '50px 0px'
          }
        )
        observer.observe(el)
      }
    }
  }
}
</script>

<style scoped>
.file-preview-container {
  width: 100%;
  min-height: 100vh;
}

.office-container {
  width: 100%;
  height: 100vh;
  background: white;
}

.preview-wrapper {
  width: 100%;
  height: 100%;
}

/* Word 文档特殊处理 */
.preview-wrapper :deep(.vue-office-docx) {
  width: 100%;
  height: 100%;
  overflow: auto !important;
  -webkit-overflow-scrolling: touch;
}

.preview-wrapper :deep(.vue-office-docx > div) {
  min-width: fit-content;
  padding: 20px;
}

/* PPT 文件特殊处理 */
.preview-wrapper :deep(.vue-office-pptx) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-wrapper :deep(.vue-office-pptx img) {
  max-width: 100%;
  height: auto;
}

/* PDF 容器特殊处理 */
.pdf-container {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}

.pdf-pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
}

.pdf-page {
  max-width: 100%;
  height: auto;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 加载和错误提示 */
.loading-tip, .error-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-tip button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  background: #f40f02;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.error-tip button:hover {
  background: #d40d01;
}

.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(244, 15, 2, 0.9);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 16px;
}
</style>  