# Weather CN 🌤️

**中国天气预报 API - 支持全球城市，无 API 密钥需求**

基于 wttr.in 和 Open-Meteo 的免费天气预报服务，专为国内开发者设计！

---

## ✨ 特性

- 🆓 **完全免费** - 无需 API Key，开箱即用
- 🌍 **全球支持** - 支持全球任意城市天气查询
- 🇨🇳 **中文友好** - 自动返回中文天气信息
- 📦 **轻量级** - 基于 Node.js 的轻量级服务
- ⚡ **高性能** - 支持并发请求，响应迅速

---

## 🚀 快速开始

### 1. 安装

```bash
npx clawhub install weather-cn
```

### 2. 启动服务

```bash
cd skills/weather-cn
node index.js
```

服务启动在 `http://localhost:3001`

---

## 📖 API 使用

### 当前天气

```bash
curl "http://localhost:3001/weather?city=北京"
```

### 天气预报（3 天）

```bash
curl "http://localhost:3001/forecast?city=上海&days=3"
```

### 支持的城市格式

- 中文：`北京`、`上海`、`广州`
- 英文：`Beijing`、`Shanghai`、`Guangzhou`
- 坐标：`39.9,116.4`（纬度，经度）

---

## 💡 使用示例

### Node.js

```javascript
const response = await fetch('http://localhost:3001/weather?city=北京');
const data = await response.json();
console.log(`当前温度：${data.temperature}°C`);
console.log(`天气状况：${data.condition}`);
console.log(`风速：${data.windSpeed} km/h`);
```

### Python

```python
import requests

response = requests.get('http://localhost:3001/weather', params={'city': '北京'})
data = response.json()
print(f"当前温度：{data['temperature']}°C")
print(f"天气状况：{data['condition']}")
```

### cURL

```bash
# 查询北京天气
curl "http://localhost:3001/weather?city=北京"

# 查询上海 3 天预报
curl "http://localhost:3001/forecast?city=上海&days=3"
```

---

## 📋 API 响应格式

### 当前天气响应

```json
{
  "city": "北京",
  "country": "中国",
  "temperature": 15,
  "condition": "晴",
  "humidity": 45,
  "windSpeed": 12,
  "windDirection": "西北",
  "feelsLike": 13,
  "updateTime": "2026-03-19T12:00:00Z"
}
```

### 天气预报响应

```json
{
  "city": "上海",
  "forecast": [
    {
      "date": "2026-03-19",
      "tempMax": 18,
      "tempMin": 10,
      "condition": "多云",
      "precipitation": 10
    },
    {
      "date": "2026-03-20",
      "tempMax": 20,
      "tempMin": 12,
      "condition": "小雨",
      "precipitation": 60
    }
  ]
}
```

---

## 🔧 配置说明

`package.json` 配置项：

```json
{
  "port": 3001,
  "defaultLanguage": "zh",
  "cacheTimeout": 600
}
```

---

## 📄 许可证

MIT License

---

## 👤 作者

- GitHub: [@hyperfeng-prog](https://github.com/hyperfeng-prog)
- Email: 106810831@qq.com
- 支付宝：106810831@qq.com

---

## 🙏 数据来源

- [wttr.in](https://wttr.in/) - 天气预报数据
- [Open-Meteo](https://open-meteo.com/) - 气象数据 API

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
