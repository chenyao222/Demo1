import React from 'react';
import { Section } from './Section';
import { ConnectivitySuite } from '@/utils/diagnostics';

type Props = {
  state: 'idle' | 'running' | 'done';
  suite: ConnectivitySuite | null;
  onRefresh: () => void;
};

// 连通性测试卡片：显示五项测试与重测按钮
export function Connectivity({ state, suite, onRefresh }: Props): JSX.Element {
  const allDone = state === 'done';
  return (
    <Section
      title="连通性测试"
      extra={allDone ? <button className="refresh" onClick={onRefresh}>点击重测</button> : null}
    >
      {state === 'running' && (
        <div className="center">
          <div>
            <div className="spinner" />
            <div className="sub" style={{ textAlign: 'center' }}>正在进行检测，约需5秒，请稍等…</div>
          </div>
        </div>
      )}
      {suite && (
        <div className="grid connectivity-grid">
          {renderTestRow('文件预览', suite.filePreview)}
          {renderTestRow('文件上传', suite.fileUpload)}
          {renderTestRow('客户端', suite.clientApi)}
          {renderTestRow('医生端', suite.doctorApi)}
          {renderTestRow('微信', suite.wechat)}
        </div>
      )}
      {/* 重测按钮已放在标题右侧，仅在 allDone 时出现 */}
    </Section>
  );
}

// 单个测试结果行
function renderTestRow(label: string, r: { ms: number; ok: boolean; status?: number; message?: string }) {
  const badgeClass = r.ok ? 'ok' : r.status && r.status >= 400 ? 'error' : 'warn';
  const badgeText = r.ok ? '良好' : r.status ? `状态:${r.status}` : '异常';
  const tooltip = r.ok ? '' : r.message || '';
  return (
    <div className="row" title={tooltip} key={label}>
      <div className="label">{label}</div>
      <div className="value status">
        <span>{r.ms}ms</span>
        <span className={`badge ${badgeClass}`}>{badgeText}</span>
      </div>
    </div>
  );
}


