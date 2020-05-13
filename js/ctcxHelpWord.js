
var ctcxHelpWordJs = {
	op: {
		"yd": [{
			name: "string",
			area: 0,
			proportion: 0
		}],
		"rk": {
			total: 0,
			arr: [
				{
					name: "string",
					num: 0,
					proportion: 0
				}
			]
		},
		"jz": {
			total: 0,
			totalArea: 0,
			"lwz": [{
				name: "string",
				num: 0,
				proportion: 0,
				area: 0
			}],
			"cwz": [{
				name: "string",
				num: 0,
				proportion: 0,
				area: 0
			}]

		},
		"qs": {
			total: 0,
			totalArea: 0,
			proportion: 0,
			arr: [{
				name: "string",
				area: 0,
				Proportion: 0
			}]

		},
		"td": {
			"gy": {
				totalNum: 0,
				totalArea: 0,
				proportion: 0,
				arr: [{
					name: "string",
					area: 0,
				}]

			},
			"cb": {
				totalNum: 0,
				totalArea: 0,
				proportion: 0
			}
		}


	},
	"jzDictionary": {
		"JR": "居住建筑",
		"JA": "行政办公建筑",
		"JA1": "行政办公建筑",
		"JA2": "化设施建筑",
		"JA3": "教育科研建筑",
		"JA4": "体育建筑",
		"JA5": "医疗卫生建筑",
		"JA6": "社会福利设施建筑",
		"JA7": "文物古迹建筑",
		"JA8": "特殊建筑",
		"JA9": "宗教建筑",
		"JB": "商业服务业建筑",
		"JM": "工业建筑",
		"JW": "物流仓储建筑",
		"JS": "城市交通设施用房",
		"JU": "公用设施用房"
	},
	edbgDictionary: {
		"城镇用地": {
			"201": true,
			"202": true,
			"203": true,
			"204": true,
			"101": true,
			"102": true,
			"105": true,
			"106": true,
			"107": true,
			"113": true,
			"118": true,
			"205": true

		},
		"城镇建设用地": {
			"201": true,
			"202": true
		},
		"农用地": {
			"011": true,
			"012": true,
			"013": true,
			"021": true,
			"022": true,
			"023": true,
			"031": true,
			"032": true,
			"033": true,
			"041": true,
			"043": true,
			"122": true,
			"104": true,
			"114": true,
			"117": true
		},
		"耕地": {
			"011": true,
			"012": true,
			"013": true

		},
		"林地": {
			"031": true,
			"032": true,
			"033": true
		}
	},
	ctcxServeObj: {
		"现状用地": {
			"url": "http://tdxx.wpl:6080/arcgis/rest/services/FZSYS/TDLYXZ2018/MapServer",
			"layerIds": [
				1
			],
			"outFields": ["DLBM"],
			"returnGeometry": true,
			"funType": "xzyd"
		},
		"现状人口": {
			"url": "http://whgis.wpl:8010/ServiceAdapter/MAP/%E6%9C%80%E5%B0%8F%E7%A9%BA%E9%97%B4%E5%8D%95%E5%85%832018%E5%B9%B4%E4%BA%BA%E5%8F%A3%E7%BB%9F%E8%AE%A1/5606b7d46861a2078fd4a6369ff2ea6c",
			"layerIds": [
				0
			],
			"outFields": ["FREQUENCY", "Age0_14", "Age15_64", "Age65up"],
			"dictionary": {
				"0-14岁": "Age0_14",
				"15-64岁": "Age15_64",
				"65岁以上": "Age65up"
			},
			"returnGeometry": true,
			"funType": "xzrk"
		},
		"现状建筑": {
			"url": "http://192.168.213.153:6080/arcgis/rest/services/FZJZ_TILE/%E4%BB%BF%E7%9C%9F%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%BB%BA%E7%AD%91%E5%9F%BA%E7%A1%80%E6%95%B0%E6%8D%AE_TILE/MapServer",
			"layerIds": [
				0, 1, 2, 3, 4, 5, 6, 7, 8
			],
			"outFields": ["建筑面积", "地上层数", "建筑用途"],
			"returnGeometry": false,
			"funType": "xzjz"
		},
		// "现状权属": {
		// 	"url": "http://whgis.wpl:8010/ServiceAdapter/MAP/SYQWH2000new1(%E5%88%87%E7%89%87%EF%BC%89/19534274a9897b8880845a14268558c3",
		// 	"layerIds": [
		// 		0
		// 	],
		// 	"outFields": ["QLR", "Shape_Area"],
		// 	"returnGeometry": false,
		// 	"funType": "xzcs"
		// },
		"土地信息": {
			"gy": {
				"url": "http://tdxx.wpl:6080/arcgis/rest/services/FZSYS/tdgy/MapServer",
				"layerIds": [
					0
				],
				"outFields": ["标准土地用途"],
				"returnGeometry": true,
				"funType": "gy"
			},
			"cb": {
				"url": "http://192.168.31.199:6080/arcgis/rest/services/TDCB/MapServer",
				"layerIds": [
					0
				],
				"outFields": ["OBJECTID"],
				"returnGeometry": true,
				"funType": "cb"
			}
		}
	},
	ctcxHelpWord: function (geo, mapO) {
		ctcxHelpWordJs.op.yd = []
		ctcxHelpWordJs.op.rk = {
			"total": 0,
			"arr": []
		}
		ctcxHelpWordJs.op.jz = {
			"total": 0,
			"lwz": [],
			"cwz": []
		}
		ctcxHelpWordJs.op.qs = {
			total: 0,
			totalArea: 0,
			proportion: 0,
			arr: []

		}
		ctcxHelpWordJs.op.td = {
			"gy": {
				totalNum: 0,
				totalArea: 0,
				proportion: 0,
				arr: []

			},
			"cb": {
				totalNum: 0,
				totalArea: 0,
				proportion: 0
			}
		}

		return new Promise(function (reslove, reject) {
			ctcxHelpWordJs.isOk = 0
			ctcxHelpWordJs.mapOperator = mapO
			ctcxHelpWordJs.geo = geo

			var _p = [];
			for (let key in ctcxHelpWordJs.ctcxServeObj) {
				var p1;
				switch (key) {
					case "土地信息":
						for (let keyTd in ctcxHelpWordJs.ctcxServeObj[key]) {
							if (keyTd == "gy") {
								p1 = ctcxHelpWordJs.IdentifyTaskHelp(ctcxHelpWordJs.ctcxServeObj[key][keyTd], ctcxHelpWordJs[ctcxHelpWordJs.ctcxServeObj[key][keyTd].funType])
							} else {
								p1 = ctcxHelpWordJs.queryTaskHelp(ctcxHelpWordJs.ctcxServeObj[key][keyTd], ctcxHelpWordJs[ctcxHelpWordJs.ctcxServeObj[key][keyTd].funType])
							}

							_p.push(p1)
						}
						break;
					default:
						p1 = ctcxHelpWordJs.queryTaskHelp(ctcxHelpWordJs.ctcxServeObj[key], ctcxHelpWordJs[ctcxHelpWordJs.ctcxServeObj[key].funType])
						_p.push(p1)
						break;
				}

			}


			Promise.all(_p).then((result) => {
				reslove(ctcxHelpWordJs.op)
			})

		})
	},
	queryTaskHelp: function (ctcxServe, fun) {
		var p = new Promise((resolve, reject) => {
			try {
				urlStr = ctcxServe.url
				layerIds = ctcxServe.layerIds
				outFields = ctcxServe.outFields
				returnGeometry = ctcxServe.returnGeometry

				var responseNum = 0
				var responseLength = layerIds.length
				var features = []

				for (let i = 0; i < layerIds.length; i++) {
					let queryTask = new ctcxHelpWordJs.mapOperator.types.QueryTask({
						url: urlStr + '/' + layerIds[i],
					});
					let que = new ctcxHelpWordJs.mapOperator.types.Query();
					que.geometry = ctcxHelpWordJs.geo;
					que.spatialRelationship = "intersects";
					que.outFields = outFields;
					que.geometryPrecision = 6
					que.returnGeometry = returnGeometry;
					queryTask.execute(que).then((response) => {
						features = features.concat(response.features)
						responseNum++
						if (responseNum == responseLength) {
							resolve();
							try {
								fun(features)
							}
							catch (e) {
								console.log(e);
							}


						}

					}, (err) => {
						console.log(err)
						resolve()
					})
				}
			} catch (e) {
				console.log(e);
			}

		})
		return p;

	},
	IdentifyTaskHelp(ctcxServe, fun) {
		var p = new Promise((resolve, reject) => {
			urlStr = ctcxServe.url
			layerIds = ctcxServe.layerIds
			//outFields = ctcxServe.outFields
			returnGeometry = ctcxServe.returnGeometry


			let idenParam = new ctcxHelpWordJs.mapOperator.types.IdentifyParameters();
			idenParam.layerIds = layerIds;
			idenParam.mapExtent = ctcxHelpWordJs.mapOperator.view.extent;
			idenParam.returnGeometry = returnGeometry;
			idenParam.geometry = ctcxHelpWordJs.geo;
			idenParam.tolerance = 1;
			//定义IdentifyTask对象
			let idenTask = new ctcxHelpWordJs.mapOperator.types.IdentifyTask(decodeURIComponent(urlStr));
			//执行方法
			idenTask.execute(idenParam).then(
				response => {
					resolve();
					try {
						fun(response.results)
					}
					catch (e) {
						console.log(e);
					}
				},
				err => {
					console.log(err)
					resolve()
				}
			)
		})
		return p;
	},
	xzyd: function (features) {
		var attrObj = {}
		var totalArea = 0
		var outFields = ctcxHelpWordJs.ctcxServeObj["现状用地"]["outFields"][0]
		var range = Math.abs(ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(ctcxHelpWordJs.geo, "hectares"));
		for (let j = 0; j < features.length; j++) {
			var attr = features[j]["attributes"][outFields]
			var primary_mj = Math.abs(ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(features[j].geometry, 'hectares'))
			var intersect_geo = ctcxHelpWordJs.mapOperator.types.geoEngine.intersect(ctcxHelpWordJs.geo, features[j].geometry);
			var intersect_mj = ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
			for (let key in ctcxHelpWordJs.edbgDictionary) {
				if (!attrObj[key]) {
					attrObj[key] = 0
				}
				if (ctcxHelpWordJs.edbgDictionary[key][attr]) {
					attrObj[key] += intersect_mj
				}
			}
			totalArea += intersect_mj
		}
		for (let key in attrObj) {
			ctcxHelpWordJs.op.yd.push(
				{
					name: key,
					area: attrObj[key],
					proportion: (attrObj[key] / totalArea) * 100
				}
			)

		}
		ctcxHelpWordJs.isOk++
	},
	xzrk: function (features) {
		var attrObj = {};
		var totalNum = 0
		var dictionary = ctcxHelpWordJs.ctcxServeObj["现状人口"]["dictionary"]
		var outFields = ctcxHelpWordJs.ctcxServeObj["现状人口"]["outFields"][0]
		for (let j = 0; j < features.length; j++) {
			var primary_mj = Math.abs(ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(features[j].geometry, 'hectares'))
			var intersect_geo = ctcxHelpWordJs.mapOperator.types.geoEngine.intersect(ctcxHelpWordJs.geo, features[j].geometry);
			var intersect_mj = ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
			var proportion = intersect_mj / primary_mj;
			for (let key in dictionary) {
				if (!attrObj[key]) {
					attrObj[key] = 0
				}
				if (features[j]["attributes"][dictionary[key]]) {
					attrObj[key] += (features[j]["attributes"][dictionary[key]] * proportion)
				}
			}
			totalNum += (features[j]["attributes"][outFields] * proportion)

		}

		ctcxHelpWordJs.op["rk"]["total"] = totalNum
		for (let key in attrObj) {
			ctcxHelpWordJs.op.rk.arr.push(
				{
					name: key,
					num: attrObj[key],
					proportion: (attrObj[key] / totalNum) * 100
				}
			)

		}
		ctcxHelpWordJs.isOk++
	},
	xzjz: function (features) {
		var mj = ctcxHelpWordJs.ctcxServeObj["现状建筑"]["outFields"][0]
		var cs = ctcxHelpWordJs.ctcxServeObj["现状建筑"]["outFields"][1]
		var yt = ctcxHelpWordJs.ctcxServeObj["现状建筑"]["outFields"][2]
		var csObj = {}
		var ytObj = {}
		var totalArea = 0
		var ytAttributes_arr = []
		var csAttributes_arr = []

		var range = Math.abs(ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(ctcxHelpWordJs.geo, "hectares"));
		for (let j = 0; j < features.length; j++) {
			//var primary_mj = Math.abs(ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(features[j].geometry, 'hectares'))
			// var intersect_geo = ctcxHelpWordJs.mapOperator.types.geoEngine.intersect(ctcxHelpWordJs.geo, features[j].geometry);
			// var intersect_mj = ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
			//var proportion = intersect_mj / primary_mj;
			var area = features[j]["attributes"][mj]
			if (csObj[features[j]["attributes"][cs]]) {
				csObj[features[j]["attributes"][cs]][0] += 1
				csObj[features[j]["attributes"][cs]][1] += area
			} else {
				csObj[features[j]["attributes"][cs]] = []
				csObj[features[j]["attributes"][cs]][0] = 1
				csObj[features[j]["attributes"][cs]][1] = area

			}

			var ydxzStr = features[j]["attributes"][yt]
			if (ctcxHelpWordJs.jzDictionary[ydxzStr.substr(0, 3)]) {
				ydxzStr = ctcxHelpWordJs.jzDictionary[ydxzStr.substr(0, 3)]
			} else if (ctcxHelpWordJs.jzDictionary[ydxzStr.substr(0, 2)]) {
				ydxzStr = ctcxHelpWordJs.jzDictionary[ydxzStr.substr(0, 2)]
			} else {
				ydxzStr = "不明建筑"
			}
			if (ytObj[ydxzStr]) {
				ytObj[ydxzStr][0] += 1
				ytObj[ydxzStr][1] += area
			} else {
				ytObj[ydxzStr] = []
				ytObj[ydxzStr][0] = 1
				ytObj[ydxzStr][1] = area
			}
			totalArea += area
		}

		for (let key in csObj) {
			var bl = (csObj[key][1] / totalArea) * 100
			if (bl > 5) {
				csAttributes_arr.push({
					name: key,
					num: csObj[key][0],
					proportion: bl,
					area: csObj[key][1] / 10000
				})
			}
		}
		for (let key in ytObj) {
			var bl = (ytObj[key][1] / totalArea) * 100
			if (bl > 10) {
				ytAttributes_arr.push({
					name: key,
					num: ytObj[key][0],
					proportion: bl,
					area: ytObj[key][1] / 10000
				})
			}
		}
		ytAttributes_arr = ytAttributes_arr.sort(function (a, b) {
			return b.num - a.num;
		})
		csAttributes_arr = csAttributes_arr.sort(function (a, b) {
			return b.num - a.num;
		})

		ctcxHelpWordJs.op.jz = {
			"total": features.length,
			"totalArea": totalArea / 10000,
			"lwz": ytAttributes_arr,
			"cwz": csAttributes_arr

		}
		ctcxHelpWordJs.isOk++
	},
	gy: function (features) {
		var attrObj = {};
		var totalNum = 0
		var totalArea = 0
		var outFields = ctcxHelpWordJs.ctcxServeObj["土地信息"]["gy"]["outFields"][0]


		var range = Math.abs(ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(ctcxHelpWordJs.geo, "hectares"));
		for (let j = 0; j < features.length; j++) {
			var intersect_geo = ctcxHelpWordJs.mapOperator.types.geoEngine.intersect(ctcxHelpWordJs.geo, features[j].feature.geometry);
			var intersect_mj = ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
			var attr = features[j]["feature"]["attributes"][outFields]
			if (attrObj[attr]) {
				attrObj[attr][0] += 1
				attrObj[attr][1] += intersect_mj
			} else {
				attrObj[attr] = []
				attrObj[attr][0] = 1
				attrObj[attr][1] = intersect_mj
			}

			totalNum++
			totalArea += intersect_mj

		}
		ctcxHelpWordJs.op["td"]["gy"]["totalNum"] = totalNum
		ctcxHelpWordJs.op["td"]["gy"]["totalArea"] = totalArea
		ctcxHelpWordJs.op["td"]["gy"]["proportion"] = (totalArea / range) * 100

		for (let key in attrObj) {
			var bl = (attrObj[key][1] / totalArea) * 100
			if (bl > 5) {
				ctcxHelpWordJs.op["td"]["gy"]["arr"].push(
					{
						name: key,
						area: attrObj[key][1],
					}
				)
			}


		}
		ctcxHelpWordJs.isOk++
	},
	cb: function (features) {
		var attrObj = {};
		var totalNum = 0
		var totalArea = 0
		// var outFields = ctcxHelpWordJs.ctcxServeObj["土地信息"]["gy"]["outFields"][0]


		var range = Math.abs(ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(ctcxHelpWordJs.geo, "hectares"));
		for (let j = 0; j < features.length; j++) {
			try {
				var intersect_geo = ctcxHelpWordJs.mapOperator.types.geoEngine.intersect(ctcxHelpWordJs.geo, features[j].geometry);
				var intersect_mj = ctcxHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
				// var attr = features[j]["feature"]["attributes"][outFields]
				// if (attrObj[attr]) {
				// 	attrObj[attr][0] += 1
				// 	attrObj[attr][1] += intersect_mj
				// } else {
				// 	attrObj[attr] = []
				// 	attrObj[attr][0] = 1
				// 	attrObj[attr][1] = intersect_mj
				// }
				totalNum++
				totalArea += intersect_mj

			} catch (err) {
				console.log(err)
			}


		}
		ctcxHelpWordJs.op["td"]["cb"]["totalNum"] = totalNum
		ctcxHelpWordJs.op["td"]["cb"]["totalArea"] = totalArea
		ctcxHelpWordJs.op["td"]["cb"]["proportion"] = (totalArea / range) * 100

		// for (let key in attrObj) {
		// 	ctcxHelpWordJs.op["td"]["gy"]["arr"].push(
		// 		{
		// 			name: key,
		// 			num: attrObj[key][1],
		// 		}
		// 	)

		// }
		// ctcxHelpWordJs.isOk++
		ctcxHelpWordJs.isOk++
	},
	xzcs: function (features) {
		var OF0 = ctcxHelpWordJs.ctcxServeObj["现状权属"]["outFields"][0]
		var OF1 = ctcxHelpWordJs.ctcxServeObj["现状权属"]["outFields"][1]

		var total = {}
		var attributes_arr = []
		var range = 0;
		for (let j = 0; j < features.length; j++) {
			if (total[features[j].attributes[OF0]]) {
				total[features[j].attributes[OF0]] += features[j].attributes[OF1];
			} else {
				total[features[j].attributes[OF0]] = features[j].attributes[OF1];
			}
			range += features[j].attributes[OF1]
		}

		ctcxHelpWordJs.op["dj"]["z"] = features.length
		for (let key in total) {
			var bl = (total[key] / range) * 100
			if (bl > 5) {
				attributes_arr.push([key, bl])
			}
		}
		attributes_arr = attributes_arr.sort(function (a, b) {
			return b[1] - a[1];
		})
		for (let i = 0; i < attributes_arr.length; i++) {
			ctcxHelpWordJs.op["dj"]["wz"].push(attributes_arr[i][0])
		}
		ctcxHelpWordJs.isOk++
	},
	"ydAttrTotalDictionary": {
		"农用地": {
			"耕地": {
				"水田": ["011"],
				"水浇地": ["012"],
				"旱地": ["013"]
			},
			"园地": {
				"果园": ["021"],
				"茶园": ["022"],
				"其他园地": ["023"]
			},
			"林地": {
				"有林地": ["031"],
				"灌木林地": ["032"],
				"其他林地": ["033"]
			},
			"牧草地": {
				"天然牧草地": ["041"],
				"其他草地": ["043"]
			},
			"其他农用地": {
				"设施农用地": ["122"],
				"农村道路": ["104"],
				"坑塘水面": ["114"],
				"农田水利用地": ["117"]
			}
		},
		"建设用地": {
			"城乡建设用地": {
				"城镇建设用地": ["201", "202"],
				"农村居民点": ["203"],
				"采矿用地": ["204"]
			},
			"交通水利用地": {
				"铁路": ["101"],
				"公路": ["102"],
				"机场用地": ["105"],
				"港口码头": ["106"],
				"管道运输用地": ["107"],
				"水库水面": ["113"],
				"水工建筑用地": ["118"]
			},
			"其他建设用地": {
				"风景名胜设施及特殊用地": ["205"]
			}
		},
		"未利用地": {
			"水域": {
				"河流水面": ["111"],
				"湖泊水面": ["112"],
				"内陆滩涂": ["115"]
			},
			"自然保留地": {
				"沼泽地": ["125"],
				"沙地": ["126"],
				"裸地": ["127"]
			}
		}
	},
	"ydDictionary": {
		"R": {
			"color": [
				255,
				255,
				0
			],
			"text": "居住用地"
		},
		"R1": {
			"color": [
				255,
				255,
				190
			],
			"text": "一类居住用地"
		},
		"R11": {
			"color": [
				255,
				255,
				190
			],
			"text": "一类住宅用地"
		},
		"R12": {
			"color": [
				255,
				255,
				190
			],
			"text": "一类服务设施用地"
		},
		"R2": {
			"color": [
				255,
				255,
				0
			],
			"text": "二类居住用地"
		},
		"R21": {
			"color": [
				255,
				255,
				0
			],
			"text": "二类住宅用地"
		},
		"R22": {
			"color": [
				255,
				255,
				0
			],
			"text": "二类服务设施用地"
		},
		"R3": {
			"color": [
				194,
				181,
				0
			],
			"text": "三类居住用地"
		},
		"R31": {
			"color": [
				194,
				181,
				0
			],
			"text": "三类住宅用地"
		},
		"R32": {
			"color": [
				194,
				181,
				0
			],
			"text": "三类服务设施用地"
		},
		"A": {
			"color": [
				165,
				0,
				165
			],
			"text": "公共管理与公共服务用地"
		},
		"A1": {
			"color": [
				245,
				87,
				255
			],
			"text": "行政办公用地"
		},
		"A2": {
			"color": [
				255,
				186,
				217
			],
			"text": "文化设施用地"
		},
		"A21": {
			"color": [
				255,
				186,
				217
			],
			"text": "图书展览用地"
		},
		"A22": {
			"color": [
				255,
				186,
				217
			],
			"text": "文化活动用地"
		},
		"A3": {
			"color": [
				255,
				184,
				0
			],
			"text": "教育科研用地"
		},
		"A31": {
			"color": [
				255,
				184,
				0
			],
			"text": "高等院校用地"
		},
		"A32": {
			"color": [
				255,
				184,
				0
			],
			"text": "中等专业学校用地"
		},
		"A33": {
			"color": [
				255,
				255,
				190
			],
			"text": "中小学用地"
		},
		"A331": {
			"color": [
				255,
				255,
				190
			],
			"text": "小学"
		},
		"A332": {
			"color": [
				255,
				255,
				190
			],
			"text": "中学"
		},
		"A333": {
			"color": [
				255,
				255,
				190
			],
			"text": "九年一贯制学校"
		},
		"A34": {
			"color": [
				255,
				184,
				0
			],
			"text": "特殊教育用地"
		},
		"A35": {
			"color": [
				255,
				184,
				0
			],
			"text": "科研用地"
		},
		"A4": {
			"color": [
				30,
				199,
				176
			],
			"text": "体育用地"
		},
		"A41": {
			"color": [
				30,
				199,
				176
			],
			"text": "体育场馆用地"
		},
		"A42": {
			"color": [
				30,
				199,
				176
			],
			"text": "体育训练用地"
		},
		"A5": {
			"color": [
				205,
				189,
				15
			],
			"text": "医疗卫生用地"
		},
		"A51": {
			"color": [
				205,
				189,
				15
			],
			"text": "医院用地"
		},
		"A511": {
			"color": [
				205,
				189,
				15
			],
			"text": "综合医院"
		},
		"A512": {
			"color": [
				205,
				189,
				15
			],
			"text": "专科医院"
		},
		"A513": {
			"color": [
				205,
				189,
				15
			],
			"text": "社区卫生服务中心"
		},
		"A52": {
			"color": [
				205,
				189,
				15
			],
			"text": "卫生防疫用地"
		},
		"A53": {
			"color": [
				205,
				189,
				15
			],
			"text": "特殊医疗用地"
		},
		"A59": {
			"color": [
				205,
				189,
				15
			],
			"text": "其他医疗卫生用地"
		},
		"A6": {
			"color": [
				168,
				56,
				0
			],
			"text": "社会福利设施用地"
		},
		"A7": {
			"color": [
				165,
				124,
				82
			],
			"text": "文物古迹用地"
		},
		"A8": {
			"color": [
				168,
				61,
				92
			],
			"text": "外事用地"
		},
		"A9": {
			"color": [
				76,
				57,
				38
			],
			"text": "宗教用地"
		},
		"B": {
			"color": [
				255,
				0,
				0
			],
			"text": "商业服务业设施"
		},
		"B1": {
			"color": [
				255,
				0,
				0
			],
			"text": "商业设施用地"
		},
		"B11": {
			"color": [
				255,
				0,
				0
			],
			"text": "零售商业用地"
		},
		"B12": {
			"color": [
				255,
				0,
				0
			],
			"text": "批发市场用地"
		},
		"B13": {
			"color": [
				255,
				0,
				0
			],
			"text": "餐饮用地"
		},
		"B14": {
			"color": [
				255,
				0,
				0
			],
			"text": "旅馆用地"
		},
		"B2": {
			"color": [
				255,
				0,
				0
			],
			"text": "商务用地"
		},
		"B21": {
			"color": [
				255,
				0,
				0
			],
			"text": "金融保险用地"
		},
		"B22": {
			"color": [
				255,
				0,
				0
			],
			"text": "艺术传媒用地"
		},
		"B29": {
			"color": [
				255,
				0,
				0
			],
			"text": "其他商务用地"
		},
		"B3": {
			"color": [
				255,
				127,
				159
			],
			"text": "娱乐康体用地"
		},
		"B31": {
			"color": [
				255,
				127,
				159
			],
			"text": "娱乐用地"
		},
		"B32": {
			"color": [
				255,
				127,
				159
			],
			"text": "康体用地"
		},
		"B4": {
			"color": [
				115,
				178,
				255
			],
			"text": "公用设施营业网点用地"
		},
		"B41": {
			"color": [
				115,
				178,
				255
			],
			"text": "加油加气站用地"
		},
		"B49": {
			"color": [
				115,
				178,
				255
			],
			"text": "其他公用设施营业网点用地"
		},
		"B9": {
			"color": [
				255,
				107,
				0
			],
			"text": "其他服务设施用地"
		},
		"M": {
			"color": [
				184,
				138,
				92
			],
			"text": "工业用地"
		},
		"M1": {
			"color": [
				255,
				159,
				127
			],
			"text": "一类工业用地"
		},
		"M2": {
			"color": [
				184,
				138,
				92
			],
			"text": "二类工业用地"
		},
		"M3": {
			"color": [
				135,
				62,
				27
			],
			"text": "三类工业用地"
		},
		"W": {
			"color": [
				212,
				71,
				255
			],
			"text": "物流仓储用地"
		},
		"W1": {
			"color": [
				212,
				71,
				255
			],
			"text": "一类物流仓储用地"
		},
		"W2": {
			"color": [
				212,
				71,
				255
			],
			"text": "二类物流仓储用地"
		},
		"W3": {
			"color": [
				212,
				71,
				255
			],
			"text": "三类物流仓储用地"
		},
		"S": {
			"color": [
				115,
				178,
				255
			],
			"text": "交通设施用地"
		},
		"S1": {
			"color": [
				156,
				156,
				156
			],
			"text": "城市道路用地"
		},
		"S2": {
			"color": [
				115,
				178,
				255
			],
			"text": "城市轨道交通用地"
		},
		"S3": {
			"color": [
				115,
				178,
				255
			],
			"text": "综合交通枢纽用地"
		},
		"S31": {
			"color": [
				115,
				178,
				255
			],
			"text": "铁路枢纽用地"
		},
		"S32": {
			"color": [
				115,
				178,
				255
			],
			"text": "长途客运站用地"
		},
		"S33": {
			"color": [
				115,
				178,
				255
			],
			"text": "客运港用地"
		},
		"S4": {
			"color": [
				115,
				178,
				255
			],
			"text": "交通场站用地"
		},
		"S41": {
			"color": [
				115,
				178,
				255
			],
			"text": "公共交通场站用地"
		},
		"S42": {
			"color": [
				115,
				178,
				255
			],
			"text": "社会停车场用地"
		},
		"S9": {
			"color": [
				115,
				178,
				255
			],
			"text": "其他交通设施用地"
		},
		"U": {
			"color": [
				115,
				178,
				255
			],
			"text": "公用设施用地"
		},
		"U1": {
			"color": [
				115,
				178,
				255
			],
			"text": "供应设施用地"
		},
		"U11": {
			"color": [
				115,
				178,
				255
			],
			"text": "供水用地"
		},
		"U12": {
			"color": [
				115,
				178,
				255
			],
			"text": "供电用地"
		},
		"U13": {
			"color": [
				115,
				178,
				255
			],
			"text": "供燃气用地"
		},
		"U14": {
			"color": [
				115,
				178,
				255
			],
			"text": "供热用地"
		},
		"U15": {
			"color": [
				115,
				178,
				255
			],
			"text": "通信用地"
		},
		"U16": {
			"color": [
				115,
				178,
				255
			],
			"text": "广播电视用地"
		},
		"U2": {
			"color": [
				115,
				178,
				255
			],
			"text": "环境设施用地"
		},
		"U21": {
			"color": [
				115,
				178,
				255
			],
			"text": "排水用地"
		},
		"U22": {
			"color": [
				115,
				178,
				255
			],
			"text": "环卫用地"
		},
		"U3": {
			"color": [
				115,
				178,
				255
			],
			"text": "安全设施用地"
		},
		"U31": {
			"color": [
				115,
				178,
				255
			],
			"text": "消防设施用地"
		},
		"U32": {
			"color": [
				115,
				178,
				255
			],
			"text": "防洪设施用地"
		},
		"U9": {
			"color": [
				115,
				178,
				255
			],
			"text": "其他公用设施用地"
		},
		"G": {
			"color": [
				85,
				255,
				0
			],
			"text": "绿地与广场用地"
		},
		"G1": {
			"color": [
				85,
				255,
				0
			],
			"text": "公园绿地"
		},
		"G11": {
			"color": [
				85,
				255,
				0
			],
			"text": "城市公园"
		},
		"G111": {
			"color": [
				85,
				255,
				0
			],
			"text": "市级公园"
		},
		"G112": {
			"color": [
				85,
				255,
				0
			],
			"text": "区级公园"
		},
		"G113": {
			"color": [
				85,
				255,
				0
			],
			"text": "专类公园"
		},
		"G12": {
			"color": [
				85,
				255,
				0
			],
			"text": "社区公园"
		},
		"G121": {
			"color": [
				85,
				255,
				0
			],
			"text": "居住区公园"
		},
		"G122": {
			"color": [
				85,
				255,
				0
			],
			"text": "带状公园"
		},
		"G123": {
			"color": [
				85,
				255,
				0
			],
			"text": "街头公园"
		},
		"G2": {
			"color": [
				76,
				191,
				0
			],
			"text": "防护绿地"
		},
		"G3": {
			"color": [
				196,
				255,
				215
			],
			"text": "广场用地"
		},
		"G4": {
			"color": [
				44,
				109,
				11
			],
			"text": "生产绿地"
		},
		"H": {
			"color": [
				194,
				184,
				0
			],
			"text": "建设用地"
		},
		"H1": {
			"color": [
				194,
				184,
				0
			],
			"text": "城乡居民点建设用地"
		},
		"H11": {
			"color": [
				194,
				184,
				0
			],
			"text": "城市建设用地"
		},
		"H12": {
			"color": [
				194,
				184,
				0
			],
			"text": "镇建设用地"
		},
		"H13": {
			"color": [
				194,
				184,
				0
			],
			"text": "乡建设用地"
		},
		"H14": {
			"color": [
				194,
				184,
				0
			],
			"text": "村庄建设用地"
		},
		"H2": {
			"color": [
				130,
				130,
				130
			],
			"text": "区域交通设施用地"
		},
		"H21": {
			"color": [
				130,
				130,
				130
			],
			"text": "铁路用地"
		},
		"H22": {
			"color": [
				130,
				130,
				130
			],
			"text": "公路用地"
		},
		"H23": {
			"color": [
				115,
				148,
				222
			],
			"text": "港口用地"
		},
		"H24": {
			"color": [
				178,
				178,
				178
			],
			"text": "机场用地"
		},
		"H25": {
			"color": [
				130,
				130,
				130
			],
			"text": "管道运输用地"
		},
		"H3": {
			"color": [
				115,
				178,
				255
			],
			"text": "区域公用设施用地"
		},
		"H31": {
			"color": [
				115,
				178,
				255
			],
			"text": "能源设施用地"
		},
		"H32": {
			"color": [
				115,
				178,
				255
			],
			"text": "水工设施用地"
		},
		"H33": {
			"color": [
				115,
				178,
				255
			],
			"text": "殡葬设施用地"
		},
		"H34": {
			"color": [
				115,
				178,
				255
			],
			"text": "环卫设施用地"
		},
		"H39": {
			"color": [
				115,
				178,
				255
			],
			"text": "其他区域公用设施用地"
		},
		"H4": {
			"color": [
				225,
				225,
				225
			],
			"text": "特殊用地"
		},
		"H41": {
			"color": [
				225,
				225,
				225
			],
			"text": "军事用地"
		},
		"H42": {
			"color": [
				225,
				225,
				225
			],
			"text": "安保用地"
		},
		"H5": {
			"color": [
				185,
				91,
				0
			],
			"text": "采矿用地"
		},
		"H9": {
			"color": [
				222,
				255,
				145
			],
			"text": "其他建设用地"
		},
		"H9R": {
			"color": [
				222,
				255,
				145
			],
			"text": "生态型居住用地"
		},
		"H9A": {
			"color": [
				222,
				255,
				145
			],
			"text": "生态型公共管理和服务用地"
		},
		"H9B": {
			"color": [
				222,
				255,
				145
			],
			"text": "生态型商业服务业设施用地用地"
		},
		"H9D": {
			"color": [
				222,
				255,
				145
			],
			"text": "生态型研发设施用地"
		},
		"H9Z": {
			"color": [
				222,
				255,
				145
			],
			"text": "其他独立建设用地"
		},
		"E": {
			"color": [
				139,
				217,
				103
			],
			"text": "非建设用地"
		},
		"E1": {
			"color": [
				177,
				229,
				253
			],
			"text": "水域"
		},
		"E2": {
			"color": [
				139,
				217,
				103
			],
			"text": "农林用地"
		},
		"E21": {
			"color": [
				139,
				217,
				103
			],
			"text": "农用地"
		},
		"E22": {
			"color": [
				139,
				217,
				103
			],
			"text": "林地"
		},
		"E23": {
			"color": [
				58,
				118,
				30
			],
			"text": "山体"
		},
		"E29": {
			"color": [
				139,
				217,
				103
			],
			"text": "其他农林用地"
		},
		"E3": {
			"color": [
				211,
				255,
				190
			],
			"text": "生态维育用地"
		},
		"E9": {
			"color": [
				56,
				186,
				0
			],
			"text": "生态维育用地"
		},
		"K": {
			"color": [
				201,
				201,
				201
			],
			"text": "发展备用地"
		},
		"F": {
			"color": [
				0,
				255,
				0
			],
			"text": "F"
		},
		"F1": {
			"color": [
				201,
				201,
				201
			],
			"text": "存量待建用地"
		},
		"F2": {
			"color": [
				139,
				217,
				103
			],
			"text": "增量待建用地"
		},
		"F3": {
			"color": [
				139,
				217,
				103
			],
			"text": "未批待建用地"
		},
		"G5": {
			"color": [
				97,
				240,
				143
			],
			"text": "其他绿地 "
		},
		"A334": {
			"color": [
				255,
				255,
				190
			],
			"text": "初中"
		},
		"A335": {
			"color": [
				255,
				255,
				190
			],
			"text": "高中"
		}
	}
}