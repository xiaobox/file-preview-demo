<template>
  <div class="home">
    <h1 class="md-headline">文件预览测试</h1>
    <div class="preview-sections">
      <!-- Word 文档预览 -->
      <div class="preview-section md-elevation-2 word-section">
        <div class="section-header">
          <i class="material-icons">description</i>
          <h3 class="md-title">Word 文档预览</h3>
        </div>
        <div class="preview-options">
          <div class="local-file">
            <div class="file-item md-button md-raised word-btn" @click="previewFile('test.docx', 'docx')">
              <i class="material-icons">insert_drive_file</i>
              预览本地 Word 文档 (DOCX)
            </div>
          </div>
          <div class="url-input">
            <div class="input-wrapper">
              <input 
                type="text" 
                v-model="urls.docx" 
                :class="['md-input', { error: urlErrors.docx }]"
                :placeholder="`输入Word 文档 URL`"
              >
              <div class="error-message" v-if="urlErrors.docx">{{ urlErrors.docx }}</div>
            </div>
            <button 
              class="md-button" 
              :class="`docx-preview-btn`"
              @click.prevent="previewUrl('docx')"
              :disabled="!urls.docx || !validateUrl('docx') || isChecking"
            >
              <span class="material-icons">visibility</span>
              预览
            </button>
          </div>
        </div>
      </div>

      <!-- Excel 文件预览 -->
      <div class="preview-section md-elevation-2 excel-section">
        <div class="section-header">
          <i class="material-icons">grid_on</i>
          <h3 class="md-title">Excel 文件预览</h3>
        </div>
        <div class="preview-options">
          <div class="local-file">
            <div class="file-item md-button md-raised excel-btn" @click="previewFile('test.xlsx', 'xlsx')">
              <i class="material-icons">table_chart</i>
              预览本地 Excel 文件 (XLSX)
            </div>
          </div>
          <div class="url-input">
            <div class="input-wrapper">
              <input 
                type="text" 
                v-model="urls.xlsx" 
                :class="['md-input', { error: urlErrors.xlsx }]"
                :placeholder="`输入Excel 文件 URL`"
              >
              <div class="error-message" v-if="urlErrors.xlsx">{{ urlErrors.xlsx }}</div>
            </div>
            <button 
              class="md-button" 
              :class="`xlsx-preview-btn`"
              @click.prevent="previewUrl('xlsx')"
              :disabled="!urls.xlsx || !validateUrl('xlsx') || isChecking"
            >
              <span class="material-icons">visibility</span>
              预览
            </button>
          </div>
        </div>
      </div>

      <!-- PDF 文件预览 -->
      <div class="preview-section md-elevation-2 pdf-section">
        <div class="section-header">
          <i class="material-icons">picture_as_pdf</i>
          <h3 class="md-title">PDF 文件预览</h3>
        </div>
        <div class="preview-options">
          <div class="local-file">
            <div class="file-item md-button md-raised pdf-btn" 
              @click="previewFile('test.pdf', 'pdf')"
              :disabled="isChecking"
            >
              <i class="material-icons">file_present</i>
              预览本地 PDF 文件
            </div>
          </div>
          <div class="url-input">
            <div class="input-wrapper">
              <input 
                type="text" 
                v-model="urls.pdf" 
                :class="['md-input', { error: urlErrors.pdf }]"
                :placeholder="`输入PDF 文件 URL`"
              >
              <div class="error-message" v-if="urlErrors.pdf">{{ urlErrors.pdf }}</div>
            </div>
            <button 
              class="md-button" 
              :class="`pdf-preview-btn`"
              @click.prevent="previewUrl('pdf')"
              :disabled="!urls.pdf || !validateUrl('pdf') || isChecking"
            >
              <span class="material-icons">visibility</span>
              预览
            </button>
          </div>
        </div>
      </div>

      <!-- PPT 文件预览 -->
      <div class="preview-section md-elevation-2 ppt-section">
        <div class="section-header">
          <i class="material-icons">slideshow</i>
          <h3 class="md-title">PPT 文件预览</h3>
        </div>
        <div class="preview-options">
          <div class="local-file">
            <div class="file-item md-button md-raised ppt-btn" @click="previewFile('test.pptx', 'pptx')">
              <i class="material-icons">present_to_all</i>
              预览本地 PPT 文件 (PPTX)
            </div>
          </div>
          <div class="url-input">
            <div class="input-wrapper">
              <input 
                type="text" 
                v-model="urls.pptx" 
                :class="['md-input', { error: urlErrors.pptx }]"
                :placeholder="`输入PPT 文件 URL`"
              >
              <div class="error-message" v-if="urlErrors.pptx">{{ urlErrors.pptx }}</div>
            </div>
            <button 
              class="md-button" 
              :class="`pptx-preview-btn`"
              @click.prevent="previewUrl('pptx')"
              :disabled="!urls.pptx || !validateUrl('pptx') || isChecking"
            >
              <span class="material-icons">visibility</span>
              预览
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="format-tips">
      <div class="tips-header">
        <i class="material-icons">info</i>
        <h3>支持的文件格式</h3>
      </div>
      <ul>
        <li><i class="material-icons">description</i> Word：.docx</li>
        <li><i class="material-icons">grid_on</i> Excel：.xlsx（支持多 sheet 页）</li>
        <li><i class="material-icons">slideshow</i> PowerPoint：.pptx</li>
        <li><i class="material-icons">picture_as_pdf</i> PDF：.pdf</li>
      </ul>
      <div class="tips">
        <p><i class="material-icons">folder</i> 本地预览：请确保文件放在 public/files 目录下</p>
        <p><i class="material-icons">link</i> URL 预览：请确保输入完整的文件 URL，且该文件可以被公开访问</p>
        <p class="warning">
          <i class="material-icons">warning</i>
          注意：由于浏览器的跨域限制，某些网站的文件可能无法直接预览。遇到这种情况，建议先下载到本地后再预览。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      urls: {
        docx: '',
        xlsx: '',
        pdf: '',
        pptx: ''
      },
      urlErrors: {
        docx: '',
        xlsx: '',
        pdf: '',
        pptx: ''
      },
      isChecking: false
    }
  },
  methods: {
    async previewUrl(type) {
      // 防止重复点击
      if (this.isChecking) {
        return;
      }

      if (!this.urls[type]) {
        this.$message?.warning?.('请输入文件 URL') || alert('请输入文件 URL');
        return;
      }

      // 验证 URL
      if (!this.validateUrl(type)) {
        return;
      }

      try {
        this.isChecking = true;
        console.log('开始检测文件...');

        // 先检查文件大小
        const response = await fetch(this.urls[type], { method: 'HEAD' });
        const size = response.headers.get('content-length');
        const fileSize = parseInt(size, 10) || 0;
        const isLargeFile = fileSize > 5 * 1024 * 1024; // 5MB

        // 检测设备
        const ua = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isAndroid = /android/.test(ua);
        const isMobile = isIOS || isAndroid;

        console.log('文件和设备检测:', {
          fileSize: fileSize / 1024 / 1024 + 'MB',
          isLargeFile,
          isIOS,
          isAndroid,
          isMobile,
          userAgent: ua
        });

        // 如果是移动设备上的大型 PDF，直接使用系统打开
        if (isMobile && isLargeFile && type === 'pdf') {
          console.log('使用系统打开 PDF');
          // 使用 setTimeout 确保日志输出后再跳转
          setTimeout(() => {
            window.location.href = this.urls[type];
          }, 100);
          return;
        }

        // 其他情况，使用路由跳转到预览页
        await this.$router.push({
          path: '/preview',
          query: {
            fileUrl: this.urls[type],
            fileType: type,
            isLocalFile: false,
            fileSize,
            isMobile
          }
        });
      } catch (error) {
        console.error('检查文件失败:', error);
        // 如果检查失败，也进行路由跳转，让预览组件处理
        await this.$router.push({
          path: '/preview',
          query: {
            fileUrl: this.urls[type],
            fileType: type,
            isLocalFile: false
          }
        });
      } finally {
        this.isChecking = false;
      }
    },
    validateUrl(type) {
      const url = this.urls[type]
      if (!url) {
        this.urlErrors[type] = ''
        return false
      }

      try {
        const urlObj = new URL(url)
        const extension = urlObj.pathname.split('.').pop().toLowerCase()
        
        switch (type) {
          case 'docx':
            if (extension !== 'docx') {
              this.urlErrors[type] = '请输入有效的 Word 文档地址 (.docx)'
              return false
            }
            break
          case 'xlsx':
            if (extension !== 'xlsx') {
              this.urlErrors[type] = '请输入有效的 Excel 文件地址 (.xlsx)'
              return false
            }
            break
          case 'pdf':
            if (extension !== 'pdf') {
              this.urlErrors[type] = '请输入有效的 PDF 文件地址 (.pdf)'
              return false
            }
            break
          case 'pptx':
            if (extension !== 'pptx') {
              this.urlErrors[type] = '请输入有效的 PPT 文件地址 (.pptx)'
              return false
            }
            break
        }
        return true
      } catch (e) {
        this.urlErrors[type] = '请输入有效的文件 URL'
        return false
      }
    },
    isValidUrl(type) {
      try {
        if (!this.urls[type]) return false;
        const url = new URL(this.urls[type]);
        const extension = url.pathname.split('.').pop().toLowerCase();
        
        switch (type) {
          case 'docx':
            return extension === 'docx';
          case 'xlsx':
            return extension === 'xlsx';
          case 'pdf':
            return extension === 'pdf';
          case 'pptx':
            return extension === 'pptx';
          default:
            return false;
        }
      } catch (e) {
        return false;
      }
    },
    async previewFile(filename, type) {
      try {
        this.isChecking = true;
        console.log('开始检测本地文件...');

        // 构建本地文件 URL
        const fileUrl = `${process.env.BASE_URL}files/${filename}`;

        // 检测设备
        const ua = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        const isAndroid = /android/.test(ua);
        const isMobile = isIOS || isAndroid;

        // 检查文件大小
        const response = await fetch(fileUrl, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        const fileSize = parseInt(size, 10) || 0;
        const isLargeFile = fileSize > 5 * 1024 * 1024; // 5MB

        console.log('本地文件和设备检测:', {
          fileSize: fileSize / 1024 / 1024 + 'MB',
          isLargeFile,
          isIOS,
          isAndroid,
          isMobile,
          userAgent: ua
        });

        // 如果是移动设备上的大型 PDF，直接使用系统打开
        if (isMobile && isLargeFile && type === 'pdf') {
          console.log('使用系统打开本地 PDF');
          window.location.href = fileUrl;
          return;
        }

        // 其他情况，使用路由跳转到预览页
        await this.$router.push({
          path: '/preview',
          query: {
            fileUrl,
            fileType: type,
            isLocalFile: true,
            fileSize,
            isMobile
          }
        });
      } catch (error) {
        console.error('检查本地文件失败:', error);
        this.$message?.error?.('无法访问本地文件') || alert('无法访问本地文件');
      } finally {
        this.isChecking = false;
      }
    }
  },
  watch: {
    'urls.docx'() {
      this.validateUrl('docx')
    },
    'urls.xlsx'() {
      this.validateUrl('xlsx')
    },
    'urls.pdf'() {
      this.validateUrl('pdf')
    },
    'urls.pptx'() {
      this.validateUrl('pptx')
    }
  }
}
</script>

