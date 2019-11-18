<template>
  <div class="channel-select">
    <el-select
      :value="value"
      @input="onInput"
      placeholder="请选择活动区域">
      <el-option
        :label="channel.name"
        :value="channel.id"
        v-for="channel in channels"
        :key="channel.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  // created () {
  //   console.log('123')
  // },
  name: 'ChannelSelect',
  data () {
    return {
      channels: []
    }
  },
  props: {
    value: {
      // type: [String, Number],
      required: true
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    loadChannels () {
      // 有些接口需要 token，有些接口不需要 token
      // 是否需要，应该由接口文档指示
      this.$axios({
        method: 'GET',
        url: '/channels'
      }).then(res => {
        this.channels = res.data.data.channels
      }).catch(err => {
        console.log(err, '获取数据失败')
      })
    },
    onInput (data) {
      this.$emit('input', data)
    }
  }
}
</script>

<style>

</style>
