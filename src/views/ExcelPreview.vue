<template>
  <vue-office-excel :src="fileUrl" @rendered="rendered"/>
</template>

<script>
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'

export default {
  name: 'ExcelPreview',
  components: {
    VueOfficeExcel
  },
  data() {
    return {
      fileUrl: '/files/test.xlsx'
    }
  },
  created() {
    // 从路由参数获取文件信息
    const { fileUrl } = this.$route.query
    if (fileUrl) {
      this.fileUrl = fileUrl
    }
  },
  methods: {
    rendered() {
      console.log('Excel 渲染完成')
    }
  }
}
</script> 