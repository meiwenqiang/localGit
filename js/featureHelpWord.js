var featureHelpWordJs = {
    op: {
        "lswh": {
            num: 0,
            arr: ["string","string"]
        },
        "jcjk": [
            {
                name: "string",
                area: 0
            }
        ],
        "wbtd": ["string", "string"],
        "sttj":[{
            totalArea:0,
            arr:[{
                name: "string",
                area: 0 
            }]
        }]
    },
    featureServeObj: {
        "历史文化保护紫线": {
            "url": "http://192.168.31.56:6080/arcgis/rest/services/%E5%9F%BA%E7%A1%80%E6%95%B0%E6%8D%AE/%E6%AD%A6%E6%B1%89%E5%B8%82%E7%B4%AB%E7%BA%BF%E4%B8%93%E9%A1%B9%E8%A7%84%E5%88%92%E4%BC%98%E5%8C%96/MapServer",
            "layerIds": [
                0
            ],
            "outFields": ["控制类别", "备注"],
            "returnGeometry": false,
            "funType": "lswh"
        },
        "机场净空线": {
            "url": "http://192.168.8.43:6080/arcgis/rest/services/TDLY/CSSJ_GDGK_JCJK/MapServer",
            "layerIds": [
                0
            ],
            "outFields": ["高度管控"],
            "returnGeometry": true,
            "funType": "jcjk"
        },
        "微波通道": {
            "url": "http://192.168.8.43:6080/arcgis/rest/services/TDLY/GIS_TDLY_CSSJ_GDGK_WBTD/MapServer",
            "layerIds": [
                0
            ],
            "outFields": ["建筑高"],
            "returnGeometry": false,
            "funType": "wbtd"
        },
        "山体退距": {
            "url": "http://192.168.8.43:6080/arcgis/rest/services/ZYHJ/GIS_ZYHJ_GHST/MapServer",
            "layerIds": [
                0
            ],
            "outFields": ["FID"],
            "returnGeometry": true,
            "funType": "sttj"
        }
        // "现状人口": {
        // 	"url": "http://whgis.wpl:8010/ServiceAdapter/MAP/%E6%9C%80%E5%B0%8F%E7%A9%BA%E9%97%B4%E5%8D%95%E5%85%832018%E5%B9%B4%E4%BA%BA%E5%8F%A3%E7%BB%9F%E8%AE%A1/5606b7d46861a2078fd4a6369ff2ea6c",
        // 	"layerIds": [
        // 		0
        // 	],
        // 	"outFields": ["FREQUENCY", "Age0_14", "Age15_64", "Age65up"],
        // 	"dictionary": {
        // 		"0-14岁": "Age0_14",
        // 		"15-64岁": "Age15_64",
        // 		"65岁以上": "Age65up"
        // 	},
        // 	"returnGeometry": true,
        // 	"funType": "xzrk"
        // },
        // "现状建筑": {
        // 	"url": "http://192.168.213.153:6080/arcgis/rest/services/FZJZ_TILE/%E4%BB%BF%E7%9C%9F%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%BB%BA%E7%AD%91%E5%9F%BA%E7%A1%80%E6%95%B0%E6%8D%AE_TILE/MapServer",
        // 	"layerIds": [
        // 		0, 1, 2, 3, 4, 5, 6, 7, 8
        // 	],
        // 	"outFields": ["建筑面积", "地上层数", "建筑用途"],
        // 	"returnGeometry": false,
        // 	"funType": "xzjz"
        // },
        // "现状权属": {
        // 	"url": "http://whgis.wpl:8010/ServiceAdapter/MAP/SYQWH2000new1(%E5%88%87%E7%89%87%EF%BC%89/19534274a9897b8880845a14268558c3",
        // 	"layerIds": [
        // 		0
        // 	],
        // 	"outFields": ["QLR", "Shape_Area"],
        // 	"returnGeometry": false,
        // 	"funType": "xzcs"
        // },
        // "土地信息": {
        // 	"gy": {
        // 		"url": "http://tdxx.wpl:6080/arcgis/rest/services/FZSYS/tdgy/MapServer",
        // 		"layerIds": [
        // 			0
        // 		],
        // 		"outFields": ["标准土地用途"],
        // 		"returnGeometry": true,
        // 		"funType": "gy"
        // 	},
        // 	"cb": {
        // 		"url": "http://192.168.31.199:6080/arcgis/rest/services/TDCB/MapServer",
        // 		"layerIds": [
        // 			0
        // 		],
        // 		"outFields": ["OBJECTID"],
        // 		"returnGeometry": true,
        // 		"funType": "cb"
        // 	}
        // }
    },
    featureHelpWord: function (geo, mapO, faDkGeoArr) {
        featureHelpWordJs.op.lswh = {
            num: 0,
            arr: []
        }
        featureHelpWordJs.op.jcjk = []
        featureHelpWordJs.op.wbtd = []
        featureHelpWordJs.op.sttj = {
            totalArea:0,
            arr:[]
        }
        return new Promise(function (reslove, reject) {
            featureHelpWordJs.isOk = 0
            featureHelpWordJs.mapOperator = mapO
            featureHelpWordJs.geo = geo
            featureHelpWordJs.faDkGeoArr = faDkGeoArr
            var _p = [];
            for (let key in featureHelpWordJs.featureServeObj) {
                var p1;
                switch (key) {
                    case "土地信息":
                        for (let keyTd in featureHelpWordJs.featureServeObj[key]) {
                            if (keyTd == "gy") {
                                p1 = featureHelpWordJs.IdentifyTaskHelp(featureHelpWordJs.featureServeObj[key][keyTd], featureHelpWordJs[featureHelpWordJs.featureServeObj[key][keyTd].funType])
                            } else {
                                p1 = featureHelpWordJs.queryTaskHelp(featureHelpWordJs.featureServeObj[key][keyTd], featureHelpWordJs[featureHelpWordJs.featureServeObj[key][keyTd].funType])
                            }

                            _p.push(p1)
                        }
                        break;
                    default:
                        p1 = featureHelpWordJs.queryTaskHelp(featureHelpWordJs.featureServeObj[key], featureHelpWordJs[featureHelpWordJs.featureServeObj[key].funType])
                        _p.push(p1)
                        break;
                }

            }


            Promise.all(_p).then((result) => {
                reslove(featureHelpWordJs.op)
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
                    let queryTask = new featureHelpWordJs.mapOperator.types.QueryTask({
                        url: urlStr + '/' + layerIds[i],
                    });
                    let que = new featureHelpWordJs.mapOperator.types.Query();
                    que.geometry = featureHelpWordJs.geo;
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


            let idenParam = new featureHelpWordJs.mapOperator.types.IdentifyParameters();
            idenParam.layerIds = layerIds;
            idenParam.mapExtent = featureHelpWordJs.mapOperator.view.extent;
            idenParam.returnGeometry = returnGeometry;
            idenParam.geometry = featureHelpWordJs.geo;
            idenParam.tolerance = 1;
            //定义IdentifyTask对象
            let idenTask = new featureHelpWordJs.mapOperator.types.IdentifyTask(decodeURIComponent(urlStr));
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
    lswh: function (features) {
        var attrObj = {}
        for (let j = 0; j < features.length; j++) {
            var outFields1 = featureHelpWordJs.featureServeObj["历史文化保护紫线"]["outFields"][0]
            var outFields2 = featureHelpWordJs.featureServeObj["历史文化保护紫线"]["outFields"][1]
            var attr1 = features[j]["attributes"][outFields1]
            var attr2 = features[j]["attributes"][outFields2]
            if (attr1.indexOf("保护范围") != -1) {
                attr2 = splitHelp(attr2)
                for (let i = 0; i < attr2.length; i++) {
                    if (!attrObj[attr2[i]]) {
                        attrObj[attr2[i]] = true
                    }
                }
            }
        }
        var attrObjArr = Object.keys(attrObj)
        featureHelpWordJs.op.lswh.num = attrObjArr.length
        featureHelpWordJs.op.lswh.arr = attrObjArr
        function splitHelp(str) {
            var dictionary = featureHelpWordJs.splitDictionary
            var lsArr = []
            var spliceNum = 0
            var spliceArr = []
            for (let key in dictionary) {
                lsArr = str.split(key)
                if (lsArr.length > 1) {
                    if (key == "、") {
                        spliceArr.push(lsArr[0])
                        for (let j = 1; j < lsArr.length; j++) {
                            if ((/^[0-9]/).test(lsArr[j])) {
                                spliceArr[spliceNum] += '、' + lsArr[j]
                            } else {
                                spliceNum++
                                spliceArr.push(lsArr[j])
                            }
                        }
                        return spliceArr
                    } else {
                        return lsArr
                    }

                }
            }
            spliceArr.push(str)
            return spliceArr
        }
    },
    jcjk: function (features) {
        var attrObj = {}
        var outFields = featureHelpWordJs.featureServeObj["机场净空线"]["outFields"][0]
        var range = Math.abs(featureHelpWordJs.mapOperator.types.geoEngine.planarArea(featureHelpWordJs.geo, "hectares"));
        for (let j = 0; j < features.length; j++) {
            var attr = features[j]["attributes"][outFields]
            var primary_mj = Math.abs(featureHelpWordJs.mapOperator.types.geoEngine.planarArea(features[j].geometry, 'hectares'))
            var intersect_geo = featureHelpWordJs.mapOperator.types.geoEngine.intersect(featureHelpWordJs.geo, features[j].geometry);
            var intersect_mj = featureHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
            if (attrObj[attr]) {
                attrObj[attr] += intersect_mj
            } else {
                attrObj[attr] = intersect_mj
            }
        }
        for (let key in attrObj) {
            featureHelpWordJs.op.jcjk.push(
                {
                    name: key,
                    area: attrObj[key]
                }
            )

        }
    },
    wbtd: function (features) {
        var outFields = featureHelpWordJs.featureServeObj["机场净空线"]["outFields"][0]
        for (let j = 0; j < features.length; j++) {
            var attr = features[j]["attributes"][outFields]
            featureHelpWordJs.op.wbtd.push(attr)
        }
    },
    sttj: function (features) {
        var dictionary = featureHelpWordJs.jsydDictionary
        var ydObj = {}
        var totalArea = 0
        var totalObj = {}
        for (let i = 0; i < featureHelpWordJs.faDkGeoArr.length; i++) {
            var attr3 = featureHelpWordJs.faDkGeoArr[i]["ydxz"].substr(0, 3)
            var attr2 = featureHelpWordJs.faDkGeoArr[i]["ydxz"].substr(0, 2)
            var attr1 = featureHelpWordJs.faDkGeoArr[i]["ydxz"].substr(0, 1)
            var attr = ""
            if (dictionary[attr3]) {
                attr = dictionary[attr3]
            } else if (dictionary[attr2]) {
                attr = dictionary[attr2]
            } else if (dictionary[attr1]) {
                attr = dictionary[attr1]
            } else {
                continue
            }
            if (ydObj[attr]) {
                ydObj[attr].push(featureHelpWordJs.faDkGeoArr[i].geo)
            } else {
                ydObj[attr] = []
                ydObj[attr].push(featureHelpWordJs.faDkGeoArr[i].geo)
            }

        }
        for (let j = 0; j < features.length; j++) {
            for (let key in ydObj) {
                for (let i = 0; i < ydObj[key].length; i++) {
                    var intersect_geo = featureHelpWordJs.mapOperator.types.geoEngine.intersect(ydObj[key][i], features[j].geometry);
                    if (intersect_geo) {
                        var intersect_mj = featureHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
                        totalArea += intersect_mj
                        if (totalObj[key]) {
                            totalObj[key] += intersect_mj
                        } else {
                            totalObj[key] = intersect_mj
                        }
                    }
                }
            }
        }
        featureHelpWordJs.op.sttj.totalArea = totalArea
        for(let key in totalObj){
            featureHelpWordJs.op.sttj.arr.push({ name: key, area: totalObj[key] })
        }
        
    },
    splitDictionary: [",", "，", "、"],
    jsydDictionary: {
        "R": "居住用地",
        "A": "公共管理与公共服务用地",
        "B": "商业服务业设施用地",
        "M": "工业用地",
        "W": "物流仓储用地",
        "S": "交通设施用地",
        "U": "公共设施用地",
        "G": "绿地与广场用地",
        "H12": "镇建设用地",
        "H14": "村庄建设用地",
        "H2": "区域交通设施用地",
        "H3": "区域公共设施用地",
        "H4": "特殊用地",
        "H5": "采矿用地",
        "H9": "其他建设用地",
    }
}