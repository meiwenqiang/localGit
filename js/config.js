//协审后台接口
var newPyHttp = "http://192.168.8.41:5002/"
var netHttp = "http://192.168.8.41:8880";
//var netHttp = "http://localhost:8090";
var apiHttp = "http://192.168.8.41:8889";//api
//协审规则脚本
//var pyHttp = "http://192.168.10.29:8890/test/";
var pyHttp = "http://119.23.222.168:5863/"; //末尾斜杆
var dayinArcgisUrl="http://192.168.8.41:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
//协审图层配置
//var xsLayerInfo = {   //原数据
//	"城镇开发边界": '',
//	"基本农田": {
//		url: 'http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_JBNTBGQ/MapServer',
//		type: "image"
//	},
//	"基本生态控制线": {
//		url: 'http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_STKZX/MapServer',
//		type: "image"
//	},
//	"生态保护红线": {
//		url: 'http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_SZHX1/MapServer',
//		type: "image"
//	},
//	"总规过渡版总图": {
//		url: 'http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_ZGGDB/MapServer',
//		type: "image"
//	},
//	"土地利用总体规划":{
//		url: 'http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_TGTZ/MapServer',
//		type: "image"
//	},
//	"控制性详细规则": '',
//	"紫线规则": '',
//	"三线一路": {
//		url:'http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_SXYLBHGH/MapServer',
//		type: "image"
//	},
//	"城市道路红线": ''
//};
/*底图*/
var dtLayers = {
	"底图": "http://192.168.8.41:6080/arcgis/rest/services/GIS_DT_QGDT_WHCSQ/MapServer",
	"注记": "http://192.168.8.41:6080/arcgis/rest/services/GIS_DT_QGDT_WHZJ/MapServer"
};

/*参考图层树状结构*/
//var layertree = [         //原数据
//	{
//		name: "三区三线",
//		child: [
//			{name: "城镇开发边界",code: ""},
//			{name: "基本农田",code: "nt"}, ////
//			{name: "基本生态控制线",code: "st"}, ////st
//			{name: "生态保护红线",code: "hx"} ////
//		]
//	},
//	{
//		name: "法定规则",
//		child: [
//			{name: "总规过渡版总图",code: "zg"}, ////
//			{name: "土地利用总体规划",code: "tg"},////tg
//			{name: "控制性详细规则",code: ""} ////kg
//		]
//	},
//	{
//		name: "专线规划",
//		child: [
//			{name: "紫线规则",code: ""},
//			{name: "三线一路",code: "xl"}, ////xl
//			{name: "城市道路红线",code: ""}
//		]
//	}
//]

var xsLayerInfo = {};      //该数据用作测试
var layertree = [           //该数据用作测试
    {
        name: "三区三线",
        child: []
    },
    {
        name: "法定规划",
        child: []
    },
    {
        name: "专项规划",
        child: []
    }
]


