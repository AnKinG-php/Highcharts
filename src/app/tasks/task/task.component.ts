import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

import {ApiService} from '../../shared/services/api.service';

import * as HighCharts from "highcharts";
import {timeout} from "rxjs/operators";

// tslint:disable-next-line:no-var-requires
const Highcharts = require('highcharts/highstock');
// tslint:disable-next-line:no-var-requires
require('highcharts/highcharts-3d')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);
require('highcharts/modules/boost')(Highcharts);

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public apiService: ApiService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.id = Number(this.route.snapshot.firstChild.params['id']);
        this.getTask();
        console.log(this.id)
      }
    });
  }

  ngOnInit(): void {

  }

  getTask() {
    if ((this.id == 0) || (this.id > 4)) {
      this.id = 1;
    }
    document.getElementById('chart').innerHTML = "";
    document.getElementById("chart").style.height = "500px";

    if (this.id == 1)
      this.task1();
    else if (this.id == 2)
      this.task2();
    else if (this.id == 3)
      this.task3();
    else if (this.id == 4)
      this.task4();
  }

  task1() {
    // @ts-ignore
    HighCharts.chart('chart', {
      chart: {
        type: 'spline',
        scrollablePlotArea: {
          minWidth: 1000 * 30,
          scrollPositionX: 0.0095
        }
      },
      title: {
        text: 'Task 1'
      },
      yAxis: {
        tickWidth: 2,
        title: {
          text: ''
        },
        lineWidth: 2,
        opposite: true
      },
      plotOptions: {
        spline: {
          lineWidth: 4,
          states: {
            hover: {
              lineWidth: 8
            }
          },
          marker: {
            enabled: false
          },
        }
      },
      series: [{
        name: 'alpha',
        color: '#0066FF',
        data: this.getRandomArray(1, 0, 1000)

      }, {
        name: 'beta',
        color: '#00378b',
        data: this.getRandomArray(2, 1, 1000)
      }, {
        name: 'gamma',
        color: '#5493f1',
        data: this.getRandomArray(3, 2, 1000)
      }]
    });
    this.clearCredits();
  }

  task2() {
    let apiService = this.apiService;
    // @ts-ignore
    Highcharts.chart('chart', {
      chart: {
        type: 'spline',
        // @ts-ignore
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {
            let series = this.series[0];
            setInterval(function () {
              console.time('line');

              apiService.getTask(2)
                .subscribe((y) => {
                  if (series.data) {
                    series.addPoint([(new Date()).getTime(), y], true, true);
                    console.timeEnd('line');
                  }
                });
            }, 1000);
          }
        }
      },

      time: {
        useUTC: false
      },

      title: {
        text: 'Task 2'
      },

      xAxis: {
        type: 'datetime',
        tickPixelInterval: 5
      },

      yAxis: {
        title: {
          text: 'Value'
        },
        plotLines: [{
          value: 0,
          width: 1
        }]
      },

      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
      },

      series: [{
        name: 'Random data',
        color: '#0066FF',
        data: (function () {
          let data = [], time = (new Date()).getTime(), i;
          for (i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random()
            });
          }
          return data;
        }())
      }]
    });
    this.clearCredits();
  }

  task3() {

    console.time('line');
    this.apiService.getTask(3)
      .subscribe((data) => {

        Highcharts.chart('chart', {

          chart: {
            zoomType: 'x'
          },

          title: {
            text: 'Task 3'
          },

          tooltip: {
            valueDecimals: 2
          },

          xAxis: {
            type: 'datetime'
          },

          series: [{
            data: data,
            lineWidth: 0.2,
            color: '#0066FF',
            name: 'Points'
          }]

        });
        console.timeEnd('line');
        this.clearCredits();
      });

  }

  task4() {
    let apiService = this.apiService;
    document.getElementById("chart").style.height = (window.innerHeight - 300) + 'px';

    let chart = new Highcharts.Chart({
      chart: {
        renderTo: 'chart',
        margin: 100,
        type: 'scatter3d',
        events: {
          load: function () {
            console.time('line');
            let series = this.series[0];
            apiService.getTask(4)
              .subscribe((data: string[][]) => {
                if (series.data) {
                  let seriesData: number[][] = [];
                  data.forEach(item => {
                    let n = Number(item[0]) *
                      Math.sin(Number(item[1])) *
                      Math.cos(Number(item[2]));

                    let e = Number(item[0]) *
                      Math.sin(Number(item[1])) *
                      Math.sin(Number(item[2]));

                    let tvd = Number(item[0]) *
                      Math.cos(Number(item[1]));

                    seriesData.push([n, e, tvd])
                  })
                  console.log(seriesData);
                  series.setData(seriesData, true, false);
                  console.timeEnd('line');
                }

              });
          }
        },
        animation: false,
        options3d: {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 250,
          viewDistance: 5,
          fitToPlot: false,
          frame: {
            bottom: {size: 1, color: 'rgba(0,0,0,0.02)'},
            back: {size: 1, color: 'rgba(0,0,0,0.04)'},
            side: {size: 1, color: 'rgba(0,0,0,0.06)'}
          }
        }
      },
      title: {
        text: 'Task 4'
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Data',
        colorByPoint: true,
        accessibility: {
          exposeAsGroupOnly: true
        },
      }]
    });
    this.clearCredits();
// Add mouse and touch events for rotation
    (function (H) {
      function dragStart(eStart) {
        eStart = chart.pointer.normalize(eStart);

        let posX = eStart.chartX,
          posY = eStart.chartY,
          alpha = chart.options.chart.options3d.alpha,
          beta = chart.options.chart.options3d.beta,
          sensitivity = 5,  // lower is more sensitive
          handlers = [];

        function drag(e) {
          // Get e.chartX and e.chartY
          e = chart.pointer.normalize(e);

          chart.update({
            chart: {
              options3d: {
                alpha: alpha + (e.chartY - posY) / sensitivity,
                beta: beta + (posX - e.chartX) / sensitivity
              }
            }
          }, undefined, undefined, false);
        }

        function unbindAll() {
          handlers.forEach(function (unbind) {
            if (unbind) {
              unbind();
            }
          });
          handlers.length = 0;
        }

        handlers.push(H.addEvent(document, 'mousemove', drag));
        handlers.push(H.addEvent(document, 'touchmove', drag));


        handlers.push(H.addEvent(document, 'mouseup', unbindAll));
        handlers.push(H.addEvent(document, 'touchend', unbindAll));
      }

      H.addEvent(chart.container, 'mousedown', dragStart);
      H.addEvent(chart.container, 'touchstart', dragStart);
    }(Highcharts));

  }

  clearCredits() {
      let credits = document.getElementsByClassName("highcharts-credits") as HTMLCollectionOf<HTMLElement>;
      if (credits[0]) {
        credits[0].style['display'] = 'none';
      }
  }

  getRandomArray(max, min, count) {
    let numbArray = [];
    for (let i = 0; i < count; i++) {
      let numb = Math.random() * (max - min) + min;
      numbArray.push(numb);
    }
    return numbArray;
  }

}
