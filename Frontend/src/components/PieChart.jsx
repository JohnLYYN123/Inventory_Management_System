import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const Donut = ({ data }) => {
    const chartRef = useRef(null);
  
    useEffect(() => {
      const chart = echarts.init(chartRef.current);
  
      chart.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: 'top',
        },
        series: [
          {
            name: 'Device Type',
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: true,
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
              },
            },
            label: {
              show: true,
              position: 'outside',
            },
            data: data,
          },
        ],
      });
  
      const handleResize = () => {
        chart.resize();
      };
  
      window.addEventListener('resize', handleResize);
      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }, [data]);
  
    return <div ref={chartRef} className="w-full h-80" />;
  };

export default Donut;