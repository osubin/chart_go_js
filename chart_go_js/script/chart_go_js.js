import data from '../employee.js';

const dep = {
    deptObj: {
    },
    jsonObj: {
        "class" : "GraphLinksModel", 
        "nodeDataArray" : [], 
        "linkDataArray" : []
    }, 
    orgDiagram:{
    }, 
    init: function(){
        $('#loadOc').on('click', function(){
            dep.orgDiagram.model = go.Model.fromJson(dep.jsonObj);
        });
        dep.makeJsonData(data);
        console.log(dep.jsonObj)
        dep.initDiagram();
    }, 
    makeJsonData: function(paramData){
        var dataKey = [];
        dataKey = Object.keys(paramData);
        var depObj = {};

        //Department 최대 Level 추출 - maxDepLen
        var depLen = Object.values(paramData).map(function(v) {
            return v.level;
        });
        var maxDepLen = Math.max.apply(null, depLen);

        //Department 데이터 추출 - deptObj
        Object.keys(paramData).forEach(element => {
            var linkObj = {};
            var nodeObj = {};
            if(paramData[element].isGroup == "true"){
                //링크데이터 생성
                linkObj['key'] = paramData[element].from + '_' + paramData[element].key;
                linkObj['from'] = paramData[element].from;
                linkObj['to'] = paramData[element].key;
                dep.jsonObj.linkDataArray.push(linkObj);
                //노드데이터 생성
                nodeObj['key'] = paramData[element].key;
                nodeObj['name'] = paramData[element].name;
                nodeObj['from'] = paramData[element].from;
                nodeObj['isGroup'] = true;
                nodeObj['level'] = paramData[element].level;
                dep.jsonObj.nodeDataArray.push(nodeObj);
            }else{
                linkObj['key'] = paramData[element].emnmm;
                linkObj['emnm'] = paramData[element].emnmm;
                linkObj['empKrNm'] = paramData[element].empKrNm;
                linkObj['deptNm'] = paramData[element].deptNm;
                linkObj['jobgrNm'] = paramData[element].jobgrNm;
                linkObj['taskNm'] = paramData[element].taskNm;
                linkObj['group'] = paramData[element].group;
                linkObj['level'] = paramData[element].level;
                linkObj['isGroup'] = false;
                dep.jsonObj.nodeDataArray.push(linkObj);
            }
        });
        console.log(dep.jsonObj)
    }, 
    makeDepartmentData: function(paramData){
        console.log("AAAAAAA000000000")
        var dataKey = [];
        dataKey = Object.keys(paramData);
        var depObj = {};

        //Department 최대 Level 추출 - maxDepLen
        var depLen = Object.values(paramData).map(function(v) {
            return v.level;
        });
        var maxDepLen = Math.max.apply(null, depLen);

        //Department 데이터 추출 - deptObj
        Object.keys(paramData).forEach(element => {
            for(var i=1; i <=maxDepLen; i++){
                if(paramData[element].isGroup == "true" & paramData[element].level == i){
                    if(dep.deptObj.hasOwnProperty(`depth${i}DeptObj`)){
                        dep.deptObj[`depth${i}DeptObj`].push(paramData[element]);
                    }else{
                        dep.deptObj[`depth${i}DeptObj`] = [paramData[element]];    
                    }
                }
            }
        });
        console.log(dep.deptObj)
    },
    textStyle: function(){
        return { //font: "10 Segoe UI,sans-serif", 
        stroke: "black" }
    },
    initDiagram: function(){
        console.log("AAAAAAA00")
        const $ = go.GraphObject.make;
        var mt8 = new go.Margin(8, 0, 0, 0);
        var mr8 = new go.Margin(0, 8, 0, 0);
        var ml8 = new go.Margin(0, 0, 0, 8);
        var roundedRectangleParams = {
            parameter1: 2,
            spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
        };
    
        dep.orgDiagram =
            $(go.Diagram, "OrgChartDiv", 
                {
                    initialDocumentSpot: go.Spot.Top,
                    initialViewportSpot: go.Spot.Top,
                    layout:
                        $(go.TreeLayout,
                            {
                                isOngoing: false,
                                treeStyle: go.TreeLayout.StyleLastParents,
                                angle: 90,
                                layerSpacing: 180,
                                alternateAngle: 0,
                                alternateAlignment: go.TreeLayout.AlignmentStart,
                                alternateNodeIndent: 15,
                                alternateNodeIndentPastParent: 1,
                                alternateNodeSpacing: 50,
                                alternateLayerSpacing: 40,
                                alternateLayerSpacingParentOverlap: 1,
                                alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
                                alternateChildPortSpot: go.Spot.Left
                            }
                        )
                }
            );

        dep.orgDiagram.nodeTemplate = 
            $(go.Node, "Auto", 
                {
                    deletable: false
                },
                new go.Binding("text", "name")
                ,
                $(go.Shape, "Rectangle", 
                    {
                        name: "SHAPE", fill: "white", stroke: 'pink', strokeWidth: 1, 
                        portId: "", fromLinkable: false, toLinkable: false, cursor: "pointer", 
                        toLinkableDuplicates: false, 
                        margin: new go.Margin(2, 2, 2, 2)
                    }
                )
                ,  
                $(go.Panel, "Horizontal", 
                    $(go.Panel, "Table", 
                        {
                            minSize: new go.Size(180, NaN), 
                            maxSize: new go.Size(220, NaN), 
                            margin: new go.Margin(10, 0, 6, 6), 
                            defaultAlignment: go.Spot.Left 
                        }, 
                        $(go.RowColumnDefinition, {column: 0, width:50, minimum: 50, alignment: go.Spot.Left}),
                        $(go.RowColumnDefinition, {column: 1, width:50, minimum: 50}),
                        $(go.TextBlock, this.textStyle(), 
                            {
                                row: 0, column: 0, columnSpan: 5, 
                                minSize: new go.Size(10, 16), 
                                margin: new go.Margin(0, 6, 3, 6)
                            }, 
                            new go.Binding("text", "empKrNm").makeTwoWay())
                            , 
                        $(go.TextBlock, this.textStyle(), 
                            {
                                row: 1, column: 0, columnSpan: 5, 
                                minSize: new go.Size(10, 16), 
                                margin: new go.Margin(0, 6, 0, 6)
                            }, 
                            new go.Binding("text", "jobgrNm").makeTwoWay()), 
                        $(go.TextBlock, this.textStyle(), 
                            {
                                row: 2, column: 0, columnSpan: 5, 
                                minSize: new go.Size(10, 16), 
                                margin: new go.Margin(0, 6, 0, 6)
                            }, 
                            new go.Binding("text", "taskNm").makeTwoWay())
                    ), 
                )
            );

           
        
        dep.orgDiagram.linkTemplate = 
            $(go.Link, go.Link.Orthogonal, 
                { corner: 0, relinkableFrom: true, relinkableTo: true}, 
                $(go.Shape, { strokeWidth: 2.0, stroke: "#000000"}),
                { deletable : false }  
            );
        
        dep.orgDiagram.groupTemplate = 
            $(go.Group, "Vertical", 
                {
                    deletable: false, 
                    portSpreading: go.Node.SpreadingPacked, 
                    isSubGraphExpanded: true
                }, 
                {
                    layout: $(go.GridLayout, {cellSize: new go.Size(1, 0), wrappingColumn: 2, spacing: new go.Size(0, 0)})
                }, 
                    $(go.Panel, "Vertical", 
                        $(go.Panel, "Auto", 
                            $(go.Shape, {
                                fill: "lightgray", stroke: "#fff"
                            }),
                            $(go.Placeholder, {
                                padding: new go.Margin(30, 3, 3, 3)
                            }),  
                            $(go.TextBlock, this.textStyle(), 
                            {
                                row: 0, column: 0, columnSpan: 5, stroke: "white", 
                                font: "bold 10pt Segoe UI, sans-serif", 
                                margin: new go.Margin(7, 0, 0, 0), 
                                alignment: go.Spot.Top
                            },
                            new go.Binding("stroke", "black"),  
                            new go.Binding("text", "name")
                                )))
                );   
    }
}

window.addEventListener('DOMContentLoaded', function(){
    dep.init();
})
