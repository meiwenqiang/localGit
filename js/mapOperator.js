function MapOperator() {
	if(!(this instanceof MapOperator)) {
		throw Error('请用 new 操作符初始化 MapOperator')
	}
	if(!MapOperator.instances.has(this)) {
		MapOperator.instances.add(this)
	} else {
		throw Error('该实例已存在')
	}
}

MapOperator.instances = new WeakSet()

// 获取当前激活视图
// return: 当前激活视图实例
MapOperator.getActiveOperator = function() {
	MapOperator.instances.forEach(instance => {
		if(instance.active) {
			return instance
		}
	})
	return null
}

MapOperator.prototype.initMap = function(divId) {
	// 返回 Promise，通过 then 调用
	return new Promise((resolve, reject) => {
		require([
			'esri/Map',
			'esri/Basemap',
			'esri/views/MapView',
			'esri/geometry/Point',
			'esri/Graphic',
			'esri/layers/GraphicsLayer',
			'esri/layers/FeatureLayer',
			'esri/layers/GroupLayer',
			'esri/layers/TileLayer',
			'esri/layers/ImageryLayer',
			'esri/layers/MapImageLayer',
			'esri/widgets/Legend',
			'esri/tasks/support/Query',
			'esri/core/Collection',
			"esri/request",
			"esri/PopupTemplate",
			"esri/widgets/DistanceMeasurement2D",
			"esri/widgets/AreaMeasurement2D",
			"esri/views/draw/Draw",
			"esri/geometry/geometryEngine",
			"esri/geometry/Polyline",
			"esri/geometry/Polygon",
			"esri/symbols/SimpleFillSymbol",
			"esri/Color",
			"esri/symbols/SimpleLineSymbol",
			"esri/config",
			"esri/core/urlUtils",
			"esri/geometry/SpatialReference",
			"esri/tasks/QueryTask",
			"esri/tasks/PrintTask",
			"esri/tasks/support/PrintTemplate",
			"esri/tasks/support/PrintParameters",
			"esri/tasks/support/IdentifyParameters",
			"esri/tasks/IdentifyTask",
			"esri/widgets/ScaleBar"
		], (
			ArcGISMap,
			Basemap,
			MapView,
			Point,
			Graphic,
			GraphicsLayer,
			FeatureLayer,
			GroupLayer,
			TileLayer,
			ImageryLayer,
			MapImageLayer,
			Legend,
			Query,
			Collection,
			request,
			PopupTemplate,
			DistanceMeasurement2D,
			AreaMeasurement2D,
			Draw,
			geometryEngine,
			Polyline,
			Polygon,
			SimpleFillSymbol,
			Color,
			SimpleLineSymbol,
			esriConfig,
			urlUtils,
			SpatialReference,
			QueryTask,
			PrintTask,
			PrintTemplate,
			PrintParameters,
			IdentifyParameters,
			IdentifyTask,
			ScaleBar
		) => {
			//esriConfig.request.proxyUrl = "http://59.175.191.84/DotNet4/proxy.ashx"
			//esriConfig.request.useProxy = false;
			// esriConfig.request.proxyUrl = "../../proxy/proxy.ashx";
			// esriConfig.request.useProxy = false;
			/*urlUtils.addProxyRule({
				urlPrefix: "http://58.49.22.196:2963", //配置文件proxy.config中的地址,要请求的地址
				proxyUrl: "../../proxy.ashx" //部署的代理文件地址
			});*/
			// 存储 ArcGIS 类型
			this.types = Object
			this.types.Map = ArcGISMap
			this.types.Basemap = Basemap
			this.types.MapView = MapView
			this.types.Point = Point
			this.types.Graphic = Graphic
			this.types.GraphicsLayer = GraphicsLayer
			this.types.FeatureLayer = FeatureLayer
			this.types.GroupLayer = GroupLayer
			this.types.TileLayer = TileLayer
			this.types.ImageryLayer = ImageryLayer
			this.types.MapImageLayer = MapImageLayer
			this.types.Legend = Legend
			this.types.Query = Query
			this.types.Collection = Collection
			this.types.request = request
			this.types.PopupTemplate = PopupTemplate
			this.types.DistanceMeasurement2D = DistanceMeasurement2D
			this.types.AreaMeasurement2D = AreaMeasurement2D
			this.types.Draw = Draw
			this.types.geoEngine = geometryEngine
			this.types.Polyline = Polyline
			this.types.Polygon = Polygon
			this.types.SimpleFillSymbol = SimpleFillSymbol
			this.types.Color = Color
			this.types.SimpleLineSymbol = SimpleLineSymbol
			this.types.QueryTask = QueryTask
			this.types.PrintTask = PrintTask
			this.types.PrintTemplate = PrintTemplate
			this.types.PrintParameters = PrintParameters
			this.types.IdentifyParameters = IdentifyParameters
			this.types.IdentifyTask = IdentifyTask
			this.types.ScaleBar = ScaleBar
			esriConfig.fontsUrl = 'http://192.168.8.41:80/arcgis_js_v411_api/arcgis_js_api/library/4.11/esri/themes/base/fonts'
			// esriConfig.request.useProxy = false;
			/*urlUtils.addProxyRule({
				urlPrefix: "http://58.49.22.196:2963", //配置文件proxy.config中的地址,要请求的地址
				proxyUrl: "../../proxy.ashx" //部署的代理文件地址
			});*/

			// 存储 ArcGIS 类型
			// 地图是否加载完成
			this.lastGraphic = null
			this.loaded = false

			// 是否处于激活状态
			this.active = false

			// Dom id
			this._divId = divId

			//底图
			this.tileLayer = new this.types.TileLayer({
				url: dtLayers["底图"],
				//   url: "http://localhost:6080/arcgis/rest/services/GIS_DT_QGDT_WHCSQ/MapServer"
			});

			//注记
			var tileLayer2 = new this.types.TileLayer({
				url: dtLayers["注记"]
				//  url:"http://localhost:6080/arcgis/rest/services/GIS_DT_QGDT_WHZJ/MapServer"
			})
			//协审冲突状态图层
			var xsStateLayer = new this.types.GraphicsLayer({
				graphics: [],
				legendEnabled: true,
				objectIdField: 'FID',
				outFields: ["*"],
				id: "xsState"
			})
			//选中图层
			var selectLayer = new this.types.GraphicsLayer({
				graphics: [],
				legendEnabled: true,
				objectIdField: 'FID',
				outFields: ["*"],
				id: "select"
			})
			//编号图层、
			var textLayer = new this.types.GraphicsLayer({
				graphics: [],
				legendEnabled: true,
				objectIdField: 'FID',
				outFields: ["*"],
				id: "text"
			})
			//上传地块图层
			var GraphicsLayer = new this.types.GraphicsLayer({
				graphics: [],
				legendEnabled: true,
				objectIdField: 'FID',
				outFields: ["*"],
				id: "dk"
			})
			//范围线图层
			var XieshenFWX = new this.types.GraphicsLayer({
				graphics: [],
				legendEnabled: true,
				objectIdField: 'FID',
				outFields: ["*"],
				id: "fwx"
			})
			//分析图层
			var XieshenFX = new this.types.GraphicsLayer({
				graphics: [],
				legendEnabled: true,
				objectIdField: 'FID',
				outFields: ["*"],
				id: "fx"
			})
			//覆盖图层
			var XieshenFg = new this.types.GraphicsLayer({
				graphics: [],
				legendEnabled: true,
				objectIdField: 'FID',
				outFields: ["*"],
				id: "fg"
			})
			var basemap = new this.types.Basemap({
				baseLayers: [this.tileLayer, tileLayer2]
			})

			// 底图
			this.map = new this.types.Map({
				basemap
			})

			// this.map.layers.add(new FeatureLayer({
			//   url: "http://58.49.22.196:2963/arcgis/rest/services/GIS_SYS_ZBTX08_QJRK/MapServer",
			// }))

			// 地图控件
			this.view = new this.types.MapView({
				container: divId,
				map: this.map,
					zoom: 2
			})
			this.view.spatialReference = new SpatialReference({
				"wkt": 'PROJCS["WuHan_WH2000_at_11420_E_CGCS2000",' +
					'GEOGCS["GCS_WuHanCGCS2000",' +
					'DATUM["D_WuHanCGCS2000",' +
					'SPHEROID["ElliCGCS2000",6378137.0,298.257222101]],' +
					'PRIMEM["Greenwich",0.0],' +
					'UNIT["Degree",0.0174532925199433]],' +
					'PROJECTION["Transverse_Mercator"],' +
					'PARAMETER["false_easting",800000.0],' +
					'PARAMETER["false_northing",-3000000.0],' +
					'PARAMETER["central_meridian",114.3333333333333],' +
					'PARAMETER["scale_factor",1.0],' +
					'PARAMETER["latitude_of_origin",0.0],' +
					'UNIT["Meter",1.0]]'
			})
			var pt = new this.types.Point({
					x: 812133.2769695884,
					y: 387581.56953939213,
				spatialReference: this.view.spatialReference
			});
			this.view.center = pt;
			//添加上传地块图层
			// this.map.add(ghxxLayer)
			// this.map.add(ghxxAllLayer)
			this.map.add(GraphicsLayer)
			this.map.add(XieshenFWX)
			this.map.add(xsStateLayer)
			this.map.add(XieshenFg)
			this.map.add(XieshenFX)
			this.map.add(textLayer)
			this.map.add(selectLayer)
			this.view.ui.empty("top-left");

			// 专题图图层
			this.thematicLayers = new Map()
			this.draw = new this.types.Draw({
				view: this.view
			});
			// 关联的 MapOperator
			this.releativeOperator = new Set()
			this.view.on("mouse-wheel", () => {
				// 触发 zoom 和 drag 事件
				this.view.on("mouse-wheel", () => {
					// 触发 zoom 和 drag 事件

					window.setTimeout(() => {
						this._callMethodInReleativeOperators('_setZoomAndCenter', this.view.zoom, this.view.center, this.view.extent,
							this.view.rotation)
					}, 100)
				})
			})
			this.view.on("drag", () => {
				// 触发 zoom 和 drag 事件
				window.setTimeout(() => {
					this._callMethodInReleativeOperators('_setZoomAndCenter', this.view.zoom, this.view.center, this.view.extent,
						this.view.rotation)
				}, 100)
			})
			//方向键禁止
			this.view.on("key-down", function(event) {
				var prohibitedKeys = ["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"];
				var keyPressed = event.key;
				if(prohibitedKeys.indexOf(keyPressed) !== -1) {
					event.stopPropagation();
				}
			});
			this.view.on('click', (event) => {
				var that = this;
				//触发本实例为激活状态
				this.setOnlySelfActive();
			})

			// 视图加载完成回调
			this.view.when(() => {
				//$(".hzBox").click()
				this.loaded = true;
				resolve(this)
				setTimeout(() => {
					//外网没有地址
					/*var zg = new this.types.MapImageLayer({
						url: "http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_ZGGDB/MapServer"
					})
					zg.on("layerview-create", function(event) {
						console.log(event.layerView)

					});
					xieshenPage.mapOperator.map.add(zg, 0)*/
					this.zoom = this.view.zoom;
					this.center = this.view.center;
					this.extent = this.view.extent;
					this.rotation = this.view.rotation;
				}, 500)

			}, (error) => {
				reject(error)
			})
		})
	})
}
//初始化图层
MapOperator.prototype.initBaseDiyMap = function() {
		//外网没有地址
		var zg = new this.types.TileLayer({
			url: "http://192.168.8.41:6080/arcgis/rest/services/GIS_SYS_KJGH_CGBZ_GDBZT/MapServer"
		})
		xieshenPage.mapOperator.map.add(zg, 0)
}
//定位
MapOperator.prototype.dw = function() {
	this.view.zoom = this.zoom;
	this.view.center = this.center;
	this.view.extent = this.extent;
	this.view.rotation = this.rotation;
}

