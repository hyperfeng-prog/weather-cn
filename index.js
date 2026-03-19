/**
 * Weather CN Skill - 天气预报实现
 * 使用 wttr.in 和 Open-Meteo 免费 API
 */

const WEATHER_API = {
  wttr: 'https://wttr.in',
  openMeteo: 'https://api.open-meteo.com/v1'
};

const WEATHER_CODES = {
  '0': '晴朗',
  '1': '主要晴朗',
  '2': '部分多云',
  '3': '多云',
  '45': '雾',
  '48': '雾凇',
  '51': '轻度毛毛雨',
  '53': '中度毛毛雨',
  '55': '重度毛毛雨',
  '61': '轻度雨',
  '63': '中度雨',
  '65': '大雨',
  '71': '轻度雪',
  '73': '中度雪',
  '75': '大雪',
  '77': '雪粒',
  '80': '轻度阵雨',
  '81': '中度阵雨',
  '82': '强阵雨',
  '85': '轻度雪阵',
  '86': '中度雪阵',
  '95': '雷雨',
  '96': '雷雨伴冰雹',
  '99': '强雷雨伴冰雹'
};

/**
 * 获取当前天气
 * @param {string} city - 城市名称
 * @param {object} options - 选项
 * @returns {Promise<object>} 天气数据
 */
async function getCurrent(city, options = {}) {
  const { language = 'zh', units = 'metric' } = options;
  
  try {
    // 使用 wttr.in 获取当前天气
    const response = await fetch(`${WEATHER_API.wttr}/${encodeURIComponent(city)}?format=j1&lang=${language}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    const current = data.current_condition[0];
    const nearestArea = data.nearest_area[0];
    
    return {
      city: nearestArea.areaName[0].value,
      country: nearestArea.country[0].value,
      region: nearestArea.region[0].value,
      temperature: parseInt(current.temp_C),
      feelsLike: parseInt(current.FeelsLikeC),
      condition: current.weatherDesc[0].value,
      humidity: parseInt(current.humidity),
      windSpeed: parseInt(current.windspeedKmph),
      windDirection: current.winddir16Point,
      pressure: parseInt(current.pressure),
      visibility: parseInt(current.visibility),
      uvIndex: parseInt(current.uvIndex),
      cloudCover: parseInt(current.cloudcover),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}

/**
 * 获取天气预报
 * @param {string} city - 城市名称
 * @param {object} options - 选项
 * @returns {Promise<Array>} 预报数据
 */
async function getForecast(city, options = {}) {
  const { days = 3, language = 'zh' } = options;
  
  try {
    const response = await fetch(`${WEATHER_API.wttr}/${encodeURIComponent(city)}?format=j1&lang=${language}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    const forecast = data.weather.slice(0, days);
    
    return forecast.map(day => ({
      date: day.date,
      maxTemp: parseInt(day.maxtempC),
      minTemp: parseInt(day.mintempC),
      avgTemp: parseInt(day.avgtempC),
      condition: day.hourly[6].weatherDesc[0].value,
      weatherCode: day.hourly[6].weatherCode,
      precipitationChance: parseInt(day.hourly[6].chanceofrain),
      precipitationMM: parseFloat(day.hourly[6].precipMM),
      windSpeed: parseInt(day.hourly[6].windspeedKmph),
      humidity: parseInt(day.hourly[6].humidity),
      uvIndex: parseInt(day.hourly[6].uvIndex),
      sunrise: day.astronomy[0].sunrise,
      sunset: day.astronomy[0].sunset
    }));
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

/**
 * 获取详细天气信息
 * @param {string} city - 城市名称
 * @param {object} options - 选项
 * @returns {Promise<object>} 详细天气数据
 */
async function getDetailed(city, options = {}) {
  const { 
    includeHourly = false, 
    includeAlerts = false, 
    includeSun = false 
  } = options;
  
  const result = {
    current: await getCurrent(city, options)
  };
  
  // 获取逐小时预报
  if (includeHourly) {
    const response = await fetch(`${WEATHER_API.wttr}/${encodeURIComponent(city)}?format=j1`);
    const data = await response.json();
    
    result.hourly = data.weather[0].hourly.map(hour => ({
      time: hour.time,
      temperature: parseInt(hour.tempC),
      feelsLike: parseInt(hour.FeelsLikeC),
      condition: hour.weatherDesc[0].value,
      windSpeed: parseInt(hour.windspeedKmph),
      humidity: parseInt(hour.humidity),
      precipitationChance: parseInt(hour.chanceofrain),
      precipitationMM: parseFloat(hour.precipMM)
    }));
  }
  
  // 获取日出日落信息
  if (includeSun) {
    const response = await fetch(`${WEATHER_API.wttr}/${encodeURIComponent(city)}?format=j1`);
    const data = await response.json();
    
    result.sun = {
      sunrise: data.weather[0].astronomy[0].sunrise,
      sunset: data.weather[0].astronomy[0].sunset,
      moonrise: data.weather[0].astronomy[0].moonrise,
      moonset: data.weather[0].astronomy[0].moonset,
      moonPhase: data.weather[0].astronomy[0].moon_phase
    };
  }
  
  // 天气预警（wttr.in 不直接提供，需要其他数据源）
  if (includeAlerts) {
    result.alerts = [];
    console.warn('Weather alerts not available in current version');
  }
  
  return result;
}

/**
 * 获取 ASCII 天气图
 * @param {string} city - 城市名称
 * @param {object} options - 选项
 * @returns {Promise<string>} ASCII 艺术图
 */
async function getASCII(city, options = {}) {
  const { language = 'zh', days = 3 } = options;
  
  try {
    const response = await fetch(`${WEATHER_API.wttr}/${encodeURIComponent(city)}?lang=${language}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error fetching ASCII weather:', error);
    throw error;
  }
}

/**
 * 搜索城市
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 城市列表
 */
async function searchCities(query) {
  try {
    const response = await fetch(`${WEATHER_API.openMeteo}/geocode?name=${encodeURIComponent(query)}&count=10&language=zh&format=json`);
    
    if (!response.ok) {
      throw new Error(`Geocode API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.results || []).map(city => ({
      name: city.name,
      country: city.country_code,
      region: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population || 0
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

/**
 * 将 Open-Meteo 天气代码转换为中文描述
 * @param {number} code - 天气代码
 * @returns {string} 天气描述
 */
function getWeatherDescription(code) {
  return WEATHER_CODES[code.toString()] || '未知';
}

// 导出 API
module.exports = {
  getCurrent,
  getForecast,
  getDetailed,
  getASCII,
  searchCities,
  getWeatherDescription
};

// 导出默认对象
export default {
  getCurrent,
  getForecast,
  getDetailed,
  getASCII,
  searchCities,
  getWeatherDescription
};
