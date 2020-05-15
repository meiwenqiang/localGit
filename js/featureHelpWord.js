var featureHelpWordJs = {
    op: {
        tgSituation: {
            xmTotal: 0,
            tjTotal: 0
        },
        featureSituation: {
            "lswh": {
                num: 0,
                arr: ["string", "string"]
            },
            "jcjk": [
                {
                    name: "string",
                    area: 0
                }
            ],
            "wbtd": ["string", "string"],
            "sttj": [{
                totalArea: 0,
                arr: [{
                    name: "string",
                    area: 0
                }]
            }]
        },


    },
    featureServeObj: {
        "土地利用总体规划": {
            "url": "http://192.168.8.41:6080/arcgis/rest/services/TDLY/GIS_FZSYS_TGBZ_TGTZ/MapServer",
            "layerIds": [
                4
            ],
            "outFields": ["FID"],
            "returnGeometry": true,
            "funType": "tg"
        },
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
    },
    featureHelpWord: function (geo, mapO, faDkGeoArr, xsData) {
        featureHelpWordJs.op.tgSituation.xmTotal = 0
        featureHelpWordJs.op.tgSituation.tjTotal = 0
        featureHelpWordJs.op.featureSituation.lswh = {
            num: 0,
            arr: []
        }
        featureHelpWordJs.op.featureSituation.jcjk = []
        featureHelpWordJs.op.featureSituation.wbtd = []
        featureHelpWordJs.op.featureSituation.sttj = {
            totalArea: 0,
            arr: []
        }
        return new Promise(function (reslove, reject) {
            featureHelpWordJs.isOk = 0
            featureHelpWordJs.mapOperator = mapO
            featureHelpWordJs.geo = geo
            featureHelpWordJs.faDkGeoArr = faDkGeoArr
            featureHelpWordJs.tgSumarea = xsData.tg.sumarea
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
    tg: function (features) {
        var xmTotal = 0
        var tjTotal = 0
        var tgSumarea = featureHelpWordJs.tgSumarea
        var dictionary = featureHelpWordJs.tgDictionary
        var ydDictionary = featureHelpWordJs.jsydGeneralDictionary
        for (let j = 0; j < tgSumarea.length; j++) {
            if (!dictionary[tgSumarea[j].type] && ydDictionary[tgSumarea[j].dkType.substr(0, 1)]) {
                xmTotal += tgSumarea[j].totalArea
                for (let i = 0; i < features.length; i++) {
                    var intersect_geo = featureHelpWordJs.mapOperator.types.geoEngine.intersect(tgSumarea[j].geometry, features[i].geometry);
                    if (intersect_geo) {
                        var intersect_mj = featureHelpWordJs.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
                        tjTotal += intersect_mj

                    }
                }

            }

        }
        featureHelpWordJs.op.tgSituation.xmTotal = xmTotal / 100
        featureHelpWordJs.op.tgSituation.tjTotal = tjTotal / 100
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
        featureHelpWordJs.op.featureSituation.lswh.num = attrObjArr.length
        featureHelpWordJs.op.featureSituation.lswh.arr = attrObjArr
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
            featureHelpWordJs.op.featureSituation.jcjk.push(
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
            featureHelpWordJs.op.featureSituation.wbtd.push(attr)
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
        featureHelpWordJs.op.featureSituation.sttj.totalArea = totalArea
        for (let key in totalObj) {
            featureHelpWordJs.op.featureSituation.sttj.arr.push({ name: key, area: totalObj[key] })
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
    },
    jsydGeneralDictionary: {
        "R": true,
        "A": true,
        "B": true,
        "M": true,
        "W": true,
        "S": true,
        "U": true,
        "G": true,
        "H": true
    },
    tgDictionary: {
        "城镇用地": true,
        "农村居民点用地": true,
        "其他独立建设用地": true,
        "采矿用地": true,
        "铁路用地": true,
        "公路用地": true,
        "民用机场用地": true,
        "港口码头用地": true,
        "管道运输用地": true,
        "水库水面": true,
        "水工建筑用地": true,
        "风景名胜设施用地": true,
        "特殊用地": true
    }
}