<style scoped>
/* 在 head 中引入 Material Icons */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* 基础样式 */
.home {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Roboto, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* Word 相关样式 */
.word-section {
  border-top: 4px solid #2b579a;
}

.word-section .section-header .material-icons {
  color: #2b579a;
}

.word-btn {
  background-color: #2b579a !important;
  color: white !important;
}

.word-preview-btn {
  background-color: #2b579a !important;
  color: white !important;
}

/* Excel 相关样式 */
.excel-section {
  border-top: 4px solid #217346;
}

.excel-section .section-header .material-icons {
  color: #217346;
}

.excel-btn {
  background-color: #217346 !important;
  color: white !important;
}

.excel-preview-btn {
  background-color: #217346 !important;
  color: white !important;
}

/* PDF 相关样式 */
.pdf-section {
  border-top: 4px solid #f40f02;
}

.pdf-section .section-header .material-icons {
  color: #f40f02;
}

.pdf-btn {
  background-color: #f40f02 !important;
  color: white !important;
}

.pdf-preview-btn {
  background-color: #f40f02;
  color: white;
}

.pdf-preview-btn:disabled {
  background-color: #ccc !important;
  color: rgba(0, 0, 0, 0.38) !important;
}

/* PPT 相关样式 */
.ppt-section {
  border-top: 4px solid #d24726;
}

.ppt-section .section-header .material-icons {
  color: #d24726;
}

.ppt-btn {
  background-color: #d24726 !important;
  color: white !important;
}

.ppt-preview-btn {
  background-color: #d24726 !important;
  color: white !important;
}

/* 输入框焦点样式 */
.word-section .md-input:focus { border-color: #2b579a; }
.excel-section .md-input:focus { border-color: #217346; }
.pdf-section .md-input:focus { border-color: #f40f02; }
.ppt-section .md-input:focus { border-color: #d24726; }

/* 按钮基础样式 */
.md-button {
  min-width: 120px;
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-flex !important;
  align-items: center;
  gap: 8px;
  border: none;
  outline: none;
  cursor: pointer;
}

.file-item.md-button {
  width: 100%;
  padding: 24px;
  justify-content: center;
  font-size: 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin: 0;
  box-sizing: border-box;
}

.file-item .material-icons {
  font-size: 20px;
}

.md-button .material-icons {
  font-size: 20px;
}

.md-headline {
  font-size: 28px;
  font-weight: 500;
  margin: 0 0 40px;
  color: rgba(0, 0, 0, 0.87);
  text-align: center;
}

.preview-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.preview-section {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 头部样式 */
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: calc(100% - 32px);  /* 与长按钮宽度一致 */
}

.section-header .material-icons {
  font-size: 32px;
}

.md-title {
  font-size: 24px;
  font-weight: 500;
  margin: 0;
  color: rgba(0, 0, 0, 0.87);
}

/* 预览选项样式 */
.preview-options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.local-file {
  margin-bottom: 8px;
  width: calc(100% - 32px);  /* 减去右侧内边距 */
}

.file-item.md-button {
  width: 100%;
  padding: 16px;
  justify-content: center;
  font-size: 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  margin: 0;
  box-sizing: border-box;  /* 确保padding包含在宽度内 */
}

/* URL 输入区域样式 */
.url-input {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 8px;
  position: relative;
  min-height: 80px;
  width: calc(100% - 32px);
}

.input-wrapper {
  flex: 1;
  position: relative;
  margin: 0;
}

.md-input {
  width: 100%;
  height: 52px;
  padding: 8px 16px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.md-input:focus {
  outline: none;
  border-width: 2px;
}

.md-input.error {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -24px;
  font-size: 12px;
  color: #f44336;
  white-space: nowrap;
  line-height: 1.2;
}

/* 预览按钮样式 */
.url-input .md-button {
  height: 52px;
  min-width: 140px;
  padding: 0 32px;
  margin: 0;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-sizing: border-box;
  align-self: flex-start;
  flex-shrink: 0;
}

.url-input .md-button .material-icons {
  font-size: 24px;
  margin-right: 8px;
}

/* 预览按钮悬停效果 */
.url-input .md-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  filter: brightness(110%);
}

.url-input .md-button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 本地文件按钮悬停效果 */
.file-item.md-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  filter: brightness(110%);
}

.file-item.md-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 禁用状态 */
.md-button:disabled {
  opacity: 0.5;
  background-color: #ccc !important;
  color: rgba(0, 0, 0, 0.38) !important;
  cursor: not-allowed;
  box-shadow: none !important;
  transform: none !important;
  filter: none !important;
}

/* 提示区域样式 */
.format-tips {
  margin-top: 48px;
  padding: 32px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.tips-header h3 {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  color: rgba(0, 0, 0, 0.87);
}

.format-tips ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
}

.format-tips li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 16px;
}

.tips {
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.tips p {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}

.warning {
  margin-top: 16px;
  padding: 16px;
  background-color: rgba(245, 124, 0, 0.05);
  border-radius: 4px;
  border-left: 4px solid #f57c00;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .home {
    padding: 16px;
  }

  .preview-section {
    padding: 24px;
  }

  .url-input {
    flex-direction: column;
    gap: 16px;
  }

  .url-input .md-button {
    width: 100%;
    margin-top: 8px;
  }

  .input-wrapper {
    width: 100%;
    margin-bottom: 0;
  }
}

.docx-preview-btn:disabled {
  background-color: #ccc !important;
  color: rgba(0, 0, 0, 0.38) !important;
}

.xlsx-preview-btn:disabled {
  background-color: #ccc !important;
  color: rgba(0, 0, 0, 0.38) !important;
}

.pptx-preview-btn:disabled {
  background-color: #ccc !important;
  color: rgba(0, 0, 0, 0.38) !important;
}
</style> 