// 设置激活状态
// active：是否激活
MapOperator.prototype._setActiveStatus = function(active) {
	this.active = active
}

// 得到 divId
MapOperator.prototype.getDivId = function() {
	return this._divId
}

// 设置自己为激活状态，其它关联视图为非激活状态
MapOperator.prototype.setOnlySelfActive = function() {
	this._setActiveStatus(true)
	this._callMethodInReleativeOperators('_setActiveStatus', false)
}

// 添加关联视图
// operator: 被关联的 MapView 实例
MapOperator.prototype.addRelativeOperator = function(operator) {
	if(!this.releativeOperator.has(operator)) {
		this.releativeOperator.add(operator)
	} else {
		throw Error('该视图已关联，添加失败')
	}
}

// 移除某个关联视图
// operator: 被关联的 MapView 实例
MapOperator.prototype.removeReleativeOperator = function(operator) {
	if(this.releativeOperator.has(operator)) {
		this.releativeOperator.delete(operator)
	} else {
		throw Error('该视图未关联，移除失败')
	}
}

// 移除所有关联视图
// operator: 被关联的 MapView 实例
MapOperator.prototype.removeAllReleativeOperators = function() {
	this.releativeOperator.clear()
}

// 改变本实例 MapView 的 zoom 和 center
MapOperator.prototype._setZoomAndCenter = function(zoom, center, extent, rotation) {
	this.view.zoom = zoom
	this.view.center = center
	this.view.extent = extent
	this.view.rotation = rotation
}

