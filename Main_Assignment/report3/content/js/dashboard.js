/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5408921933085502, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "sceenario5/config.json-196"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/node_modules/tether/dist/js/tether.min.js-186"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/iphone1.jpg-195"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "Login "], "isController": false}, {"data": [0.52, 500, 1500, "Add Monitor to cart"], "isController": false}, {"data": [0.58, 500, 1500, "Add Laptop2 to cart"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/bm.png-192"], "isController": false}, {"data": [0.62, 500, 1500, "View Cart"], "isController": false}, {"data": [0.5, 500, 1500, "Invalid_Login "], "isController": false}, {"data": [1.0, 500, 1500, "sceenario5/node_modules/bootstrap/dist/js/bootstrap.min.js-187"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/imgs/sony_vaio_5.jpg-205"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/imgs/galaxy_s6.jpg-200"], "isController": false}, {"data": [1.0, 500, 1500, "sceenario5/css/latostyle.css-184"], "isController": false}, {"data": [1.0, 500, 1500, "sceenario5/js/index.js-189"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/imgs/HTC_M9.jpg-203"], "isController": false}, {"data": [0.6, 500, 1500, "Add Moblie2 to cart"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/node_modules/video.js/dist/video.min.js-188"], "isController": false}, {"data": [1.0, 500, 1500, "sceenario5/node_modules/bootstrap/dist/css/bootstrap.min.css-181"], "isController": false}, {"data": [1.0, 500, 1500, "sceenario5/imgs/front.jpg-191"], "isController": false}, {"data": [1.0, 500, 1500, "sceenario5/node_modules/video.js/dist/video-js.min.css-182"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/node_modules/jquery/dist/jquery.min.js-185"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/Samsung1.jpg-193"], "isController": false}, {"data": [0.68, 500, 1500, "Delete one cart item"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/-180"], "isController": false}, {"data": [0.66, 500, 1500, "View cart after deleting"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/node_modules/videojs-contrib-hls/dist/videojs-contrib-hls.min.js-190"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/entries-198"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Register"], "isController": false}, {"data": [0.28, 500, 1500, "Add Mobile to cart"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/imgs/Lumia_1520.jpg-201"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/check-199"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/nexus1.jpg-194"], "isController": false}, {"data": [0.5, 500, 1500, "sceenario5/check-197"], "isController": false}, {"data": [0.4, 500, 1500, "Add Laptop to cart"], "isController": false}, {"data": [1.0, 500, 1500, "sceenario5/css/latofonts.css-183"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 269, 0, 0.0, 966.4869888475841, 201, 4075, 819.0, 1408.0, 3397.0, 3908.9000000000005, 4.463693083764768, 17.02541370055091, 2.2398192743594847], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sceenario5/config.json-196", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 2.2403492647058827, 2.2307751225490198], "isController": false}, {"data": ["sceenario5/node_modules/tether/dist/js/tether.min.js-186", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 17.227320995145632, 0.8021086165048543], "isController": false}, {"data": ["sceenario5/iphone1.jpg-195", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 67.00293160609037, 0.7942964145383103], "isController": false}, {"data": ["Login ", 15, 0, 0.0, 1241.5333333333333, 986, 1507, 1215.0, 1487.2, 1507.0, 1507.0, 6.423982869379015, 3.8648454229122056, 3.1266729122055676], "isController": false}, {"data": ["Add Monitor to cart", 25, 0, 0.0, 716.0, 416, 1098, 693.0, 946.4, 1052.6999999999998, 1098.0, 5.1229508196721305, 1.6559538294057377, 2.751584912909836], "isController": false}, {"data": ["Add Laptop2 to cart", 25, 0, 0.0, 770.3600000000001, 410, 1163, 845.0, 1039.6000000000001, 1133.0, 1163.0, 4.9830576041459045, 1.610734440402631, 2.671580688160255], "isController": false}, {"data": ["sceenario5/bm.png-192", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 6.897073208401977, 0.6580132825370676], "isController": false}, {"data": ["View Cart", 25, 0, 0.0, 717.3200000000002, 402, 1225, 609.0, 1147.8000000000002, 1212.1, 1225.0, 5.415944540727903, 3.9631597297443677, 2.5969030952123053], "isController": false}, {"data": ["Invalid_Login ", 15, 0, 0.0, 876.3333333333334, 767, 986, 871.0, 960.8000000000001, 986.0, 986.0, 8.012820512820513, 4.623021834935897, 3.889034955929487], "isController": false}, {"data": ["sceenario5/node_modules/bootstrap/dist/js/bootstrap.min.js-187", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 73.1033624387255, 2.053653492647059], "isController": false}, {"data": ["sceenario5/imgs/sony_vaio_5.jpg-205", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 123.6638663702929, 0.5761310146443515], "isController": false}, {"data": ["sceenario5/imgs/galaxy_s6.jpg-200", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 153.1753206877729, 0.598446597525473], "isController": false}, {"data": ["sceenario5/css/latostyle.css-184", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 2.131764481707317, 0.9837080792682927], "isController": false}, {"data": ["sceenario5/js/index.js-189", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 6.693568479498861, 0.8742347665148064], "isController": false}, {"data": ["sceenario5/imgs/HTC_M9.jpg-203", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 116.25277310281518, 0.49963662790697677], "isController": false}, {"data": ["Add Moblie2 to cart", 25, 0, 0.0, 677.1600000000002, 435, 1118, 651.0, 1006.8000000000001, 1089.5, 1118.0, 5.014039310068191, 1.620749034797433, 2.688190997292419], "isController": false}, {"data": ["sceenario5/node_modules/video.js/dist/video.min.js-188", 1, 0, 0.0, 1299.0, 1299, 1299, 1299.0, 1299.0, 1299.0, 1299.0, 0.7698229407236336, 121.13133901077752, 0.3164994707467283], "isController": false}, {"data": ["sceenario5/node_modules/bootstrap/dist/css/bootstrap.min.css-181", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 61.776297433035715, 0.9700230189732143], "isController": false}, {"data": ["sceenario5/imgs/front.jpg-191", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 58.204523418854414, 0.9719011038186158], "isController": false}, {"data": ["sceenario5/node_modules/video.js/dist/video-js.min.css-182", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 60.48886138613861, 2.122331373762376], "isController": false}, {"data": ["sceenario5/node_modules/jquery/dist/jquery.min.js-185", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 69.28211122047244, 0.8073941929133858], "isController": false}, {"data": ["sceenario5/Samsung1.jpg-193", 1, 0, 0.0, 1441.0, 1441, 1441, 1441.0, 1441.0, 1441.0, 1441.0, 0.6939625260235947, 18.77426158049965, 0.28124457841776546], "isController": false}, {"data": ["Delete one cart item", 25, 0, 0.0, 644.72, 385, 1053, 549.0, 1024.0, 1044.3, 1053.0, 5.576622797233995, 2.8534446101940665, 2.684838905308945], "isController": false}, {"data": ["sceenario5/-180", 1, 0, 0.0, 1212.0, 1212, 1212, 1212.0, 1212.0, 1212.0, 1212.0, 0.8250825082508251, 16.055267636138613, 0.3811172132838284], "isController": false}, {"data": ["View cart after deleting", 25, 0, 0.0, 598.9999999999999, 401, 886, 513.0, 827.0, 871.9, 886.0, 5.289885738468049, 3.7948731088658487, 2.536458884363098], "isController": false}, {"data": ["sceenario5/node_modules/videojs-contrib-hls/dist/videojs-contrib-hls.min.js-190", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 77.29158184039088, 0.47290648751357217], "isController": false}, {"data": ["sceenario5/entries-198", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 3.0765533447265625, 0.7476806640625], "isController": false}, {"data": ["Register", 15, 0, 0.0, 1205.1999999999998, 885, 2311, 1107.0, 1898.8000000000002, 2311.0, 2311.0, 0.5167068549776094, 0.33024161427833276, 0.2519955111091974], "isController": false}, {"data": ["Add Mobile to cart", 25, 0, 0.0, 2264.92, 822, 4075, 1429.0, 3913.2000000000003, 4034.2, 4075.0, 5.354465624330691, 1.731625816556008, 2.8707047146069824], "isController": false}, {"data": ["sceenario5/imgs/Lumia_1520.jpg-201", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 154.31808156894678, 0.44745860477741584], "isController": false}, {"data": ["sceenario5/check-199", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 1.0282807632398754, 0.7164500584112149], "isController": false}, {"data": ["sceenario5/nexus1.jpg-194", 1, 0, 0.0, 1426.0, 1426, 1426, 1426.0, 1426.0, 1426.0, 1426.0, 0.7012622720897616, 23.396410413744743, 0.28283331872370265], "isController": false}, {"data": ["sceenario5/check-197", 1, 0, 0.0, 1125.0, 1125, 1125, 1125.0, 1125.0, 1125.0, 1125.0, 0.888888888888889, 0.4105902777777778, 0.4140625], "isController": false}, {"data": ["Add Laptop to cart", 25, 0, 0.0, 1360.6400000000003, 613, 3613, 906.0, 3525.4, 3609.4, 3613.0, 5.167424555601488, 1.6711370271806532, 2.7704258603761884], "isController": false}, {"data": ["sceenario5/css/latofonts.css-183", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 6.889381218905473, 2.0065687189054726], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 269, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