//为假数据仅仅用做测试
/*var resdata = {
    "Flag": 10000,
    "Message": "执行成功",
    "Datas": [
        {
            "id": 3,
            "name": "土地利用总体规划",
            "customcode": "tg",
            "attr": "GHDLMC",
            "ascription": "法定规则",
            "url": "http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_TGTZ/MapServer",
            "type": "image"
        },
        {
            "id": 9,
            "name": "城镇开发边界",
            "customcode": null,
            "attr": null,
            "ascription": "三区三线",
            "url": "",
            "type": ""
        },
        {
            "id": 10,
            "name": "紫线规则",
            "customcode": null,
            "attr": null,
            "ascription": "专线规划",
            "url": "",
            "type": ""
        },
        {
            "id": 11,
            "name": "城市道路红线",
            "customcode": null,
            "attr": null,
            "ascription": "专线规划",
            "url": "",
            "type": ""
        },
        {
            "id": 2,
            "name": "总规过渡版总图",
            "customcode": "zg",
            "attr": "用地分",
            "ascription": "法定规则",
            "url": "http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_ZGGDB/MapServer",
            "type": "image"
        },
        {
            "id": 4,
            "name": "基本生态控制线",
            "customcode": "st",
            "attr": "类别",
            "ascription": "三区三线",
            "url": "http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_STKZX/MapServer",
            "type": "image"
        },
        {
            "id": 5,
            "name": "控制性详细规划",
            "customcode": "",
            "attr": null,
            "ascription": "法定规则",
            "url": "",
            "type": ""
        },
        {
            "id": 6,
            "name": "生态保护红线",
            "customcode": "hx",
            "attr": null,
            "ascription": "三区三线",
            "url": "http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_SZHX1/MapServer",
            "type": "image"
        },
        {
            "id": 7,
            "name": "基本农田",
            "customcode": "nt",
            "attr": null,
            "ascription": "三区三线",
            "url": "http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_JBNTBGQ/MapServer",
            "type": "image"
        },
        {
            "id": 8,
            "name": "三线一路",
            "customcode": "xl",
            "attr": null,
            "ascription": "专线规划",
            "url": 'http://58.49.22.196:2963/arcgis/rest/services/SCCS/GIS_SYS_HGXSC_SXYLBHGH/MapServer',
            "type": "image"
        }
    ],
    "Total": 0,
    "PageCount": 1,
    "PageIndex": 1,
    "PageSize": 10
}
*/
var ydDictionary = {
	R: {
		color: [255, 255, 0],
		text: '居住用地'
	},
	R1: {
		color: [255, 255, 190],
		text: '一类居住用地'
	},
	R11: {
		color: [255, 255, 190],
		text: '一类住宅用地'
	},
	R12: {
		color: [255, 255, 190],
		text: '一类服务设施用地'
	},
	R2: {
		color: [255, 255, 0],
		text: '二类居住用地'
	},
	R21: {
		color: [255, 255, 0],
		text: '二类住宅用地'
	},
	R22: {
		color: [255, 255, 0],
		text: '二类服务设施用地'
	},
	R3: {
		color: [194, 181, 0],
		text: '三类居住用地'
	},
	R31: {
		color: [194, 181, 0],
		text: '三类住宅用地'
	},
	R32: {
		color: [194, 181, 0],
		text: '三类服务设施用地'
	},
	A: {
		color: [165, 0, 165],
		text: '公共管理与公共服务用地'
	},
	A1: {
		color: [245, 87, 255],
		text: '行政办公用地'
	},
	A2: {
		color: [255, 186, 217],
		text: '文化设施用地'
	},
	A21: {
		color: [255, 186, 217],
		text: '图书展览用地'
	},
	A22: {
		color: [255, 186, 217],
		text: '文化活动用地'
	},
	A3: {
		color: [255, 184, 0],
		text: '教育科研用地'
	},
	A31: {
		color: [255, 184, 0],
		text: '高等院校用地'
	},
	A32: {
		color: [255, 184, 0],
		text: '中等专业学校用地'
	},
	A33: {
		color: [255, 255, 190],
		text: '中小学用地'
	},

	A331: {
		color: [255, 255, 190],
		text: '小学'
	},
	A332: {
		color: [255, 255, 190],
		text: '中学'
	},
	A333: {
		color: [255, 255, 190],
		text: '九年一贯制学校'
	},

	A34: {
		color: [255, 184, 0],
		text: '特殊教育用地'
	},
	A35: {
		color: [255, 184, 0],
		text: '科研用地'
	},

	A4: {
		color: [30, 199, 176],
		text: '体育用地'
	},
	A41: {
		color: [30, 199, 176],
		text: '体育场馆用地'
	},
	A42: {
		color: [30, 199, 176],
		text: '体育训练用地'
	},

	A5: {
		color: [205, 189, 15],
		text: '医疗卫生用地'
	},
	A51: {
		color: [205, 189, 15],
		text: '医院用地'
	},
	A511: {
		color: [205, 189, 15],
		text: '综合医院'
	},
	A512: {
		color: [205, 189, 15],
		text: '专科医院'
	},
	A513: {
		color: [205, 189, 15],
		text: '社区卫生服务中心'
	},
	A52: {
		color: [205, 189, 15],
		text: '卫生防疫用地'
	},
	A53: {
		color: [205, 189, 15],
		text: '特殊医疗用地'
	},
	A59: {
		color: [205, 189, 15],
		text: '其他医疗卫生用地'
	},

	A6: {
		color: [168, 56, 0],
		text: '社会福利设施用地'
	},
	A7: {
		color: [165, 124, 82],
		text: '文物古迹用地'
	},
	A8: {
		color: [168, 61, 92],
		text: '外事用地'
	},
	A9: {
		color: [76, 57, 38],
		text: '宗教用地'
	},
	

	B: {
		color: [255, 0, 0],
		text: '商业服务业设施'
	},
	B1: {
		color: [255, 0, 0],
		text: '商业设施用地'
	},
	B11: {
		color: [255, 0, 0],
		text: '零售商业用地'
	},
	B12: {
		color: [255, 0, 0],
		text: '批发市场用地'
	},
	B13: {
		color: [255, 0, 0],
		text: '餐饮用地'
	},
	B14: {
		color: [255, 0, 0],
		text: '旅馆用地'
	},
	B2: {
		color: [255, 0, 0],
		text: '商务用地'
	},
	B21: {
		color: [255, 0, 0],
		text: '金融保险用地'
	},
	B22: {
		color: [255, 0, 0],
		text: '艺术传媒用地'
	},
	B29: {
		color: [255, 0, 0],
		text: '其他商务用地'
	},

	B3: {
		color: [255, 127, 159],
		text: '娱乐康体用地'
	},
	B31: {
		color: [255, 127, 159],
		text: '娱乐用地'
	},
	B32: {
		color: [255, 127, 159],
		text: '康体用地'
	},

	B4: {
		color: [115, 178, 255],
		text: '公用设施营业网点用地'
	},
	B41: {
		color: [115, 178, 255],
		text: '加油加气站用地'
	},
	B49: {
		color: [115, 178, 255],
		text: '其他公用设施营业网点用地'
	},

	B9: {
		color: [255, 107, 0],
		text: '其他服务设施用地'
	},
	F2: {
		color: [255, 255, 0],
		text: "增量待建用地"
	},
	F3: {
		color: [255, 255, 0],
		text: "未批待建用地"
	},
	M: {
		color: [184, 138, 92],
		text: '工业用地'
	},
	M1: {
		color: [255, 159, 127],
		text: '一类工业用地'
	},
	M2: {
		color: [184, 138, 92],
		text: '二类工业用地'
	},
	M3: {
		color: [135, 62, 27],
		text: '三类工业用地'
	},

	W: {
		color: [212, 71, 255],
		text: '物流仓储用地'
	},
	W1: {
		color: [212, 71, 255],
		text: '一类物流仓储用地'
	},
	W2: {
		color: [212, 71, 255],
		text: '二类物流仓储用地'
	},
	W3: {
		color: [212, 71, 255],
		text: '三类物流仓储用地'
	},

	S: {
		color: [115, 178, 255],
		text: '交通设施用地'
	},
	S1: {
		color: [156, 156, 156],
		text: '城市道路用地'
	},
	S2: {
		color: [115, 178, 255],
		text: '城市轨道交通用地'
	},
	S3: {
		color: [115, 178, 255],
		text: '综合交通枢纽用地'
	},
	S31: {
		color: [115, 178, 255],
		text: '铁路枢纽用地'
	},
	S32: {
		color: [115, 178, 255],
		text: '长途客运站用地'
	},
	S33: {
		color: [115, 178, 255],
		text: '客运港用地'
	},
	S4: {
		color: [115, 178, 255],
		text: '交通场站用地'
	},
	S41: {
		color: [115, 178, 255],
		text: '公共交通场站用地'
	},
	S42: {
		color: [115, 178, 255],
		text: '社会停车场用地'
	},
	S9: {
		color: [115, 178, 255],
		text: '其他交通设施用地'
	},

	U: {
		color: [115, 178, 255],
		text: '公用设施用地'
	},
	U1: {
		color: [115, 178, 255],
		text: '供应设施用地'
	},
	U11: {
		color: [115, 178, 255],
		text: '供水用地'
	},
	U12: {
		color: [115, 178, 255],
		text: '供电用地'
	},
	U13: {
		color: [115, 178, 255],
		text: '供燃气用地'
	},
	U14: {
		color: [115, 178, 255],
		text: '供热用地'
	},
	U15: {
		color: [115, 178, 255],
		text: '通信用地'
	},
	U16: {
		color: [115, 178, 255],
		text: '广播电视用地'
	},
	U2: {
		color: [115, 178, 255],
		text: '环境设施用地'
	},
	U21: {
		color: [115, 178, 255],
		text: '排水用地'
	},
	U22: {
		color: [115, 178, 255],
		text: '环卫用地'
	},
	U3: {
		color: [115, 178, 255],
		text: '安全设施用地'
	},
	U31: {
		color: [115, 178, 255],
		text: '消防设施用地'
	},
	U32: {
		color: [115, 178, 255],
		text: '防洪设施用地'
	},
	U9: {
		color: [115, 178, 255],
		text: '其他公用设施用地'
	},

	G: {
		color: [85, 255, 0],
		text: '绿地与广场用地'
	},
	G1: {
		color: [85, 255, 0],
		text: '公园绿地'
	},
	G11: {
		color: [85, 255, 0],
		text: '城市公园'
	},
	G111: {
		color: [85, 255, 0],
		text: '市级公园'
	},
	G112: {
		color: [85, 255, 0],
		text: '区级公园'
	},
	G113: {
		color: [85, 255, 0],
		text: '专类公园'
	},
	G12: {
		color: [85, 255, 0],
		text: '社区公园'
	},
	G121: {
		color: [85, 255, 0],
		text: '居住区公园'
	},
	G122: {
		color: [85, 255, 0],
		text: '带状公园'
	},
	G123: {
		color: [85, 255, 0],
		text: '街头公园'
	},

	G2: {
		color: [76, 191, 0],
		text: '防护绿地'
	},
	G3: {
		color: [196, 255, 215],
		text: '广场用地'
	},
	G4: {
		color: [44, 109, 11],
		text: '生产绿地'
	},

	H: {
		color: [194, 184, 0],
		text: '建设用地'
	},
	H1: {
		color: [194, 184, 0],
		text: '城乡居民点建设用地'
	},
	H11: {
		color: [194, 184, 0],
		text: '城市建设用地'
	},
	H12: {
		color: [194, 184, 0],
		text: '镇建设用地'
	},
	H13: {
		color: [194, 184, 0],
		text: '乡建设用地'
	},
	H14: {
		color: [194, 184, 0],
		text: '村庄建设用地'
	},

	H2: {
		color: [130, 130, 130],
		text: '区域交通设施用地'
	},
	H21: {
		color: [130, 130, 130],
		text: '铁路用地'
	},
	H22: {
		color: [130, 130, 130],
		text: '公路用地'
	},
	H23: {
		color: [115, 148, 222],
		text: '港口用地'
	},
	H24: {
		color: [178, 178, 178],
		text: '机场用地'
	},
	H25: {
		color: [130, 130, 130],
		text: '管道运输用地'
	},

	H3: {
		color: [115, 178, 255],
		text: '区域公用设施用地'
	},
	H31: {
		color: [115, 178, 255],
		text: '能源设施用地'
	},
	H32: {
		color: [115, 178, 255],
		text: '水工设施用地'
	},
	H33: {
		color: [115, 178, 255],
		text: '殡葬设施用地'
	},
	H34: {
		color: [115, 178, 255],
		text: '环卫设施用地'
	},
	H39: {
		color: [115, 178, 255],
		text: '其他区域公用设施用地'
	},

	H4: {
		color: [225, 225, 225],
		text: '特殊用地'
	},
	H41: {
		color: [225, 225, 225],
		text: '军事用地'
	},
	H42: {
		color: [225, 225, 225],
		text: '安保用地'
	},

	H5: {
		color: [185, 91, 0],
		text: '采矿用地'
	},

	H9: {
		color: [222, 255, 145],
		text: '其他建设用地'
	},
	H9R: {
		color: [222, 255, 145],
		text: '生态型居住用地'
	},
	H9A: {
		color: [222, 255, 145],
		text: '生态型公共管理和服务用地'
	},
	H9B: {
		color: [222, 255, 145],
		text: '生态型商业服务业设施用地用地'
	},
	H9D: {
		color: [222, 255, 145],
		text: '生态型研发设施用地'
	},
	H9Z: {
		color: [222, 255, 145],
		text: '其他独立建设用地'
	},

	E: {
		color: [139, 217, 103],
		text: '非建设用地'
	},
	E1: {
		color: [177, 229, 253],
		text: '水域'
	},
	E2: {
		color: [139, 217, 103],
		text: '农林用地'
	},
	E21: {
		color: [139, 217, 103],
		text: '农用地'
	},
	E22: {
		color: [139, 217, 103],
		text: '林地'
	},
	E23: {
		color: [58, 118, 30],
		text: '山体'
	},
	E29: {
		color: [139, 217, 103],
		text: '其他农林用地'
	},

	E3: {
		color: [211, 255, 190],
		text: '生态维育用地'
	},
	E9: {
		color: [56, 186, 0],
		text: '生态维育用地'
	},
	K: {
		color: [201, 201, 201],
		text: '发展备用地'
	},
	
	AB: {
		color: [245, 87, 255],
		text: '临里中心'
	},
	RB: {
		color: [255, 255, 0],
		text: '住商混合用地'
	},
	BR: {
		color: [255, 0, 0],
		text: '商住混合用地'
	},
	A334: {
		color:  [255, 255, 190],
		text: '初中'
	},
};