// 调用关联地图函数
// methodKey: 接口函数名(字符串)
// args: 所有参数
MapOperator.prototype._callMethodInReleativeOperators = function(methodKey, ...args) {
	if(this.releativeOperator.size) {
		this.releativeOperator.forEach(operator => {
			if(Object.prototype.toString.call(operator[methodKey]) === '[object Function]') {
				operator[methodKey](...args)
			} else {
				throw Error(`${methodKey}不是方法`)
			}
		})
	}
}

//绘值范围线
MapOperator.prototype.addFWX = function(result) {
	var that = this;

	switch(result.geometry.type) {
		case "Point":
			var point = {
				type: "point", // autocasts as new Point()
				x: -0.178,
				y: 51.48791,
				z: 1010
			};

			var markerSymbol = {
				type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
				color: [226, 119, 40],
				outline: {
					// autocasts as new SimpleLineSymbol()
					color: [255, 255, 255],
					width: 2
				}
			};
			break;
		case "polyline":
			var polyline = {
				type: "polyline", // autocasts as new Polyline()
				paths: result.geometry.paths,
				spatialReference: that.view.spatialReference
			};

			var lineSymbol = {
				type: "simple-line", // autocasts as SimpleLineSymbol()
				color: [0, 255, 255],
				width: 4
			};
			var polylineGraphic = new that.types.Graphic({
				geometry: polyline,
				symbol: lineSymbol
			});
			that.map.findLayerById("fwx").graphics.add(polylineGraphic);
			break;
		case "Polygon":
			var polygon = {
				type: "polygon", // autocasts as new Polygon()
				rings: result.geometry.coordinates,
				spatialReference: that.view.spatialReference
			};

			var fillSymbol = {
				type: "simple-fill", // autocasts as new SimpleFillSymbol()
				color: [0, 255, 255, 0.2],
				outline: {
					// autocasts as new SimpleLineSymbol()
					color: [0, 255, 255],
					width: 2
				}
			};
			var polygonGraphic = new that.types.Graphic({
				geometry: polygon,
				symbol: fillSymbol
			});
			that.map.findLayerById("fwx").graphics.add(polygonGraphic);
			break;
		case "polygon":
			var polygon = {
				type: "polygon", // autocasts as new Polygon()
				rings: result.geometry.rings,
				spatialReference: that.view.spatialReference
			};

			var fillSymbol = {
				type: "simple-fill", // autocasts as new SimpleFillSymbol()
				color: [0, 255, 255, 0.2],
				outline: {
					// autocasts as new SimpleLineSymbol()
					color: [0, 255, 255],
					width: 2
				}
			};
			var polygonGraphic = new that.types.Graphic({
				geometry: polygon,
				symbol: fillSymbol
			});

			that.map.findLayerById("fwx").graphics.add(polygonGraphic);

			break;
		default:
			break;
	}

}
//获取面图形
MapOperator.prototype.getPolygon = function(xyArr) {
	var polygon = new this.types.Polygon({
		"spatialReference": this.view.spatialReference,
		"rings": xyArr
	});
	return polygon;
}

