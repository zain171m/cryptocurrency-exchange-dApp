export const options = {
    chart: {
      animations: { enabled: true },
      toolbar: { show: false },
      width: '100px'
    },
    tooltip: {
      enabled: true,
      theme: false,
      style: {
        fontSize: '12px',
        fontFamily: undefined
      },
      x: {
        show: false,
        format: 'dd MMM',
        formatter: undefined,
      },
      y: {
        show: true,
        title: 'price'
      },
      marker: {
        show: false,
      },
      items: {
        display: 'flex',
      },
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
    },
    grid: {
      show: true,
      borderColor: '#767F92',
      strokeDashArray: 0
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#25CE8F',
          downward: '#F45353'
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        style: {
          colors: '#767F92',
          fontSize: '14px',
          cssClass: 'apexcharts-xaxis-label',
        },
      }
    },
    yaxis: {
      labels: {
        show: true,
        minWidth: 0,
        maxWidth: 160,
        style: {
          color: '#F1F2F9',
          fontSize: '14px',
          cssClass: 'apexcharts-yaxis-label',
        },
        offsetX: 0,
        offsetY: 0,
        rotate: 0,
      }
    }
  }
  
  //Default Series
  export const defaultSeries = []
  // Code in the series as a temporary placeholder for demonstration
  
  export const series = [
    {
      data: [
        [24.01, [6593.34, 6600, 6582.63, 6600]],
        [25.01, [6600, 6604.76, 6590.73, 6593.86]],
        [26.01, [6593.86, 6625.76, 6590.73, 6620.00]],
        [27.01, [6620.00, 6604.76, 6590.73, 6605.86]],
        [28.01, [6605.86, 6604.76, 6590.73, 6590.75]],
        [29.01, [6590.75, 6604.76, 6590.73, 6582.10]],
        [30.01, [6582.10, 6604.76, 6516.73, 6550.10]],
        [31.01, [6550.10, 6604.76, 6550.73, 6600.23]],
        [32.01, [6600.23, 6604.76, 6590.73, 6652.89]],
        [33.01, [6652.89, 6670.00, 6632.89, 6660.89]],
        [34.01, [6660.89, 6670.00, 6632.89, 6650.89]],
        [35.01, [6650.89, 6670.00, 6632.89, 6638.89]],
        [36.01, [6638.89, 6670.00, 6598.89, 6618.89]],
        [37.01, [6590.75, 6604.76, 6590.73, 6582.10]],
        [38.01, [6582.10, 6604.76, 6516.73, 6550.10]],
        [39.01, [6550.10, 6604.76, 6550.73, 6600.23]],
        [40.01, [6600.23, 6604.76, 6590.73, 6652.89]],
        [41.01, [6652.89, 6670.00, 6632.89, 6660.89]],
        [42.01, [6660.89, 6670.00, 6632.89, 6650.89]],
        [43.01, [6650.89, 6670.00, 6632.89, 6638.89]],
        [44.01, [6638.89, 6670.00, 6598.89, 6618.89]], 
        [45.01, [6660.89, 6670.00, 6632.89, 6650.89]],
        [46.01, [6650.89, 6670.00, 6632.89, 6638.89]],
        [47.01, [6638.89, 6670.00, 6598.89, 6618.89]],
        [48.01, [6590.75, 6604.76, 6590.73, 6582.10]],
        [49.01, [6582.10, 6604.76, 6516.73, 6550.10]],
        [50.01, [6550.10, 6604.76, 6550.73, 6600.23]],
        [51.01, [6600.23, 6604.76, 6590.73, 6652.89]],
        [52.01, [6652.89, 6670.00, 6632.89, 6660.89]],
        [53.01, [6660.89, 6670.00, 6632.89, 6650.89]],
        [54.01, [6650.89, 6670.00, 6632.89, 6638.89]],
        [55.01, [6638.89, 6670.00, 6598.89, 6618.89]] 
      ]
    }
  ]