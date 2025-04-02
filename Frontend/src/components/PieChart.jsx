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
          left: 'center',
        },
        series: [
          {
            name: 'Device Type',
            type: 'pie',
            radius: ['30%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
              },
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
  
    return <div ref={chartRef} className="w-full h-96" />;
  };

export default Donut;