//面积过滤配置（单位是公顷）
var areaOver = 0.04;

//属性字典
var attrDictionary = {"R":"居住用地","R1":"一类居住用地","B49":"其他公用设施营业网点用地","B9":"其他服务设施用地","M":"工业用地","M1":"一类工业用地","M2":"二类工业用地","M3":"三类工业用地","W":"物流仓储用地","W1":"一类物流仓储用地","W2":"二类物流仓储用地","W3":"三类物流仓储用地","S":"交通设施用地","S1":"城市道路用地","S2":"城市轨道交通用地","S3":"综合交通枢纽用地","S31":"铁路枢纽用地","S32":"长途客运站用地","S33":"客运港用地","S4":"交通场站用地","S41":"公共交通场站用地","S42":"社会停车场用地","S9":"其他交通设施用地","U":"公用设施用地","U1":"供应设施用地","U11":"供水用地","U12":"供电用地","U13":"供燃气用地","U14":"供热用地","U15":"通信用地","U16":"广播电视用地","U2":"环境设施用地","U21":"排水用地","U22":"环卫用地","U3":"安全设施用地","U31":"消防设施用地","U32":"防洪设施用地","U9":"其他公用设施用地","G":"绿地与广场用地","G1":"公园绿地","G11":"城市公园","G111":"市级公园","G112":"区级公园","G113":"专类公园","G12":"社区公园","G121":"居住区公园","G122":"带状公园","G123":"街头公园","G2":"防护绿地","G3":"广场用地","G4":"生产绿地","H":"建设用地","H1":"城乡居民点建设用地","H11":"城市建设用地","H12":"镇建设用地","H13":"乡建设用地","H14":"村庄建设用地","H2":"区域交通设施用地","H21":"铁路用地","H23":"港口用地","H24":"机场用地","H3":"区域公用设施用地","H31":"能源设施用地","H32":"水工设施用地","H33":"殡葬设施用地","H34":"环卫设施用地","H39":"其他区域公用设施用地","H4":"特殊用地","H41":"军事用地","H42":"安保用地","H5":"采矿用地","H9":"其他建设用地","H9R":"生态型居住用地","H9A":"生态型公共管理和服务用地","H9B":"生态型商业服务业设施用地用地","H9D":"生态型研发设施用地","H9Z":"其他独立建设用地","E":"非建设用地","E1":"水域","E2":"农林用地","E21":"农用地","E22":"林地","E23":"山体","E29":"其他农林用地","E3":"生态维育用地","E9":"其他非建设用地","K":"发展备用地","G5":"其他绿地","A334":"初中","A335":"高中","R2":"二类居住用地","R11":"一类住宅用地","R12":"一类服务设施用地","R21":"二类住宅用地","R22":"二类服务设施用地","R3":"三类居住用地","R31":"三类住宅用地","R32":"三类服务设施用地","A2":"文化设施用地","A":"公共管理与公共服务用地","A1":"行政办公用地","A21":"图书展览用地","A22":"文化活动用地","A3":"教育科研用地","A31":"高等院校用地","A32":"中等专业学校用地","A33":"中小学用地","A331":"小学","A332":"中学","A333":"九年一贯制学校","A34":"特殊教育用地","A35":"科研用地","A4":"体育用地","A41":"体育场馆用地","A42":"体育训练用地","A5":"医疗卫生用地","A51":"医院用地","A511":"综合医院","A512":"专科医院","A513":"社区卫生服务中心","A52":"卫生防疫用地","A53":"特殊医疗用地","A59":"其他医疗卫生用地","A6":"社会福利设施用地","A7":"文物古迹用地","A8":"外事用地","A9":"宗教用地","B":"商业服务业设施","B1":"商业设施用地","B11":"零售商业用地","B12":"批发市场用地","B13":"餐饮用地","B14":"旅馆用地","B2":"商务用地","B21":"金融保险用地","B22":"艺术传媒用地","B29":"其他商务用地","B3":"娱乐康体用地","B31":"娱乐用地","B32":"康体用地","B4":"公用设施营业网点用地","B41":"加油加气站用地","H22":"公路用地","H25":"管道运输用地"};

