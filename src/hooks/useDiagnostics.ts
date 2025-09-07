// useDiagnostics
// 统一组织：连通性测试 + 网络详情获取 + 设备信息
// 暴露：状态 suiteState、结果 suite/network/device，以及重测函数 run
import React from 'react';
import { ConnectivitySuite, DeviceInfo, NetworkInfo, getDeviceInfo, getNetworkInfo, runConnectivitySuite } from '@/utils/diagnostics';

export function useDiagnostics() {
  // 页面级状态：测试阶段、测试结果、网络详情与设备信息
  const [suiteState, setSuiteState] = React.useState<'idle' | 'running' | 'done'>('idle');
  const [suite, setSuite] = React.useState<ConnectivitySuite | null>(null);
  const [network, setNetwork] = React.useState<NetworkInfo | null>(null);
  const [device] = React.useState<DeviceInfo>(() => getDeviceInfo());

  // 执行一次完整诊断：并发“连通性测试 + 网络详情”
  const run = React.useCallback(async () => {
    setSuiteState('running');
    setSuite(null);
    const [s, n] = await Promise.all([runConnectivitySuite(), getNetworkInfo()]);
    setSuite(s);
    setNetwork(n);
    setSuiteState('done');
  }, []);

 // 首次渲染后延后执行，提高首屏响应
  React.useEffect(() => {
    const win: any = window as any;
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(run, { timeout: 1000 });
    } else {
      setTimeout(run, 0);
    }
  }, [run]);

  return { suiteState, suite, network, device, run };
}


