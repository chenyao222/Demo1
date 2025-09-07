import React from 'react';
import { Section, Item } from './Section';
import { DeviceInfo as D } from '@/utils/diagnostics';

// 设备详情卡片：品牌/型号/系统/平台/性能/内存/CPU/WiFi
export function DeviceInfo({ data }: { data: D }): JSX.Element {
  return (
    <Section title="设备详情">
      <div className="grid">
        <Item label="设备品牌" value={data.brand || '-'} />
        <Item label="操作系统及版本" value={data.os || '-'} />
        <Item label="设备型号" value={data.model || '-'} />
        <Item label="客户端平台" value={data.platform || 'Web'} />
        <Item label="设备性能" value={String(data.performanceScore ?? '-')} />
        <Item label="设备内存" value={data.memory || '-'} />
        <Item label="CPU" value={data.cpu || '-'} />
        <Item label="WIFI开关" value={data.wifiSwitch || '未知'} />
      </div>
    </Section>
  );
}


