import React from 'react';
import { useDiagnostics } from '@/hooks/useDiagnostics';
import { Connectivity } from '@/components/Connectivity';
import { NetworkInfo } from '@/components/NetworkInfo';
import { DeviceInfo } from '@/components/DeviceInfo';
import { parseUserFromQuery } from '@/utils/diagnostics';

export default function App(): JSX.Element {
  const { suiteState, suite, network, device, run } = useDiagnostics();
  const { userId, userName } = React.useMemo(() => parseUserFromQuery(), []);

  return (
    <div className="page">
      {(userId || userName) && (
        <div className="watermark">
          <div className="wm-text">{`${userName || '用户'}-${userId || '未登录'}`}</div>
        </div>
      )}

      <div className="topbar">
        <div className="tb-left">‹</div>
        <div className="tb-title">网络诊断</div>
        <div className="tb-right">···</div>
      </div>

      <div className="header">
        <div className="avatar" />
        <div>
          <div className="title">{userName || '李医生'}</div>
          <div className="sub">ID：{userId || '未登录'}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div className="sub">{new Date().toLocaleString()}</div>
        </div>
      </div>

      <Connectivity state={suiteState} suite={suite} onRefresh={run} />
      <NetworkInfo data={network} />
      <DeviceInfo data={device} />

      <div className="footer" />
    </div>
  );
}


