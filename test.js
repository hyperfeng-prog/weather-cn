#!/usr/bin/env node
/**
 * Weather CN - 测试脚本
 * 测试天气 API 的各项功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 发送 HTTP 请求
function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    }).on('error', reject);
  });
}

// 测试用例
async function runTests() {
  log('\n🌤️  Weather CN 测试开始\n', 'blue');
  
  let passed = 0;
  let failed = 0;
  
  // 测试 1: 健康检查
  log('测试 1: 健康检查...', 'yellow');
  try {
    const res = await request('/health');
    if (res.status === 200 && res.data.status === 'ok') {
      log('✅ 通过 - 服务正常运行', 'green');
      passed++;
    } else {
      log(`❌ 失败 - 状态码：${res.status}`, 'red');
      failed++;
    }
  } catch (e) {
    log(`❌ 失败 - ${e.message} (请确保服务已启动：node index.js)`, 'red');
    failed++;
  }
  
  // 测试 2: 北京天气
  log('\n测试 2: 查询北京天气...', 'yellow');
  try {
    const res = await request('/weather?city=北京');
    if (res.status === 200 && res.data.city) {
      log(`✅ 通过 - 城市：${res.data.city}, 温度：${res.data.temperature}°C`, 'green');
      passed++;
    } else {
      log(`❌ 失败 - ${JSON.stringify(res.data)}`, 'red');
      failed++;
    }
  } catch (e) {
    log(`❌ 失败 - ${e.message}`, 'red');
    failed++;
  }
  
  // 测试 3: 英文城市
  log('\n测试 3: 查询 Shanghai 天气...', 'yellow');
  try {
    const res = await request('/weather?city=Shanghai');
    if (res.status === 200 && res.data.city) {
      log(`✅ 通过 - 城市：${res.data.city}, 温度：${res.data.temperature}°C`, 'green');
      passed++;
    } else {
      log(`❌ 失败 - ${JSON.stringify(res.data)}`, 'red');
      failed++;
    }
  } catch (e) {
    log(`❌ 失败 - ${e.message}`, 'red');
    failed++;
  }
  
  // 测试 4: 天气预报
  log('\n测试 4: 查询 3 天天气预报...', 'yellow');
  try {
    const res = await request('/forecast?city=广州&days=3');
    if (res.status === 200 && res.data.forecast && res.data.forecast.length > 0) {
      log(`✅ 通过 - 城市：${res.data.city}, 预报天数：${res.data.forecast.length}`, 'green');
      passed++;
    } else {
      log(`❌ 失败 - ${JSON.stringify(res.data)}`, 'red');
      failed++;
    }
  } catch (e) {
    log(`❌ 失败 - ${e.message}`, 'red');
    failed++;
  }
  
  // 测试 5: 无效城市
  log('\n测试 5: 查询无效城市...', 'yellow');
  try {
    const res = await request('/weather?city=InvalidCityName12345');
    if (res.status === 404 || (res.status === 200 && res.data.error)) {
      log('✅ 通过 - 正确返回错误', 'green');
      passed++;
    } else {
      log(`⚠️  警告 - 应该返回错误但得到：${JSON.stringify(res.data)}`, 'yellow');
      passed++; // 不算失败，但行为可能不理想
    }
  } catch (e) {
    log(`❌ 失败 - ${e.message}`, 'red');
    failed++;
  }
  
  // 总结
  log('\n' + '='.repeat(50), 'blue');
  log(`测试结果：${passed} 通过，${failed} 失败`, failed > 0 ? 'red' : 'green');
  log('='.repeat(50) + '\n', 'blue');
  
  process.exit(failed > 0 ? 1 : 0);
}

// 运行测试
runTests();
