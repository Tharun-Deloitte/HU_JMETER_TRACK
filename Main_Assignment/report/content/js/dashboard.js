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

    var data = {"OkPercent": 87.75510204081633, "KoPercent": 12.244897959183673};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4204081632653061, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.64, 500, 1500, "Add Moblie2 to cart"], "isController": false}, {"data": [0.48, 500, 1500, "View cart after deleting"], "isController": false}, {"data": [0.4, 500, 1500, "Register"], "isController": false}, {"data": [0.14, 500, 1500, "Add Mobile to cart"], "isController": false}, {"data": [0.0, 500, 1500, "InvalidLogin "], "isController": false}, {"data": [0.52, 500, 1500, "View Cart"], "isController": false}, {"data": [0.0, 500, 1500, "Login "], "isController": false}, {"data": [0.5, 500, 1500, "Add Laptop to cart"], "isController": false}, {"data": [0.52, 500, 1500, "Add Monitor to cart"], "isController": false}, {"data": [0.54, 500, 1500, "Add Laptop2 to cart"], "isController": false}, {"data": [0.54, 500, 1500, "Delete one cart item"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 245, 30, 12.244897959183673, 919.0530612244902, 367, 2157, 751.0, 1651.8, 1755.3, 2091.64, 5.795524435823438, 2.7252686713464542, 2.7796479144982733], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add Moblie2 to cart", 25, 0, 0.0, 595.44, 367, 890, 569.0, 788.4000000000001, 863.3, 890.0, 10.382059800664452, 3.3559197207225915, 5.566162920473422], "isController": false}, {"data": ["View cart after deleting", 25, 0, 0.0, 730.96, 508, 1844, 650.0, 1107.0000000000014, 1738.0999999999997, 1844.0, 8.976660682226212, 6.465650246858169, 4.3042386669658885], "isController": false}, {"data": ["Register", 15, 0, 0.0, 1149.3999999999996, 777, 1714, 1175.0, 1694.8, 1714.0, 1714.0, 0.513874614594039, 0.302804631294964, 0.2506142407502569], "isController": false}, {"data": ["Add Mobile to cart", 25, 0, 0.0, 1695.5600000000004, 1198, 2157, 1740.0, 2089.4, 2139.6, 2157.0, 8.161932745674175, 2.6382809949396018, 4.375879958374143], "isController": false}, {"data": ["InvalidLogin ", 15, 15, 100.0, 1548.1999999999998, 1297, 1724, 1532.0, 1715.0, 1724.0, 1724.0, 6.302521008403361, 3.1820345325630255, 1.4956177783613447], "isController": false}, {"data": ["View Cart", 25, 0, 0.0, 680.3999999999999, 483, 823, 686.0, 760.4000000000001, 807.0999999999999, 823.0, 9.416195856873822, 6.996307085687383, 4.514992349340867], "isController": false}, {"data": ["Login ", 15, 15, 100.0, 1505.0666666666666, 1286, 1659, 1524.0, 1645.8, 1659.0, 1659.0, 6.090133982947624, 3.0748039738124238, 1.4535436967113275], "isController": false}, {"data": ["Add Laptop to cart", 25, 0, 0.0, 763.6400000000001, 554, 1001, 784.0, 905.4, 972.4999999999999, 1001.0, 9.723842862699339, 3.144675588292493, 5.213271222287047], "isController": false}, {"data": ["Add Monitor to cart", 25, 0, 0.0, 718.2, 390, 932, 724.0, 910.2, 931.4, 932.0, 10.084711577248891, 3.2598042305365067, 5.416593132311416], "isController": false}, {"data": ["Add Laptop2 to cart", 25, 0, 0.0, 666.1999999999999, 386, 829, 702.0, 788.0, 819.4, 829.0, 9.788566953797964, 3.1640777946358654, 5.24797193128426], "isController": false}, {"data": ["Delete one cart item", 25, 0, 0.0, 634.72, 453, 765, 640.0, 761.2, 764.4, 765.0, 9.370314842578711, 5.3341249297226385, 4.511294157608695], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 30, 100.0, 12.244897959183673], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 245, 30, "500/Internal Server Error", 30, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["InvalidLogin ", 15, 15, "500/Internal Server Error", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login ", 15, 15, "500/Internal Server Error", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
