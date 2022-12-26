<template>
  <div class="body">
    <!-- {{ title }} -->
    <!-- 电脑版本 -->
    <!-- 图形靠左 -->
    <div class="flex_box">
      <div>
        <!-- canvas画布 -->
        <div class="box">
          <canvas id="canvas"></canvas>
        </div>
        <!-- 404的icon -->
        <div class="lost_logo">
          <div class="iconfont">&#xe635;</div>
        </div>
        <!-- 返回按钮 -->
        <div class="box">
          <button class="btn iconfont" @click="backToIndex"> &#xe623;返回首页</button>
        </div>
      </div>
      <!-- 宇航员靠右 -->
      <div class="rt_man">
        <i class="iconfont">&#xe601;</i>
      </div>
    </div>

    <!-- ========================== 手机版本 ============================== -->
    <div class="phone_box">
      <!-- 垂直居中 -->
      <div class="phone_content">
        <div class="phone_yhy">
          <i class="iconfont">&#xe601;</i>
        </div>
        <!-- 404字和icon -->
        <div class="phone_icon">
          <div class="iconfont">&#xe635;</div>
        </div>
        <!-- 文字 -->
        <div class="phone_zi">
          <div class="phone_z01">ohh！该页面已丢失</div>
          <div class="phone_z02">您所寻找的页面不存在。你可以点击下面的按钮，返回主页。</div>
        </div>
        <!-- 返回首页按钮 -->
        <div>
          <button class="phone_btn iconfont" @click="backToPhoneIndex">&#xe623;&nbsp;返回首页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let canvas