//获得相交图形
MapOperator.prototype.getGeoInter = function(ygeo, geo) {
	ygeo.spatialReference = this.view.spatialReference;
	geo.spatialReference = this.view.spatialReference;
	var res = this.types.geoEngine.intersect(ygeo, geo);
	if(res) {
		//this.view.spatialReference.wkid = null;
		res.spatialReference = this.view.spatialReference;
	}
	return res;
}

//判断是否相交
MapOperator.prototype.isIntersect = function(ygeo, geo) {
	ygeo.spatialReference = this.view.spatialReference;
	geo.spatialReference = this.view.spatialReference;
	var res = this.types.geoEngine.intersects(ygeo, geo);
	//this.view.spatialReference.wkid = null;
	//res.spatialReference = this.view.spatialReference;
	return res;
}

//QueryTask 空间查询
/*urlStr -查询的图层服务(单个图层)
 * geo -查询范围的图形
 * errFun- 失败回调函数
 * sucFun- 成功回调函数
 */
MapOperator.prototype.queryTaskByGeo = function(urlStr, geo, sucFun, errFun) {
	var queryTask = new this.types.QueryTask({
		url: urlStr
	});
	var que = new this.types.Query();
	que.geometry = geo;
	que.outFields = ["*"];
	que.returnGeometry = true;
	que.spatialRelationship = this.types.Query.SPATIAL_REL_INTERSECTS;
	queryTask.execute(que).then(sucFun, errFun);
}

