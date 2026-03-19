---
name: Weather CN
slug: weather-cn
version: 1.0.0
description: 天气预报技能 - 支持全球城市，无 API 密钥需求
author: Leo
license: MIT
tags: [weather, forecast, wttr, open-meteo]
---

# Weather CN Skill

天气预报技能，使用 wttr.in 和 Open-Meteo 免费 API，无需 API 密钥。

## 功能

- 🌤️ 当前天气查询
- 📅 3-7 天天气预报
- 🌍 支持全球任意城市
- 🌡️ 温度、湿度、风速、降水量等详细信息
- 📊 可选 ASCII 天气图

## 安装

```bash
npx clawhub@latest install weather-cn
```

## 使用示例

```javascript
// 查询当前天气
const weather = await weatherCN.getCurrent('Beijing');
console.log(weather);
// {
//   city: 'Beijing',
//   temperature: 15,
//   condition: 'Sunny',
//   humidity: 45,
//   windSpeed: 12,
//   feelsLike: 13
// }

// 查询天气预报（3 天）
const forecast = await weatherCN.getForecast('Shanghai', { days: 3 });
console.log(forecast);
// [
//   { date: '2026-03-18', maxTemp: 18, minTemp: 10, condition: 'Partly Cloudy' },
//   { date: '2026-03-19', maxTemp: 20, minTemp: 12, condition: 'Sunny' },
//   { date: '2026-03-20', maxTemp: 17, minTemp: 11, condition: 'Rainy' }
// ]

// 获取详细天气信息
const detailed = await weatherCN.getDetailed('Guangzhou', {
  includeHourly: true,
  includeAlerts: true
});

// 获取 ASCII 天气图
const asciiArt = await weatherCN.getASCII('Shenzhen');
console.log(asciiArt);
// 输出精美的 ASCII 天气图
```

## API

### `getCurrent(city, options)`

查询当前天气。

**参数：**
- `city` (string): 城市名称（支持中文、英文、拼音）
- `options` (object, optional):
  - `language` (string): 语言，默认 'zh'（中文）
  - `units` (string): 单位，'metric'（公制）或 'imperial'（英制）

**返回：**
```javascript
{
  city: string,
  country: string,
  temperature: number,      // °C
  feelsLike: number,        // °C
  condition: string,        // 天气状况
  humidity: number,         // %
  windSpeed: number,        // km/h
  windDirection: string,    // 风向
  pressure: number,         // hPa
  visibility: number,       // km
  uvIndex: number,          // 紫外线指数
  updatedAt: string         // 更新时间
}
```

### `getForecast(city, options)`

查询天气预报。

**参数：**
- `city` (string): 城市名称
- `options` (object, optional):
  - `days` (number): 预报天数，1-7，默认 3
  - `language` (string): 语言，默认 'zh'

**返回：**
```javascript
[
  {
    date: string,           // YYYY-MM-DD
    maxTemp: number,        // 最高温 °C
    minTemp: number,        // 最低温 °C
    condition: string,      // 天气状况
    precipitationChance: number,  // 降水概率 %
    windSpeed: number,      // km/h
    humidity: number        // %
  }
]
```

### `getDetailed(city, options)`

获取详细天气信息。

**参数：**
- `city` (string): 城市名称
- `options` (object, optional):
  - `includeHourly` (boolean): 包含逐小时预报，默认 false
  - `includeAlerts` (boolean): 包含天气预警，默认 false
  - `includeSun` (boolean): 包含日出日落时间，默认 false

**返回：**
```javascript
{
  current: { ... },         // 当前天气
  hourly: [ ... ],          // 逐小时预报（如果请求）
  alerts: [ ... ],          // 天气预警（如果请求）
  sun: {                    // 日出日落（如果请求）
    sunrise: string,
    sunset: string
  }
}
```

### `getASCII(city, options)`

获取 ASCII 天气图。

**参数：**
- `city` (string): 城市名称
- `options` (object, optional):
  - `language` (string): 语言，默认 'zh'
  - `days` (number): 预报天数，默认 3

**返回：** string（ASCII 艺术图）

### `searchCities(query)`

搜索城市。

**参数：**
- `query` (string): 搜索关键词

**返回：**
```javascript
[
  {
    name: string,
    country: string,
    region: string,
    latitude: number,
    longitude: number
  }
]
```

## 数据来源

- **wttr.in**: 当前天气和短期预报
- **Open-Meteo**: 详细气象数据
- 无需 API 密钥，完全免费

## 注意事项

1. 城市名称支持中文、英文、拼音
2. 数据每 30 分钟更新一次
3. 建议添加缓存机制减少请求

## 许可证

MIT License
