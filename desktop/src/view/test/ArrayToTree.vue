<template>
  <div> </div>
</template>

<script setup lang="ts">
const list = [
  {
    value: '430100',
    label: '长沙市',
    parent: '430000',
  },
  {
    value: '430000',
    label: '湖南省',
    parent: '-1',
  },
  {
    value: '430102',
    label: '芙蓉区',
    parent: '430100',
  },
  {
    value: '430103',
    label: '天心区',
    parent: '430100',
  },
  {
    value: '430104',
    label: '岳麓区',
    parent: '430100',
  },
  {
    value: '4400003',
    label: '孝感2',
    parent: '4400002',
  },
  {
    value: '4400002',
    label: '孝感1',
    parent: '4400001',
  },
  {
    value: '4400001',
    label: '孝感',
    parent: '440000',
  },
  {
    value: '440000',
    label: '湖北省',
    parent: '-1',
  },
  {
    value: '430105',
    label: '开福区',
    parent: '430100',
  },
  {
    value: '430111',
    label: '雨花区',
    parent: '430100',
  },
  {
    value: '430112',
    label: '望城区',
    parent: '430100',
  },
  {
    value: '430121',
    label: '长沙县',
    parent: '430100',
  },
  {
    value: '430181',
    label: '浏阳市',
    parent: '430100',
  },
  {
    value: '430182',
    label: '宁乡市',
    parent: '430100',
  },
  {
    value: '430200',
    label: '株洲市',
    parent: '430000',
  },
  {
    value: '430202',
    label: '荷塘区',
    parent: '430200',
  },
  {
    value: '430203',
    label: '芦淞区',
    parent: '430200',
  },
  {
    value: '430204',
    label: '石峰区',
    parent: '430200',
  },
  {
    value: '430211',
    label: '天元区',
    parent: '430200',
  },
  {
    value: '430212',
    label: '渌口区',
    parent: '430200',
  },
  {
    value: '430223',
    label: '攸县',
    parent: '430200',
  },
  {
    value: '430224',
    label: '茶陵县',
    parent: '430200',
  },
  {
    value: '430225',
    label: '炎陵县',
    parent: '430200',
  },
  {
    value: '430271',
    label: '云龙示范区',
    parent: '430200',
  },
  {
    value: '430281',
    label: '醴陵市',
    parent: '430200',
  },
  {
    value: '430300',
    label: '湘潭市',
    parent: '430000',
  },
  {
    value: '430302',
    label: '雨湖区',
    parent: '430300',
  },
  {
    value: '430304',
    label: '岳塘区',
    parent: '430300',
  },
  {
    value: '430321',
    label: '湘潭县',
    parent: '430300',
  },
  {
    value: '430371',
    label: '湖南湘潭高新技术产业园区',
    parent: '430300',
  },
  {
    value: '430372',
    label: '湘潭昭山示范区',
    parent: '430300',
  },
  {
    value: '430373',
    label: '湘潭九华示范区',
    parent: '430300',
  },
  {
    value: '430381',
    label: '湘乡市',
    parent: '430300',
  },
  {
    value: '430382',
    label: '韶山市',
    parent: '430300',
  },
  {
    value: '430400',
    label: '衡阳市',
    parent: '430000',
  },
  {
    value: '430405',
    label: '珠晖区',
    parent: '430400',
  },
  {
    value: '430406',
    label: '雁峰区',
    parent: '430400',
  },
  {
    value: '430407',
    label: '石鼓区',
    parent: '430400',
  },
  {
    value: '430408',
    label: '蒸湘区',
    parent: '430400',
  },
  {
    value: '430412',
    label: '南岳区',
    parent: '430400',
  },
  {
    value: '430421',
    label: '衡阳县',
    parent: '430400',
  },
  {
    value: '430422',
    label: '衡南县',
    parent: '430400',
  },
  {
    value: '430423',
    label: '衡山县',
    parent: '430400',
  },
  {
    value: '430424',
    label: '衡东县',
    parent: '430400',
  },
  {
    value: '430426',
    label: '祁东县',
    parent: '430400',
  },
  {
    value: '430471',
    label: '衡阳综合保税区',
    parent: '430400',
  },
  {
    value: '430472',
    label: '湖南衡阳高新技术产业园区',
    parent: '430400',
  },
  {
    value: '430472001',
    label: '湖南衡阳高新技术产业园区001',
    parent: '430472',
  },
  {
    value: '430473',
    label: '湖南衡阳松木经济开发区',
    parent: '430400',
  },
  {
    value: '430481',
    label: '耒阳市',
    parent: '430400',
  },
  {
    value: '430482',
    label: '常宁市',
    parent: '430400',
  },
  {
    value: '430500',
    label: '邵阳市',
    parent: '430000',
  },
  {
    value: '430502',
    label: '双清区',
    parent: '430500',
  },
  {
    value: '430503',
    label: '大祥区',
    parent: '430500',
  },
  {
    value: '430511',
    label: '北塔区',
    parent: '430500',
  },
  {
    value: '430522',
    label: '新邵县',
    parent: '430500',
  },
  {
    value: '430523',
    label: '邵阳县',
    parent: '430500',
  },
  {
    value: '430524',
    label: '隆回县',
    parent: '430500',
  },
  {
    value: '430525',
    label: '洞口县',
    parent: '430500',
  },
  {
    value: '430527',
    label: '绥宁县',
    parent: '430500',
  },
  {
    value: '430528',
    label: '新宁县',
    parent: '430500',
  },
  {
    value: '430529',
    label: '城步苗族自治县',
    parent: '430500',
  },
  {
    value: '430581',
    label: '武冈市',
    parent: '430500',
  },
  {
    value: '430582',
    label: '邵东市',
    parent: '430500',
  },
  {
    value: '430600',
    label: '岳阳市',
    parent: '430000',
  },
  {
    value: '430602',
    label: '岳阳楼区',
    parent: '430600',
  },
  {
    value: '430603',
    label: '云溪区',
    parent: '430600',
  },
  {
    value: '430611',
    label: '君山区',
    parent: '430600',
  },
  {
    value: '430621',
    label: '岳阳县',
    parent: '430600',
  },
  {
    value: '430623',
    label: '华容县',
    parent: '430600',
  },
  {
    value: '430624',
    label: '湘阴县',
    parent: '430600',
  },
  {
    value: '430626',
    label: '平江县',
    parent: '430600',
  },
  {
    value: '430671',
    label: '岳阳市屈原管理区',
    parent: '430600',
  },
  {
    value: '430681',
    label: '汨罗市',
    parent: '430600',
  },
  {
    value: '430682',
    label: '临湘市',
    parent: '430600',
  },
  {
    value: '430700',
    label: '常德市',
    parent: '430000',
  },
  {
    value: '430702',
    label: '武陵区',
    parent: '430700',
  },
  {
    value: '430703',
    label: '鼎城区',
    parent: '430700',
  },
  {
    value: '430721',
    label: '安乡县',
    parent: '430700',
  },
  {
    value: '430722',
    label: '汉寿县',
    parent: '430700',
  },
  {
    value: '430723',
    label: '澧县',
    parent: '430700',
  },
  {
    value: '430724',
    label: '临澧县',
    parent: '430700',
  },
  {
    value: '430725',
    label: '桃源县',
    parent: '430700',
  },
  {
    value: '430726',
    label: '石门县',
    parent: '430700',
  },
  {
    value: '430771',
    label: '常德市西洞庭管理区',
    parent: '430700',
  },
  {
    value: '430781',
    label: '津市市',
    parent: '430700',
  },
  {
    value: '430800',
    label: '张家界市',
    parent: '430000',
  },
  {
    value: '430802',
    label: '永定区',
    parent: '430800',
  },
  {
    value: '430811',
    label: '武陵源区',
    parent: '430800',
  },
  {
    value: '430821',
    label: '慈利县',
    parent: '430800',
  },
  {
    value: '430822',
    label: '桑植县',
    parent: '430800',
  },
  {
    value: '430900',
    label: '益阳市',
    parent: '430000',
  },
  {
    value: '430902',
    label: '资阳区',
    parent: '430900',
  },
  {
    value: '430903',
    label: '赫山区',
    parent: '430900',
  },
  {
    value: '430921',
    label: '南县',
    parent: '430900',
  },
  {
    value: '430922',
    label: '桃江县',
    parent: '430900',
  },
  {
    value: '430923',
    label: '安化县',
    parent: '430900',
  },
  {
    value: '430971',
    label: '益阳市大通湖管理区',
    parent: '430900',
  },
  {
    value: '430972',
    label: '湖南益阳高新技术产业园区',
    parent: '430900',
  },
  {
    value: '430981',
    label: '沅江市',
    parent: '430900',
  },
  {
    value: '431000',
    label: '郴州市',
    parent: '430000',
  },
  {
    value: '431002',
    label: '北湖区',
    parent: '431000',
  },
  {
    value: '431003',
    label: '苏仙区',
    parent: '431000',
  },
  {
    value: '431021',
    label: '桂阳县',
    parent: '431000',
  },
  {
    value: '431022',
    label: '宜章县',
    parent: '431000',
  },
  {
    value: '431023',
    label: '永兴县',
    parent: '431000',
  },
  {
    value: '431024',
    label: '嘉禾县',
    parent: '431000',
  },
  {
    value: '431025',
    label: '临武县',
    parent: '431000',
  },
  {
    value: '431026',
    label: '汝城县',
    parent: '431000',
  },
  {
    value: '431027',
    label: '桂东县',
    parent: '431000',
  },
  {
    value: '431028',
    label: '安仁县',
    parent: '431000',
  },
  {
    value: '431081',
    label: '资兴市',
    parent: '431000',
  },
  {
    value: '431100',
    label: '永州市',
    parent: '430000',
  },
  {
    value: '431102',
    label: '零陵区',
    parent: '431100',
  },
  {
    value: '431103',
    label: '冷水滩区',
    parent: '431100',
  },
  {
    value: '431122',
    label: '东安县',
    parent: '431100',
  },
  {
    value: '431123',
    label: '双牌县',
    parent: '431100',
  },
  {
    value: '431124',
    label: '道县',
    parent: '431100',
  },
  {
    value: '431125',
    label: '江永县',
    parent: '431100',
  },
  {
    value: '431126',
    label: '宁远县',
    parent: '431100',
  },
  {
    value: '431127',
    label: '蓝山县',
    parent: '431100',
  },
  {
    value: '431128',
    label: '新田县',
    parent: '431100',
  },
  {
    value: '431129',
    label: '江华瑶族自治县',
    parent: '431100',
  },
  {
    value: '431171',
    label: '永州经济技术开发区',
    parent: '431100',
  },
  {
    value: '431173',
    label: '永州市回龙圩管理区',
    parent: '431100',
  },
  {
    value: '431181',
    label: '祁阳市',
    parent: '431100',
  },
  {
    value: '431200',
    label: '怀化市',
    parent: '430000',
  },
  {
    value: '431202',
    label: '鹤城区',
    parent: '431200',
  },
  {
    value: '431221',
    label: '中方县',
    parent: '431200',
  },
  {
    value: '431222',
    label: '沅陵县',
    parent: '431200',
  },
  {
    value: '431223',
    label: '辰溪县',
    parent: '431200',
  },
  {
    value: '431224',
    label: '溆浦县',
    parent: '431200',
  },
  {
    value: '431225',
    label: '会同县',
    parent: '431200',
  },
  {
    value: '431226',
    label: '麻阳苗族自治县',
    parent: '431200',
  },
  {
    value: '431227',
    label: '新晃侗族自治县',
    parent: '431200',
  },
  {
    value: '431228',
    label: '芷江侗族自治县',
    parent: '431200',
  },
  {
    value: '431229',
    label: '靖州苗族侗族自治县',
    parent: '431200',
  },
  {
    value: '431230',
    label: '通道侗族自治县',
    parent: '431200',
  },
  {
    value: '431271',
    label: '怀化市洪江管理区',
    parent: '431200',
  },
  {
    value: '431281',
    label: '洪江市',
    parent: '431200',
  },
  {
    value: '431300',
    label: '娄底市',
    parent: '430000',
  },
  {
    value: '431302',
    label: '娄星区',
    parent: '431300',
  },
  {
    value: '431321',
    label: '双峰县',
    parent: '431300',
  },
  {
    value: '431322',
    label: '新化县',
    parent: '431300',
  },
  {
    value: '431381',
    label: '冷水江市',
    parent: '431300',
  },
  {
    value: '431382',
    label: '涟源市',
    parent: '431300',
  },
  {
    value: '433100',
    label: '湘西土家族苗族自治州',
    parent: '430000',
  },
  {
    value: '433101',
    label: '吉首市',
    parent: '433100',
  },
  {
    value: '433122',
    label: '泸溪县',
    parent: '433100',
  },
  {
    value: '433123',
    label: '凤凰县',
    parent: '433100',
  },
  {
    value: '433124',
    label: '花垣县',
    parent: '433100',
  },
  {
    value: '433125',
    label: '保靖县',
    parent: '433100',
  },
  {
    value: '433126',
    label: '古丈县',
    parent: '433100',
  },
  {
    value: '433127',
    label: '永顺县',
    parent: '433100',
  },
  {
    value: '433130',
    label: '龙山县',
    parent: '433100',
  },
]

