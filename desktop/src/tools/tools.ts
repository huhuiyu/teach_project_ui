import sparkMd5 from 'spark-md5'

let tools = {
  md5: (info: string) => {
    return info.trim().length > 0 ? sparkMd5.hash(info) : ''
  },
  changeTitle: (title: string) => {
    const eletitle = document.querySelector('head > title');
    if (eletitle) {
      eletitle.innerHTML = '胡辉煜教学项目' + title;
    }
  }
}

export default tools