//协审规划方案里查询一张图数据的服务地址
var yztFw="http://192.168.31.56:6080/arcgis/rest/services/%E7%BB%9F%E4%B8%80%E8%A7%84%E5%88%92%E7%AE%A1%E7%90%86%E7%94%A8%E5%9B%BE/%E6%B3%95%E5%AE%9A%E5%B1%82%E7%94%A8%E5%9C%B0%E7%AE%A1%E6%8E%A7%E8%A6%81%E6%B1%82/MapServer";

var yztUrl = "http://192.168.31.56:6080/arcgis/rest/services/%E7%BB%9F%E4%B8%80%E8%A7%84%E5%88%92%E7%AE%A1%E7%90%86%E7%94%A8%E5%9B%BE/%E6%B3%95%E5%AE%9A%E5%B1%82%E7%94%A8%E5%9C%B0%E7%AE%A1%E6%8E%A7%E8%A6%81%E6%B1%82/MapServer/23";
//一张图查询的属性
var yztAttr = ["用地性质"];


//协审规划方案里查询规划山体数据的服务地址
var ghstUrl = "http://192.168.8.43:6080/arcgis/rest/services/ZYHJ/GIS_ZYHJ_GHST/MapServer";
var ghstAttr = ["类别"];

//协审规划方案里查询机场净空线数据的服务地址
var jcjkxUrl = "http://192.168.8.43:6080/arcgis/rest/services/TDLY/CSSJ_GDGK_JCJK/MapServer";
var jcjkxAttr = ["高度管控"];

//协审规划方案里查询微波通道数据的服务地址
var wbtdUrl = "http://192.168.8.43:6080/arcgis/rest/services/TDLY/GIS_TDLY_CSSJ_GDGK_WBTD/MapServer";
var wbtdAttr = ["建筑高"];