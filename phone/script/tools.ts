import sparkMd5 from 'spark-md5'

let tools = {
	md5: (info: string) => {
		return info.trim().length > 0 ? sparkMd5.hash(info) : ''
	},
	// 格式化日期
	formatDate: (value: Date | Number, format = 'yyyy-MM-dd hh:mm:ss') => {
		try {
			let time = new Date()
			if (typeof value === 'number') {
				time.setTime(parseInt(value.toString()))
			} else if (value instanceof Date) {
				time = value
			}
			let year = time.getFullYear() + ''
			let month = time.getMonth() + 1 + ''
			let day = time.getDate() + ''
			let hour = time.getHours() + ''
			let minute = time.getMinutes() + ''
			let second = time.getSeconds() + ''
			let ms = time.getMilliseconds() + ''
			month = month.padStart(2, '0')
			day = day.padStart(2, '0')
			hour = hour.padStart(2, '0')
			minute = minute.padStart(2, '0')
			second = second.padStart(2, '0')
			ms = ms.padStart(3, '0')

			format = format.replace(/yyyy/g, year)
			format = format.replace(/MM/g, month)
			format = format.replace(/dd/g, day)
			format = format.replace(/hh/g, hour)
			format = format.replace(/mm/g, minute)
			format = format.replace(/ss/g, second)
			format = format.replace(/ms/g, ms)
			return format
		} catch (ex) {
			console.error(ex)
			return ''
		}
	},
	// 格式化显示文件大小
	formatFileSize: (filesize: number) => {
		console.debug('in filesize====>', filesize)
		if (filesize === 0) {
			return '0 B'
		}
		let k = 1024
		//单位值
		let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		let i = Math.floor(Math.log(filesize) / Math.log(k))
		//.toPrecision(3)
		return (filesize / Math.pow(k, i)).toFixed(1) + '' + sizes[i]
	},
	// 合并json
	concatJson: (...jsons: any) => {
		let json = {}
		for (let index = 0; index < jsons.length; index++) {
			const element = jsons[index]
			for (let key in element) {
				json[key] = element[key]
			}
		}
		return json
	},
	regValidate: (value: string, reg: RegExp) => {
		console.log(value)
		let result: boolean = false
		if (reg.test(value)) {
			console.log(reg.test(value))
			result = true
		} else {
			result = false
		}
		return result
	}
}

export default tools
