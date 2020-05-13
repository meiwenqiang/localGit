
var roadHelpWordJs = {
    H11Dictionary:{
        "R": true,
        "A": true,
        "B": true,
        "M": true,
        "W": true,
        "S": true,
        "U": true,
        "G": true
    },
	roadHelpWord: function (geo, mapO,faDkGeoArr,yztData,rkxzData) {
            roadHelpWordJs.faDkGeoArr=faDkGeoArr
            roadHelpWordJs.yztData = yztData
            roadHelpWordJs.rkxzData=rkxzData
			roadHelpWordJs.mapOperator = mapO
            roadHelpWordJs.geo = geo
            roadHelpWordJs.range =  roadHelpWordJs.mapOperator.types.geoEngine.planarArea(roadHelpWordJs.geo, "hectares")
            roadHelpWordObj={}
            roadHelpWordObj["road"]=roadHelpWordJs.roadFun()
            roadHelpWordObj["facilities"]=roadHelpWordJs.facilitiesFun()
            return roadHelpWordObj
	},
	roadFun:function(){
        // var roadObj={
		// 	"道路面积":0,
		// 	"道路占范围比":0,
		// 	"道路占城市建设比":0,
		// 	"人均道路":0,
		// 	"城市道路面积":0,
		// 	"城市道路占范围比":0,
		// 	"城市道路占城市建设比":0,
		// 	"人均道路城市":0
		// }
		var S_Area =0
		var S1_Area =0
		var H11_Area=0
        var p_total=roadHelpWordJs.rkxzData.rk.total
        var range=roadHelpWordJs.range

        var A33={
            num:0,
            area:0
        }
        var A5={
            num:0,
            area:0
        }
        var A6={
            num:0,
            area:0
        }
        var A4={
            num:0,
            area:0
        }
        var A2={
            num:0,
            area:0
        }
		for(let i = 0; i < roadHelpWordJs.faDkGeoArr.length; i++) {
			var attr1=roadHelpWordJs.faDkGeoArr[i]["ydxz"].substr(0, 1)
			var attr2=roadHelpWordJs.faDkGeoArr[i]["ydxz"].substr(0, 2)
			var attr3=roadHelpWordJs.faDkGeoArr[i]["ydxz"].substr(0, 3)
			if(attr1 == "S"){
				S_Area+=roadHelpWordJs.faDkGeoArr[i].ydmj
			}
			if(attr2 == "S1"){
				S1_Area+=roadHelpWordJs.faDkGeoArr[i].ydmj
			}
			if(roadHelpWordJs.H11Dictionary[attr1] || attr3 =="H11"){
				H11_Area+=roadHelpWordJs.faDkGeoArr[i].ydmj
            }
            

            if(attr3=="A33" && attr2 !="A335"){
                A33.num++
                A33.area+=roadHelpWordJs.faDkGeoArr[i].ydmj
            }

            if(attr2=="A5"){
                A5.num++
                A5.area+=roadHelpWordJs.faDkGeoArr[i].ydmj
            }

            if(attr2=="A6"){
                A6.num++
                A6.area+=roadHelpWordJs.faDkGeoArr[i].ydmj
            }

            if(attr2=="A4"){
                A4.num++
                A4.area+=roadHelpWordJs.faDkGeoArr[i].ydmj
            }

            if(attr2=="A2"){
                A2.num++
                A2.area+=roadHelpWordJs.faDkGeoArr[i].ydmj
            }
        }
        roadHelpWordJs.facilitiesHelpObj={
            A33:A33,
            A5:A5,
            A6:A6,
            A4:A4,
            A2:A2
        }
		return roadObj={
			"S_Area":S_Area/100,
			"S_Range_Proportion":(S_Area/range)*100,
			"S_H11_Proportion":(S_Area/H11_Area)*100,
			"people_S":S_Area*10000/p_total,
			"S1_Area":S1_Area/100,
			"S1_Range_Proportion":(S1_Area/range)*100,
			"S1_H11_Proportion":(S1_Area/H11_Area)*100,
			"people_S1":S1_Area*10000/p_total
		}
    },
	facilitiesFun:function(){
		var dictionary=roadHelpWordJs.yztDictionary
        var yztData=roadHelpWordJs.yztData.yzt
        var A33={
            num:0,
            area:0
        }
        var A5={
            num:0,
            area:0
        }
        var A6={
            num:0,
            area:0
        }
        var A4={
            num:0,
            area:0
        }
        var A2={
            num:0,
            area:0
        }
        for(let key in yztData) {
            var lsStr=dictionary[key]
            if(lsStr){
                var attr2=lsStr.substr(0, 2)
                var attr3=lsStr.substr(0, 3)
                if(attr3=="A33" && attr2 !="A335"){
                    A33.num++
                    A33.area+=yztData[key]
                }

                if(attr2=="A5"){
                    A5.num++
                    A5.area+=yztData[key]
                }

                if(attr2=="A6"){
                    A6.num++
                    A6.area+=yztData[key]
                }

                if(attr2=="A4"){
                    A4.num++
                    A4.area+=yztData[key]
                }

                if(attr2=="A2"){
                    A2.num++
                    A2.area+=yztData[key]
                }
            }
            
        }
        var facilitiesLsObj={
            A33:A33,
            A5:A5,
            A6:A6,
            A4:A4,
            A2:A2
        }
        var facilitiesObj={}
        for(let key in roadHelpWordJs.facilitiesHelpObj){
            facilitiesObj[key]={}
            facilitiesObj[key].fNum=facilitiesLsObj[key].num
            facilitiesObj[key].fArea=facilitiesLsObj[key].area
            facilitiesObj[key].xNum=roadHelpWordJs.facilitiesHelpObj[key].num
            facilitiesObj[key].xArea=roadHelpWordJs.facilitiesHelpObj[key].area
            facilitiesObj[key].diff=(roadHelpWordJs.facilitiesHelpObj[key].area-facilitiesLsObj[key].area)
        }
        
        return facilitiesObj
    },
    yztDictionary:{ "水域":"E1","消防用地(U31)":"U31","安保用地(H42)": "H42", "安全设施用地(U3)": "U3", "保安用地(D3)": "H4", "餐饮用地(B13)": "B13", "草地(辛)": "其他（非标准分类）", "成人与业余学校用地(C63)": "A3", "城市道路用地(S1)": "S1", "城市公园(G11)": "G11", "城市轨道交通用地(S2)": "S2", "城市轨道交通用地复合商业办公用地(S2、B1、B2)": "S2", "初中(A332)": "A334", "初中(A334)": "A334", "村镇居住用地(E61)": "H14", "村庄建设用地(H14)": "H14", "带状公园(G122)": "G122", "带状公园(G14)": "G122", "电信设施用地(U3)": "U15", "电信设施用地(U32)": "U15", "二类服务设施用地(R22)": "R22", "二类工业用地(M2)": "M2", "二类居住用地(R2)": "R2", "二类居住用地(R21)": "R21", "二类物流仓储用地(W2)": "W2", "二类住宅用地(R21)": "R21", "发展备用地(K)": "K", "发展预留地(F)": "K", "防洪设施用地(U32)": "U32", "防护绿地(G2)": "G2", "防护绿地(G22)": "G2", "防护绿地(G3)": "G2", "防护绿地复合公共停车场用地(G2、S42)": "G2", "非市属办公用地(C12)": "B2", "粪便垃圾处理用地(U42)": "U22", "风景游赏用地(甲)": "其他（非标准分类）", "服务业用地(C24)": "B29", "港口用地(H23)": "H23", "高等学校用地(C61)": "A31", "高等院校用地(A31)": "A31", "耕地(E2)": "E2", "工业用地(M)": "M", "公共交通场站用地(S41)": "S41", "公共交通场站用地复合利用商业服务业设施用地(S41、B)": "S41", "公共交通设施(U21)": "S9", "公共交通设施用地(S41)": "S9", "公共交通用地(U21)": "S9", "公共交通站场用地(S41)": "S41", "公共绿地(G1)": "G1", "公共设施与居住混合用地(CR)": "R2", "公共停车场复合商务用地(S42、B2)": "S42", "公共停车场用地(S31)": "S42", "公共停车场用地(S42)": "S42", "公交首末站(S41)": "S41", "公交首末站用地(U21)": "S41", "公路用地(H22)": "H22", "公用设施营业网点用地(B4)": "B4", "公用设施用地(U)": "U", "公园(G11)": "G11", "公园绿地(G1)": "G1", "公园绿地(G11)": "G11", "公园绿地(G12)": "G12", "公园绿地复合加气站用地(G1、B41)": "G1", "供电用地(U12)": "U12", "供燃气用地(U13)": "U13", "供热用地(U14)": "U14", "供水用地(U11)": "U11", "供应设施用地(U1)": "U1", "观光农业用地(EL2)": "其他（非标准分类）", "管道运输用地(H25)": "H25", "管道运输用地(T3)": "H25", "广播电视用地(B22)": "B22", "广播电视用地(U16)": "B22", "广场用地(G3)": "G3", "广场用地(S2)": "G3", "轨道车场用地(S41)": "S2", "轨道交通复合商业用地(S2、B1)": "S2", "轨道交通用地复合居住用地(S4、R2)": "S2", "轨道交通用地复合中小学用地(S4、A33)": "S2", "行政办公设施用地(A1)": "A1", "行政办公用地(A1)": "A1", "行政办公用地(C1)": "B2", "行政办公用地(C11)": "A1", "环保设施用地(U23)": "U2", "环境设施用地(U2)": "U2", "环境设施用地(U23)": "U2", "环境卫生设施用地(U4)": "U2", "环境卫生设施用地(U41)": "U2", "环卫设施用地(U22)": "U22", "环卫用地(U22)": "U22", "货运交通用地(U22)": "S4", "货运站场用地(U22)": "S4", "机场用地(H24)": "H24", "机动车停车场(S31)": "S42", "机动车停车场库(S31)": "S42", "机动车停车场库用地(S31)": "S42", "机动车停车场用地(S31)": "S42", "加气加油站用地(B41)": "B41", "加油加气站(B41)": "B41", "加油加气站用地(B41)": "B41", "加油加气站用地(U23)": "B41", "加油站用地(U23)": "B41", "交通场站用地(S4)": "S4", "交通场站用地(S41)": "S41", "交通广场用地(S21)": "G3", "交通设施用地(S)": "S", "交通设施用地(U2)": "S", "交通枢纽用地复合商业服务业设施用地(S3、B)": "S3", "教育科研用地(A3)": "A3", "教育科研用地(C6)": "A3", "街旁绿地(G15)": "G123", "街头公园(G123)": "G123", "金融保险业用地(B21)": "B21", "金融保险业用地(C22)": "B21", "金融保险用地(B21)": "B21", "景点建设用地(SR23)": "其他（非标准分类）", "九年一贯制学校(A333)": "A333", "居民社会用地(丙)": "R", "居住和商业用地(R2、B1)": "R2", "居住区公园(G12)": "G121", "居住区公园(G121)": "G121", "居住用地(R)": "R", "居住用地(R2)": "R2", "居住用地(R21)": "R21", "居住用地、商业服务业设施用地(RB)": "R2", "居住与公共设施混合用地(R、B)": "R2", "居住与公共设施混合用地(RC)": "R2", "居住与商业混合用地(RB)": "R2", "剧院用地(C35)": "B3", "军事用地(D1)": "H41", "军事用地(H41)": "H41", "康体用地(B32)": "B32", "科研设计用地(C65)": "A35", "科研用地(A35)": "A35", "坑塘沟渠(E13)": "E13", "立交复合公园绿地": "S1", "立交复合绿化用地": "S1", "邻里中心用地(AB)": "A1", "林地(戊)": "E2", "零售商业用地(B11)": "B11", "留白区域": "其他（非标准分类）", "旅馆业用地(C25)": "B14", "旅馆用地(B14)": "B14", "旅游度假用地(C27)": "B9", "旅游服务设施用地(EC31)": "其他（非标准分类）", "绿地与广场用地(G)": "G3", "绿化复合铁路用地": "G2", "贸易咨询用地(C23)": "B2", "农林用地(E2)": "E2", "农贸市场用地(B12)": "B12", "排水用地(U21)": "U21", "批发市场用地(B12)": "B12", "普通仓库用地(W1)": "W1", "普通高中(A333)": "A335", "普通高中(A335)": "A335", "其他非建设用地(E9)": "E9", "其他服务设施用地(B9)": "B9", "其他公用设施营业网点用地(B49)": "B49", "其他公用设施用地(U9)": "U9", "其他建设用地(H9)": "H9", "其他交通设施用地(S9)": "S9", "其他交通设施用地(U29)": "S9", "其他绿地(G5)": "G5", "其他商务用地(B29)": "B29", "其他设施用地(U9)": "U9", "其他生态型建设用地(科普展览)(EC35)": "其他（非标准分类）", "其他市政公共设施用地(U9)": "U9", "其他市政公用设施用地(U9)": "U9", "其他医疗卫生用地(A59)": "A59", "其它商务用地(B29)": "B29", "其它生态型建设用地(科普展览)(EC35)": "其他（非标准分类）", "区级公园(G112)": "G112", "区域公用设施用地(H3)": "H3", "区域交通设施用地(H2)": "H2", "三类服务设施用地(R32)": "R32", "三类工业用地(M3)": "M3", "三类物流仓储用地(W3)": "W3", "山体(E21)": "E23", "山体(E23)": "E23", "山体(E4)": "E23", "山体水体保护用地(EP1)": "E2", "商务服务设施用地(B2)": "B2", "商务商业用地(B1、B2)": "B1", "商务设施用地(B2)": "B2", "商务用地(B2)": "B2", "商业服务设施用地(B1)": "B1", "商业服务业设施(B)": "B", "商业服务业设施用地(B)": "B", "商业服务业设施用地混合居住用地(BR)": "B2", "商业复合社会停车场用地(B1)": "B1", "商业金融业用地(B)": "B", "商业金融业用地(C2)": "B2", "商业设施(B1)": "B1", "商业设施用地(B1)": "B1", "商业用地(B)": "B", "商业用地(B1)": "B1", "商业用地(C21)": "B2", "商业与居住混合用地(BR)": "B2", "商业与居住混合用地(CR)": "B2", "商住混合用地(BR)": "B2", "设施绿地(SR6)": "G5", "社会福利设施用地(A6)": "A6", "社会福利用地(A6)": "A6", "社会福利用地(C8)": "A6", "社会停车场用地(S3)": "S42", "社会停车场用地(S42)": "S42", "社区公园(G12)": "G12", "社区公园用地(G12)": "G12", "社区卫生服务中心(A513)": "A513", "生产绿地(G4)": "G4", "生态控制线项目清理": "其他（非标准分类）", "生态林地(EL4)": "E2", "生态农业用地(EL1)": "E2", "生态维育用地(E3)": "E3", "生态型公共管理和服务用地(H92)": "H92", "生态型公共管理和服务用地(H9A)": "H9A", "生态型居住用地(H9R)": "H9R", "生态型商业服务业设施用地用地(H9B)": "H9B", "生态型研发设施用地(H9D)": "H9D", "生态研发用地(H93)": "H9D", "施工与维修设施用地(U5)": "U9", "市级公园(G111)": "G111", "市属办公用地(C11)": "A1", "市属行政办公用地(C11)": "A1", "市政设施用地": "U", "水域(E1)": "E1", "水域(甲)": "E1", "特殊教育用地(A34)": "A34", "特殊医疗用地(A53)": "A53", "特殊用地(D1)": "H41", "特殊用地(H4)": "H41", "特殊用地(H41)": "H41", "体育场馆用地(A41)": "A41", "体育场馆用地(C41)": "A41", "体育设施用地(A41)": "A41", "体育训练用地(A42)": "A42", "体育用地(A4)": "A4", "体育用地(C4)": "A4", "体育用地(C41)": "A41", "体育运动配套设施用地(EC32)": "A4", "铁路(T1)": "H21", "铁路枢纽用地(S31)": "S31", "铁路用地(H21)": "H21", "铁路用地(T1)": "H21", "通信设施用地(U15)": "U15", "通信设施用地(U32)": "U15", "通信用地(U15)": "U15", "图书会展用地(C34)": "A21", "图书展览用地(A21)": "A21", "外事用地(A8)": "A8", "卫生防疫用地(A52)": "A52", "文化创意用地(旅游服务设施)(EC31)": "A22", "文化活动设施用地(A22)": "A22", "文化活动用地(A22)": "A22", "文化设施用地(A2)": "A2", "文化设施用地、二类住宅用地(A2、R21)": "A2", "文化娱乐用地(C3)": "A2", "文物古迹用地(A7)": "A7", "污水处理用地(U41)": "U22", "物流仓储用地(W)": "W", "物流仓储用地(W1)": "W1", "消防设施用地(U31)": "U31", "消防用地(U9)": "U31", "消防站用地(U9)": "U31", "小学(A33)": "A331", "小学(A331)": "A331", "小学(R52)": "A331", "小学用地(A33)": "A331", "小学用地(A331)": "A331", "休疗养用地(C53)": "A59", "研发用地(MC)": "M", "一般水体(E12)": "E1", "一类服务设施用地(R12)": "R12", "一类工业用地(M1)": "M1", "一类居住用地(R1)": "R1", "一类物流仓储用地(W1)": "W1", "一类物流用地(W1)": "W1", "一类住宅用地(R11)": "R11", "医疗卫生用地(A5)": "A5", "医疗卫生用地(C5)": "A5", "医疗用地(A51)": "A51", "医院用地(A5)": "A5", "医院用地(A51)": "A51", "医院用地(C51)": "A51", "医院用地复合社会停车场用地(A51、S42)": "A51", "艺术传媒用地(B22)": "B22", "影剧院用地(C35)": "B3", "邮政设施用地(U3)": "U15", "邮政设施用地(U31)": "U15", "游览设施用地(乙)": "B3", "游乐用地(C36)": "B3", "游憩集会广场用地(S22)": "G3", "娱乐康体用地(B3)": "B3", "娱乐用地(B31)": "B31", "雨、污水处理设施(U41)": "U31", "雨、污水处理用地(U41)": "U31", "雨水、污水处理用地(U41)": "U31", "雨水污水处理用地(U41)": "U31", "园林生产绿地(G21)": "G4", "远期建设用地": "K", "长途客运站用地(S32)": "S32", "滞留特殊用地(癸)": "H41", "中等专业学校用地(A32)": "A32", "中等专业学校用地(C62)": "A32", "中小学用地(A33)": "A33", "中学(A332)": "A332", "中学(R53)": "A332", "中学用地(A332)": "A332", "住商混合用地(RB)": "R2", "住商混合用地(RC)": "R2", "住宅用地(R21)": "R21", "专科医院(A512)": "A512", "专类公园(G113)": "G113", "自然保育用地(E9)": "E9", "自然水域(E11)": "E11", "宗教用地(A9)": "A9", "综合公园(G11)": "G11", "综合公园用地(G11)": "G11", "综合交通枢纽用地(S3)": "S3", "综合医院(A511)": "A511" }
}