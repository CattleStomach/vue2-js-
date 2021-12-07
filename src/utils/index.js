/**
 * Created by PanJiaChen on 16/11/18.
 */
/**
 *
 * @param {*} list 没有父子关系的部门数据
  * 数据结构：树形数据结构(父子嵌套关系)
  * 处理树形结构：找规律=》父子部门的关系
  * 后台数据规律：
  * 1. 父部门的pid是空（顶层）
  * 2. 子部门的pid有值=》是父部门的ID
 * @returns {Array} 返回部门的树形结构数据
 * 步骤：
 * 1. 定义一个空数组=》存储处理的数据
 * 2. 根据规律生成关系数据=>父子映射关系 =》{id: 部门数据}
 * 3. 根据关系数据遍历list查找父部门
 * 4. 返回处理完的树形结构
 */

export function formatTreeData (list) {
  const treeData = []
  // 处理逻辑
  // 1. 父子映射关系 =》拿部门ID作为属性，存储所有部门数据
  const maps = {}
  list.forEach(dept => {
    maps[dept.id] = dept
  })
  console.log('父子映射关系:', maps)
  // 2. 根据关系数据遍历list查找父部门
  list.forEach(dept => {
    // 排除公司数据
    if (parseInt(dept.pid) === -1) return
    // 遍历所有部门数据=》找父部门
    const parent = maps[dept.pid]
    console.log('所有的父：', parent)
    if (parent) {
      // 说明当前dept是个子部门
      if (!parent.children) {
        // 第一次初始化添加=> 没有children添加
        parent.children = []
      }
      // 加入子部门
      parent.children.push(dept)
    } else {
      // 顶层部门
      treeData.push(dept)
    }
  })
  console.log('部门树形数据：', treeData, list)
  return treeData
}

// excel时间格式化
/**
 *
 * @param {*} numb excel时间格式
 * @param {*} format 转换分隔符
 * @returns 标准时间格式
 */
export function formatExcelDate (numb, format) {
  // 天数
  const time = new Date((numb - 1) * 24 * 3600000 + 1)
  console.log(time)
  time.setYear(time.getFullYear() - 70)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() + ''
  // 转换的格式符号
  if (format && format.length === 1) {
    return year + format + month + format + date
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time date对象
 * @param {string} cFormat 格式化的格式 {y}-{m}-{d} {h}:{i}:{s}
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
