export function calculateRsi(candleStickData, chartLength){
  const rsArr = getRs(candleStickData).splice(-chartLength);
  const rsiArr = [];

  for(let x = 0; x < rsArr.length; x++){
    const y = getRsi(rsArr[x]);
    rsiArr.push({x, y});
  }

  const lastCandle = rsiArr[rsiArr.length-1];

  return {value: (lastCandle) ? lastCandle.y: 0, chartData: rsiArr};
}

export function getPriceChartData(candleStickData, chartLength){
  candleStickData = candleStickData.splice(-chartLength);
  const chartData = [];

  for(let x=0; x < candleStickData.length; x++){
    const y = candleStickData[x][4];
    chartData.push({x, y});
  }

  return chartData;
}

function getRsi(rs){
  return 100 - 100 / (1 + rs);
}

function getRs(candleStickData) {
  const gains = [];
  const losses = [];
  let aveGain;
  let aveLoss;

  const rsArr = [];

  for (let i = 0; i < candleStickData.length; i++) {
    const prevCandle = candleStickData[i - 1];
    const prevCandleClose = prevCandle ? prevCandle[4] : undefined;
    const currCandleClose = candleStickData[i][4];

    const difference = prevCandleClose !== undefined
      ? currCandleClose - prevCandleClose
      : undefined;

    let currentGain;
    let currentLoss;

    if (difference !== undefined) {
      if (difference > 0) {
        currentGain = difference;
        currentLoss = 0;
      } else {
        currentLoss = Math.abs(difference);
        currentGain = 0;
      }
      gains.push(currentGain);
      losses.push(currentLoss);
    }

    if (i >= 14) {
      if (aveGain && aveLoss) {
        aveGain = getSmoothAve(aveGain, currentGain);
        aveLoss = getSmoothAve(aveLoss, currentLoss);
      } else {
        aveGain = getAverage(gains);
        aveLoss = getAverage(losses);
      }

      rsArr.push(aveGain / aveLoss);
    }
  }

  return rsArr;
}

function getAverage(arrayOfNumbers) {
  const sum = arrayOfNumbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  return sum / arrayOfNumbers.length;
}

function getSmoothAve(prevAve, currentDiff) {
  return (prevAve * 13 + currentDiff) / 14;
}
