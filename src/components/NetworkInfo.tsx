import React from 'react';
import { Section, Item } from './Section';
import { NetworkInfo as N } from '@/utils/diagnostics';

// 网络情况卡片：IP/城市/网络类型/信号/代理/弱网
export function NetworkInfo({ data }: { data: N | null }): JSX.Element {
  return (
    <Section title="网络情况">
      {data ? (
        <div className="grid">
          <Item label="IP地址" value={data.ip || '-'} />
          <Item label="城市" value={data.city || '-'} />
          <Item label="网络类型" value={data.networkType || '-'} />
          <Item label="信号强度" value={data.signal || '-'} />
          <Item label="是否使用代理" value={data.isProxyLikely ? '是' : '否'} />
          <Item label="是否弱网环境" value={data.isWeakNetwork ? '是' : '否'} />
        </div>
      ) : (
        <div className="center sub">正在获取网络详情…</div>
      )}
    </Section>
  );
}


