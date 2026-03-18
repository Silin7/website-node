/*
 * @Description: TextEncoder/TextDecoder polyfill for Node.js
 * @Author: Silin7
 * @Date: 2025-12-20
 */

// 检查是否在Node.js环境中
if (typeof global !== 'undefined' && !global.TextEncoder) {
  const { TextEncoder, TextDecoder } = require('util');

  // 全局注册TextEncoder和TextDecoder
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;

  console.log('[INFO] TextEncoder/TextDecoder polyfill applied successfully');
}

module.exports = {
  TextEncoder: global.TextEncoder,
  TextDecoder: global.TextDecoder
};