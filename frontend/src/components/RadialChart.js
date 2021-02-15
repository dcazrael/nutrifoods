import Chart from 'react-apexcharts';

const RadialChart = (props) => {
    const { title, variant, percentage, height } = props;

    const startColor = ['#A78BFA', '#FBBF24', '#A5F3FC', '#FECACA'];
    const endColor = ['#7C3AED', '#FDE047', '#2DD4BF', '#EF4444'];
    const data = {
        options: {
            chart: {
                type: 'radialBar',
            },
            series: [percentage],
            colors: [startColor[variant]],
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '60%',
                    },
                    track: {
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            blur: 4,
                            opacity: 0.15,
                        },
                    },
                    dataLabels: {
                        name: {
                            offsetY: -10,
                            color: '#737373',
                            fontSize: '.6em',
                        },
                        value: {
                            offsetY: 0,
                            color: '#3d3d3d',
                            fontSize: '1.2em',
                            show: true,
                        },
                    },
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'vertical',
                    gradientToColors: [endColor[variant]],
                    stops: [0, 100],
                },
            },
            stroke: {
                lineCap: 'round',
            },
            labels: [title],
        },
    };

    return (
        <Chart
            options={data.options}
            series={data.options.series}
            type={data.options.chart.type}
            height={height}
            width={height}
            className="my-3 lg:my-0"
        />
    );
};

export default RadialChart;