//queryFeatures 空间查询
/*urlStr -查询的图层服务(单个图层)
 * geo -查询范围的图形
 * errFun- 失败回调函数
 * sucFun- 成功回调函数
 */
MapOperator.prototype.queryFeaLayByGeo = function(urlStr, geo, sucFun, errFun) {
	var aFeaLay = new this.types.FeatureLayer({
		url: urlStr,
		outFields: ["*"]
	});
	var que = aFeaLay.createQuery();
	que.geometry = geo;
	que.outFields = ["*"];
	que.returnGeometry = true;
	aFeaLay.queryFeatures(que).then(sucFun, errFun);
}

function executeFindTaskBygetHttpResuqet(geometry, layerUrl, where, successFun, errorFun) {
	var url =
		"f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=1&geometryPrecision=0&outFields=*";
	if(geometry) {
		var gType = "";
		if(geometry.type == "polyline") {
			gType = "esriGeometryPolyline";
		} else if(geometry.type.indexOf("point") > -1) {
			gType = "esriGeometryPoint";
		} else {
			gType = "esriGeometryPolygon";
		}
		url += "&geometry=" + JSON.stringify(geometry.toJSON()) + "&geometryType=" + gType;
	}
	if(where) {
		url += "&where=" + where;
	}
	var ajaxUrl = "http://59.175.191.84:8080/whgh/home/getHttpResuqet"
	// ajaxUrl = "User.ashx"
	sendAjax(ajaxUrl, {
		url: layerUrl + "/query",
		params: url,
		method: "getHttpResuqetA"
	}, function(result) {
		if(typeof result == "string") {
			result = JSON.parse(result);
		}

		if(successFun) successFun(result);
	}, function(e) {
		console.log("executeFindTask查询失败");
		if(errorFun) errorFun(e);
	}, false, "getHttpResuqetA");

};

/** ajax请求封装 */
function sendAjax(url, data, successFun, errorFun, isCrossDomain, callback) {
	if(isCrossDomain) {
		callback += Date.now();
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			dataType: "jsonp",
			jsonp: "callback",
			jsonpCallback: callback,
			success: function(data) {
				successFun(data);
			},
			error: function(e) {
				errorFun(e);
			}
		})
	} else {
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			success: function(data) {
				successFun(data);
			},
			error: function(e) {
				errorFun(e);
			}
		})
	}
}

//打印地图
/*view- 要打印的地图视图
 *printResult - 成功打印回调
 *printError- 失败回调
 */