let ctx
export default {
  name: 'Template',
  data() {
    return {
      title: '教学演示-网站迷路了',
    }
  },
  methods: {
    backToPhoneIndex() {
      this.$router.push('/phone/home')
    },
    backToIndex() {
      this.$router.push('/')
    },
    initCanvas() {
      this.$logger.debug('初始化canvas')
      canvas = document.getElementById('canvas')
      ctx = canvas.getContext('2d')
      // 屏幕高宽
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      this.drawmoon()
      this.drawcircle()
    },
    drawmoon() {
      //void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
      //x圆弧中心（圆心）的 x 轴坐标,y圆弧中心（圆心）的 y 轴坐标,radius半径
      // startAngle圆弧的起始点， x轴方向开始计算，单位以弧度表示。
      // endAngle圆弧的终点， 单位以弧度表示。
      // anticlockwise 可选 可选的Boolean值 ，如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
      // 开始绘画
      // 月球
      ctx.beginPath()
      ctx.arc(canvas.width / 5, canvas.height / 4, 500, 0, 2 * Math.PI)
      ctx.shadowOffsetX = 10
      ctx.shadowOffsetY = 8
      ctx.shadowBlur = 2
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.fillStyle = '#cacaca'
      ctx.strokeStyle = 'transparent'
      ctx.fill()
      ctx.stroke()
      // 里面的小圆1
      ctx.beginPath()
      let mycolor = ctx.createLinearGradient(canvas.width / 13, canvas.height / 12, 50, 0, 2 * Math.PI)
      mycolor.addColorStop(0, '#a2a2a2')
      mycolor.addColorStop(1, 'white')
      ctx.arc(canvas.width / 13, canvas.height / 12, 50, 0, 2 * Math.PI)
      // 阴影xy轴
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      // 模糊，默认为0
      ctx.shadowBlur = 0
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
      ctx.strokeStyle = 'transparent'
      ctx.fillStyle = mycolor
      ctx.fill()
      ctx.stroke()
      // 圆2
      ctx.beginPath()
      let color = ctx.createLinearGradient(canvas.width / 2.5, canvas.height / 10, 36, 100, 90, 0, Math.PI * 2)
      color.addColorStop(0.1, '#a2a2a2')
      color.addColorStop(0.5, 'white')
      ctx.arc(canvas.width / 2.9, canvas.height / 2, 45, 0, 2 * Math.PI)
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.shadowBlur = 0
      ctx.strokeStyle = 'transparent'
      ctx.fillStyle = color
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()

      if (ctx.ellipse) {
        // createLinearGradient(x,y,x1,y1) - 创建线条渐变
        // createRadialGradient(x,y,r,x1,y1,r1) - 创建一个径向/圆渐变
        let mycolor = ctx.createLinearGradient(canvas.width / 2.5, canvas.height / 10, 36, 100, 90, 0, Math.PI * 2)
        mycolor.addColorStop(0, '#a2a2a2')
        mycolor.addColorStop(1, 'white')
        // x,y,宽，高，倾斜角度，显示大小
        ctx.ellipse(canvas.width / 2.5, canvas.height / 10, 36, 100, 90, 0, Math.PI * 2)
        ctx.fillStyle = mycolor
        ctx.strokeStyle = 'transparent'
        ctx.fill()
        ctx.stroke()
      } else {
        alert('no ellipse!')
      }
      // 文字
      ctx.beginPath()
      ctx.font = '25px serif'
      ctx.fillStyle = '#000'
      ctx.strokeStyle = 'transparent'
      ctx.fill()
      ctx.stroke()
      ctx.fillText('uh ho!看来迷路了', canvas.width / 7, canvas.height / 1.8)
      ctx.fillText('请点击按钮返回首页', canvas.width / 7, canvas.height / 1.6)
    },
    drawcircle() {
      ctx.beginPath()
      ctx.arc(canvas.width / 1.6, canvas.height / 6, 6, 0, 2 * Math.PI)
      ctx.fillStyle = '#acacac'
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(canvas.width / 1.2, canvas.height / 8, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(canvas.width / 1.4, canvas.height / 1.5, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 1.2, 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    },
  },
  mounted() {
    this.initCanvas()
    // 当调整窗口大小时重绘canvas
    window.onresize = () => {
      this.initCanvas()
    }
  },
}
</script>

<style scoped>
/* 0-768 */
@media screen and (max-width: 768px) {
  .body {
    background: radial-gradient(200% 100% at bottom center, #f8f8ce, #f09ab2, #9e6fa9, #364b78);
    background: radial-gradient(220% 105% at top center, #364b78 10%, #9e6fa9 40%, #f09ab2 65%, #f8f8ce);
  }
  .body > .flex_box {
    display: none;
  }
  .phone_box {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 主内容 */
  .phone_box > .phone_content {
    display: flex;
    justify-content: center;
    /* 竖直显示 */
    flex-direction: column;
    align-items: center;
  }
  /* 404图标 */
  .phone_icon {
    font-size: 12rem;
    color: #000;
  }
  /* 宇航员 */
  .phone_yhy {
    font-size: 5rem;
    animation: picon 2000ms infinite;
  }
  @keyframes picon {
    0% {
      transform: scaleX(0);
      color: #6f6f6f;
    }
    50% {
      transform: scaleX(1);
      color: #000;
    }
    100% {
      transform: scaleX(0);
      color: #6f6f6f;
    }
  }
  .phone_zi {
    text-align: center;
  }
  .phone_z01 {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .phone_z02 {
    font-size: 0.6rem;
  }
  /* 返回按钮 */
  .phone_btn {
    border: 2px solid #364b78;
    color: #fff;
    border-radius: 2rem;
    background: #364b78;
    box-shadow: 3px 4px 3px #000;
    padding: 10px 20px;
    margin-top: 1rem;
    position: relative;
  }
}

.body {
  overflow: hidden;
  height: 100vh;
}
canvas {
  background-color: #272d35;
}
.flex_box {
  position: relative;
  display: flex;
}
.flex_box > div {
  justify-content: space-between;
}
.box {
  position: absolute;
}

.lost_logo {
  position: relative;
  font-size: 20rem;
  left: 30%;
  top: 20%;
}
.btn {
  position: relative;
  left: 17rem;
  top: 12rem;
  background-color: black;
  color: white;
  border: none;
  border-radius: 1.5rem;
  width: 130px;
  height: 50px;
  font-size: 1rem;
}
.btn:hover {
  animation: button 3s infinite;
}
@keyframes button {
  0% {
    background-color: black;
    color: white;
  }
  50% {
    background-color: white;
    color: black;
  }
  100% {
    background-color: gray;
    color: white;
  }
}
.rt_man {
  font-size: 30rem;
  /* background-color: rgb(205, 218, 218); */
  right: 0;
  color: #0fbfdf;
  position: absolute;
  animation: man 4s infinite;
}

@keyframes man {
  0% {
    /* translateX x轴平移 rotate(0deg) 旋转角度 */
    transform: translateX(0px) rotate(0deg);
  }
  25% {
    transform: translateX(-100px) rotate(80deg);
  }
  50% {
    transform: translateX(-200px) rotate(160deg);
  }
  75% {
    transform: translateX(-100px) rotate(280deg);
  }
  100% {
    transform: translateX(0px) rotate(360deg);
  }
}
</style>
