$(function () {
	xieshenPage.init();
	xieshenPage.eventBind();

});

var xieshenPage = {
	//主地图封装对象
	mapOperator: null,
	mapOperator_jsxm: null, //建设项目里地图对象
	//对比地图封装对象
	mapOperator1: null,
	mapOperator2: null,

	JsxmYdxz: null, //建设项目选择的用地性质
	shpGeoRing: null, //shp文件解析后的面图形的ring
	xsType: 'JSXM', //协审选择的类型（默认是建设项目）
	xsResult_jsxm: {}, //建设项目协审结果
	xsResult_JSXM_COUNT: 0, ////建设项目数量
	shpPtah: null, // 返回的shp文件路径(建设项目部分)

	faShpPath: null, // 返回的shp文件路径(规划方案部分)
	attributeStr: null, //规划方案里选择的属性
	xsResult_ghfa: {}, //规划方案协审结果
	faFwGeo: null, //规划方案上传的范围图形
	faDkGeoArr: [], //规划方案上传的地块图形
	ghrk:null, //规划人口


	rkxzData: null,//查询人口现状信息
	yztData: null, //一张图查询信息
	kzyslsData: null, //控制要素落实信息
	dlss:null,//道路设施数据

	ruleArrInfo: {}, //所有图层的规则集合

	//python文件组
	pythonArr: [],
	pythonArrBak: null, //python文件组备份
	////进度条名字
	setpArr: [],
	ScreenShot: [], ////截图
	layersObj: {
		"土地利用总体规划": {},
		"基本农田": {},
		"基本生态控制线": {},
		"总规过渡版总图": {},
		"控制性详细规划": {},
		"生态保护红线": {},
		"三线一路": {}
	},
	fwx: null,
	//图层冲突组
	ctMap: [],
	//打开的图层对象
	openObj: {},
	//文件路径
	path: null,
	//load
	tAction: true,
	tTime: 0,
	init: function () {

		this.initMainMap();
		this.pythonArr = [];
		this.setpArr = [];

		//请求协审结果列表数据
		this.XsjgAjax();

		//请求用地类型表
		this.getYdlxB()

	},
	//请求用地类型表
	getYdlxB: function () {
		$.ajax({
			url: apiHttp + '/api/UseLand/GetUseLandList',
			type: "get",
			dataType: "json", // 请求格式
			//jsonp: "callback", // 参数名
			async: true,
			success: function (response) {
				if (response.Flag == 10000) {
					xieshenPage.ydlxB = response.Datas;
				} else {
					alert(response.Message)
				}

			},
			error: function (response) {
				console.log(response);
			}
		});
	},
	//请求协审结果数据
	XsjgAjax: function () {
		$.ajax({
			url: apiHttp + '/api/LayerAttr/GetLayerAttr',
			type: "get",
			dataType: "json", // 请求格式
			//jsonp: "callback", // 参数名
			async: true,
			success: function (response) {
				xieshenPage.XsjgData(response);
			},
			error: function (response) {
				console.log(response);
			}
		});
	},

	//处理协审结果数据
	XsjgData: function (data) {
		console.log(data);
		xieshenPage.webArr = []
		let layerdatas = data.Datas;
		for (let key in layerdatas) {
			for (let i = 0; i < layertree.length; i++) { //生成layertree
				if (layertree[i].name == layerdatas[key].ascription) {
					layertree[i].child.push({
						"name": layerdatas[key].name,
						"code": layerdatas[key].customcode
					})
				}
			}

			if (layerdatas[key].layerurl && layerdatas[key].type) { //生成xsLayerInfo
				xsLayerInfo[layerdatas[key].name] = {
					"url": layerdatas[key].layerurl,
					"type": layerdatas[key].type,
					'code': layerdatas[key].customcode,
					'layerId': layerdatas[key].layid,
					'attr': layerdatas[key].attr
				}
			} else {
				xsLayerInfo[layerdatas[key].name] = "";
			}
		}

		var code = "";
		for (var i = 0; i < layertree.length; i++) {
			for (var j = 0; j < layertree[i].child.length; j++) {
				code = layertree[i].child[j].code;
				if (code && code != "") {
					xieshenPage.pythonArr.push(code);
					xieshenPage.webArr.push(layertree[i].child[j].name);
					xieshenPage.setpArr.push(layertree[i].child[j].name)
				}
			}
		}

		console.log(layertree)
		console.log(xsLayerInfo)

		xieshenPage.XsjgHtml();
	},

	//生成协审结果列表
	XsjgHtml: function () {
		let html = "";
		let ghhtml = ""
		for (let i = 0; i < layertree.length; i++) { //生成建设项目协审结果列表
			html += "<div class='title'>" + layertree[i].name + "</div><div class='samestyle'><ul id='sameList'>";
			//html += "";
			for (let j = 0; j < layertree[i].child.length; j++) {
				html += "<li data-code='" + layertree[i].child[j].code + "'>" + layertree[i].child[j].name + "<i class=''></i></li>"
			}
			html += "</ul></div>";
		}

		$(".xsMb").append(html);

		for (let i = 0; i < layertree.length; i++) { //生成规划方案协审结果列表
			ghhtml += "<div class='title'>" + layertree[i].name + "</div><div class='samestyle'><ul id='sameList'>";
			for (let j = 0; j < layertree[i].child.length; j++) {
				ghhtml += "<li><span data-code='" + layertree[i].child[j].code + "'>" + layertree[i].child[j].name + "<i></i></li>"
			}
			ghhtml += "</ul></div>";
		}

		$(".left").append(ghhtml);
		xieshenPage.XsjgClick();
	},

	//建设项目和规划方案协审结果图层面板点击事件
	XsjgClick: function () {
		//协审结果图层面板里图层点击
		$('.xsMb li').click(function (e) {
			xieshenPage.mapOperator_jsxm.view.popup.close();
			var layerName = $(this).text();
			e.preventDefault();
			for (let j = 0; j < layertree.length; j++) { //该标签具有图层协审数据时触发
				for (let k = 0; k < layertree[j].child.length; k++) {
					if (layerName == layertree[j].child[k].name && layertree[j].child[k].code) {
						$('.xsMb li').removeClass('liActive');
						$(this).addClass('liActive');
						//显示具体图层冲突信息
						xieshenPage.showDetail(layerName);
						return;
					}
				}
			}

			alert("此图层暂无协审数据");
		});
		//协审结果面板里显示文案按钮
		$('.xsMb .head .xsyj').click(function (e) {
			//文档滚动条初始化
			xieshenPage.isCheckWord = 0

			//$(".transition-loader").show()

			e.preventDefault();

			//建设项目里隐藏详情
			$('.xsXq').hide();
			$('.xieshenResultBox').show();
			$("#divXSYJD").scrollTop(0)
			$(".xsMb").hide()
		});
		//协审结果的图层面板的关闭按钮
		$('.xsMb .closeMb').click(function (e) {
			e.preventDefault();
			//图层面板隐藏、协审详情隐藏
			$('.xsMb,.xsXq').hide();
			//显示选择范围面板
			$('#jsxmMb').show();
			//上传方式重置uploadNote
			$("#jsxmMb .uploadNote").html(':未上传');
			$("#jsxmMb .yuan").removeClass("yuanAction");
			//选择用地性质恢复
			$('#jsxmMb .ydxzBtn').removeClass('navActive').html('请选择用地性质').attr('title', '请选择用地性质');
			//清除地图上上次渲染
			xieshenPage.mapOperator.view.graphics.removeAll();

			//重置内容部分
			xieshenPage.JsxmYdxz = null
			xieshenPage.shpGeoRing = null
		});

		//规划方案的协审结果窗口关闭按钮
		$('.faXq #closeFa').click(function (e) {
			e.preventDefault();
			//规划方案协审详情隐藏
			$('.faXq').hide();
			//显示选择范围面板并重置
			$('#ghfaMb').show();
			//上传方式重置uploadNote
			$("#ghfaMb .uploadNote").html(':未上传');
			$("#ghfaMb .yuan").removeClass("yuanAction");
			//选择属性恢复
			$('#ghfaMb #attr span').html('').attr('title', '');
			$('#ghfaMb .attrList').html('');
			//清除地图上上次渲染
			xieshenPage.mapOperator.view.graphics.removeAll();
		});
		//规划方案的协审结果图层点击
		$('.faXq .left li span').click(function (e) {
			var layerName = $(this).text();
			e.preventDefault();
			for (let j = 0; j < layertree.length; j++) { //该标签具有图层协审数据时触发
				for (let k = 0; k < layertree[j].child.length; k++) {
					if (layerName == layertree[j].child[k].name && layertree[j].child[k].code) {
						$('.faXq .left li span').removeClass('navActive');
						$(this).addClass('navActive');
						xieshenPage.showDetail_fa(layerName);
						return;
					}
				}
			}

			alert("此图层暂无协审数据");
		});
	},

	initMainMap: function () {
		xieshenPage.mapOperator = new MapOperator();
		xieshenPage.mapOperator1 = new MapOperator();
		xieshenPage.mapOperator2 = new MapOperator();
		xieshenPage.mapOperator_jsxm = new MapOperator();
		var lsWhen = xieshenPage.mapOperator.initMap('mapView');
		lsWhen.then(() => {
			xieshenPage.mapOperator.initBaseDiyMap()
		})
	},
	////建设项目worddata
	wordDataXM: "",
	eventBind: function () {
		//回到以前表格
		$(".faXq .xsBg").click(function () {
			xieshenPage.mapOperator2.map.findLayerById("fg").removeAll();
			xieshenPage.mapOperator2.map.findLayerById("fx").removeAll();
			xieshenPage.mapOperator2.map.findLayerById("text").removeAll();
			xieshenPage.mapOperator2.map.findLayerById("select").removeAll();
			xieshenPage.mapOperator2.view.popup.close();
			if (xieshenPage.currentLayerName == "总规过渡版总图") {
				$(".faXq .tableDiv").show()
			} else {
				$(".faXq .table_yfa").show()
				$(".faXq .table_xfa").show()
			}

			$(".faXq .fxTableDiv").hide()
		})
		//判断预览文档是否检查过
		$("#divXSYJD").scroll(function () {
			var top = $("#divXSYJD").scrollTop()
			var hei = $("#divXSYJD .content").height() - $("#divXSYJD").height()
			if (top >= hei) {
				xieshenPage.isCheckWord = 1
			}
		})
		//冲突图层开关
		$(".jsxmCheckBox").click(function () {
			let is = $(".jsxmCheckBox input").attr("checked")
			if (is) {
				$(".jsxmCheckBox input").attr("checked", false);
				$(".diyLegendBox").hide()
				//xieshenPage.mapOperator_jsxm.map.findLayerById('xsState').graphics.removeAll()
				xieshenPage.mapOperator_jsxm.map.findLayerById('xsState').opacity = 0
				xieshenPage.mapOperator_jsxm.map.findLayerById('text').opacity = 0
			} else {
				$(".jsxmCheckBox input").attr("checked", true)
				$(".diyLegendBox").show()
				//xieshenPage.clashShow('mapOperator_jsxm', xieshenPage.currentCode)
				xieshenPage.mapOperator_jsxm.map.findLayerById('xsState').opacity = 1
				xieshenPage.mapOperator_jsxm.map.findLayerById('text').opacity = 1
			}
		})
		$(".ghfaCheckBox").click(function () {
			let is = $(".ghfaCheckBox input").attr("checked")
			if (is) {
				$(".ghfaCheckBox input").attr("checked", false);
				$(".diyLegendBox").hide()
				//xieshenPage.mapOperator_jsxm.map.findLayerById('xsState').graphics.removeAll()
				xieshenPage.mapOperator2.map.findLayerById('xsState').opacity = 0
				xieshenPage.mapOperator2.map.findLayerById('text').opacity = 0
				xieshenPage.mapOperator2.map.findLayerById('fx').opacity = 0
				xieshenPage.mapOperator2.map.findLayerById('fg').opacity = 0
			} else {
				$(".ghfaCheckBox input").attr("checked", true)
				$(".diyLegendBox").show()
				//xieshenPage.clashShow('mapOperator_jsxm', xieshenPage.currentCode)
				xieshenPage.mapOperator2.map.findLayerById('xsState').opacity = 1
				xieshenPage.mapOperator2.map.findLayerById('text').opacity = 1
				xieshenPage.mapOperator2.map.findLayerById('fx').opacity = 1
				xieshenPage.mapOperator2.map.findLayerById('fg').opacity = 1
			}
		})

		//上传地块的渲染图层的显示隐藏控制
		$(".dkCheckBox").click(function () {
			let is = $(".dkCheckBox input").attr("checked")
			if (is) {
				$(".dkCheckBox input").attr("checked", false);
				xieshenPage.mapOperator2.map.findLayerById('dk').opacity = 0
			} else {
				$(".dkCheckBox input").attr("checked", true)
				xieshenPage.mapOperator2.map.findLayerById('dk').opacity = 1
			}
		})

		//建设项目.规划方案、提取规划的导航点击
		$(".navBtn").click(function () {
			$(".ydxzMb").hide()
			try {
				xieshenPage.mapOperator.draw.reset();
			} catch (e) {

			}

			$(this).addClass("navActiveBtn").siblings().removeClass("navActiveBtn");
			var showId = $(this).attr("data-show");
			//重置内容部分
			xieshenPage.JsxmYdxz = null
			xieshenPage.shpGeoRing = null
			//显示原始状态，隐藏其他的面板
			$(".mb").hide();
			$("#" + showId).show();
			$(".yuan").removeClass("yuanAction");
			//隐藏协审结果的图层面板、某图层详情面板
			$('.xsMb,.xsXq').hide();
			//隐藏规划方案详情方案详情
			$('.faXq').hide();
			//隐藏协审结构文案
			$('.xieshenResultBox #closeRes').click();

			//隐藏提取规划条件生成清单
			$('.closetqghMb').click();
			//隐藏提取规划结果单
			$('.closeBox').click();

			if (showId == 'jsxmMb') {
				xieshenPage.xsType = 'JSXM'; //建设项目
				$('.xsMb .closeMb').click();
				//$(".hzBox").click()
				$(".scBox").css({
					"top": "0.56rem"
				})
			}
			if (showId == 'ghfaMb') {
				xieshenPage.xsType = 'GHFA'; //规划方案
				$('.faXq #closeFa').click();
				$(".table_yfa").hide();
				$(".table_xfa").hide();
				$(".faXq .tableDiv").hide();
				$('.faXq .left li span').removeClass('navActive');
				$(".scBox").css({
					"top": "0.28rem"
				})
			}

			if (showId == 'tqghMb') { //提取规划
				$('.ydxzMb').hide();
				$(".scBox").css({
					"top": "0.56rem"
				})
				//清除地图上上次渲染
				xieshenPage.mapOperator.view.graphics.removeAll();
			}
		});

		//协审结果文案里回溯按钮点击
		$('#hs').click(function (e) {
			e.preventDefault();
			$('.xieshenResultBox').hide();
			if (xieshenPage.xsType == 'JSXM') {
				//隐藏获取范围面板、协审文案
				$('#jsxmMb').hide();

				//显示协审结果图层面板
				$('.xsMb').show();

				$(".xsMb li").removeClass("liActive")
				//初始化地图
				//xieshenPage.mapOperator_jsxm.initMap('mapView_jsxm');
			}
			if (xieshenPage.xsType == 'GHFA') {
				//隐藏获取范围面板、协审文案
				$('#ghfaMb').hide();
				//显示规划方案的协审结果图层面板
				$('.faXq').show();
				/*//初始化地图
				xieshenPage.mapOperator1.initMap('mapView1');
				xieshenPage.mapOperator2.initMap('mapView2');
				//地图联动
				if(xieshenPage.mapOperator1.releativeOperator.size == 0) {
					xieshenPage.mapOperator1.addRelativeOperator(xieshenPage.mapOperator2);
					xieshenPage.mapOperator2.addRelativeOperator(xieshenPage.mapOperator1);
				}*/
			}
		});
		//协审结果文案关闭按钮点击
		$('.xieshenResultBox #closeRes').click(function (e) {
			e.preventDefault();
			$('.xieshenResultBox').hide();
		});

		//#region 规划方案里点击事件

		$("#ghfaMb #attr").click(function (event) {
			event.stopPropagation();
			/*if(!$(this).children().eq(0).html()) { //判断下拉框选项中是否有值
				return
			}*/
			if (!$('#ghfaMb .attrList').html()) { //判断下拉框选项中是否有值
				return
			}

			if ($(".attrList").is(":visible")) {
				$(".attrList").hide();
			} else {
				$(".attrList").show();
			}
		});
		/* $("#ghfaMb .attrList li").click(function (event) {
			$(".attrList").hide();
			$("#ghfaMb #attr>span").html($(this).text());
			$("#ghfaMb #attr>span").attr("title", $(this).text());
		}); */
		//点击其他地方，隐藏属性下拉项
		$(document).click(function (event) {
			var eo = $(event.target);
			if ($(".attrList").is(":visible") && eo.attr("class") != "attrList" && !eo.parent(".attrList").length)
				$(".attrList").hide();
		});
		//上传文件
		xieshenPage.initFileInput();
		$("#ghfaMb .scBox").click(function () {
			//清除渲染
			xieshenPage.mapOperator.view.graphics.removeAll();
			$(this).find(".yuan").addClass("yuanAction");
			$('#ghfaMb #uploadFileFA').click();
		});

		//开始审查点击
		$('#ghfaMb .startBtn').click(function (e) {

			xieshenPage.wordDataXM = ''
			e.preventDefault();
			//获取用地性质
			var attr = $('#attr span').text();
			if (attr == "") {
				alert('请选择用地性质');
				return false;
			}
			$(".transition-loader").show()
			//执行查询
			xieshenPage.attrFa = attr

			xieshenPage.faQuery();

		});

		//#region 建设项目里点击事件
		$(".jsxmSelect").click(function () {
			//清除渲染
			xieshenPage.mapOperator.view.graphics.removeAll();
			$(".jsxmSelect .yuan").removeClass("yuanAction");
			$(this).find(".yuan").addClass("yuanAction");
			var type = $(this).attr('data-type');
			//xieshenPage.shpGeoRing = null;
			if (type == 'sc') { //上传按钮
				xieshenPage.mapOperator.draw.reset();
				$('#jsxmMb #uploadFileXM').click();
			}
			if (type == 'hz') { //绘制图形
				xieshenPage.mapOperator.drawPolygon(function (evt) {
					var geoRing = evt.vertices;
					/*xieshenPage.shpGeoRing = [geoRing];
					console.log(geoRing);*/
					var polygon = {
						type: "polygon", // autocasts as Polygon
						rings: evt.vertices,
						spatialReference: xieshenPage.mapOperator.view.spatialReference
					};
					var graphic = new xieshenPage.mapOperator.types.Graphic({
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
					console.log(graphic)
					var geoS = xieshenPage.mapOperator.types.geoEngine.simplify(graphic.geometry)
					console.log(geoS)
					xieshenPage.shpGeoRing = geoS.rings
					xieshenPage.jsxmGeo = geoS
				});
			}
		});
		//上传input
		xieshenPage.inputC();
		//选择用地性质
		$('#jsxmMb .ydxzBtn').click(function (e) {
			e.preventDefault();
			$('.ydxzMb .xl .xlname').html('选择小类')
			if (!xieshenPage.shpGeoRing) {
				alert('请获取图形');
				return false;
			}
			xieshenPage.JsxmYdxz = null;
			if (!$(this).hasClass('navActive')) {
				$(this).addClass('navActive');
			}
			$(this).html('请选择用地性质').attr('title', '请选择用地性质');
			//显示选择用地性质面板
			xieshenPage.showYdxzMb();
			//$(".ydxzMb").show();
		});

		//用地性质面板的‘确定’按钮
		$('.ydxzMb .ydxzStart').click(function (e) {
			e.preventDefault();
			//获取当前选中的小类部分
			var clickObj = $('.ydxzMb .xlList li.navActive');
			if (clickObj.length !== 1) {
				alert('请选择小类');
			} else {
				xieshenPage.JsxmYdxz = clickObj.attr('data-code');
				console.log(xieshenPage.JsxmYdxz);
				$(".ydxzMb").hide();
				$('.ydxzMb .xl .xlname').removeClass('xlTitleStyle') //去除小类标题样式
				$('.ydxzBtn').html(clickObj.html()).attr('title', clickObj.html());
			}
		});

		//开始审查点击
		$('#jsxmMb .startBtn').click(function (e) {

			xieshenPage.wordDataXM = ''
			e.preventDefault();
			//获取图形及用地性质
			if (!xieshenPage.shpGeoRing) {
				alert('请获取图形');
				return false;
			}
			if (!xieshenPage.JsxmYdxz) {
				alert('请选择用地性质');
				return false;
			}
			$(".transition-loader").show()
			xieshenPage.shpPtah = null;

			xieshenPage.jsxmQuery()
		});

		//协审详情关闭按钮
		$('.xsXq #closeXq').click(function (e) {
			e.preventDefault();
			$('.xsXq').hide();
		});
		//#endregion
		$(".closeYdxzMb").click(function () {
			$(".ydxzMb").hide()
			$('.ydxzMb .xl .xlname').removeClass('xlTitleStyle')
		})

		//提取规划相关事件
		//初始化规划设计条件生成清单的默认选中复选框
		xieshenPage.initCheck();
		//开始审查点击
		$('#tqghMb .startBtn').click(function () {
			$("#tqghMb .ghList .selbox").removeClass("selcheck");
			$('.closetqghMb').click();
			$('.closeBox').click();
			xieshenPage.initCheck();
			$('#tqghMb .ghList').show();
		})

		xieshenPage.initFileGH();

		$(".tqghSelect").click(function () {
			//清除渲染
			xieshenPage.mapOperator.view.graphics.removeAll();
			$(".tqghSelect .yuan").removeClass("yuanAction");
			$(this).find(".yuan").addClass("yuanAction");

			var type = $(this).attr('data-type');
			if (type == 'ghFile') { //上传按钮
				xieshenPage.mapOperator.draw.reset();
				$('#tqghMb #uploadFileGH').click();
			}
			if (type == 'ghDraw') { //绘制图形
				xieshenPage.mapOperator.drawPolygon(function (evt) {
					var geoRing = evt.vertices;
					xieshenPage.shpGeoRing = [geoRing];
					console.log(geoRing);
				});
			}
		});

		//复选框点击事件
		$('#tqghMb .selbox').click(function () {
			if ($(this).hasClass("selcheck")) {
				$(this).removeClass("selcheck")
			} else {
				$(this).addClass("selcheck");
			}
		})

		$('#tqghMb .selsame').click(function () {
			$('#tqghMb .selsame').removeClass("selActive");
			$(this).addClass("selActive")

			if ($(this).hasClass("seldefault")) {
				$("#tqghMb .ghList .selbox").removeClass("selcheck");
				xieshenPage.initCheck();
			}

			if ($(this).hasClass("selnext")) {
				$('.closetqghMb').click();
				$('.tqghResultBox').show();
			}
		})

		//关闭提取规划表单条件生成清单
		$('.closetqghMb').click(function () {
			$('.ghList').hide();
			$('#tqghMb .selsame').removeClass("selActive");
		})

		//关闭提取协审结果单
		$(".closeBox").click(function () {
			$('.tqghResultBox').hide();
		})

		//请求报告按钮
		$(".xsyjFa").click(function () {
			//查询人口现状和一张图数据
			xieshenPage.queryYztAndRkxz();
			//请求报告
			xieshenPage.queryReportFa();
			//$(".transition-loader").hide()

			//$(".faXq").hide()

			//$('.xieshenResultBox').show();
		})

	},
	//初始化规划设计条件生成清单的默认选中复选框
	initCheck: function () {
		let liList = $("#tqghMb .ghList .selbox");
		for (let i = 0; i < liList.length; i++) {
			if (liList.eq(i).hasClass("selms")) {
				liList.eq(i).addClass("selcheck")
			}
		}
	},
	//提取规划上传项目部分
	initFileGH: function () {
		$("#uploadFileGH").off("change").change((event) => {
			var files = $("#uploadFileGH")[0].files;
			//判断文件是否符合要求
			var flg = xieshenPage.checkFiles(files);
			if (flg.isTrue) {
				$("#tqghMb .uploadNote").text("：" + $("#uploadFileGH")[0].files[0].name.split('.')[0]);
				//xieshenPage.ajaxFA();
			} else {
				$("#ghfaMb .uploadNote").text("：未上传");
				//alert(flg.message);
			}
			$("#uploadFileGH").val('');
		});
	},

	//#region 建设项目部分里用到的方法
	//查询用地性质大类并展示
	showYdxzMb: function () {
		$('.ydxzMb .dlList,.ydxzMb .xlList').html("");
		$.ajax({
			type: "GET",
			url: apiHttp + "/api/UseLand/GetUseLand",
			data: "",
			dataType: "json",
			success: function (response) {
				console.log(response);
				if (response.Datas) {
					xieshenPage.showYdxzDl(response.Datas);
				} else {
					alert('查询用地性质出错');
				}
			},
			error: function (response) {
				alert('查询用地性质出错');
			}
		});
	},
	//构建用地性质大类内容
	showYdxzDl: function (data) {
		var htmlStr = '';
		for (var i = 0; i < data.length; i++) {
			var element = data[i];
			htmlStr += '<li title="' + element.description + '" data-code="' + element.code + '">' + element.description + '(' +
				element.code + ')' + '</li>';
		}

		$('.ydxzMb .dlList').html(htmlStr);
		$('.ydxzMb').show();
		//大类点击，查询小类
		$('.ydxzMb .dlList li').click(function (e) {
			e.preventDefault();
			xieshenPage.dlName = $(this).html(); //获取到当前点击的大类的名字
			console.log(xieshenPage.dlName)
			$(this).addClass('navActive').siblings().removeClass('navActive');
			$(this).addClass('navBtnActive').siblings().removeClass('navBtnActive');
			var code = $(this).attr('data-code');
			xieshenPage.showYdxzXl(code);
		});
	},
	//根据用地性质大类查询小类
	showYdxzXl: function (data) {
		$.ajax({
			type: "GET",
			url: apiHttp + "/api/UseLand/GetUseLand",
			data: {
				'code': data
			},
			dataType: "json",
			success: function (response) {
				console.log(response);
				if (response.Datas) {
					xieshenPage.getYdxzXlHtml(response.Datas);
				} else {
					alert('查询用地性质出错');
				}
			},
			error: function (response) {
				alert('查询用地性质出错');
			}
		});
	},
	//构建小类结果
	getYdxzXlHtml: function (data) {
		$('.ydxzMb .xl .xlname').html(xieshenPage.dlName)
		$('.ydxzMb .xl .xlname').addClass('xlTitleStyle')
		var htmlStr = '';
		for (var i = 0; i < data.length; i++) {
			var element = data[i];
			htmlStr += '<li title="' + element.description + '" data-code="' + element.code + '">' + element.description + '(' +
				element.code + ')' + '</li>';
		}
		$('.ydxzMb .xlList').html(htmlStr);
		$('.ydxzMb .xlList').show();
		$('.ydxzMb .xlList li').click(function (e) {
			e.preventDefault();
			$(this).addClass('navActive').siblings().removeClass('navActive');
			$(this).addClass('navBtnActive').siblings().removeClass('navBtnActive');
		});
	},
	//建设项目里上传文件
	//input域变化
	inputC: function () {
		$("#uploadFileXM").off("change").change((event) => {
			var files = $("#uploadFileXM")[0].files;
			//判断文件是否符合要求
			var flg = xieshenPage.checkFile(files);
			if (flg.isTrue) {
				$("#jsxmMb .uploadNote").text("：" + $("#uploadFileXM")[0].files[0].name.split('.')[0]);
				xieshenPage.ajaxF();
			} else {
				$("#jsxmMb .uploadNote").text("：未上传");
				alert(flg.message);
			}

			$("#uploadFileXM").val('');
		});
	},
	//判断上传的文件是否符合要求
	checkFile: function (files) {
		var msg = {
			'isTrue': false
		};
		if (files.length < 3) {
			msg['message'] = '请上传至少三个主要文件';
			return msg;
		}
		//取文件后缀
		var suffix = [];
		for (var i = 0; i < files.length; i++) {
			var element = files[i].name.split('.')[1];
			suffix.push(element);
		}
		if (suffix.indexOf('dbf') != -1 && suffix.indexOf('shp') != -1 && suffix.indexOf('shx') != -1) {
			msg['isTrue'] = true;
			return msg;
		} else {
			msg['message'] = '缺少.shp或.dbf或.shx文件';
			return msg;
		}
	},

	//后台解压
	ajaxF: function () {
		$.ajax({
			url: netHttp + '/WebService.ashx?action=upLoadJSXM',
			//url: netHttp + '/WebService.ashx?action=Upload',
			type: 'POST',
			cache: false,
			data: new FormData($('#formXM')[0]),
			processData: false,
			contentType: false,
			dataType: "json",
			beforeSend: function () {
				uploading = true;
			},
			success: (data) => {
				console.log(data);
				if (data.Res) {
					xieshenPage.dealFeature(data);
				} else {
					alert('解析出错');
				}
			},
			error: (data) => {
				console.log(data);
				alert('解析出错');

			}
		});
	},
	//处理解析出来的要素
	dealFeature: function (data) {

		var xieshenLayer = xieshenPage.mapOperator.map.findLayerById("dk");

		xieshenLayer.removeAll();

		var featuresArr = JSON.parse(data.Res).features;
		if (featuresArr.length > 1) {
			alert('建设项目里只能上传单个地块,请上传正确文件');
		} else {
			//定位图形			
			var polygon = xieshenPage.mapOperator.GetPolygon(featuresArr[0].geometry.coordinates);
			xieshenPage.mapOperator.locationPolygon(polygon);
			xieshenPage.shpGeoRing = featuresArr[0].geometry.coordinates;
			xieshenPage.jsxmGeo = polygon
		}
	},
	ReturnGeojson: function (fid, ydxz, rings) {
		return {
			"geometryType": "esriGeometryPolygon",
			"spatialReference": xieshenPage.mapOperator.view.spatialReference,
			"fields": [{
				"name": "FID",
				"type": "esriFieldTypeOID",
			}, {
				"name": "用地性质",
				"type": "esriFieldTypeString",
				"length": 254
			}],
			"features": [{
				"attributes": {
					"FID": fid,
					"用地性质": ydxz
				},
				"geometry": {
					"rings": rings
				}
			}]
		};
	},
	//返回shp文件路径
	ToShpCallback: function (data, pythonArr) {
		xieshenPage.faLayerPath = {
			"dk": data
		}
		xieshenPage.ajaxPyData(xieshenPage['xiangmu' + 'Code'], 'jsxm')
	},
	//建设项目协审规则查询
	jsxmQuery: function () {

		xieshenPage.ajaxGetCode('xiangmu')
		//
		xieshenPage.jsxmDkGeoArr = [{
			'geo': xieshenPage.jsxmGeo,
			'ydmj': xieshenPage.mapOperator.types.geoEngine.planarArea(xieshenPage.jsxmGeo, 'hectares'),
			'用地性质': xieshenPage.JsxmYdxz,
			'ydxz': xieshenPage.JsxmYdxz
		}]

		xieshenPage.xsDataObj = {}
		xieshenPage.yesXs = 0
		xieshenPage.sDate = new Date()
		for (let i = 0; i < xieshenPage.webArr.length; i++) {
			var webX = xieshenPage.webArr[i]
			var attrTc = xsLayerInfo[webX].atrr
			let queryTask = new xieshenPage.mapOperator.types.QueryTask({
				url: xsLayerInfo[webX].url + '/' + xsLayerInfo[webX].layerId,
			});

			// 当被统计字段为面积相关字段时，需要分情况进行查询
			let que = new xieshenPage.mapOperator.types.Query();
			que.geometry = xieshenPage.jsxmGeo;
			que.spatialRelationship = "intersects";
			que.outFields = ['*'];
			que.geometryPrecision = 6
			que.returnGeometry = true;
			(function (num) {
				queryTask.execute(que).then((response) => {

					var dkFeaArr = xieshenPage.jsxmDkGeoArr
					var webX = xieshenPage.webArr[num]
					var attrTc = xsLayerInfo[webX].attr
					var code = xsLayerInfo[webX].code
					xieshenPage.xsDataObj[code] = {}
					xieshenPage.xsDataObj[code].hegui = dkFeaArr
					xieshenPage.xsDataObj[code].isHg = null
					xieshenPage.xsDataObj[code].sumarea = []
					var tcFeaArr = response.features
					if (tcFeaArr.length == 0) {
						xieshenPage.xsDataObj[code].isHg = '没有判断规则'
						xieshenPage.xsDataObj[code].source = code
						xieshenPage.yesXs += 1
						if (xieshenPage.webArr.length == xieshenPage.yesXs) {
							//所有图层查询完毕
							xieshenPage.queryAllEnd();
						}
					}
					for (var i = 0; i < dkFeaArr.length; i++) {
						var dkgeo = dkFeaArr[i].geo
						for (var j = 0; j < tcFeaArr.length; j++) {

							var intersect_geo = xieshenPage.mapOperator.types.geoEngine.intersect(tcFeaArr[j].geometry, dkgeo);
							if (i == (dkFeaArr.length - 1) && j == (tcFeaArr.length - 1)) {

								if (intersect_geo) {
									var end = 'yes'
								} else {
									xieshenPage.yesXs += 1
									if (xieshenPage.webArr.length == xieshenPage.yesXs) {
										//所有图层查询完毕
										xieshenPage.queryAllEnd();
									}
								}
							}
							if (intersect_geo) {
								var ydflMj = xieshenPage.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
								if (attrTc) {
									var tcStr = tcFeaArr[j].attributes[attrTc]
								} else {
									var tcStr = ''
								}

								xieshenPage.ajaxRule(code, tcStr, xieshenPage.JsxmYdxz, intersect_geo, ydflMj, end, xieshenPage.queryAllEnd, i)
								//xieshenPage.testArr.push(intersect_geo)
							}
						}
					}

				})
			})(i)
		}
	},
	//查询协审规则脚本
	ajaxQuery: function (urlStr, pythonArr) {
		$.ajax({
			url: urlStr,
			//data: param,
			type: "get",
			dataType: "jsonp", // 请求格式
			//jsonp: "callback", // 参数名
			async: true,
			jsonpCallback: "xieshenPage.eachCallback",
			// error:function (resp,error,e) {
			// 	console.log(e);
			// 	alert("验证"+pythonArr[0]+"出错!");
			// }
		});
	},
	//查询各图层的协审规则的脚本回调
	eachCallback: function (data) {
		console.log(data);

		if (xieshenPage.xsType == 'JSXM') {
			////jietu 
			var xieshenD = data.xieshen
			for (var key in xieshenD) {
				xieshenPage.xsResult_jsxm[key] = xieshenD[key];
			}
			var layer = "";
			for (let i = 0; i < xieshenPage.pythonArr.length; i++) {
				layer += xieshenPage.pythonArr[i]
				if (i < (xieshenPage.pythonArr.length - 1)) {
					layer += ","
				}
			}
			////截图
			xieshenPage.screenShotPng(data);
			xieshenPage.xsResult_JSXM_COUNT++;
			//查询下一个图层
			// xieshenPage.pythonArrBak.splice(0, 1);
			// xieshenPage.ToShpCallback(null, xieshenPage.pythonArrBak);
		} else if (xieshenPage.xsType == 'GHFA') {
			//$("#step").step("next");
			//xieshenPage.xsResult_ghfa[data.source] = data;
			var xieshenD = data.xieshen
			for (var key in xieshenD) {
				xieshenPage.xsResult_ghfa[key] = xieshenD[key];
			}
			//查询下一个图层
			/*xieshenPage.pythonArrBak.splice(0, 1);
			xieshenPage.faQuery(null, xieshenPage.pythonArrBak);*/
			xieshenPage.faQuery(null, true)
		}
	},

	screenShotPng: function (data) {
		/*var shpFile = xieshenPage.shpPtah;
		var index = shpFile.indexOf("Files\\") + "Files\\".length
		var path = shpFile.substring(0, index); ////E:\IIS\15xieshenfile\File\files132101410282681078
		var filename = shpFile.substring(index, shpFile.length - 4); ////不要后
		var url;
		url = pyHttp + "/geoprocessing.py?upload_shp_folder=" + path + "&mxdname=" + layer + "&shpname=" + filename +
			"&extent=0&mode=3";
		$.ajax({
			url: url,
			type: "get",
			dataType: "jsonp",
			async: true,
			jsonpCallback: "xieshenPage.printCallback",
		});*/
		xieshenPage.printCallback(data)
	},
	printCallback: function (data) {
		////建设项目截图完后，才进行下一步
		//$("#step").step("next");
		////保存到全局里
		var printD = data.print
		for (var key in printD) {
			xieshenPage.ScreenShot.push({
				code: printD[key].code,
				pic: printD[key].local,
				webpic: printD[key].web
			});
		}

		/*if(xieshenPage.ScreenShot.length == xieshenPage.pythonArr.length) {
			xieshenPage.queryAllEnd();
		} else {
			xieshenPage.ToShpCallback(xieshenPage.shpPtah)
		}*/
		xieshenPage.queryAllEnd();
	},
	//建设项目协审的所有图层查询完毕
	queryAllEnd: function () {
		if ($("#yongdiMap canvas")[0]) {
			$("#yongdiMap canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
			$("#yongdiMapY canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
		}
		//
		//$(".transition-loader").hide()
		for (let i = 0; i < xieshenPage.pythonArr.length; i++) {
			var code = xieshenPage.pythonArr[i]
			if ($("#" + code + "Map canvas")[0]) {
				$("#" + code + "Map canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
				$("#" + code + "MapY canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
			}
		}

		xieshenPage.xsResult_jsxm = xieshenPage.xsDataObj
		xieshenPage.mapOperator_jsxm.initMap('mapView_jsxm');
		//选中地块
		xieshenPage.mapOperator_jsxm.view.on("click", (event) => {
			xieshenPage.mapOperator_jsxm.view.hitTest(event).then((event) => xieshenPage.xsSelectDk(event));
		});
		var lsDate = new Date()
		var time = lsDate.getSeconds() - xieshenPage.sDate.getSeconds()
		console.log(time)

		//构建协审查询结果面板
		$('.xsMb li').each(function () {
			var layercode = $(this).attr("data-code");
			var aRes = xieshenPage.xsResult_jsxm[layercode];
			if (aRes) {
				var isHg = (aRes.isHg == "1" || aRes.isHg == "没有判断规则") ? 'true' : 'false';
				$(this).find('i').removeClass("false")
				$(this).find('i').removeClass("true")
				$(this).find('i').addClass(isHg);
			}
		});
		//加载建设项目文档
		xieshenPage.showJSXMWord();
		//显示协审结构文案
		//$('.xieshenResultBox').show();
		$(".xsMb").show()
		$(".mb").hide();
	},
	xsSelectDk: function (event) {
		var trArr = $(".tableDiv tbody").find('tr')
		trArr.removeClass("activeXsR")
		for (var i = 0; i < event.results.length; i++) {
			if (event.results[i].graphic.layer.id == "xsState") {

				var geo = event.results[i].graphic.geometry
				var location = geo.extent.center;
				var attributes = event.results[i].graphic.attributes
				break;

			}
		}
		var fid = attributes.fid

		if (location) {
			if (xieshenPage.ydlxB[attributes.type]) {
				var type = xieshenPage.ydlxB[attributes.type] + "(" + attributes.type + ")"
			} else {
				var type = attributes.type
			}
			xieshenPage.mapOperator_jsxm.view.popup.open({
				title: "用地概况",
				location: location,
				content: '<table class="popupContent" border="1">\
					<tr><td>用地性质：  </td><td>' + type + '</td></tr>\
					<tr><td>用地面积： </td><td>' + attributes.totalArea.toFixed(2) + 'ha</td></tr>\
					<tr><td>结论： </td><td>' + attributes.result + '</td></tr></table>'
			});
			setTimeout(function () {
				$('.esri-popup__button').click(function () {
					trArr.removeClass("activeXsR")
					xieshenPage.mapOperator_jsxm.map.findLayerById('select').graphics.removeAll()
				});
			}, 400);
			xieshenPage.mapOperator_jsxm.map.findLayerById('select').graphics.removeAll()
			xieshenPage.mapOperator_jsxm.polygonColorGraphAdd(geo, [0, 255, 255, 0.5], [0, 255, 255, 1], 1, {}, 'select')

		} else {
			xieshenPage.mapOperator_jsxm.view.popup.close();
		}

		$.each(trArr, function (i, n) {
			var dataFid = $(this).attr('data-fid')
			if (fid == dataFid) {
				$(this).addClass("activeXsR")
				//锚点
				$("#maoDian").attr("href", "#maoDian" + dataFid)
				$("#maoDian")[0].click()
			}
		});
	},
	getWordData: function () {
		////拼接worddata
		var data = xieshenPage.wordDataXM;
		if (data == undefined || data == "") {
			xieshenPage.wordDataXM = [];
			////请求后台获取到的判断数据
			var respdata = xieshenPage.xsResult_jsxm;
			var jssm; ////建设项目
			////定义变量
			var name, code, pic, webpic, child, tabledata;
			var item, jtem, resp, erroritem;
			var worddata = {},
				layers = [];
			for (var i = 0; i < layertree.length; i++) {
				////循环最外一层
				item = layertree[i];
				child = [];
				for (var j = 0; j < item.child.length; j++) {
					jtem = item.child[j];
					name = jtem.name; ////图层名
					code = jtem.code; ////图层编号
					pic = "", webpic = "";
					if (code && code != "") {
						resp = respdata[code]; ////根据图层名取数据
						if (jssm == undefined || jssm == "") {
							////获取建设项目
							jssm = {
								"XMYDLX": resp.hegui[0].ydxz,
								"YDMJ": resp.hegui[0].ydmj
							}
						}
						tabledata = [];
						if (resp.isHg != "没有判断规则" && resp.sumarea) {
							////不合规
							for (var ii = 0; ii < resp.sumarea.length; ii++) {
								erroritem = resp.sumarea[ii];
								tabledata.push({
									"Hg": erroritem.hg,
									"Name": erroritem.type,
									"Area": erroritem.totalArea,
									"Conclusion": erroritem.result,
									"Guide": erroritem.text
								})
							}
						}
						/*for(var pidx = 0; pidx < xieshenPage.ScreenShot.length; pidx++) {
							if(xieshenPage.ScreenShot[pidx].code == code) {
								pic = xieshenPage.ScreenShot[pidx].pic;
								webpic = xieshenPage.ScreenShot[pidx].webpic;
							}
						}*/
						child.push({
							"Name": jtem.name,
							"Code": jtem.code,
							"IsOK": (resp.isHg == "1" || resp.isHg == "没有判断规则") ? "1" : "0",
							"TableData": tabledata
						})
					}

				}
				layers.push({
					"Name": item.name,
					"Child": child
				})
			}
			worddata = {
				"XMYDLX": jssm.XMYDLX,
				"YDMJ": jssm.YDMJ,
				"WZ": "",
				"Layers": layers
			}
			xieshenPage.wordDataXM = worddata;
			////在取一次
			data = xieshenPage.wordDataXM;
		}
		return data;
	},

	showJSXMWord: function () {
		////显示建设项目文档
		var worddata = xieshenPage.getWordData();

		$.ajax({
			type: "POST",
			url: netHttp + "/WebService.ashx?action=wordhtmlForNewest",
			data: {
				/*'code': xieshenPage.xiangmuCode,*/
				'json': JSON.stringify(worddata)
			},
			dataType: "json",
			success: function (response) {
				if (response.Msg == "html生成成功") {
					$(".transition-loader").hide()
					//显示文案
					//$(".xsMb").hide()
					$("#divXSYJD .content").html(response.Data);

					xieshenPage.createJsxmMaps();
				} else {
					alert(response.Msg)
				}

			},
			error: function (err) {
				console.log(err);
			}
		});
	},
	//生成建设项目协审地图对象
	createJsxmMaps: function () {
		for (let i = 0; i < xieshenPage.pythonArr.length; i++) {
			var code = xieshenPage.pythonArr[i]
			if (!xieshenPage[code + 'JsxmMaps']) {
				xieshenPage[code + 'JsxmMapYs'] = new MapOperator();
				xieshenPage[code + 'JsxmMaps'] = new MapOperator();
			}
			xieshenPage[code + 'JsxmMapYs'].initMap(code + 'MapY')
			xieshenPage[code + 'JsxmMaps'].initMap(code + 'Map')
			for (let key in xsLayerInfo) {
				if (xsLayerInfo[key].code == code) {
					var layerUrl = xsLayerInfo[key].url;
					var layType = xsLayerInfo[key].type;
					var layerObj = xieshenPage[code + 'JsxmMaps'].addImageryLayer(layerUrl, layType, code);
					var layerObjY = xieshenPage[code + 'JsxmMapYs'].addImageryLayer(layerUrl, layType, code);
					layerObj.on("layerview-create", function (event) {
						xieshenPage[event.layerView.layer.diyAttr + 'JsxmMaps'].locationPolygon(xieshenPage.jsxmGeo)
						xieshenPage.clashShow(event.layerView.layer.diyAttr + 'JsxmMaps', 16, xieshenPage.xsDataObj[event.layerView.layer.diyAttr].sumarea, 'xsState')
					});
					layerObjY.on("layerview-create", function (event) {
						xieshenPage[event.layerView.layer.diyAttr + 'JsxmMapYs'].locationPolygon(xieshenPage.jsxmGeo)
					});
				}
			}
			/*xieshenPage[code+'JsxmMaps'].tileLayer.on("layerview-create", function(event){
				console.log(event)
				xieshenPage[code+'JsxmMaps'].locationPolygon(xieshenPage.jsxmGeo)
			});*/
		}
	},
	//生成规划方案协审地图对象
	createGhfaMaps: function () {
		if (!xieshenPage['yongdiGhfaMapYs']) {
			xieshenPage['yongdiGhfaMapYs'] = new MapOperator();
			xieshenPage['yongdiGhfaMaps'] = new MapOperator();
		}
		if (!xieshenPage['yztGhfaMaps']) {
			xieshenPage['yztGhfaMaps'] = new MapOperator();
		}
		xieshenPage['yongdiGhfaMapYs'].initMap('yongdiMapY')
		xieshenPage['yongdiGhfaMaps'].initMap('yongdiMap')
		xieshenPage['yztGhfaMaps'].initMap('yztBox')
		//左侧地图添加图层及范围渲染
		var layUrl = xsLayerInfo['总规过渡版总图'].url;
		var layType = xsLayerInfo['总规过渡版总图'].type;
		var layerObjY = xieshenPage.yongdiGhfaMapYs.addImageryLayer(layUrl, layType, "yongdi");
		xieshenPage.yongdiGhfaMapYs.fwxPolygonGraphAdd(xieshenPage.faFwGeo, 'fwx');
		var yzt = xieshenPage.yztGhfaMaps.addImageryLayer(yztFw, "image", "yzt");
		//渲染多个地块
		for (var i = 0; i < xieshenPage.faDkGeoArr.length; i++) {
			var polygon = xieshenPage.faDkGeoArr[i].geo;
			var ydType = xieshenPage.faDkGeoArr[i].ydxz;
			//var color = ydDictionary[ydType].color;
			if (ydDictionary[ydType]) {
				var color = ydDictionary[ydType].color;
			} else {
				var color = [110, 110, 110];
			}
			var attributes = {
				"ydxz": ydType
			}
			xieshenPage.yongdiGhfaMaps.polygonColorGraphAdd(polygon, color, [255, 255, 255, 1], 1, attributes, 'dk');
		}
		//添加范围渲染
		xieshenPage.yongdiGhfaMaps.fwxPolygonGraphAdd(xieshenPage.faFwGeo, 'fwx');
		layerObjY.on("layerview-create", function (event) {
			setTimeout(function () {
				xieshenPage.yongdiGhfaMapYs.locationPolygon(xieshenPage.faFwGeo)
				xieshenPage.yongdiGhfaMaps.view.extent = xieshenPage.yongdiGhfaMapYs.view.extent
			}, 100)

		});
		yzt.on("layerview-create", function (event) {
			setTimeout(function () {
				xieshenPage.yztGhfaMaps.locationPolygon(xieshenPage.faFwGeo)
				xieshenPage.yztGhfaMaps.view.extent = xieshenPage.yongdiGhfaMapYs.view.extent
			}, 100)

		})
		for (let i = 0; i < xieshenPage.pythonArr.length; i++) {
			var code = xieshenPage.pythonArr[i]
			if (!xieshenPage[code + 'GhfaMaps']) {
				xieshenPage[code + 'GhfaMapYs'] = new MapOperator();
				xieshenPage[code + 'GhfaMaps'] = new MapOperator();
			}
			xieshenPage[code + 'GhfaMapYs'].initMap(code + 'MapY')
			xieshenPage[code + 'GhfaMaps'].initMap(code + 'Map')
			for (let key in xsLayerInfo) {
				if (xsLayerInfo[key].code == code) {
					var layerUrl = xsLayerInfo[key].url;
					var layType = xsLayerInfo[key].type;
					var layerObjY = xieshenPage[code + 'GhfaMapYs'].addImageryLayer(layerUrl, layType, code);

					layerObjY.on("layerview-create", function (event) {
						setTimeout(function () {
							xieshenPage.yongdiGhfaMapYs.locationPolygon(xieshenPage.faFwGeo)

							xieshenPage[event.layerView.layer.diyAttr + 'GhfaMapYs'].locationPolygon(xieshenPage.faFwGeo)
							xieshenPage.clashShowNew(event.layerView.layer.diyAttr + 'GhfaMapYs', 16, xieshenPage.xsDataObj[event.layerView.layer.diyAttr].hegui, 'xsState', xieshenPage.xsDataObj[event.layerView.layer.diyAttr].sumarea)
							xieshenPage.clashShow(event.layerView.layer.diyAttr + 'GhfaMaps', 16, xieshenPage.xsDataObj[event.layerView.layer.diyAttr].hegui, 'xsState', false)
							xieshenPage[event.layerView.layer.diyAttr + 'GhfaMaps'].view.extent = xieshenPage[event.layerView.layer.diyAttr + 'GhfaMapYs'].view.extent
							//清除标注
							xieshenPage[event.layerView.layer.diyAttr + 'GhfaMaps'].map.findLayerById("text").opacity = 0
							xieshenPage[event.layerView.layer.diyAttr + 'GhfaMapYs'].map.findLayerById("text").opacity = 0
						}, 100)
					});
				}
			}

		}
	},
	saveword: function () {
		//判断是否检查
		if (xieshenPage.isCheckWord != 1) {
			alert("请先检查文档是否加载正常!")
			return
		}
		$(".transition-loader").show()
		if (xieshenPage.xsType == 'JSXM') {
			xieshenPage.printArr = {}
			xieshenPage.printArrY = {}
			//xieshenPage.printEnd = 0
			for (let i = 0; i < xieshenPage.pythonArr.length; i++) {
				var code = xieshenPage.pythonArr[i];
				(function (code) {
					xieshenPage[code + 'JsxmMaps'].printMap(
						xieshenPage[code + 'JsxmMaps'].view,
						(res) => {
							xieshenPage.printArr[code] = res.url

							if (Object.keys(xieshenPage.printArr).length == xieshenPage.pythonArr.length) {
								var forArr1 = xieshenPage.wordDataXM.Layers
								for (let i = 0; i < forArr1.length; i++) {
									var forArr2 = forArr1[i].Child
									for (let j = 0; j < forArr2.length; j++) {
										var Code = forArr2[j].Code
										xieshenPage.wordDataXM.Layers[i].Child[j].pic = xieshenPage.printArr[Code]
									}
								}
								//xieshenPage.printEnd += 1
								LSajax()
							}
						},
						(err) => {
							console.log(err)
						}
					)
				})(code)

			}

			function LSajax() {
				/*if(xieshenPage.printEnd == 2) {
					
				}*/
				$.ajax({
					type: "POST",
					url: netHttp + "/WebService.ashx?action=wordPrintForNewest",
					data: {
						'json': JSON.stringify(xieshenPage.wordDataXM),
						'XMGK': $("#divXSYJD textarea").val()
					},
					dataType: "json",
					async: false,
					success: function (response) {
						if (response.Msg == "word保存成功") {
							window.open(netHttp + response.Url);
							$(".transition-loader").hide()
						} else {
							alert(response.Msg)
						}

					},
					error: function (err) {
						console.log(err);
					}
				});

			}

		} else {
			xieshenPage.printArr = {}
			xieshenPage.yongdi = {}
			xieshenPage.printindex = 0;
			var keys = Object.keys(xieshenPage.xsResult_ghfa)
			for (let key in xieshenPage.xsResult_ghfa) {
				(function (key) {
					xieshenPage.printindex++;
					xieshenPage[key + 'GhfaMaps'].printMap(
						xieshenPage[key + 'GhfaMaps'].view,
						(res) => {
							isPrintEnd(res, key)
						},
						(err) => {
							console.log(err)
						}
					)
					xieshenPage[key + 'GhfaMapYs'].printMap(
						xieshenPage[key + 'GhfaMapYs'].view,
						(res) => {
							isPrintEnd(res, key, "Y")
						},
						(err) => {
							console.log(err)
						}
					)
				})(key)
			}

			function isPrintEnd(res, key, y) {
				if (y) {
					xieshenPage.xsResult_ghfa[key]["picY"] = res.url
					xieshenPage.printArr[key + "Y"] = res.url
				} else {
					xieshenPage.xsResult_ghfa[key]["pic"] = res.url
					xieshenPage.printArr[key] = res.url
				}

				//if (Object.keys(xieshenPage.printArr).length == (xieshenPage.pythonArr.length * 2)) {
				if (6 == xieshenPage.printindex) {
					xieshenPage.printindex++;
					xieshenPage['yongdiGhfaMaps'].printMap(
						xieshenPage['yongdiGhfaMaps'].view,
						(res) => {
							xieshenPage.yongdi["pic"] = res.url
							xieshenPage['yongdiGhfaMapYs'].printMap(
								xieshenPage['yongdiGhfaMapYs'].view,
								(res) => {
									xieshenPage.yongdi["picY"] = res.url
									LSajax2()
								},
								(err) => {
									LSajax2()
									console.log(err)
								}
							)
						},
						(err) => {
							LSajax2()
							console.log(err)
						}
					)
				}
			}

			function LSajax2() {
				// var n = $("#xmmc-input").val();
				// var a = $("#address-input").val();
				// if(n==undefined || n==""){
				// 	alert("请填写项目名称");
				// 	return ;
				// }
				// if(a==undefined || a==""){
				// 	alert("请填写项目地址");
				// 	return ;
				// }
				var name = $("#name").val();//项目名称
				var bzdw = $("#bzdw").val();//编制单位
				var scsj = $("#scsj").html();//审查时间
				var cgsd = $("#cgsd").val();//成果深度
				var title = $("#title").val();//简介
				var ghcg = $("#ghcg").val(); //规划成果
				var xmqw = $("#xmqw").val(); //项目区位
				var xmdw = $("#xmdw").val(); //项目定位
				var jdxzqkTitle = $("#jdxzqkTitle ").val(); // 基地现状情况段落
				var jsbg = {
					'name': name,
					'bzdw': bzdw,
					'scsj': scsj,
					'cgsd': cgsd,
					'title': title,
					'ghcg': ghcg,
					'xmqw': xmqw,
					'xmdw': xmdw,
					'jdxzqkTitle': jdxzqkTitle
				};
			
				//现状信息
				var xzxx = '';
				try {
					xzxx = JSON.stringify(xieshenPage.rkxzData);
				} catch (e) {
					console.log(e);
				}
				//一张图数据
				var yztData = '';
				try {
					yztData = JSON.stringify(xieshenPage.yztData);
				} catch (e) {
					console.log(e);
				}
				//道路、设施数据
				var roadData = '';
				var sslsData = '';
				try {
					roadData = JSON.stringify(xieshenPage.dlss.road);
					sslsData = JSON.stringify(xieshenPage.dlss.facilities);
				} catch (e) {
					console.log(e);
				}
				//控制要素落实情况
				var kzyslsqkData = '';
				//土地利用总体规划
				var tdlyztghData = '';
				try {
					kzyslsqkData = JSON.stringify(xieshenPage.kzyslsData.featureSituation);
					var arr = [xieshenPage.kzyslsData.tgSituation.xmTotal, xieshenPage.kzyslsData.tgSituation.tjTotal];
					tdlyztghData = JSON.stringify(arr);
				} catch (e) {
					console.log(e);
				}

				$.ajax({
					type: "POST",
					url: netHttp + "/WebService.ashx?action=wordPrintFN",
					data: {
						'yongdi': JSON.stringify(xieshenPage.yongdi),
						'tcData': JSON.stringify(xieshenPage.xsResult_ghfa),
						'jsbg':JSON.stringify(jsbg),

						'xzxxData': xzxx,
						'yztData': JSON.stringify(xieshenPage.yztData),
						"roadData": roadData,
						"sslsData": sslsData,
						"kzyslsqkData": kzyslsqkData,
						'tdlyztghData': tdlyztghData
					},
					dataType: "json",
					async: false,
					success: function (response) {
						if (response.State) {
							window.open(netHttp + response.Url);
							$(".transition-loader").hide()
						} else {
							alert(response.Msg)
						}

					},
					error: function (err) {
						$(".transition-loader").hide()
						console.log(err);
					}
				});
			}
		}

	},
	//展示建设项目的具体图层冲突信息
	showDetail: function (layerName) {
		xieshenPage.mapOperator_jsxm.map.findLayerById('select').graphics.removeAll()
		$('.xsXq .head span').html(layerName + '协审情况');
		//添加图层
		var layerUrl = xsLayerInfo[layerName].url;
		var layType = xsLayerInfo[layerName].type;
		var layCode = xsLayerInfo[layerName].code
		xieshenPage.currentCode = layCode
		//显示冲突状态
		let is = $(".jsxmCheckBox input").attr("checked")
		if (is) {
			$(".diyLegendBox").show()
			xieshenPage.mapOperator_jsxm.map.findLayerById('xsState').opacity = 1
			xieshenPage.mapOperator_jsxm.map.findLayerById('text').opacity = 1

		} else {
			$(".diyLegendBox").hide()
			xieshenPage.mapOperator_jsxm.map.findLayerById('xsState').opacity = 0
			xieshenPage.mapOperator_jsxm.map.findLayerById('text').opacity = 0
		}
		xieshenPage.mapOperator_jsxm.map.findLayerById('xsState').graphics.removeAll()
		xieshenPage.mapOperator_jsxm.map.findLayerById('text').graphics.removeAll()
		xieshenPage.clashShow('mapOperator_jsxm', 16, xieshenPage.xsDataObj[layCode].sumarea, 'xsState')

		if (layerUrl !== '') {
			xieshenPage.mapOperator_jsxm.addImageryLayer(layerUrl, layType);
		}
		//添加分析地块图形
		var polygon = xieshenPage.mapOperator_jsxm.GetPolygon(xieshenPage.shpGeoRing);
		xieshenPage.mapOperator_jsxm.PolygonGraphAdd(polygon);
		//构建表格内容
		var layerCode = getLayerCodeByName(layerName);
		xieshenPage.getTableHtml(xieshenPage.xsResult_jsxm[layerCode]);
		$('.xsXq').show();

	},
	//显示冲突状态
	clashShow: function (obj, size, laySumarea, id, isGhfa) {
		for (let i = 0; i < laySumarea.length; i++) {
			var color = ''
			switch (laySumarea[i].hg) {
				case 0:
					color = [255, 0, 0, 0.9]
					break;
				case 1:
					color = [0, 255, 0, 0.9]
					break;
				case 2:
					color = [255, 127, 39, 0.9]
					break;
				default: //无规则
					color = [204, 204, 204, 0.9]
					break;
			}
			if (isGhfa) {//规划方案
				var attributes = {
					ydxz: laySumarea[i].type,
					scYdxz: laySumarea[i].dkType
				}
				//var geo = xieshenPage.mapOperator.GetPolygon(laySumarea[i].geo.rings)
				var geo = xieshenPage.mapOperator.GetPolygon(laySumarea[i].geometry.rings)
				xieshenPage[obj].polygonColorGraphAdd(geo, color, [0, 0, 0, 1], 0.5, attributes, id)
			} else {
				if (laySumarea[i].type) {
					var attributes = {
						fid: i,
						type: laySumarea[i].type,
						totalArea: laySumarea[i].totalArea,
						result: laySumarea[i].result
					}
				} else {
					var attributes = {}
				}
				if (laySumarea[i].geometry) {
					var geo = laySumarea[i].geometry
				} else {
					var geo = xieshenPage.mapOperator.GetPolygon(laySumarea[i].geo.rings)
				}

				xieshenPage[obj].polygonColorGraphAdd(geo, color, [0, 255, 255, 1], 1, attributes, id, i + 1, size)
			}

		}
	},
	//显示冲突状态new
	clashShowNew: function (obj, size, layH, id, layS) {
		for (let i = 0; i < layH.length; i++) {
			var attributes = {}
			var geo = xieshenPage.mapOperator.GetPolygon(layH[i].geo.rings)
			xieshenPage[obj].polygonColorGraphAdd(geo, [0, 0, 0, 0], [0, 255, 255, 1], 1, attributes, id)
			var num = 1
			for (let j = 0; j < layS.length; j++) {
				if (layS[j].objId == i) {
					switch (layS[j].hg) {
						case 0:
							color = [255, 0, 0, 0.9]
							break;
						case 1:
							color = [0, 255, 0, 0.9]
							break;
						case 2:
							color = [255, 127, 39, 0.9]
							break;
						default:
							break;
					}
					var geoM = layS[j].geometry
					xieshenPage[obj].polygonColorGraphAdd(geoM, color, [0, 255, 255, 1], 1, {}, id, num, size)
					num++
				}
			}

		}
	},
	//构建表格详情
	getTableHtml: function (data) {
		//同类型面积数据合并
		if (data && data != "" && data.sumarea.length != 0) {
			/*var obj = {};
			var sumarea = objDeepCopy(data.sumarea);
			for(var i = 0; i < sumarea.length; i++) {
				if(!obj[sumarea[i].type]) {
					obj[sumarea[i].type] = {};
					obj[sumarea[i].type] = sumarea[i];
				} else {
					obj[sumarea[i].type].totalArea += sumarea[i].totalArea;
				}
			}
			var newsumarea = [];
			for(var key in obj) {
				newsumarea.push(obj[key]);
			}*/
			var newsumarea = data.sumarea
			//构建表格内容
			var rowNum = newsumarea.length;
			var htmlStr = '';
			for (var k = 0; k < rowNum; k++) {
				var aRow = newsumarea[k];
				switch (aRow.hg) {
					case 0:
						color = 'FRColor'
						break;
					case 1:
						color = 'FGColor'
						break;
					case 2:
						color = 'FOColor'
						break;
					default: //无规则情况
						color = "FNColor"
						break;
				}
				var area = aRow.totalArea ? aRow.totalArea.toFixed(2) : "";
				if (xieshenPage.ydlxB[aRow.type]) {
					var type = xieshenPage.ydlxB[aRow.type] + "(" + aRow.type + ")"
				} else {
					var type = aRow.type
				}

				htmlStr += '<tr id="maoDian' + k + '"  data-fid="' + k + '" ><td>' + (k + 1) + '</td><td>' + type + '</td><td>' + area + '</td>';
				if (k == 0) { //新方案
					var area = data['hegui'][0].ydmj ? data['hegui'][0].ydmj.toFixed(2) : "";
					if (xieshenPage.ydlxB[data['hegui'][0].ydxz]) {
						var ydxz = xieshenPage.ydlxB[data['hegui'][0].ydxz] + "(" + data['hegui'][0].ydxz + ")"
					} else {
						var ydxz = data['hegui'][0].ydxz
					}
					htmlStr += '<td class="hbTd" rowspan="' + rowNum + '">' + ydxz + '</td><td class="hbTd" rowspan="' + rowNum + '">' + area +
						'</td>';
				}
				if (JSON.stringify(aRow.text) == "{}") {
					aRow.text = "暂无建议"
				}
				htmlStr += '<td class="' + color + '" >' + aRow.result + '</td><td>' + aRow.text + '</td></tr>';
			}
			$('.xsXq .table tbody').html(htmlStr);
		} else {
			var htmlStr = ""
			htmlStr = "<tr><th colspan='7' >此项目不涉及</th><tr/>"
			$('.xsXq .table tbody').html(htmlStr);
		}
		//联动
		var trArr = $(".tableDiv tbody").find('tr')
		trArr.click(function () {
			var dataFid = $(this).attr('data-fid')
			$(".tableDiv tbody").find('tr').removeClass("activeXsR")
			$(this).addClass("activeXsR")
			for (var i = 0; i < newsumarea.length; i++) {
				if (i == dataFid) {
					var attributes = newsumarea[i]
					var location = newsumarea[i].geometry.extent.center
					if (location) {
						if (xieshenPage.ydlxB[attributes.type]) {
							var type = xieshenPage.ydlxB[attributes.type] + "(" + attributes.type + ")"
						} else {
							var type = attributes.type
						}
						xieshenPage.mapOperator_jsxm.view.popup.open({
							title: "用地概况",
							location: location,
							content: '<table class="popupContent" border="1">\
							<tr><td>用地性质： </td><td>' + type + '</td></tr>\
							<tr><td>用地面积：</td><td>' + attributes.totalArea.toFixed(2) + 'ha</td></tr>\
							<tr><td>结论：</td><td>' + attributes.result + '</td></tr></table>'
						});
						setTimeout(function () {
							$('.esri-popup__button').click(function () {
								trArr.removeClass("activeXsR")
								xieshenPage.mapOperator_jsxm.map.findLayerById('select').graphics.removeAll()
							});
						}, 400);
						xieshenPage.mapOperator_jsxm.map.findLayerById('select').graphics.removeAll()
						xieshenPage.mapOperator_jsxm.polygonColorGraphAdd(newsumarea[i].geometry, [0, 255, 255, 0.5], [0, 255, 255, 1], 1, {}, 'select')
					} else {
						xieshenPage.mapOperator_jsxm.view.popup.close();
					}
				}
			}
		})
	},
	//#endregion 建设项目部分

	//#region 规划方案里用到的方法
	//规划方案里上传文件
	initFileInput: function () {
		$("#uploadFileFA").off("change").change((event) => {
			var files = $("#uploadFileFA")[0].files;
			//判断文件是否符合要求
			var flg = xieshenPage.checkFiles(files);
			if (flg.isTrue) {
				$("#ghfaMb .uploadNote").text("：" + $("#uploadFileFA")[0].files[0].name.split('.')[0]);
				xieshenPage.ajaxFA();
			} else {
				$("#ghfaMb .uploadNote").text("：未上传");
				alert(flg.message);
			}
			$("#uploadFileFA").val('');
		});
	},
	//判断上传的文件是否符合要求
	checkFiles: function (files) {
		var msg = {
			'isTrue': false
		};
		if (files.length < 3) {
			msg['message'] = '请上传至少三个主要文件';
			return msg;
		}
		//取文件后缀
		var suffix = [];
		for (var i = 0; i < files.length; i++) {
			var element = files[i].name.split('.')[1];
			suffix.push(element);
		}
		if (suffix.indexOf('dbf') != -1 && suffix.indexOf('shp') != -1 && suffix.indexOf('shx') != -1) {
			msg['isTrue'] = true;
			return msg;
		} else {
			msg['message'] = '缺少.shp或.dbf或.shx文件';
			return msg;
		}
	},
	//后台解压
	ajaxFA: function () {
		xieshenPage.faShpPath = null;
		xieshenPage.faFwGeo = null;
		xieshenPage.faDkGeoArr = [];
		$.ajax({
			url: netHttp + '/WebService.ashx?action=upLoadGHFA',
			type: 'POST',
			cache: false,
			data: new FormData($('#formFA')[0]),
			processData: false,
			contentType: false,
			dataType: "json",
			beforeSend: function () {
				uploading = true;
			},
			success: (data) => {
				console.log(data);
				if (data.State) {
					xieshenPage.dealFeature_ghfa(data);
				} else {
					alert(data.Msg);
				}
			},
			error: (data) => {
				console.log(data);
				alert('解析出错');

			}
		});
	},
	//处理解析出来的要素
	dealFeature_ghfa: function (data) {
		xieshenPage.faLayerPath = {
			"dk": data.ShpPath,
			"fwx": data.FWShpPath
		}

		//shp文件路径
		xieshenPage.faShpPath = data.ShpPath;
		var fwxFea = JSON.parse(data.fwRes).features;
		var dkFeaArr = JSON.parse(data.dkRes).features;
		//规划人口
		xieshenPage.ghrk = 0;
		if(fwxFea[0].properties['规划人口']){
			xieshenPage.ghrk = Number(fwxFea[0].properties['规划人口']);
		}
		if (fwxFea) { //渲染范围
			var polygon = xieshenPage.mapOperator.GetPolygon(fwxFea[0].geometry.coordinates);
			xieshenPage.mapOperator.fwxPolygonGraphAdd(polygon);
			xieshenPage.faFwGeo = polygon;
		}

		//取属性名
		var propertiesArr = [];
		var properties = Object.keys(dkFeaArr[0].properties);
		for (var i = 0; i < properties.length; i++) {
			propertiesArr.push(properties[i]);
		}
		xieshenPage.propertiesList(propertiesArr, dkFeaArr);

		if (dkFeaArr) { //渲染多个地块
			for (var i = 0; i < dkFeaArr.length; i++) {
				var polygon = xieshenPage.mapOperator.GetPolygon(dkFeaArr[i].geometry.coordinates);
				//xieshenPage.mapOperator.polygonColorGraphAdd(polygon, [0, 0, 0, 0], [0, 255, 255, 1], 1);
				//地块渲染效果边线同样改为黑色,稍细
				xieshenPage.mapOperator.polygonColorGraphAdd(polygon, [0, 0, 0, 0], [0, 0, 0, 1], 0.5);
			}
		}

	},
	ajaxPyData: function (data, type) {
		let dktc = ""; //地块图层
		let dkpath = xieshenPage.faLayerPath["dk"] //地块路径
		let path = "" //文件路径
		let shpname = [] //shp文件名集合

		dktc = xieshenPage.pythonArr.join(",")
		path = dkpath.split("\\").slice(0, -1).join("\\") //获取文件的路径（不包含文件名）

		for (key in xieshenPage.faLayerPath) {
			let urlSplit = xieshenPage.faLayerPath[key].split("\\");
			let shp = urlSplit[urlSplit.length - 1].split(".")[0];
			shpname.unshift(shp)
		}
		var shpnameStr = ''
		for (let i = 0; i < shpname.length; i++) {
			if (i != 0) {
				shpnameStr += ','
			}
			shpnameStr += shpname[i]
		}
		url = newPyHttp + "geoprocessingApi?upload_shp_folder=" + path + "\\&mxdname=" + dktc + "&shpname=" + shpnameStr + "&extent=0&mbName=" + type + "&code=" + data;

		console.log(url)

		$.ajax({
			url: url,
			type: "get",
			dataType: "jsonp",
			async: true,
			success: function (response) {
				console.log(response)

			},
			error: function (err) {
				console.log(err);
			}
		});
	},
	//构建属性选择的下拉项
	propertiesList: function (propertiesArr, dkFeaArr) {
		//属性数组去重
		//var newPropertiesArr = unique(propertiesArr);
		var newPropertiesArr = propertiesArr;
		var htmlStr = '';
		for (var i = 0; i < newPropertiesArr.length; i++) {
			var element = newPropertiesArr[i];
			htmlStr += '<li title="' + element + '">' + element + '</li>';
		}
		$('#ghfaMb .attrList').html(htmlStr);
		//绑定点击事件
		$("#ghfaMb .attrList li").click(function (event) {
			$(".attrList").hide();

			if (dkFeaArr) { //渲染多个地块
				if (dkFeaArr[0].properties[$(this).text()]) {
					xieshenPage.faDkGeoArr = []
					for (var i = 0; i < dkFeaArr.length; i++) {
						var polygon = xieshenPage.mapOperator.GetPolygon(dkFeaArr[i].geometry.coordinates);
						var ydType = dkFeaArr[i].properties[$(this).text()];
						//var color;
						//没有匹配用地性质gei
						if (ydDictionary[ydType]) {
							var color = ydDictionary[ydType].color;
						} else {
							var color = [110, 110, 110];
						}

						//xieshenPage.mapOperator.polygonColorGraphAdd(polygon, color, [0, 255, 255, 1], 1);
						//地块渲染效果边线同样改为黑色,稍细
						xieshenPage.mapOperator.polygonColorGraphAdd(polygon, color, [0, 0, 0, 1], 0.5);
						//存放全局的多个地块
						var ydflMj = xieshenPage.mapOperator.types.geoEngine.planarArea(polygon, 'hectares');
						var lslsAttr = {
							'geo': polygon,
							'ydxz': ydType,

							"用地代码": ydType,
							'用地性质': ydType,
							'ydmj': ydflMj
						}
						lslsAttr[xieshenPage.attrFa] = ydType
						xieshenPage.faDkGeoArr.push(lslsAttr);
					}
				} else {
					alert('请选择有效的')
					return
				}

			}
			$("#ghfaMb #attr span").html($(this).text());
			$("#ghfaMb #attr span").attr("title", $(this).text());
		});
		//默认点击第一个
		//$(".attrList li:first").click();
		//匹配是否有用地代码项，没有用地代码，默认选中第一个
		$.each($(".attrList li"), function (i, valueOfElement) {
			if ($(valueOfElement).text() == "用地代码") {
				$(valueOfElement).click();
				return false;
			}
			if (i == $(".attrList li").length - 1) {
				$(".attrList li:first").click();
			}
		});
	},

	//规划方案里查询一张图信息
	faYztQuery: function () {
		xieshenPage.yztData = null;
		var queryTask = new xieshenPage.mapOperator.types.QueryTask({
			url: yztUrl,//config.js里配置
		});
		var que = new xieshenPage.mapOperator.types.Query();
		que.geometry = xieshenPage.faFwGeo;
		que.spatialRelationship = "intersects";
		que.geometryPrecision = 6;
		que.returnGeometry = true;
		que.outFields = [yztAttr]; //yztAttr在config.js里配置
		try {
			queryTask.execute(que).then((response) => {
				var data = response.features;
				var yztJsonData = xieshenPage.dealYztData(data);

				var dkDataJson = xieshenPage.dealFaData();
				var dataAll = {};
				dataAll["dk"] = dkDataJson;//方案地块
				dataAll["yzt"] = yztJsonData; //一张图相交地块
				var fwMj = xieshenPage.mapOperator.types.geoEngine.planarArea(xieshenPage.faFwGeo, 'hectares');
				dataAll["totalArea"] = fwMj;
				xieshenPage.yztData = dataAll;
				// console.log(dataAll);
			}, (err) => {
				console.log(err);
				xieshenPage.yztData = "err";
			});
		} catch (error) {
			xieshenPage.yztData = "err";
			console.log(error);
		}
	},

	//规划方案里查询人口现状信息
	faRkxzQuery: function () {
		xieshenPage.rkxzData = null;
		ctcxHelpWordJs.ctcxHelpWord(xieshenPage.faFwGeo, xieshenPage.mapOperator).then((res) => {
			console.log(res);
			xieshenPage.rkxzData = res;
		});
	},
	//计算方案地块面
	dealFaData: function () {
		try {
			var dkFeaArr = xieshenPage.faDkGeoArr;
			var dkObj = {};
			var totalArea = 0;
			for (var i = 0; i < dkFeaArr.length; i++) {
				var aFea = dkFeaArr[i];
				var mj = xieshenPage.mapOperator.types.geoEngine.planarArea(aFea.geo, 'hectares');
				var ydxzCode = aFea[xieshenPage.attrFa];
				//合并同类型的面积（小类归并到中类）
				totalArea += mj;
				if (ydxzCode.length > 2) {
					var code = ydxzCode.substring(0, 2);
					if (!dkObj[code]) {
						dkObj[code] = mj;
					} else {
						dkObj[code] += mj;
					}
				} else {
					if (!dkObj[ydxzCode]) {
						dkObj[ydxzCode] = mj;
					} else {
						dkObj[ydxzCode] += mj;
					}
				}
			}

			//将方案范围线面积除去其中地块面积，剩下的并入S1类
			var fwMj = xieshenPage.mapOperator.types.geoEngine.planarArea(xieshenPage.faFwGeo, 'hectares');
			var sMj = fwMj - totalArea;

			if (!dkObj['S1']) {
				dkObj['S1'] = sMj;
			} else {
				dkObj['S1'] += sMj;
			}
		} catch (error) {
			console.log("dealFaData:" + error);
		}
		return dkObj;

	},
	//处理合并一张图结果数据
	dealYztData: function (data) {
		if (data.length && data.length > 0) {
			var obj = {};
			var totalArea = 0;
			try {
				for (var i = 0; i < data.length; i++) {
					var ydxzCode = data[i].attributes[yztAttr]; //yztAttr在config.js里配置
					if (!ydxzCode) {
						ydxzCode = "其它"
					}
					//查询的地块与上传的范围图形相交切
					var intersect_geo = xieshenPage.mapOperator.types.geoEngine.intersect(data[i].geometry, xieshenPage.faFwGeo);

					var mj = 0;
					try {
						mj = xieshenPage.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
						totalArea += mj;
					} catch (e) {
						console.log(e);
					}


					//合并同类型的面积
					if (!obj[ydxzCode]) {
						obj[ydxzCode] = mj;
					} else {
						obj[ydxzCode] += mj;
					}
				}

				//将方案范围线面积除去其中地块面积，剩下的并入S1类,为了与之前数据保持一致（中英混合的），s1为‘城市道路用地(S1)’
				var fwMj = xieshenPage.mapOperator.types.geoEngine.planarArea(xieshenPage.faFwGeo, 'hectares');
				var sMj = fwMj - totalArea;

				if (!obj['城市道路用地(S1)']) {
					obj['城市道路用地(S1)'] = sMj;
				} else {
					obj['城市道路用地(S1)'] += sMj;
				}
			} catch (error) {
				console.log("dealYztData", error)
			}
			console.log(obj);
			console.log(totalArea);
			return obj;
		}
	},

	//规划方案协审规则查询
	faQuery: function () {
		/*xieshenPage.ajaxGetCode('fangan')*/

		xieshenPage.xsDataObj = {}
		xieshenPage.yesXs = 0
		xieshenPage.sDate = new Date()
		for (let i = 0; i < xieshenPage.webArr.length; i++) {
			var webX = xieshenPage.webArr[i]
			var attrTc = xsLayerInfo[webX].atrr
			let queryTask = new xieshenPage.mapOperator.types.QueryTask({
				url: xsLayerInfo[webX].url + '/' + xsLayerInfo[webX].layerId,
			});

			// 当被统计字段为面积相关字段时，需要分情况进行查询
			let que = new xieshenPage.mapOperator.types.Query();
			que.geometry = xieshenPage.faFwGeo;
			que.spatialRelationship = "intersects";
			//只返回拥有指定字段的的字段
			if (attrTc) {
				que.outFields = [attrTc];
			} else {
				que.outFields = ['*'];
			}

			que.geometryPrecision = 6
			que.returnGeometry = true;
			(function (num) {
				queryTask.execute(que).then((response) => {

					var dkFeaArrJson = JSON.stringify(xieshenPage.faDkGeoArr)
					var dkFeaArr = JSON.parse(dkFeaArrJson)
					var webX = xieshenPage.webArr[num]
					var attrTc = xsLayerInfo[webX].attr
					var code = xsLayerInfo[webX].code
					xieshenPage.xsDataObj[code] = {}
					xieshenPage.xsDataObj[code].hegui = dkFeaArr
					xieshenPage.xsDataObj[code].isHg = null
					xieshenPage.xsDataObj[code].sumarea = []
					var tcFeaArr = response.features
					if (tcFeaArr.length == 0) {
						xieshenPage.xsDataObj[code].isHg = '没有判断规则'
						xieshenPage.xsDataObj[code].source = code
						xieshenPage.yesXs += 1
						if (xieshenPage.webArr.length == xieshenPage.yesXs) {
							//所有图层查询完毕

							xieshenPage.faQueryAllEnd();
						}
					}


					var jsonUrl = netHttp + "/jsondata/" + code + ".json";
					var layerRule = null;
					$.ajax({
						type: "get", //请求方式
						url: jsonUrl, //地址，就是json文件的请求路径
						dataType: "json", //数据类型可以为 text xml json  script  jsonp
						async: false, //同步
						success: function (data) { //返回的参数就是 action里面所有的有get和set方法的参数
							layerRule = data;
						}
					});



					for (var i = 0; i < dkFeaArr.length; i++) {
						xieshenPage.xsDataObj[code].hegui[i].hg = 1
						var dkgeo = dkFeaArr[i].geo
						for (var j = 0; j < tcFeaArr.length; j++) {

							var intersect_geo = xieshenPage.mapOperator.types.geoEngine.intersect(tcFeaArr[j].geometry, dkgeo);
							if (i == (dkFeaArr.length - 1) && j == (tcFeaArr.length - 1)) {

								if (intersect_geo) {
									var end = 'yes'
								} else {
									xieshenPage.yesXs += 1
									if (xieshenPage.webArr.length == xieshenPage.yesXs) {
										//所有图层查询完毕

										xieshenPage.faQueryAllEnd();
									}

								}

							}
							if (intersect_geo) {
								var ydflMj = xieshenPage.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
								if (attrTc) {
									var tcStr = tcFeaArr[j].attributes[attrTc]
								} else {
									var tcStr = ''
								}
								//基本农田图层的属性里没有字段，规则里属于基本农田定义了‘基本农田保护区’的匹配字段
								if (code == 'nt') {
									tcStr = '基本农田保护区'
								}
								if (code == 'hx') {
									tcStr = '生态保护红线'
								}
								// xieshenPage.ajaxRule(code, tcStr, dkFeaArr[i][xieshenPage.attrFa], intersect_geo, ydflMj, end, xieshenPage.faQueryAllEnd, i)

								var fid = tcFeaArr[j].attributes["FID"];//图层地块标识
								xieshenPage.compareRule(fid, code, layerRule, tcStr, dkFeaArr[i][xieshenPage.attrFa], intersect_geo, ydflMj, end,
									xieshenPage.faQueryAllEnd, i)
								//xieshenPage.testArr.push(intersect_geo)
							}
						}
					}

				})
			})(i)
		}
	},

	//比较相交的地块的属性规则合规(规则存于json文件中)
	/**
	 * 
	 * @param {*} layerRuleJson 图层规则json集合
	 * @param {*} pendingdlmc  地块属性
	 * @param {*} standarddlmc 上传属性
	 * @param {*} intersect_geo 相交地块
	 * @param {*} ydflMj 面积
	 *  @param {*} fid 地块标识
	 */
	compareRule: function (fid, code, layerRuleJson, pendingdlmc, standarddlmc, intersect_geo, ydflMj, end, fun, i) {
		if (layerRuleJson && layerRuleJson[pendingdlmc]) {
			var key = null;
			if (standarddlmc == undefined || standarddlmc == "") {
				key = "其他";
			} else {
				key = standarddlmc;
			}
			var theRuleRes = layerRuleJson[pendingdlmc][key];
			if (theRuleRes == undefined || theRuleRes == "") {
				theRuleRes = layerRuleJson[pendingdlmc]["其他"];
			}
			try {
				xieshenPage.getRuleRes(fid, code, theRuleRes, pendingdlmc, key, standarddlmc, intersect_geo, ydflMj, end, fun, i)
			} catch (e) {
				console.log(e);
			}
		}

	},

	//判断后规则结果内容
	/**
	 * 
	 * @param {*} layerRule 规则对象
	 * @param {*} intersect_geo 相交图形
	 * @param {*} ydflMj 面积
	 */
	getRuleRes: function (fid, code, layerRule, pendingdlmc, standarddlmc, scType, intersect_geo, ydflMj, end, fun, i) {
		if (layerRule) {//有规则
			if (layerRule.ispass == 0) {
				xieshenPage.xsDataObj[code].isHg = 0
			}
			if (xieshenPage.xsDataObj[code].isHg != 0) {
				if (xieshenPage.xsDataObj[code].isHg != 2) {
					xieshenPage.xsDataObj[code].isHg = layerRule.ispass
				}
			}

			//判断指引是否为null，改为空字符
			if (layerRule.guidcontent) {
				var text = layerRule.guidcontent
			} else {
				var text = ''
			}
			if (ydflMj >= areaOver) {
				xieshenPage.xsDataObj[code].sumarea.push({
					hg: layerRule.ispass,
					result: layerRule.resulttypename,
					text: text,
					totalArea: ydflMj,
					type: layerRule.pendingdlmc,
					geometry: intersect_geo,
					objId: i,
					dkType: scType,
					fid: fid
				})

				//console.log(code + ":" + i)
				if (layerRule.ispass == 0) {
					xieshenPage.xsDataObj[code].hegui[i].hg = 0
				}
				if (xieshenPage.xsDataObj[code].hegui[i].hg != 0) {
					if (xieshenPage.xsDataObj[code].hegui[i].hg != 2) {
						if (xieshenPage.xsDataObj[code].hegui[i].hg != "没有判断规则") {
							xieshenPage.xsDataObj[code].hegui[i].hg = layerRule.ispass
						}
					}
				}
			}
		} else { //没有判断规则
			if (ydflMj >= areaOver) {//面积判断，判断值在配置文件中设置
				xieshenPage.xsDataObj[code].sumarea.push({
					hg: '没有判断规则',
					result: '没有判断规则',
					text: '没有判断规则',
					totalArea: ydflMj,
					type: pendingdlmc,
					dkType: scType,
					geometry: intersect_geo,
					fid: fid
				})
				//优先级判断 不通过0>人工判断2>无规则>通过1

				if (xieshenPage.xsDataObj[code].hegui[i].hg != 0) {
					if (xieshenPage.xsDataObj[code].hegui[i].hg != 2) {
						xieshenPage.xsDataObj[code].hegui[i].hg = "没有判断规则"
					}
				}
			}
			return;
		}

		if (end) {
			xieshenPage.yesXs += 1
			if (xieshenPage.webArr.length == xieshenPage.yesXs) {
				//所有图层查询完毕

				fun();
			}
		}
	},

	ajaxGetCode: function (type) {
		$.ajax({
			type: "GET",
			url: apiHttp + "/api/XieShen/GetCode?type=" + type,
			dataType: "json",
			success: function (response) {
				if (response.Message == '执行成功') {
					xieshenPage[type + 'Code'] = response.Datas[0].code
					if (type == 'xiangmu') {
						var geojson = xieshenPage.ReturnGeojson(1, xieshenPage.JsxmYdxz, xieshenPage.shpGeoRing);
						var params = {
							"jsonText": JSON.stringify(geojson)
						}
						/*$.ajax({
							url: newPyHttp + "toShp",
							type: "post",
							data: params,
							// 参数名
							success: function(data) {
								xieshenPage.ToShpCallback(data)
							}
						});*/
					} else {
						xieshenPage.ajaxPyData(xieshenPage[type + 'Code'], 'ghfa')
					}

				} else {
					alert(response.Message)
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	},
	ajaxRule: function (code, pendingdlmc, standarddlmc, intersect_geo, ydflMj, end, fun, i) {
		$.ajax({
			type: "GET",
			url: apiHttp + "/api/UseLand/GetUseLandXieShenRule",
			data: {
				'layercode': code,
				'pending': pendingdlmc,
				'standard': standarddlmc
			},
			dataType: "json",
			async: false,
			success: function (response) {
				console.log(response);
				if (response.Datas) {
					if (response.Datas.length != 0) {
						if (response.Datas[0].ispass == 0) {
							xieshenPage.xsDataObj[code].isHg = 0
						}
						if (xieshenPage.xsDataObj[code].isHg != 0) {
							if (xieshenPage.xsDataObj[code].isHg != 2) {
								xieshenPage.xsDataObj[code].isHg = response.Datas[0].ispass
							}
						}
						//判断指引是否为null，改为空字符
						if (response.Datas[0].guidcontent) {
							var text = response.Datas[0].guidcontent
						} else {
							var text = ''
						}
						if (ydflMj >= 0.01) {
							xieshenPage.xsDataObj[code].sumarea.push({
								hg: response.Datas[0].ispass,
								result: response.Datas[0].resulttypename,
								text: text,
								totalArea: ydflMj,
								type: response.Datas[0].pendingdlmc,
								geometry: intersect_geo,
								objId: i
							})
							console.log(code + ":" + i)
							if (response.Datas[0].ispass == 0) {
								xieshenPage.xsDataObj[code].hegui[i].hg = 0
							}
							if (xieshenPage.xsDataObj[code].hegui[i].hg != 0) {
								if (xieshenPage.xsDataObj[code].hegui[i].hg != 2) {
									xieshenPage.xsDataObj[code].hegui[i].hg = response.Datas[0].ispass
								}
							}
						}

					} else {
						if (ydflMj >= 0.01) {
							xieshenPage.xsDataObj[code].sumarea.push({
								hg: '没有判断规则',
								result: '没有判断规则',
								text: '没有判断规则',
								totalArea: ydflMj,
								type: pendingdlmc,
								dkType: standarddlmc,
								geometry: intersect_geo
							})
						}

					}

				} else {
					alert(response.Message);
				}
				if (end) {
					xieshenPage.yesXs += 1
					if (xieshenPage.webArr.length == xieshenPage.yesXs) {
						//所有图层查询完毕

						fun();
					}
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
	},
	//各图层的协审规则查询完毕
	faQueryAllEnd: function () {
		/*if($("#yongdiMap canvas")[0]) {
			$("#yongdiMap canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
			$("#yongdiMapY canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
		}
		for(let i = 0; i < xieshenPage.pythonArr.length; i++) {
			var code = xieshenPage.pythonArr[i]
			if($("#" + code + "Map canvas")[0]) {
				$("#" + code + "Map canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
				$("#" + code + "MapY canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
			}
			console.log(code)
		}*/
		$(".mapsBox canvas").each(function () {
			this.getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
		});
		$(".transition-loader").hide()

		xieshenPage.xsResult_ghfa = xieshenPage.xsDataObj
		var lsDate = new Date()
		var time = lsDate.getSeconds() - xieshenPage.sDate.getSeconds()
		console.log(time)

		//显示图层列表对错图标
		$('.faXq .left li span').each(function () {
			var layercode = $(this).attr("data-code");
			var aRes = xieshenPage.xsResult_ghfa[layercode];
			var isHg
			if (aRes) {
				var isHgStr = aRes.isHg + ''
				switch (isHgStr) {
					case '0':
						isHg = 'false'
						break;
					case '1':
						isHg = 'true'
						break;
					case '2':
						isHg = 'doubt'
						break;
					default:
						isHg = 'true'
						break;
				}

				$(this).find('i').addClass(isHg);
			}
		});

		//隐藏进度加载
		$('.lodding').hide();
		$('.faXq').show();
		//隐藏获取范围面板、协审文案
		$('#ghfaMb').hide();
		//显示规划方案的协审结果图层面板
		$('.faXq').show();
		//初始化地图
		if ($("#mapView1 canvas")[0]) {
			$("#mapView1 canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
			$("#mapView2 canvas")[0].getContext('webgl').getExtension('WEBGL_lose_context').loseContext()
		}

		$("#mapView1").html("")
		$("#mapView2").html("")
		xieshenPage.mapOperator1.initMap('mapView1');
		xieshenPage.mapOperator2.initMap('mapView2');
		//地图联动
		if (xieshenPage.mapOperator1.releativeOperator.size == 0) {
			xieshenPage.mapOperator1.addRelativeOperator(xieshenPage.mapOperator2);
			xieshenPage.mapOperator2.addRelativeOperator(xieshenPage.mapOperator1);
		}

		//右侧地图选中选中地块
		xieshenPage.mapOperator2.view.on("click", (event) => {
			xieshenPage.mapOperator2.view.hitTest(event).then((event) => xieshenPage.selectDk(event));
		});
		let lilist = $('.faXq .left li span');

		//xieshenPage.queryReportFa()

		for (let i = 0; i < lilist.length; i++) {
			for (let j = 0; j < layertree.length; j++) {
				for (let k = 0; k < layertree[j].child.length; k++) {
					if (lilist.eq(i).text() == layertree[j].child[k].name && layertree[j].child[k].code) {
						lilist.eq(i).click();
						return;
					}
				}
			}
		}

	},
	//查询一张图、人口现状的数据
	queryYztAndRkxz: function () {
		//查询人口现状
		xieshenPage.faRkxzQuery();
		//查询一张图的的表格数据
		xieshenPage.faYztQuery();
		//查询控制要素落实情况数据
		xieshenPage.kzyslsData = null;
		featureHelpWordJs.featureHelpWord(xieshenPage.faFwGeo, xieshenPage.mapOperator, xieshenPage.faDkGeoArr, xieshenPage.xsResult_ghfa).then((res) => {
			//console.log(res);
			xieshenPage.kzyslsData = res;
		});
	},



	//请求方案报告
	queryReportFa: function () {
		$(".transition-loader").show()

		//判断人口现状信息数据是否查询完毕 和一张图数据
		if (xieshenPage.rkxzData == null || xieshenPage.yztData == null || xieshenPage.yztData == "err" || xieshenPage.kzyslsData == null) {
			if (xieshenPage.yztData == "err") {//查询一张图的querytask执行失败
				alert("一张图查询失败，请求报告无法执行")
			} else {
				setTimeout(xieshenPage.queryReportFa, 1000);
			}
			return;
		}
		//道路、设施数据
		xieshenPage.dlss = roadHelpWordJs.roadHelpWord(xieshenPage.faFwGeo, xieshenPage.mapOperator, xieshenPage.faDkGeoArr, xieshenPage.yztData, xieshenPage.rkxzData, xieshenPage.ghrk);


		/*var tcData = []
		for(let i = 0; i < xieshenPage.webArr.length; i++) {
			var layerName = xieshenPage.webArr[i]
			var layerCode = getLayerCodeByName(layerName);
			var data = xieshenPage.xsResult_ghfa[layerCode];

			var aLayerArr = ['总规过渡版总图'];
			if(aLayerArr.indexOf(layerName) > -1) {
				var htmlL = xieshenPage.getHtmlTable(data, true);
				var htmlR = ""
			} else {
				var htmlL = xieshenPage.getHtmlTable_yfa(data, true);
				var htmlR = xieshenPage.getHtmlTable_xfa(data, true);
			}
			tcData.push({
				'layerName': layerName,
				'layerCode': layerCode,
				'isHg': data.isHg,
				'htmlL': htmlL,
				'htmlR': htmlR
			})
		}
		xieshenPage.tcData = tcData*/
		var totalArea = xieshenPage.mapOperator.areaPgon(xieshenPage.faFwGeo)
		for (var key in xieshenPage.xsResult_ghfa) {
			xieshenPage.xsResult_ghfa[key]["totalArea"] = totalArea
		}

		//$(".transition-loader").hide()
		var _aaa = '';
		try {
			_aaa = JSON.stringify(xieshenPage.xsResult_ghfa);
		} catch (e) {
			console.log(e);
		}

		//现状信息
		var xzxx = '';
		try {
			xzxx = JSON.stringify(xieshenPage.rkxzData);
		} catch (e) {
			console.log(e);
		}
		//一张图数据
		var yztData = '';
		try {
			yztData = JSON.stringify(xieshenPage.yztData);
		} catch (e) {
			console.log(e);
		}
		//道路、设施数据
		var roadData = '';
		var sslsData = '';
		try {
			roadData = JSON.stringify(xieshenPage.dlss.road);
			sslsData = JSON.stringify(xieshenPage.dlss.facilities);
		} catch (e) {
			console.log(e);
		}
		//控制要素落实情况
		var kzyslsqkData = '';
		//土地利用总体规划
		var tdlyztghData = '';
		try {
			kzyslsqkData = JSON.stringify(xieshenPage.kzyslsData.featureSituation);
			var arr = [xieshenPage.kzyslsData.tgSituation.xmTotal, xieshenPage.kzyslsData.tgSituation.tjTotal];
			tdlyztghData = JSON.stringify(arr);
		} catch (e) {
			console.log(e);
		}

		$.ajax({
			type: "POST",
			url: netHttp + "/WebService.ashx?action=wordhtmlFN",
			data: {
				'tcData': _aaa,
				'xzxxData': xzxx,
				'yztData': yztData,
				"roadData": roadData,
				"sslsData": sslsData,
				"kzyslsqkData": kzyslsqkData,
				'tdlyztghData': tdlyztghData
			},
			dataType: "json",
			async: true,
			success: function (response) {
				if (response.Msg == "html生成成功") {
					$(".transition-loader").hide()

					$(".faXq").hide()
					$("#divXSYJD .content").html(response.Data);
					$('.xieshenResultBox').show();

					//展示的报告里包含的一些事件
					xieshenPage.faClick();

					xieshenPage.createGhfaMaps()
				} else {
					$(".transition-loader").hide()
					alert(response.Msg)
				}
			},
			error: function (err) {
				$(".transition-loader").hide()
				alert(err);
				console.log(err);
			}
		});
	},

	//在预览报告出来后，绑定事件
	faClick: function () {
		//标题输入框正在输入时/得到焦点/失去焦点时
		$("#name").on('input focus blur', function () {
			var txt = $('#name').val();
			$("#newname").html(txt);
		});

		//成果深度下拉项选中
		$("#cgsd").change(function () {
			var opt = $("#cgsd").val();
			$("#ghlx").html(opt);
		});

		//审查时间
		//获取当前时间
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
		var nowDate = year + "年" + month + "月" + day + "日";
		$("#scsj").html(nowDate);
	},

	//协审结果面板里图层点击，显示具体详情
	showDetail_fa: function (layerName) {
		$(".faXq .fxTableDiv").hide()
		xieshenPage.mapOperator2.map.findLayerById("fg").removeAll();
		xieshenPage.mapOperator2.map.findLayerById("fx").removeAll();
		xieshenPage.mapOperator2.map.findLayerById("text").removeAll();
		xieshenPage.mapOperator2.map.findLayerById("select").removeAll();

		xieshenPage.currentLayerName = layerName
		xieshenPage.mapOperator2.view.popup.close();
		//标题
		$('.faXq .head span').html(layerName + "协审情况");
		//清除渲染
		xieshenPage.clearGraphic();

		//显示冲突状态
		var layCode = xsLayerInfo[layerName].code
		let is = $(".ghfaCheckBox input").attr("checked")
		if (is) {
			$(".diyLegendBox").show()
			xieshenPage.mapOperator2.map.findLayerById('xsState').opacity = 1
			xieshenPage.mapOperator2.map.findLayerById('text').opacity = 1
			xieshenPage.mapOperator2.map.findLayerById('fx').opacity = 1
			xieshenPage.mapOperator2.map.findLayerById('fg').opacity = 1

		} else {
			$(".diyLegendBox").hide()
			xieshenPage.mapOperator2.map.findLayerById('xsState').opacity = 0
			xieshenPage.mapOperator2.map.findLayerById('text').opacity = 0
			xieshenPage.mapOperator2.map.findLayerById('fx').opacity = 0
			xieshenPage.mapOperator2.map.findLayerById('fg').opacity = 0
		}

		//方案上传地地块显示
		var scdk = $("input[id='scdk']").attr("checked")
		if (scdk) {
			xieshenPage.mapOperator2.map.findLayerById('dk').opacity = 1
		} else {
			xieshenPage.mapOperator2.map.findLayerById('dk').opacity = 0
		}

		xieshenPage.mapOperator2.map.findLayerById('xsState').graphics.removeAll()
		//xieshenPage.mapOperator2.map.findLayerById('text').graphics.removeAll()
		//xieshenPage.clashShow('mapOperator2', 16, xieshenPage.xsDataObj[layCode].hegui, 'xsState', true)

		//冲突状态展示的地块，由原来的展示的上传的方案地块，改为方案与图层相交的地块
		xieshenPage.clashShow('mapOperator2', 16, xieshenPage.xsDataObj[layCode].sumarea, 'xsState', true)

		//左侧地图添加图层及范围渲染
		var layUrl = xsLayerInfo[layerName].url;
		var layType = xsLayerInfo[layerName].type;
		xieshenPage.mapOperator1.addImageryLayer(layUrl, layType);
		var showExtent = xieshenPage.mapOperator1.fwxPolygonGraphAdd(xieshenPage.faFwGeo, 'fwx');
		//右侧地图添加范围及地块
		//渲染多个地块
		for (var i = 0; i < xieshenPage.faDkGeoArr.length; i++) {
			var polygon = xieshenPage.faDkGeoArr[i].geo;
			var ydType = xieshenPage.faDkGeoArr[i].ydxz;
			//var color = ydDictionary[ydType].color;
			if (ydDictionary[ydType]) {
				var color = ydDictionary[ydType].color;
			} else {
				var color = [110, 110, 110];
			}
			var attributes = {
				"ydxz": ydType
			}
			//xieshenPage.mapOperator2.polygonColorGraphAdd(polygon, color, [0, 255, 255, 1], 1, attributes, 'dk');
			//地块渲染效果边线同样改为黑色,稍细
			xieshenPage.mapOperator2.polygonColorGraphAdd(polygon, color, [0, 0, 0, 1], 0.5, attributes, 'dk');
		}
		//添加范围渲染
		xieshenPage.mapOperator2.fwxPolygonGraphAdd(xieshenPage.faFwGeo, 'fwx');
		xieshenPage.mapOperator1.view.extent = xieshenPage.mapOperator2.view.extent

		//显示表格
		xieshenPage.showTable(layerName);
	},

	//选中地块
	selectDk: function (event) {
		for (var i = 0; i < event.results.length; i++) {
			if (event.results[i].graphic.layer.id == "fg") {
				if (event.results[i].graphic.attributes.yes) {
					for (var j = 0; j < event.results.length; j++) {
						if (event.results[j].graphic.layer.id == "fx") {
							var fxId = event.results[j].graphic.attributes.id
							var xz = xieshenPage.fxFeatures[fxId].xieshen.pendingdlmc
							var jl = xieshenPage.fxFeatures[fxId].xieshen.resulttypename

							var geo = xieshenPage.mapOperator.types.geoEngine.intersect(xieshenPage.fxFeatures[fxId].geometry, event.results[j].graphic.geometry);
							var mj = xieshenPage.mapOperator.types.geoEngine.planarArea(geo, 'hectares').toFixed(2);
							xieshenPage.mapOperator2.view.popup.close()
							xieshenPage.mapOperator2.view.popup.open({
								title: "用地概况",
								location: geo.extent.center,
								content: '<table class="popupContent" border="1">\
									<tr><td>用地性质：</td><td>' + xz + ' </td></tr>\
									<tr><td>用地面积：</td><td>' + mj + '公顷</td></tr>\
									<tr><td>结论：</td><td>' + jl + ' </td></tr>\
									</table>'
							});

							var trArr = $(".fxTableDiv tbody").find('tr')
							setTimeout(function () {
								$('.esri-popup__button').click(function () {
									trArr.removeClass("activeXsR")
									xieshenPage.mapOperator2.map.findLayerById('select').graphics.removeAll()
								});
							}, 400);
							trArr.removeClass("activeXsR")
							$.each(trArr, function (i, n) {
								var dataFid = $(this).attr('data-fid')
								if (fxId == dataFid) {
									$(this).addClass("activeXsR")
									//锚点
									//$("#maoDian").attr("href", "#maoDian" + dataFid)
									$("#maoDian")[0].click()
								}
							});
							xieshenPage.mapOperator2.map.findLayerById("select").removeAll();
							xieshenPage.mapOperator2.polygonColorGraphAdd(geo, [0, 255, 255, 0.5], [0, 255, 255, 1], 1, {}, 'select')
						}
					}
					return
				}

				break;
			}
		}
		for (var i = 0; i < event.results.length; i++) {
			if (event.results[i].graphic.layer.id == "xsState") {

				var rings = event.results[i].graphic.geometry.rings;
				xieshenPage.fxGeo = event.results[i].graphic.geometry
				var location = event.results[i].mapPoint;
				//xieshenPage.attributes = event.results[i].graphic.attributes.ydxz
				//点击查询单个的相交地块（原来是用上传地块进行查询的）
				xieshenPage.attributes = event.results[i].graphic.attributes.scYdxz

				var showExtent = xieshenPage.fxGeo.extent;
				showExtent.expand(2);
				xieshenPage.mapOperator2.view.extent = showExtent
				xieshenPage.mapOperator1.view.extent = xieshenPage.mapOperator2.view.extent

				xieshenPage.mapOperator2.map.findLayerById("fg").removeAll();
				xieshenPage.mapOperator2.map.findLayerById("fx").removeAll();
				xieshenPage.mapOperator2.map.findLayerById("text").removeAll();
				xieshenPage.mapOperator2.map.findLayerById("select").removeAll();
				$(".fxTableDiv tbody").find('tr').removeClass("activeXsR")
				$(".faXq .table_yfa").hide()
				$(".faXq .table_xfa").hide()
				$(".faXq .tableDiv").hide()
				$(".faXq .fxTableDiv").show()
				break;
			}
		}
		xieshenPage.mapOperator2.polygonColorGraphAdd(xieshenPage.fxGeo, [255, 255, 255, 1], [0, 255, 255], 3, {
			"yes": true
		}, "fg")
		let queryTask = new xieshenPage.mapOperator.types.QueryTask({
			url: xsLayerInfo[xieshenPage.currentLayerName].url + '/' + xsLayerInfo[xieshenPage.currentLayerName].layerId,
		});

		// 当被统计字段为面积相关字段时，需要分情况进行查询
		let que = new xieshenPage.mapOperator.types.Query();
		que.geometry = xieshenPage.fxGeo;
		que.spatialRelationship = "intersects";
		que.outFields = ['*'];
		que.geometryPrecision = 6
		que.returnGeometry = true;

		queryTask.execute(que).then((response) => {
			if (response.features.length == 0) {
				$(".fxTableDiv tbody").html("<th colspan='7'>此项目不涉及</th>")
			}

			xieshenPage.js = 0
			for (let i = 0; i < response.features.length; i++) {
				var intersect_geo = xieshenPage.mapOperator.types.geoEngine.intersect(response.features[i].geometry, xieshenPage.fxGeo);
				if (intersect_geo) {
					var mj = xieshenPage.mapOperator.types.geoEngine.planarArea(intersect_geo, 'hectares');
					//过滤面积小于指定大小的地块
					if (mj < areaOver) {
						response.features.splice(i, 1)
						i--
					}
				} else {
					response.features.splice(i, 1)
					i--
				}

			}
			for (let i = 0; i < response.features.length; i++) {
				if (xsLayerInfo[xieshenPage.currentLayerName].attr) {
					var pending = response.features[i].attributes[xsLayerInfo[xieshenPage.currentLayerName].attr]
				} else {
					var pending = ""
				}
				(function (num, features, pending) {
					$.ajax({
						type: "GET",
						url: apiHttp + "/api/UseLand/GetUseLandXieShenRule",
						data: {
							'layercode': xsLayerInfo[xieshenPage.currentLayerName].code,
							'pending': pending,
							'standard': xieshenPage.attributes
						},
						dataType: "json",
						async: false,
						success: function (res) {
							xieshenPage.js++
							features[num].hg = res.Datas[0].ispass
							features[num].xieshen = res.Datas[0]
							var ydflMj = xieshenPage.mapOperator.types.geoEngine.planarArea(xieshenPage.fxGeo, 'hectares').toFixed(2);

							if (xieshenPage.js == features.length) {
								xieshenPage.fxFeatures = features
								xieshenPage.fxClashShow('mapOperator2', 16, features, 'fx', xieshenPage.fxGeo)
								var html = ""
								for (let i = 0; i < features.length; i++) {
									try {
										features[i].yGeometry = xieshenPage.fxGeo
										var geo = xieshenPage.mapOperator.types.geoEngine.intersect(features[i].geometry, xieshenPage.fxGeo);
										var dkMj = xieshenPage.mapOperator.types.geoEngine.planarArea(geo, 'hectares').toFixed(2);

										//用地代码转成英文
										var pendingMc = features[i].xieshen.pendingdlmc
										//展示为中文+用地代码
										var lxmc = attrDictionary[pendingMc] ? pendingMc + "(" + attrDictionary[pendingMc] + ")" : pendingMc;
										html += "<tr data-fid='" + i + "'>"
										html += "<td>" + (i + 1) + "</td>"
										html += "<td>" + lxmc + "</td>"
										html += "<td>" + dkMj + "</td>"

										var ydxz = xieshenPage.attributes;//用地代码
										//展示为中文+用地代码
										var lx = attrDictionary[ydxz] ? ydxz + "(" + attrDictionary[ydxz] + ")" : ydxz;
										if (i == 0) {
											//用地代码不合并行不合并行
											html += "<td class='hbTd' >" + lx + "</td>"
											html += "<td class='hbTd' rowspan='" + features.length + "'>" + ydflMj + "</td>"
										} else {
											html += "<td class='hbTd' >" + lx + "</td>"
										}

										var color = ""
										switch (features[i].xieshen.ispass) {
											case 0:
												color = 'FRColor'
												break;
											case 1:
												color = 'FGColor'
												break;
											case 2:
												color = 'FOColor'
												break;
											default:
												color = 'FNColor'
												break;
										}
										html += "<td class='" + color + "'>" + features[i].xieshen.resulttypename + "</td>"

										var guidcontenth = ""
										if (features[i].xieshen.guidcontent) {
											guidcontenth = features[i].xieshen.guidcontent
										}
										html += "<td>" + guidcontenth + "</td>"

										html += "</tr>"
									} catch (err) {
										console.log(err)
									}

								}
								$(".fxTableDiv tbody").html(html)
								$(".fxTableDiv tbody").find('tr').click(function () {
									var trArr = $(".fxTableDiv tbody").find('tr')
									trArr.removeClass("activeXsR")
									$(this).addClass("activeXsR")
									var fxId = $(this).attr("data-fid")
									var xz = xieshenPage.fxFeatures[fxId].xieshen.pendingdlmc
									var jl = xieshenPage.fxFeatures[fxId].xieshen.resulttypename

									var geo = xieshenPage.mapOperator.types.geoEngine.intersect(xieshenPage.fxFeatures[fxId].geometry, xieshenPage.fxFeatures[fxId].yGeometry);
									var mj = xieshenPage.mapOperator.types.geoEngine.planarArea(geo, 'hectares').toFixed(2);
									xieshenPage.mapOperator2.view.popup.close()
									xieshenPage.mapOperator2.view.popup.open({
										title: "用地概况",
										location: geo.extent.center,
										content: '<table class="popupContent" border="1">\
									<tr><td>用地性质：</td><td>' + xz + ' </td></tr>\
									<tr><td>用地面积：</td><td>' + mj + '公顷 </td></tr>\
									<tr><td>结论：</td><td>' + jl + ' </td></tr>\
									</table>'
									});

									setTimeout(function () {
										$('.esri-popup__button').click(function () {
											trArr.removeClass("activeXsR")
											xieshenPage.mapOperator2.map.findLayerById('select').graphics.removeAll()
										});
									}, 400);
									xieshenPage.mapOperator2.map.findLayerById("select").removeAll();
									xieshenPage.mapOperator2.polygonColorGraphAdd(geo, [0, 255, 255, 0.5], [0, 255, 255, 1], 1, {}, 'select')
								})
							}
						},
						error: function (err) {
							console.log(err);
						}
					})
				})(i, response.features, pending)

			}

		})

		/*var ydflMj = xieshenPage.mapOperator.types.geoEngine.planarArea(xieshenPage.fxGeo, 'hectares').toFixed(2);
		if(xieshenPage.fxGeo.extent.center) {
			xieshenPage.mapOperator2.view.popup.open({
				title: "用地概况",
				location: xieshenPage.fxGeo.extent.center,
				content: '<span class="yesXs" >用地性质： ' + xieshenPage.attributes + '</br>用地面积：' + ydflMj + 'ha</span>'
			});
		} else {
			xieshenPage.mapOperator2.view.popup.close();
		}*/
		var polygon = {
			type: "polygon", // autocasts as new Polygon()
			rings: rings,
			spatialReference: xieshenPage.mapOperator1.view.spatialReference
		};
		var fillSymbol = {
			type: "simple-fill", // autocasts as new SimpleFillSymbol()
			color: [0, 0, 0, 0],
			outline: {
				// autocasts as new SimpleLineSymbol()
				color: [0, 255, 255],
				width: 2
			}
		};
		var polygonGraphic = new xieshenPage.mapOperator1.types.Graphic({
			geometry: polygon,
			symbol: fillSymbol
		});
		xieshenPage.mapOperator1.view.graphics.removeAll();
		xieshenPage.mapOperator1.view.graphics.add(polygonGraphic);
		//xieshenPage.mapOperator2.view.graphics.removeAll();

		//xieshenPage.mapOperator2.view.graphics.add(polygonGraphic);

	},
	//分析功能显示冲突状态
	fxClashShow: function (obj, size, laySumarea, id, fxGeo) {
		for (let i = 0; i < laySumarea.length; i++) {
			var color = ''
			switch (laySumarea[i].hg) {
				case 0:
					color = [255, 0, 0, 0.9]
					break;
				case 1:
					color = [0, 255, 0, 0.9]
					break;
				case 2:
					color = [255, 127, 39, 0.9]
					break;
				default:
					break;
			}

			var attributes = {
				"id": i
			}
			var intersect_geo = xieshenPage.mapOperator.types.geoEngine.intersect(laySumarea[i].geometry, fxGeo);
			if (intersect_geo) {
				xieshenPage[obj].polygonColorGraphAdd(intersect_geo, color, [0, 255, 255, 1], 2, attributes, id, i + 1, size)
			}

		}
	},
	//清除渲染
	clearGraphic: function () {
		xieshenPage.mapOperator1.view.graphics.removeAll();
		xieshenPage.mapOperator1.map.findLayerById("dk").removeAll();
		xieshenPage.mapOperator1.map.findLayerById("fwx").removeAll();
		xieshenPage.mapOperator2.map.findLayerById("fwx").removeAll();
		xieshenPage.mapOperator2.map.findLayerById("dk").removeAll();
		xieshenPage.mapOperator2.view.graphics.removeAll();
	},
	//显示对应的表格数据
	showTable: function (layerName) {
		//详情表格里原定的‘原方案’表头文字需要展示为“图层名”
		$('.layerName').html(layerName);

		var layerCode = getLayerCodeByName(layerName);
		var data = xieshenPage.xsResult_ghfa[layerCode];
		$('.faXq .tableDiv,.faXq .table_yfa, .faXq .table_xfa').hide();
		//显示单个表格的图层
		if (data) {
			var aLayerArr = ['总规过渡版总图'];
			if (aLayerArr.indexOf(layerName) > -1) {
				$('.faXq .tableDiv').show();
				xieshenPage.getHtmlTable(data);
			} else {
				$('.faXq .table_yfa, .faXq .table_xfa').show();
				xieshenPage.getHtmlTable_yfa(data);
				xieshenPage.getHtmlTable_xfa(data);
			}
		}
	},
	//构建原方案表格的内容
	getHtmlTable_yfa: function (data, isHtml) {
		//同类型面积数据合并
		if ((data && data != "" && data.sumarea.length != 0)) {
			var obj = {};
			var sumarea = objDeepCopy(data.sumarea);
			for (var i = 0; i < sumarea.length; i++) {
				if (!obj[sumarea[i].type]) {
					obj[sumarea[i].type] = {};
					obj[sumarea[i].type] = sumarea[i].totalArea;
				} else {
					obj[sumarea[i].type] += sumarea[i].totalArea;
				}
			}
			//获取范围线面积
			var fwArea = xieshenPage.mapOperator.areaPgon(xieshenPage.faFwGeo);
			console.log(fwArea)
			//构建表格内容
			var htmlStr = '';
			let totalareas = 0; //其他面积
			let totalpro = 0; //其他占比
			for (var key in obj) {
				htmlStr += '<tr><td>' + key + '</td><td>' + obj[key].toFixed(2) + '</td>';
				//占比
				var zb = ((obj[key] / fwArea) * 100).toFixed(2) + '%'; //百分符
				htmlStr += '<td>' + zb + '</td></tr>';
				totalareas = (parseFloat(totalareas) + obj[key]).toFixed(2);
				totalpro = (parseFloat(totalpro) + (obj[key] / fwArea) * 100).toFixed(2);
			}
			htmlStr += '<tr><td>其它</td><td>' + (fwArea - parseFloat(totalareas)).toFixed(2) + '</td><td>' + (100 - parseFloat(totalpro)).toFixed(2) + '%</td>'
			htmlStr += '<tr><td>合计</td><td>' + fwArea.toFixed(2) + '</td><td>100%</td>';
			$('.faXq .right .table_yfa tbody').html(htmlStr);
		} else {
			var htmlStr = ""
			htmlStr = "<tr><th colspan='4'>此项目不涉及</th></tr>"
			$('.faXq .right .table_yfa tbody').html(htmlStr);
		}
		if (isHtml) {
			var returnHtml = $('.faXq .right .table_yfa').html()
			return returnHtml
		}
	},
	//构建新方案表格的内容
	getHtmlTable_xfa: function (data, isHtml) {
		//同类型面积数据合并
		var obj = {};
		var topObj = {};
		var hegui = objDeepCopy(data.hegui);
		for (var i = 0; i < hegui.length; i++) {
			var ydxzCode = hegui[i].ydxz;
			if (ydxzCode.length > 2) {
				var code = ydxzCode.substring(0, 2);
				if (!obj[code]) {
					obj[code] = hegui[i].ydmj;
				} else {
					obj[code] += hegui[i].ydmj;
				}
			} else {
				if (!obj[ydxzCode]) {
					obj[ydxzCode] = hegui[i].ydmj;
				} else {
					obj[ydxzCode] += hegui[i].ydmj;
				}
			}
		}
		for (var key in obj) {
			if (key.length == 2) {
				var code = key.substring(0, 1);
				var aobj = {};
				if (!topObj[code]) {
					aobj['mj'] = obj[key];
					aobj['child'] = [];
					var aKey = {};
					aKey['mj'] = obj[key];
					aKey['lx'] = key;
					aobj['child'].push(aKey);
					topObj[code] = aobj;
				} else {
					topObj[code]['mj'] += obj[key];
					var aKey = {};
					aKey['mj'] = obj[key];
					aKey['lx'] = key;
					topObj[code]['child'].push(aKey);
				}
			} else {
				var aobj = {};
				if (!topObj[key]) {
					aobj['mj'] = obj[key];
					aobj['child'] = [];
					topObj[code] = aobj;
				} else {
					topObj[key]['mj'] += obj[key];
				}
			}
		}

		//获取范围线面积
		var fwArea = xieshenPage.mapOperator.areaPgon(xieshenPage.faFwGeo);

		//构建表格内容
		var htmlStr = '';
		let totalareas = 0; //其他面积
		let totalpro = 0; //其他占比
		for (var key in topObj) {
			var row = topObj[key].child.length;
			//占比
			var zb = ((topObj[key].mj / fwArea) * 100).toFixed(2) + '%'; //百分符
			var lx = "";
			//用地类别代码转为中文
			lx = attrDictionary[key] ? key + "(" + attrDictionary[key] + ")" : key;

			htmlStr += '<tr><td colspan="2">' + lx + '</td><td>' + topObj[key].mj.toFixed(2) + '</td><td>' + zb +
				'</td></tr>';

			totalareas = (parseFloat(totalareas) + topObj[key].mj).toFixed(2);
			totalpro = (parseFloat(totalpro) + ((topObj[key].mj / fwArea) * 100)).toFixed(2)

			for (var i = 0; i < row; i++) {
				var aRow = topObj[key].child[i];
				var lxMc = "";
				//用地类别代码转为中文，展示位中文+用地代码
				lxMc = attrDictionary[aRow['lx']] ? aRow['lx'] + "(" + attrDictionary[aRow['lx']] + ")" : aRow['lx'];
				if (i == 0) {
					htmlStr += '<tr><td rowspan="' + row + '"></td>';
					var zbstr = ((aRow['mj'] / fwArea) * 100).toFixed(2) + '%'; //百分符
					htmlStr += '<td>' + lxMc + '</td><td>' + aRow['mj'].toFixed(2) + '</td><td>' + zbstr + '</td></tr>';
				} else {
					var zbstr = ((aRow['mj'] / fwArea) * 100).toFixed(2) + '%'; //百分符
					htmlStr += '<td>' + lxMc + '</td><td>' + aRow['mj'].toFixed(2) + '</td><td>' + zbstr + '</td></tr>';
				}
			}
		}
		htmlStr += '<tr><td colspan="2">其它</td><td>' + (fwArea - totalareas).toFixed(2) + '</td><td>' + (100 - totalpro).toFixed(2) + '%</td>'
		htmlStr += '<tr><td colspan="2">合计</td><td>' + fwArea.toFixed(2) + '</td><td>100%</td>';
		$('.faXq .right .table_xfa tbody').html(htmlStr);
		if (isHtml) {
			var returnHtml = $('.faXq .right .table_xfa').html()
			return returnHtml
		}
	},
	//构建合并表格内容
	getHtmlTable: function (data, isHtml) {
		//构建的json数据
		var dealJson = xieshenPage.dealData(data);
		var fwArea = xieshenPage.mapOperator.areaPgon(xieshenPage.faFwGeo);
		//构建表格内容
		var htmlStr = '';
		let oldareas = 0; //旧其他面积
		let oldpro = 0; //旧其他占比
		let newareas = 0; //新其他面积
		let newpro = 0; //新其他占比
		for (var key in dealJson) {
			var lx = "";
			//用地类别代码转为中文
			lx = attrDictionary[key] ? key + "(" + attrDictionary[key] + ")" : key;
			htmlStr += '<tr><td colspan="2">' + lx + '</td><td>' + dealJson[key].ymj + '</td><td>' + dealJson[key].yzb +
				'</td><td>' + dealJson[key].xmj + '</td><td>' + dealJson[key].xzb + '</td><td>' + dealJson[key].bdz +
				'</td></tr>';
			isNaN(parseFloat(dealJson[key].ymj)) ? null : oldareas = oldareas + parseFloat(dealJson[key].ymj); //判断值能否转换为数字运算
			isNaN(parseFloat(dealJson[key].yzb)) ? null : oldpro = oldpro + parseFloat(dealJson[key].yzb);
			isNaN(parseFloat(dealJson[key].xmj)) ? null : newareas = newareas + parseFloat(dealJson[key].xmj);
			isNaN(parseFloat(dealJson[key].xzb)) ? null : newpro = newpro + parseFloat(dealJson[key].xzb);
			var rowNum = dealJson[key].child.length;
			if (rowNum > 0) {
				for (var i = 0; i < rowNum; i++) {
					var aRow = dealJson[key].child[i];
					var lx = "";
					//用地类别代码转为中文,展示为中文+用地代码
					lx = attrDictionary[aRow.lx] ? aRow.lx + "(" + attrDictionary[aRow.lx] + ")" : aRow.lx;
					if (i == 0) {
						htmlStr += '<tr><td rowspan="' + rowNum + '"></td>';
						htmlStr += '<td>' + lx + '</td><td>' + aRow.ymj + '</td><td>' + aRow.yzb + '</td><td>' + aRow.xmj +
							'</td><td>' + aRow.xzb + '</td><td>' + aRow.bdz + '</td></<tr>';
					} else {
						htmlStr += '<tr><td>' + lx + '</td><td>' + aRow.ymj + '</td><td>' + aRow.yzb + '</td><td>' + aRow.xmj +
							'</td><td>' + aRow.xzb + '</td><td>' + aRow.bdz + '</td></tr>';
					}
				}
			}
		}
		htmlStr += '<tr><td colspan="2">其它</td><td>' + (fwArea - oldareas).toFixed(2) + '</td><td>' + (100 - oldpro).toFixed(2) +
			'</td><td>' + (fwArea - newareas).toFixed(2) + '</td><td>' + (100 - newpro).toFixed(2) + '</td><td>' +
			((fwArea - newareas) - (fwArea - oldareas)).toFixed(2) + '</td></tr>';
		htmlStr += '<tr><td colspan="2">合计</td><td>' + fwArea.toFixed(2) + '</td><td>100</td><td>' +
			fwArea.toFixed(2) + '</td><td>100</td><td>0</td></tr>';
		$('.faXq .right .tableDiv tbody').html(htmlStr);
		if (isHtml) {
			var returnHtml = $('.faXq .right .tableDiv').html()
			return returnHtml
		}
	},
	//方案合并的表格数据处理
	dealData: function (data) {
		var allObj = {};
		//获取范围线面积
		var fwArea = xieshenPage.mapOperator.areaPgon(xieshenPage.faFwGeo);
		var xfaData = xieshenPage.xfaDataDeal(data);
		var yfaData = xieshenPage.yfaDataDeal(data);

		//新方案里数据组装
		for (var attr in xfaData) {
			var topObj = {};
			topObj['xmj'] = xfaData[attr].mj.toFixed(2);
			topObj['xzb'] = ((xfaData[attr].mj / fwArea) * 100).toFixed(2);
			if (yfaData[attr]) {
				topObj['ymj'] = yfaData[attr].mj.toFixed(2);
				topObj['yzb'] = ((yfaData[attr].mj / fwArea) * 100).toFixed(2);
				topObj['bdz'] = (xfaData[attr].mj - yfaData[attr].mj).toFixed(2);
				topObj['child'] = [];
				allObj[attr] = topObj;

				var xChildNode = xfaData[attr].child;
				var yChildNode = yfaData[attr].child;
				if (xChildNode.length > 0) {
					for (var i = 0; i < xChildNode.length; i++) {
						var aNode = xChildNode[i];
						var aobj = {};
						aobj['xmj'] = aNode['mj'].toFixed(2);
						aobj['xzb'] = ((aNode['mj'] / fwArea) * 100).toFixed(2);
						if (yChildNode.length > 0) {
							for (var k = 0; k < yChildNode.length; k++) {
								var node = yChildNode[k];
								if (aNode['lx'] == node['lx']) {
									aobj['ymj'] = node['mj'].toFixed(2);
									aobj['yzb'] = ((node['mj'] / fwArea) * 100).toFixed(2);
									aobj['bdz'] = (aNode['mj'] - node['mj']).toFixed(2);
									//allObj[aNode['lx']] = aobj;
									aobj['lx'] = aNode['lx'];
									allObj[attr]['child'].push(aobj);
								} else {
									aobj['ymj'] = '--';
									aobj['yzb'] = '--';
									aobj['bdz'] = aNode['mj'].toFixed(2);
									//allObj[aNode['lx']] = aobj;
									aobj['lx'] = aNode['lx'];
									allObj[attr]['child'].push(aobj);
									var aobj = {};
									aobj['xmj'] = '--';
									aobj['xzb'] = '--';
									aobj['ymj'] = node['mj'].toFixed(2);
									aobj['yzb'] = ((node['mj'] / fwArea) * 100).toFixed(2);
									aobj['bdz'] = -node['mj'].toFixed(2);
									//allObj[node['lx']] = aobj;
									aobj['lx'] = node['lx'];
									allObj[attr]['child'].push(aobj);
								}
							}
						} else {
							aobj['ymj'] = '--';
							aobj['yzb'] = '--';
							aobj['bdz'] = aNode['mj'].toFixed(2);
							//allObj[aNode['lx']] = aobj;
							aobj['lx'] = aNode['lx'];
							allObj[attr]['child'].push(aobj);
						}
					}
				}
			} else {
				topObj['ymj'] = '--';
				topObj['yzb'] = '--';
				topObj['bdz'] = xfaData[attr].mj.toFixed(2);
				topObj['child'] = [];
				allObj[attr] = topObj;

				var xChildNode = xfaData[attr].child;

				if (xChildNode.length > 0) {
					for (var i = 0; i < xChildNode.length; i++) {
						var aNode = xChildNode[i];
						var aobj = {};
						aobj['xmj'] = aNode['mj'].toFixed(2);
						aobj['xzb'] = ((aNode['mj'] / fwArea) * 100).toFixed(2);
						aobj['ymj'] = '--';
						aobj['yzb'] = '--';
						aobj['bdz'] = aNode['mj'].toFixed(2);
						//allObj[aNode['lx']] = aobj;
						aobj['lx'] = aNode['lx'];
						allObj[attr]['child'].push(aobj);
					}
				}
			}
		}

		//原方案里数据组装
		for (var attr in yfaData) {
			var aobj = {};
			if (!allObj[attr]) {
				aobj['xmj'] = '--';
				aobj['xzb'] = '--';
				aobj['ymj'] = yfaData[attr].mj.toFixed(2);
				aobj['yzb'] = ((yfaData[attr].mj / fwArea) * 100).toFixed(2);
				aobj['bdz'] = (-yfaData[attr].mj).toFixed(2);
				aobj['child'] = [];
				allObj[attr] = aobj;
				var yChildNode = yfaData[attr].child;
				if (yChildNode.length > 0) {
					for (let i = 0; i < yChildNode.length; i++) {
						var node = yChildNode[i];
						var aobj = {};
						aobj['xmj'] = '--';
						aobj['xzb'] = '--';
						aobj['ymj'] = node['mj'].toFixed(2);
						aobj['yzb'] = ((node['mj'] / fwArea) * 100).toFixed(2);
						aobj['bdz'] = -node['mj'].toFixed(2);
						//allObj[node['lx']] = aobj;
						aobj['lx'] = node['lx'];
						allObj[attr]['child'].push(aobj);
					}
				}
			}
		}
		return allObj;
	},
	//原方案面积归类
	yfaDataDeal: function (data) {
		var obj2 = {};
		var topObj = {};
		var sumarea = objDeepCopy(data.sumarea);
		for (var i = 0; i < sumarea.length; i++) {
			var ydxzCode = sumarea[i].type;
			if (ydxzCode.length > 2) {
				var code = ydxzCode.substring(0, 2);
				if (!obj2[code]) {
					obj2[code] = sumarea[i].totalArea;
				} else {
					obj2[code] += sumarea[i].totalArea;
				}
			} else {
				if (!obj2[ydxzCode]) {
					obj2[ydxzCode] = sumarea[i].totalArea;
				} else {
					obj2[ydxzCode] += sumarea[i].totalArea;
				}
			}
		}
		for (var key in obj2) {
			if (key.length == 2) {
				var code = key.substring(0, 1);
				var aobj = {};
				if (!topObj[code]) {
					aobj['mj'] = obj2[key];
					aobj['child'] = [];
					var aKey = {};
					aKey['mj'] = obj2[key];
					aKey['lx'] = key;
					aobj['child'].push(aKey);
					topObj[code] = aobj;
				} else {
					topObj[code]['mj'] += obj2[key];
					var aKey = {};
					aKey['mj'] = obj2[key];
					aKey['lx'] = key;
					topObj[code]['child'].push(aKey);
				}
			} else {
				var aobj = {};
				if (!topObj[key]) {
					aobj['mj'] = obj2[key];
					aobj['child'] = [];
					topObj[key] = aobj;
				} else {
					topObj[key]['mj'] += obj2[key];
				}
			}
		}
		return topObj;
	},
	//新方案面积归类
	xfaDataDeal: function (data) {
		var obj2 = {};
		var topObj = {};
		var hegui = objDeepCopy(data.hegui);
		for (var i = 0; i < hegui.length; i++) {
			var ydxzCode = hegui[i].ydxz;
			if (ydxzCode.length > 2) {
				var code = ydxzCode.substring(0, 2);
				if (!obj2[code]) {
					obj2[code] = hegui[i].ydmj;
				} else {
					obj2[code] += hegui[i].ydmj;
				}
			} else {
				if (!obj2[ydxzCode]) {
					obj2[ydxzCode] = hegui[i].ydmj;
				} else {
					obj2[ydxzCode] += hegui[i].ydmj;
				}
			}
		}
		for (var key in obj2) {
			if (key.length == 2) {
				var code = key.substring(0, 1);
				var aobj = {};
				if (!topObj[code]) {
					aobj['mj'] = obj2[key];
					aobj['child'] = [];
					var aKey = {};
					aKey['mj'] = obj2[key];
					aKey['lx'] = key;
					aobj['child'].push(aKey);
					topObj[code] = aobj;
				} else {
					topObj[code]['mj'] += obj2[key];
					var aKey = {};
					aKey['mj'] = obj2[key];
					aKey['lx'] = key;
					topObj[code]['child'].push(aKey);
				}
			} else {
				var aobj = {};
				if (!topObj[key]) {
					aobj['mj'] = obj2[key];
					aobj['child'] = [];
					topObj[key] = aobj;
				} else {
					topObj[key]['mj'] += obj2[key];
				}
			}
		}
		return topObj;
	}
	//#endregion
};

//#region 帮助方法
//对象数组拷贝
function objDeepCopy(source) {
	var sourceCopy = source
	/*var sourceCopy = source instanceof Array ? [] : {};
	for(var item in source) {
		sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
	}*/
	return sourceCopy;
}

//数组去重
function unique(arr) {
	var hash = [];
	for (var i = 0; i < arr.length; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i] === arr[j]) {
				++i;
			}
		}
		hash.push(arr[i]);
	}
	return hash;
}
//#endregion 帮助方法

//#region 加载进度插件
(function ($) {

	/**
	 * 自定义
	 * @param method
	 * @returns {*}
	 */
	$.fn.step = function (method) {
		//你自己的插件代码
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	};

	/**
	 * 默认值
	 * @type {{stepNames: [*], initStep: number}}
	 */
	var defStep = {
		stepNames: ['', '', ''],
		initStep: 0
	};

	/**
	 * 函数
	 * @type {{init: init, next: next, previous: previous, goto: goto}}
	 */
	var methods;
	methods = {

		/**
		 * 初始化
		 * @param options
		 */
		init: function (options) {
			// 初始化参数为空，使用默认设置
			if (!options) {
				options = defStep;
			} else {
				// 步骤名称判断
				if (!options.stepNames || typeof options.stepNames !== "object") {
					options.stepNames = defStep.stepNames;
				}
				// 初始化步骤判断
				if (!options.initStep || isNaN(options.initStep) || options.initStep < 0) {
					options.initStep = defStep.initStep;
				}
				// 初始化步骤大于最大值
				if (options.initStep > options.stepNames.length) {
					options.initStep = options.stepNames.length;
				}
			}
			// 初始化样式
			var html = '';
			html += '<ul class="progressbar">';
			$.each(options.stepNames, function (index, name) {
				html += '<li';
				if (index < options.initStep) {
					html += ' class="active" ';
				}
				html += '>';
				html += name;
				html += '</li>';
			});
			html += '</ul>';
			this.empty().append(html);
			// 计算宽度
			$(".progressbar li").css("width", 100 / options.stepNames.length + "%");
		},

		/**
		 * 下一步
		 */
		next: function () {
			var index = this.find("li.active").length;
			if (index == this.find("li").length) {
				return;
			}
			this.find("li").eq(index).addClass("active");
		},

		/**
		 * 上一步
		 */
		previous: function () {
			var index = this.find("li.active").length;
			if (index == 1) {
				return;
			}
			this.find("li").eq(index - 1).removeClass("active");
		},

		/**
		 * 去第几步
		 * @param step
		 */
		goto: function (step) {
			if (step < 0 || step > this.find("li").length) {
				return;
			}
			this.find("li").removeClass("active");
			var $target = this.find("li").eq(step - 1);
			$target.addClass("active");
			$target.prevAll("li").addClass("active");
		}
	};
}($));
//#endregion

function getLayerCodeByName(name) {
	var code = "";
	for (var i = 0; i < layertree.length; i++) {
		for (var j = 0; j < layertree[i].child.length; j++) {
			if (layertree[i].child[j].name == name) {
				code = layertree[i].child[j].code;
				break;
			}
		}
	}
	return code;
}