MapOperator.prototype.printMap = function(view, printResult, printError) {
	var printTask = new this.types.PrintTask({

		url: dayinArcgisUrl
	});

	var template = new this.types.PrintTemplate({

		format: "png32",
		layout: "map-only",
		/* exportOptions :{
			"width" :400,
			"height" :550,
			"dpi":192
		} */
		exportOptions :{
			"width" :300,
			"height" :450,
			"dpi":120
		}
	});

	var params = new this.types.PrintParameters({

		view: view,
		template: template
	});

	printTask.execute(params).then(printResult, printError);
}

//执行IdentifyTask查询
/* urlStr -查询的图层
 * mapPoint -地图点击
 * layerIds -查询图层的子图层id
 */
MapOperator.prototype.executeIdentifyTask = function(urlStr, mapPoint, layerIds) {
	var that = this;
	//定义IdentifyParameters对象
	var idenParam = new this.types.IdentifyParameters();
	//查询layerId
	idenParam.layerIds = layerIds;
	//地图点击事件
	idenParam.mapExtent = this.view.extent;
	//返回图形闪烁
	idenParam.returnGeometry = true;
	//该点半径3的容差
	idenParam.geometry = mapPoint;
	idenParam.tolerance = 3;
	//可见区域范围
	idenParam.width = this.view.width;
	idenParam.height = this.view.height;

	//定义IdentifyTask对象
	var idenTask = new this.types.IdentifyTask(decodeURIComponent(urlStr));
	//执行方法
	idenTask.execute(idenParam).then((response) => {
		try {
			that.view.graphics.removeAll();
		} catch(e) {}
		console.log(response.results);
		var results = response.results[0].feature.attributes;
		var contents = '';
		contents += "<table border='1'  cellspacing='0' style='border-color:#fff;width:100%;'>";
		for(let k in results) {
			if(results[k] != " ") {

				contents += "<tr>";
				contents += "<th>" + k + "</th>";
				contents += "<th>" + results[k] + "</th>";
				contents += "</tr>"
			}
		}
		contents += "</table>";
		that.view.popup.open({
			title: "查询结果",
			location: response.results[0].feature.geometry.extent.center,
			content: contents
		});

		var symbol = {
			type: "simple-line",
			color: [0, 255, 255],
			width: 3
		};

		var graphics = new that.types.Graphic({
			geometry: response.results[0].feature.geometry,
			symbol: symbol
		});

		that.view.graphics.add(graphics);

		setTimeout(function() {
			$('.esri-popup__icon.esri-icon-close').click(function() {
				that.view.graphics.removeAll();
			});
		}, 1000);
	});
}

//获取高亮轮廓的渲染
/*geo-渲染图形
 * color-图形填充颜色
 */
MapOperator.prototype.getHighLightGra = function(geo, color) {
	var symbol = {
		type: "simple-fill",
		color: color,
		outline: {
			type: "simple-line",
			color: [63, 218, 255],
			width: 2
		}
	};

	return new this.types.Graphic({
		geometry: geo,
		symbol: symbol
	});
}

function convertToFloat(val) {
	if(val && val != "") {
		return parseFloat(val);
	}
}

