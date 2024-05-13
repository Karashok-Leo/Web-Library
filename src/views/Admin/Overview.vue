<template>
    <div class="layout">
      <!-- 顶层四个卡片区域 -->
      <div class="top-cards">
        <el-card class="card" :span="6" v-for="(card, index) in topCards" :key="index">
          <div class="card-header">
            <span>{{ card.title }}</span>
            <el-tag :type="card.tagType">{{ card.tag }}</el-tag>
          </div>
          <el-divider />
          <div class="card-content">
            <div class="value">{{ card.value }}</div>
            <div class="description">{{ card.description }}</div>
          </div>
        </el-card>
      </div>
  
      <!-- 中间折线图显示一周访问量 -->
      <div class="middle-chart">
        <el-card class="chart-card" title="最近一周访问量">
          <span>最近一周访问量</span>
          <el-divider />
          <div class="echarts-box">
            <div id="lineEcharts" :style="{ width: '1800px', height: '300px' }"></div>
          </div>
        </el-card>
      </div>
  
      <!-- 底部两个区域，一个显示热门借阅排名柱状图，一个显示热门分类饼状图 -->
      <div class="bottom-charts">
        <el-card class="chart-card" title="热门借阅排名">
          <span>热门借阅排名"</span>
          <el-divider />
          <div class="echarts-box">
            <div id="barEcharts" :style="{ width: '600px', height: '300px' }"></div>
          </div>
        </el-card>
        <el-card class="chart-card" title="热门分类比例">
          <span>热门分类比例</span>
          <el-divider />
          <div class="echarts-box">
            <div id="pieEcharts" :style="{ width: '600px', height: '300px' }"></div>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup >
  import {ref, onMounted, onUnmounted} from 'vue';
  import {ElCard, ElMessage, ElTag} from 'element-plus';
  import * as echarts from 'echarts';
  import {getTopCardsService} from "@/api/overview.js";
  
  let lineChartInstance = null;
  let barChartInstance=null;
  let pieChart = null;
  const topCards = ref([
    { title: '图书总数', tag: '总', tagType: 'blue', value: 1000, description: '本周新增 100 种' },
    { title: '在借图书', tag: '借', tagType: 'green', value: 500, description: '共 300 人' },
    { title: '已还图书', tag: '还', tagType: 'blue', value: 300, description: '共 200 人' },
    { title: '逾期未还', tag: '逾', tagType: 'green', value: 50, description: '共 20 人' }
  ]);
  const barChartData = {
    categories: ['图书A', '图书B', '图书C', '图书D', '图书E'],
    seriesData: [150, 120, 200, 180, 160]
  };
  const pieChartData = {
    categories: ['小说', '历史', '科幻', '传记', '教育'],
    seriesData: [30, 20, 15, 10, 25]
  };

  const getTopCards =async () => {
    try {
      let result = await getTopCardsService();
      //将评论数据存储到Comments中，用于渲染视图
      topCards.value = result.data.data;
    } catch (error) {
      ElMessage({type: "error", message: "获取列表失败",});
    }
  }

  onMounted(() => {
    initChart();
    getTopCards();
  });
  
  onUnmounted(() => {
    if (lineChartInstance) {
      lineChartInstance.dispose();
    }
  });
  
  function initChart() {
    lineChartInstance = echarts.init(document.getElementById("lineEcharts"), {
      width: 1000,
      height: 200
    });
    lineChartInstance.setOption({
      xAxis: {
        type: "category",
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      tooltip: {
        trigger: "axis"
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [
            120, 200, 150, 80, 70, 110, 130
          ],
          type: "line",
          smooth: true
        }
      ]
    });
    barChartInstance = echarts.init(document.getElementById("barEcharts"), {
      width: 500,
      height: 200
    });
    barChartInstance.setOption({
      xAxis: { type: 'category', data: barChartData.categories },
      yAxis: { type: 'value' },
      series: [{ data: barChartData.seriesData, type: 'bar' }]
    })
    pieChart= echarts.init(document.getElementById("pieEcharts"), {
      width: 600,
      height: 360
    })
    pieChart.setOption({
      series: [{
        type: 'pie',
        radius: '55%',
        data: pieChartData.categories.map((category, index) => ({ name: category, value: pieChartData.seriesData[index] }))
      }]
    });
    window.onresize = function() {
      lineChartInstance.resize();
      barChartInstance.resize();
      pieChart.resize();
    };
  }
  </script>
  
  <style scoped>
  .layout { display: flex; flex-direction: column; height: 100%; }
  .top-cards { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .card { width: calc(25% - 10px); }
  .card-header { display: flex; justify-content: space-between; align-items: center; }
  .card-content { text-align: center; }
  .middle-chart { flex: 1; }
  .bottom-charts { display: flex; justify-content: space-between; }
  .chart-card { width: 100%; }
  .chart-container { height: 300px; }
  </style>
