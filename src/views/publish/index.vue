<template>
  <div class="publich">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{$route.params.articleId ? '编辑文章' : '发表文章'}}</span>
      </div>
      <el-form ref="form" :model="article" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
        <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
         <!-- 富文本编辑器 -->
          <quill-editor v-model="article.content"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="频道">
          <!-- <el-select v-model="article.channel_id" placeholder="请选择活动区域">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="channel in channels"
              :key="channel.id"
            ></el-option>
          </el-select> -->

          <!-- 频道列表 -->
          <channel-select v-model="article.channel_id"></channel-select>
          <!-- 频道列表 -->
        </el-form-item>
        <!-- <el-form-item label="封面">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit(false)">发表</el-button>
          <el-button @click="onSubmit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 加载富文本编辑器的样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 加载富文本编辑器的核心组件
import { quillEditor } from 'vue-quill-editor'
// 加载注册使用
import ChannelSelect from '@/components/channel-select'
export default {
  name: 'PublishArticle',
  components: {
    // 注册局部组件
    quillEditor,
    ChannelSelect
  },
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 图片，无图就是空数组即可
        },
        channel_id: '4'
      },
      // channels: [],
      editorOption: {}
    }
  },
  created () {
    // this.loadChannels()
    if (this.$route.params.articleId) {
      this.loadArticle()
    }
  },
  methods: {
    loadArticle () {
      this.$axios({
        method: 'GET',
        url: `/articles/${this.$route.params.articleId}`
      }).then(res => {
        this.article = res.data.data
      })
    },
    onSubmit (draft) {
      if (this.$route.params.articleId) {
        // 请求编辑文章
        this.updateArticle(draft)
      } else {
        // 请求添加文章
        this.addArticle(draft)
      }

      // console.log('submit!')
    },
    // 添加文章
    addArticle (draft) {
      this.$axios({
        method: 'POST',
        url: '/articles',
        // headers参数
        // headers: {
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        // },
        // Query参数
        params: {
          draft
        },
        // body参数
        data: this.article
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err, '保存失败')
      })
    },
    // 编辑文章
    updateArticle (draft) {
      this.$axios({
        method: 'PUT',
        url: `/articles/${this.$route.params.articleId}`,
        params: {
          draft
        },
        data: this.article
      }).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('更新失败')
      })
    }
    // loadChannels () {
    //   // 有些接口需要 token，有些接口不需要 token
    //   // 是否需要，应该由接口文档指示
    //   this.$axios({
    //     method: 'GET',
    //     url: '/channels'
    //   }).then(res => {
    //     this.channels = res.data.data.channels
    //   }).catch(err => {
    //     console.log(err, '获取数据失败')
    //   })
    // }
  }
}
</script>

<style>
.ql-editor {
  min-height: 300px;
}
</style>
