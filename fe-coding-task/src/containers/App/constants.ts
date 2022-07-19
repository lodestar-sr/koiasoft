export const Quarters = [
  2009,
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
].reduce((quarters, year) => [
  ...quarters,
  ...(new Array(4).fill('').map((i, length) => `${year}K${length + 1}`)),
], [] as string[]);

export const QuartersOptions = Quarters.map((quarter, index) => ({
  value: index,
  label: index % 4 === 0 || index === Quarters.length - 1 ? quarter : '',
}));


export const generateLineChart = (categories: string[], series: any) => ({
  chart: {
    type: 'area',
    height: 500,
  },
  title: { text: '' },
  credits: { enabled: false },
  legend: {
    borderRadius: 0,
    align: 'left',
    verticalAlign: 'top',
    shadow: false,
  },
  xAxis: {
    lineColor: '#88898C',
    gridLineColor: '#00000026',
    gridLineWidth: 1,
    categories,
    tickInterval: 1,
  },
  yAxis: {
    title: { text: '' },
    labels: { style: { fontSize: '12px', color: '#777777' } },
    lineColor: '#fff',
    gridLineColor: '#00000026',
    gridLineWidth: 1,
    tickInterval: 10,
    tickAmount: 5,
  },
  plotOptions: {
    area: {
      pointStart: 0,
      lineWidth: 3,
      marker: {
        radius: 0,
      },
    },
  },
  series,
});

export const generateBarChart = (categories: string[], series: any) => ({
  chart: {
    type: 'column',
    height: 500,
  },
  title: { text: '' },
  credits: { enabled: false },
  legend: {
    borderRadius: 0,
    align: 'left',
    verticalAlign: 'top',
    shadow: false,
  },
  xAxis: {
    lineColor: '#88898C',
    gridLineColor: '#00000026',
    categories,
    labels: {
      style: { fontSize: '12px' },
    },
  },
  yAxis: {
    title: { text: '' },
    lineColor: '#88898C',
    gridLineColor: '#00000026',
    min: 0,
    stackLabels: {
      style: {
        fontWeight: 'bold',
        color: 'gray',
      },
    },
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}',
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: false,
      },
    },
  },
  series,
});
