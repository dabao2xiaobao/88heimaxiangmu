<template>
  <div class="article">
    <!-- 筛选数据 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ totalCount }}条符合条件的内容</span>
      </div>
        <!--
        el-table 表格组件
        data 表格的数组，要求是数组
        表格组件会使用 data 数据，在内部自己进行遍历，我们不需要自己写什么 v-for
        你只需要告诉这个表格组件：
          data 是啥
          表头名是什么
          列值是什么
        el-table-column 表格列组件
          prop 用来指定渲染哪个数据字段
          label 表头名称

          width 列宽

        表格列默认只能渲染普通文本，如果想要渲染点儿别的东西，需要自定义表格列。
       -->
      <el-form ref="form" label-width="80px">
        <el-form-item label="文章状态">
          <!-- 单选框组火把选中的radio的lable同步给绑定的数据 -->
          <el-radio-group v-model="filterForm.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio label="0">草稿</el-radio>
            <el-radio label="1">待审核</el-radio>
            <el-radio label="2">审核通过</el-radio>
            <el-radio label="3">审核失败</el-radio>
            <el-radio label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <!-- <el-select placeholder="请选择活动区域" v-model="filterForm.channel_id">
            <el-option label="='所有频道" :value="null"></el-option>
            <el-option v-for="channel in channels" :key='channel.id' :label="channel.name" :value="channel.id"></el-option>
          </el-select> -->
          <channel-select v-model="filterForm.channel_id"></channel-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- 点击查询按钮,重新发送请求,从第一页开始 -->
          <el-button @click='loadArticles(1)' type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- /筛选数据 -->

    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到59806条符合条件的内容</span>
      </div>
      <el-table
        :data="articles"
          v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="封面"
          width="180">
            <!--
            自定义表格列
            在 template 上声明 slot-scope="scope" ，然后就可以通过 scope.row 获取遍历项
            scope.row 就相当于我们自己 v-for 的 item
            注意：只有当你需要在自定义表格列模板中访问遍历项的时候才这么做
           -->
          <template slot-scope="scope">
            <img width="50" :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
            <template slot-scope="scope">
            <!--
              0 草稿
              1 待审核
              2 审核通过
              3 审核失败
              4 已删除
             -->
            <!-- <span v-show="scope.row.status === 0">草稿</span>
            <span v-show="scope.row.status === 1">待审核</span>
            <span v-show="scope.row.status === 2">审核通过</span>
            <span v-show="scope.row.status === 3">审核失败</span>
            <span v-show="scope.row.status === 4">已删除</span> -->

            <!--
              scope.row.status
                0、1、2、3、4
              articleStatus
                [{ value: '草稿' }, { label: '待审核' }...]
             -->
            <!-- <span>{{ articleStatus[scope.row.status].label }}</span> -->

            <el-tag
              :type="articleStatus[scope.row.status].type"
            >{{ articleStatus[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
           <template slot-scope="scope">
            <el-button @click="onDelete(scope.row.id)" type="danger">删除</el-button>
            <el-button @click="$router.push('/publish/' + scope.row.id)" type="primary">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- /文章列表 -->
    <!-- 分页 -->
    <el-pagination
      background
      :total="totalCount"
      @current-change='onPageChange'
      layout="prev, pager, next"
      :disabled='loading'>
    </el-pagination>
    <!-- 分页 -->
  </div>
</template>

<script>
import ChannelSelect from '@/components/channel-select'
export default {
  name: 'article-list',
  components: {
    ChannelSelect
  },
  data () {
    return {
      // 过滤数据的表单
      filterForm: {
        status: null,
        // channel_id: null,
        begin_pubdate: '',
        end_pubdate: '',
        channel_id: null
      },
      rangeDate: [], // 日期范围（开始时间，结束时间）
      articles: [], // 文章数据列表
      articleStatus: [
        {
          type: '',
          label: '草稿'
        },
        {
          type: 'warning',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'danger',
          label: '审核失败'
        },
        {
          type: 'info',
          label: '已删除'
        }
      ],
      totalCount: 0,
      loading: true,
      // channels: [],
      page: 1 // 当前页码
      // rangeDate: []
      // channel_id: this.filterForm.channel_id
    }
  },
  created () {
    // 在我们的项目中，除了 /login 接口不需要 token，其它所有的接口都需要提供 token 才能请求
    // 否则后端返回 401 错误
    // 我们这里的后端要求把 token 放到请求头中
    // const token = window.localStorage.getItem('user-token')

    //   this.$axios({
    //     method: 'GET',
    //     url: '/articles',
    //     headers: { // 添加请求头
    //       // 名字: 值
    //       // 后端要求把 token 放到请求头中，使用一个名字叫：Authorization
    //       // 注意，token的格式要求：Bearer 用户token
    //       // 注意！！！Bearer有个空格，多了少了都不行
    //       Authorization: `Bearer ${token}`
    //     }
    //   }).then(res => {
    //     console.log(res)
    //   }).catch(err => {
    //     console.log(err, '获取数据失败')
    //   })
    this.loadArticles(1)
    // 加载频道列表
    // this.loadChannels()
  },
  methods: {
    loadArticles (page = 1) {
      this.loading = true
      // 在我们的项目中，除了 /login 接口不需要 token，其它所有的接口都需要提供 token 才能请求
      // 否则后端返回 401 错误
      // 我们这里的后端要求把 token 放到请求头中
      // const token = window.localStorage.getItem('user-token')
      this.$axios({
        method: 'GET',
        url: '/articles',
        // headers: { // 添加请求头
        //   // 名字: 值
        //   // 后端要求把 token 放到请求头中，使用一个名字叫：Authorization
        //   // 注意，token的格式要求：Bearer 用户token
        //   // 注意！！！Bearer有个空格，多了少了都不行
        //   Authorization: `Bearer ${token}`
        // },
        // qurey参数使用params传递
        params: {
          // 页码
          page,
          // 每页大小
          por_page: 10,
          // 文章状态
          status: this.filterForm.status,
          // 当参数值为null 的时候,数据就不传递了
          // status: null
          // channel_id,
          // begin_pubdate,
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
          end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
          // end_pubdate
          // 频道id
          channel_id: this.filterForm.channel_id
        }
      }).then(res => {
        this.articles = res.data.data.results
        this.totalCount = res.data.data.total_count
      }).catch(err => {
        console.log(err, '获取数据失败')
      }).finally(() => {
      // 无论成功失败都会执行这里
        this.loading = false
      })
    },
    onPageChange (page) {
      // 记录当前最新的页码
      this.page = page
      // 请求加载指定页码的文章列表
      this.loadArticles(page)
    },
    // loadChannels () {
    //   this.$axios({
    //     method: 'GET',
    //     url: '/channels'
    //   }).then(res => {
    //     this.channels = res.data.data.channels
    //   }).catch(err => {
    //     console.log(err, '数据获取失败')
    //   })
    // },
    onDelete (articleId) {
      // 这里报 400 错，是因为数据 id 的问题
      // 这个数据 id 不对
      this.$axios({
        method: 'DELETE',
        // /mp/v1_0/articles/:target
        // 注意：接口路径中的 :target 是一个路径参数，:target 是动态的，例如1、2、3，不要写 :
        url: `/articles/${articleId}` // 任何数据和字符串相加都会自动 toString
        // headers: {
        //   // 接口中说明的 Content-Type application/json 不需要传递
        //   // 因为 axios 会自动添加发送 Content-Type application/json
        //   Authorization: `Bearer ${window.localStorage.getItem('user-token')}`
        // }
      }).then(res => {
        // 删除成功，重新加载当前页码文章列表
        this.loadArticles(this.page)
      }).catch(err => {
        console.log(err, '删除失败')
      })
    }
  }
}
</script>

<style scoped lang='less'>
 .article {
  .box-card {
    margin-bottom: 20px;
  }
}
</style>
