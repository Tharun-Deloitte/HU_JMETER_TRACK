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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6224489795918368, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.64, 500, 1500, "Add Moblie2 to cart"], "isController": false}, {"data": [0.66, 500, 1500, "View cart after deleting"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "Register"], "isController": false}, {"data": [0.5, 500, 1500, "Add Mobile to cart"], "isController": false}, {"data": [0.72, 500, 1500, "View Cart"], "isController": false}, {"data": [0.5, 500, 1500, "Login "], "isController": false}, {"data": [0.5, 500, 1500, "Invalid_Login "], "isController": false}, {"data": [0.64, 500, 1500, "Add Laptop to cart"], "isController": false}, {"data": [0.72, 500, 1500, "Add Monitor to cart"], "isController": false}, {"data": [0.74, 500, 1500, "Add Laptop2 to cart"], "isController": false}, {"data": [0.62, 500, 1500, "Delete one cart item"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 245, 0, 0.0, 691.9714285714286, 370, 2654, 610.0, 1056.0, 1122.1999999999998, 2073.4199999999905, 6.271759164448086, 2.97048593334016, 3.198552175596457], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add Moblie2 to cart", 25, 0, 0.0, 549.9999999999999, 388, 686, 561.0, 675.4, 684.8, 686.0, 13.150973172014728, 4.2509493358758546, 7.050668233824303], "isController": false}, {"data": ["View cart after deleting", 25, 0, 0.0, 577.8000000000001, 386, 742, 636.0, 715.0000000000001, 741.1, 742.0, 10.438413361169102, 7.31219010960334, 5.0051376565762], "isController": false}, {"data": ["Register", 15, 0, 0.0, 1267.2, 841, 2654, 1054.0, 2629.4, 2654.0, 2654.0, 0.5176340672234109, 0.31593876173303886, 0.2524477081751674], "isController": false}, {"data": ["Add Mobile to cart", 25, 0, 0.0, 944.8000000000002, 759, 1298, 973.0, 1086.8, 1234.9999999999998, 1298.0, 12.468827930174564, 4.030451215710723, 6.6849477867830425], "isController": false}, {"data": ["View Cart", 25, 0, 0.0, 541.56, 386, 764, 550.0, 681.4000000000001, 744.8, 764.0, 13.150973172014728, 9.302258679642293, 6.305788894003157], "isController": false}, {"data": ["Login ", 15, 0, 0.0, 1043.0, 824, 1295, 1031.0, 1254.8, 1295.0, 1295.0, 7.371007371007371, 4.3011939496314495, 3.587607493857494], "isController": false}, {"data": ["Invalid_Login ", 15, 0, 0.0, 1043.6, 859, 1376, 1015.0, 1278.2, 1376.0, 1376.0, 7.7200205867215645, 4.257571249356665, 3.746924054297478], "isController": false}, {"data": ["Add Laptop to cart", 25, 0, 0.0, 558.6399999999999, 391, 794, 553.0, 681.0000000000001, 766.4, 794.0, 14.116318464144552, 4.565195334556748, 7.568221520327499], "isController": false}, {"data": ["Add Monitor to cart", 25, 0, 0.0, 526.5600000000001, 387, 697, 569.0, 673.4000000000001, 694.6, 697.0, 13.974287311347123, 4.517079199273337, 7.505720723868083], "isController": false}, {"data": ["Add Laptop2 to cart", 25, 0, 0.0, 504.08000000000004, 370, 644, 514.0, 639.8, 643.1, 644.0, 13.39046598821639, 4.328363517675415, 7.179068190948045], "isController": false}, {"data": ["Delete one cart item", 25, 0, 0.0, 565.6, 372, 770, 591.0, 693.2000000000002, 763.6999999999999, 770.0, 12.183235867446394, 6.945872167397661, 5.865561799463937], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 245, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
