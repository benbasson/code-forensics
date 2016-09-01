var d3 = require('d3'),
    _  = require('lodash'),
    ko = require('knockout');

module.exports = function(config, series) {
  var self = this;
  var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

  this.visibleSeries = ko.observable(series);
  this.filterableSeries = _.map(series, function(word) { return word.count; });
  this.filterVisibleSeries = function(filters) {
    var filterValue = filters.wordOccurenciesFilter.outputValue();
    this.visibleSeries(_.filter(series, function(word) {
      return word.count >= filterValue;
    }));
  };
  this.onUpdate = function(callback) {
    _.each([this.visibleSeries], function(observable) {
      observable.subscribe(_.wrap(self, callback));
    });
  };

  this.chartDefinitions = [
    {
      name: 'main',
      properties: {
        attributes: { class: config.style.cssClass, width: config.style.width, height: config.style.height }
      },
      data: {
        properties: {
          offset: { x: config.style.width / 2, y: config.style.height / 2 }
        },
        series: series,
        graphicElements: [
          {
            type: 'text',
            properties: {
              text: function(d) { return d.text; },
              offset: function(d) { return { x: d.x, y: d.y }; },
              rotation: function(d) {  return d.rotate; },
              style: {
                'font-size': function(d) { return config.style.minFontSize + d.size + 'px'; },
                'fill': function(d, i) { return colorScale(i); },
                display: function(word) {
                  return _.includes(self.visibleSeries(), word) ? 'inline' : 'none';
                }
              }
            }
          }
        ]
      },
      updateStrategy: {
        method: 'repaintData',
        arguments: [
          {
            type: 'text',
            properties: {
              style: {
                display: function(word) {
                  return _.includes(self.visibleSeries(), word) ? 'inline' : 'none';
                }
              }
            }
          }
        ]
      }
    }
  ];
};