function getFlashPointSize(params, data) {
	////获取闪烁点大小
	var val = convertToFloat(params[2]); ////值
	var dataKey = Object.keys(data.data)[0]
	var maxValue = Math.max(...data.data[dataKey])
	var minValue = Math.min(...data.data[dataKey]);

	////最大50，最小10
	var size = 50 * val / maxValue;
	return size
}
// xieshen绘制自定义多边形
//取面
MapOperator.prototype.measureArea = function(fun) {
	var that = this
	$("#divDTInfo").hide();
	this.view.popup.close();
	this.view.graphics.removeAll();
	hd();

	function hd() {
		const action = that.draw.create("polygon");
		that.view.focus();
		action.on(["vertex-add", "vertex-remove", "cursor-update", ], (event) => {
			if(event.vertices.length == 2) {
				that.view.popup.close();
				that.view.graphics.removeAll();
				const graphic = new that.types.Graphic({
					geometry: {
						type: "polyline",
						paths: event.vertices,
						spatialReference: that.view.spatialReference
					},
					symbol: {
						type: "simple-line", // autocasts as new SimpleFillSymbol
						color: "#00ffff",
						width: 1,
						cap: "square",
						join: "round"
					}
				});
				that.view.graphics.add(graphic);
			}
			if(event.vertices.length > 2) {
				that.view.graphics.removeAll();
				var polygon = {
					type: "polygon", // autocasts as Polygon
					rings: event.vertices,
					spatialReference: that.view.spatialReference
				};
				var graphic = new that.types.Graphic({
					geometry: polygon,
					symbol: {
						type: "simple-fill", // autocasts as new SimpleFillSymbol()
						color: [255, 64, 64, 0],
						style: "diagonal-cross",
						outline: { // autocasts as new SimpleLineSymbol()
							color: "#00ffff",
							width: 3
						}
					}
				});
				that.view.graphics.add(graphic);
				try {
					ctcxPage.drawGeometry = graphic.geometry
				} catch(e) {}

			}
		});
		action.on("draw-complete", (event) => {
			/*var polygon = new that.types.Polygon({
				rings: event.vertices,
				spatialReference: that.view.spatialReference
			});
			var area = that.types.geoEngine.planarArea(polygon, 'square-meters');
			position = that.view.toMap(event.native)
			that.view.popup.open({
				title: "用地性质",
				location: position,
				content: '<input><button>确定</button>'
			});
			setTimeout(function() {
				$('.esri-popup__header-buttons').off().click(function() {
					that.view.graphics.removeAll();
				});
			}, 500);*/
			fun(event)
		});
	}

}

//******************start 坐标转换成集合图形
MapOperator.prototype.GetPoint = function(x, y) {
	var point = new this.types.Point({
		"spatialReference": this.view.spatialReference,
		"x": x,
		"y": y
	});
	return point;
}
MapOperator.prototype.GetPolyline = function(xyArr) {
	var polyline = new this.types.Polyline({
		"spatialReference": this.view.spatialReference,
		"paths": xyArr
	});
	return polyline;
}
MapOperator.prototype.GetPolygon = function(xyArr) {
	var polygon = new this.types.Polygon({
		"spatialReference": this.view.spatialReference,
		"rings": xyArr
	});
	return polygon;
}
//******************end   坐标转换成集合图形

//面定位
MapOperator.prototype.locationPolygon = function(polygon) {
	var fillSymbol = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: [0, 0, 0, 0],
		outline: {
			// autocasts as new SimpleLineSymbol()
			color: [0, 255, 255],
			width: 2
		}
	};
	var polygonGraphic = new this.types.Graphic({
		geometry: polygon,
		symbol: fillSymbol
	});
	//this.map.findLayerById("dk").graphics.add(polygonGraphic);
	this.view.graphics.add(polygonGraphic);
	var showExtent = polygonGraphic.geometry.extent;
	//showExtent.expand(1.5);
	this.view.extent = showExtent;
	this.view.zoom -= 1
	//this.view.center = polygonGraphic.geometry.extent.center;
}

//绘制范围
MapOperator.prototype.drawPolygon = function(retrunGeo) {
	var that = this;
	that.view.graphics.removeAll();
	var action = that.draw.create("polygon");
	that.view.focus();
	action.on(["vertex-add", "vertex-remove", "cursor-update"], (event) => {
		if(event.vertices.length == 2) {
			that.view.graphics.removeAll();
			const graphic = new that.types.Graphic({
				geometry: {
					type: "polyline",
					paths: event.vertices,
					spatialReference: that.view.spatialReference
				},
				symbol: {
					type: "simple-line", // autocasts as new SimpleFillSymbol
					color: "#00ffff",
					width: 2,
					cap: "square",
					join: "round"
				}
			});
			that.view.graphics.add(graphic);
		}
		if(event.vertices.length > 2) {
			that.view.graphics.removeAll();
			var polygon = {
				type: "polygon", // autocasts as Polygon
				rings: event.vertices,
				spatialReference: that.view.spatialReference
			};
			var graphic = new that.types.Graphic({
				geometry: polygon,
				symbol: {
					type: "simple-fill", // autocasts as new SimpleFillSymbol()
					color: [255, 64, 64, 0],
					style: "diagonal-cross",
					outline: { // autocasts as new SimpleLineSymbol()
						color: "#00ffff",
						width: 2
					}
				}
			});
			that.view.graphics.add(graphic);
		}
	});
	action.on("draw-complete", retrunGeo);
}

