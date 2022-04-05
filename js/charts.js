/* globals Chart:false, feather:false */

(function () {
    'use strict'
  
    feather.replace({ 'aria-hidden': 'true' })
  
    // Graphs
  var ctx = document.getElementById('myChart')
  
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        datasets: [{
          data: [
            15339,
            21345,
            18483,
            24003,
            19489,
            24092,
            22034
          ],
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#90AADC',
          borderWidth: 4,
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        },
        legend: {
          display: false
        }
      }
    })
  
    var data = {
      labels: [
        "Cuadernos",
        "Lapiceros",
        "Plumones"
      ],
      datasets: [
        {
          data: [230, 90, 40],
          backgroundColor: [
            "#007EB0",
            "#00293A",
            "#009AD6"
          ]
        }]
    };
    var promisedDeliveryChart = new Chart(document.getElementById('myChart2'), {
      type: 'doughnut',
      data: data,
      options: {
         responsive: true,
        legend: {
          display: false
        }
      }
      
    });
    
  })()
  