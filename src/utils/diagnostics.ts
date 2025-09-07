// diagnostics.ts
// 职责：
// 1) 连通性测试：对 5 个端点发起请求，返回耗时/状态
// 2) 网络详情：IP、城市、网络类型、信号强度、是否代理、是否弱网
// 3) 设备信息：UA 解析 + 浏览器可暴露的硬件能力

// 连通性测试的单项结果
export type TestResult = {
  ms: number;      // 耗时（毫秒）
  ok: boolean;     // 是否成功
  status?: number; // HTTP 状态码
  message?: string;// 失败信息（含超时）
};

export type ConnectivitySuite = {
  filePreview: TestResult;
  fileUpload: TestResult;
  clientApi: TestResult;
  doctorApi: TestResult;
  wechat: TestResult;
};

import { DIAG_CONFIG } from '@/config';
const DEFAULT_TIMEOUT_MS = DIAG_CONFIG.timeoutMs;

// 计时版 fetch：在给定超时内请求并返回时间/状态
async function timeFetch(url: string, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<TestResult> {
  const start = performance.now();
  let status: number | undefined;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    status = res.status;
    const ok = res.ok;
    return {
      ms: Math.round(performance.now() - start),
      ok,
      status,
      message: ok ? undefined : `HTTP ${status}`
    };
  } catch (err: any) {
    return {
      ms: Math.round(performance.now() - start),
      ok: false,
      status,
      message: err?.name === 'AbortError' ? '请求超时' : String(err?.message || err)
    };
  } finally {
    clearTimeout(timeout);
  }
}

// 连通性测试：并发触发 5 项测试
export async function runConnectivitySuite(): Promise<ConnectivitySuite> {
  const { endpoints } = DIAG_CONFIG;
  const previewUrl = endpoints.filePreview;
  const uploadUrl = endpoints.fileUpload;
  const clientApiUrl = endpoints.clientApi;
  const doctorApiUrl = endpoints.doctorApi;
  const wechatUrl = endpoints.wechat;

  const [filePreview, fileUpload, clientApi, doctorApi, wechat] = await Promise.all([
    timeFetch(previewUrl, { cache: 'no-store' }),
    timeFetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: 1 }),
      cache: 'no-store'
    }),
    timeFetch(clientApiUrl, { cache: 'no-store' }),
    timeFetch(doctorApiUrl, { cache: 'no-store' }),
    timeFetch(wechatUrl, { cache: 'no-store' })
  ]);

  return { filePreview, fileUpload, clientApi, doctorApi, wechat };
}

// 网络详情
export type NetworkInfo = {
  ip?: string;            // 公网 IP
  city?: string;          // 城市/区域
  networkType?: string;   // 网络类型（wifi/4g/5g/unknown）
  isProxyLikely?: boolean;// 是否疑似代理/VPN（启发式）
  isWeakNetwork?: boolean;// 是否弱网（依据 downlink/effectiveType）
  signal?: string;        // 信号强度近似（RTT 或下行带宽）
};

// 获取网络详情：IP/城市 + Network Information API
export async function getNetworkInfo(): Promise<NetworkInfo> {
  let ip: string | undefined;
  let city: string | undefined;
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      ip = data.ip;
      city = data.city || data.region;
    }
  } catch {}

  const connection: any = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const downlink: number | undefined = connection?.downlink;
  const effectiveType: string | undefined = connection?.effectiveType;
  const rtt: number | undefined = connection?.rtt;
  const networkType = connection?.type || effectiveType || '未知';
  const isWeakNetwork = (effectiveType && ['slow-2g', '2g'].includes(effectiveType)) || (downlink !== undefined && downlink < 1);
  const signal = rtt ? `${rtt}ms RTT` : downlink ? `${downlink}Mbps` : '-';

  // 代理/VPN 启发式
  const ua = navigator.userAgent.toLowerCase();
  const isProxyLikely = /vpn|proxy|mitmproxy/.test(ua);

  return { ip, city, networkType, isProxyLikely, isWeakNetwork: Boolean(isWeakNetwork), signal };
}

export type DeviceInfo = {
  brand?: string;
  model?: string;
  os?: string;
  platform?: 'Android' | 'iOS' | 'Web' | 'Other';
  performanceScore?: number; // simple score 0-100
  memory?: string;
  cpu?: string;
  wifiSwitch?: '开' | '关' | '未知';
};

// 获取设备信息：UA + 浏览器硬件能力
export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const platform: DeviceInfo['platform'] = isAndroid ? 'Android' : isIOS ? 'iOS' : 'Web';

  
  let brand: string | undefined;
  let model: string | undefined;
  if (isAndroid) {
    const m = ua.match(/;\s*([^;]+)\s+Build\//i);
    model = m?.[1]?.trim();
  } else if (isIOS) {
    model = 'iPhone';
  }

  const os = isAndroid ? ua.match(/Android\s([\d_.]+)/)?.[0] : isIOS ? ua.match(/OS\s([\d_]+)/)?.[0]?.replace(/_/g, '.') : navigator.platform;

  // 内存/CPU 估算
  const deviceMemory = (navigator as any).deviceMemory; // in GB if available
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const performanceScore = Math.min(100, Math.round((hardwareConcurrency * (deviceMemory || 2)) * 5));
  const memory = deviceMemory ? `${deviceMemory}GB` : '未知';
  const cpu = `Core x${hardwareConcurrency}`;

  // WiFi 开关（基于 Network Information API 简单推断）
  const connection: any = (navigator as any).connection;
  const wifiSwitch: DeviceInfo['wifiSwitch'] = connection?.type === 'wifi' || connection?.wifi ? '开' : connection ? '关' : '未知';

  return { brand, model, os, platform, performanceScore, memory, cpu, wifiSwitch };
}

// 解析 URL 查询参数中的用户
export function parseUserFromQuery(): { userId?: string; userName?: string } {
  const sp = new URLSearchParams(location.search);
  const userId = sp.get('uid') || undefined;
  const userName = sp.get('name') || undefined;
  return { userId, userName };
}


