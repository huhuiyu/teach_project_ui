import qs from 'qs'
import spark from 'spark-md5'

console.log(qs, spark.hash('user-pwd'))

const server = {}

export default server