//添加面渲染效果并定位
MapOperator.prototype.PolygonGraphAdd = function(polygon) {
	var graphic = new this.types.Graphic({
		geometry: polygon,
		symbol: {
			type: "simple-fill", // autocasts as new SimpleFillSymbol()
			color: [255, 64, 64, 0],
			style: "diagonal-cross",
			outline: { // autocasts as new SimpleLineSymbol()
				color: "#00ffff",
				width: 3
			}
		}
	});
	this.view.graphics.add(graphic);
	var showExtent = graphic.geometry.extent;
	showExtent.expand(2);
	this.view.extent = showExtent;
}

// 添加网络图像图层
// name: 图层名
// url: 图层 url
// return: 新添加的图层实例
MapOperator.prototype.addImageryLayer = function(url, type, code) {
	//this.map.removeAll();
	if(this.map.findLayerById('tc')) {
		var lay = this.map.findLayerById('tc');
		this.map.remove(lay);
	}
	switch(type) {
		case "tile":
			var layer = new this.types.TileLayer({
				url,
				id: 'tc'
			})
			break;
		case "image":
			var layer = new this.types.MapImageLayer({
				url,
				id: 'tc'
			});
			break;
		default:
			var layer = new this.types.FeatureLayer({
				url,
				id: 'tc'
			})
			break;
	}
  if(code) {
		layer.diyAttr = code
	}
	this.map.add(layer, 0);
	return layer
}

//添加范围线面渲染效果并定位
//GraphicsLayerId- 渲染添加到指定的GraphicsLayer里
MapOperator.prototype.fwxPolygonGraphAdd = function(polygon, GraphicsLayerId) {
	var graphic = new this.types.Graphic({
		geometry: polygon,
		symbol: {
			type: "simple-fill", // autocasts as new SimpleFillSymbol()
			color: [0, 255, 255, 0.2],
			outline: {
				// autocasts as new SimpleLineSymbol()
				color: [0, 255, 255],
				width: 2
			}
		}
	});
	if(GraphicsLayerId) {
		this.map.findLayerById(GraphicsLayerId).graphics.add(graphic, 2);
	} else {
		this.view.graphics.add(graphic);
	}
	var showExtent = graphic.geometry.extent;
	showExtent.expand(2);
	this.view.extent = showExtent;
}

//添加指定颜色面渲染效果
//GraphicsLayerId- 渲染添加到指定的GraphicsLayer里
MapOperator.prototype.polygonColorGraphAdd = function(polygon, symbolColor, outlineColor, width, attributes, GraphicsLayerId, Number,size) {
	var graphic = new this.types.Graphic({
		geometry: polygon,
		/*attributes:{
			"ydxz":ydType
		},*/
		'attributes': attributes,
		symbol: {
			type: "simple-fill", // autocasts as new SimpleFillSymbol()
			color: symbolColor,
			outline: {
				// autocasts as new SimpleLineSymbol()
				color: outlineColor,
				width: width
			}
		}
	});

	if(GraphicsLayerId) {

		this.map.findLayerById(GraphicsLayerId).graphics.add(graphic, 1);

		if(Number) {
			var graphicNumber = new this.types.Graphic({
				geometry: polygon.extent.center,
				symbol: {
					type: "text", // autocasts as new TextSymbol()
					color: "white",
					haloColor: "black",
					haloSize: "1px",
					text: Number,
					font: { // autocasts as new Font()
						
						size: size
						
					}
				}
			});
			this.map.findLayerById("text").graphics.add(graphicNumber);
		}

	} else {
		this.view.graphics.add(graphic);
	}
}

//计算面积单位公顷
MapOperator.prototype.areaPgon = function(geo) {
	geo.spatialReference = this.view.spatialReference;
	var txmj = this.types.geoEngine.planarArea(geo, 109401);
	//this.view.spatialReference.wkid = null;
	txmj = Math.abs(txmj);
	return txmj;
}