const arrToTree1 = (arr: Array<any>) => {
  let objMap = {}
  let result = [] as any

  arr.forEach((element) => {
    /* 
    430001 43000
    430001=[]
    430001.children = 430001=[]
    43000=[]
    43000=[430001]
    */
    //没有找到直接赋值key=[]
    if (!objMap[element.value]) {
      objMap[element.value] = []
    }
    //找到直接将当前对象将当前对象设置为当前对象子
    if (objMap[element.value]) {
      element.children = objMap[element.value]
    }
    //父节点部位顶级给父节点添加进去父节点:[]
    if (element.parent != '-1') {
      if (!objMap[element.parent]) {
        objMap[element.parent] = []
      }
      //找到父节点将对象添加进入
      objMap[element.parent].push(element)
    }
    //顶级节点直接添加到返回数组
    if (element.parent == '-1') {
      result.push(element)
    }
  })
  console.log(Object.keys(objMap).length)

  return result
}

console.log('==========>', arrToTree1(list))
//流式api
const arrToTree = (arr: any) => {
  console.log(arr)
  //转换后返回的对象
  let parent = new Array()
  //存放所有数据，key为所有数据唯一的值，方便后续查找，对比
  let obj = new Map()
  //第一次遍历将传入的数据添加到obj
  arr.forEach((item: any) => {
    // console.log(item)
    obj.set(item.value, item)
  })
  console.log('map', obj)
  //第二次遍历
  arr.forEach((item: any) => {
    //记录当前遍历属性父元素信息，方便使用，
    const par = obj.get(item.parent)
    //判断是否拥有父元素，如果没有视为顶级元素，直接添加到需返回的数组
    if (par) {
      //判断是元素是否拥有children数组，没有则添加
      if (!par.children) {
        par.children = []
      }
      par.children.push(item)
    } else {
      parent.push(item)
    }
  })
  return parent
}
//递归
const arrayRTree = (map: any, element: any, root: any) => {
  console.log('citys root:======>', root, element)
  if (!root) {
    return
  }
  console.log('citys:======>', root, element, map.get(element.parent))
  let citys = map.get(element.parent)
  console.log('citys1111111111111>', root, element, citys)
  if (element.parent == root.value) {
    root.children.add(element)
  } else {
    citys.children.add(element)
    // 否则向上查找
    arrayRTree(map, citys, map.get(citys.parent))
  }
}
//chatGpT流式
const arrToTreeByChatGpt = (arr: any) => {
  // 定义一个字典来存储节点对象和它们的id
  let nodes = {}
  // 遍历数组并构建节点对象
  arr.forEach((item: any) => {
    nodes[item.value] = { ...item, children: [] }
  })
  // 遍历节点对象并将子节点添加到父节点的children数组中
  Object.values(nodes).forEach((node: any) => {
    if (node.parent) {
      nodes[node.parent].children.push(node)
    }
  })
  // 返回根节点数组
  return Object.values(nodes).filter((node: any) => !node.parent)
}
//chatGpi递归
const arrayRTreeByChatGpt = (arr: any, parent_id: any) => {
  let tree = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].parent === parent_id) {
      let node = arr[i]
      node.children = arrayRTreeByChatGpt(arr, node.value)
      tree.push(node)
    }
  }
  return tree
}
// let set = new Set()
// set.add(new Citys('430000', '湖南', '-1', new Set()))
// set.add(new Citys('440000', '湖北', '-1', new Set()))
// console.log('set======>', set)
// let datas = new Array()
// this.list.forEach((item) => {
//   let citys = new Citys(item.value, item.label, item.parent + '', new Set())
//   datas.push(citys)
// })
// console.log('obj:', datas)
// let map = new Map()
// datas.forEach((item) => {
//   map.set(item.value, item)
// })
// let root = new Citys('-1', '', '-2', new Set())
// map.set('-1', root)
// console.log('citys   ====    map', map, map.get('-1'))
// datas.forEach((item) => {
//   this.arrayRTree(map, item, root)
// })
// console.log(root.children)
// this.datar = root.children
// console.log('result=====>', this.datar, count)
// // let result = new Array()
// // this.arrayRTree(datas, map, -1, result)
// // console.log('++++++++++++++', result)
// // let arrayr = []
// // this.arraryRTree(this.list, -1, arrayr, new Map())
// // console.log('=============================')
// // console.log(arrayr)
//将一个平铺的数组转换为树状结构数组
</script>

<style scoped></style>
