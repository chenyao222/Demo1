import React from 'react';
import { Section, Item } from './Section';

export function UserInfo({ name, id }: { name?: string; id?: string }): JSX.Element {
  return (
    <Section title="用户信息">
      <div className="grid">
        <Item label="用户姓名" value={name || '未提供'} />
        <Item label="用户ID" value={id || '未提供'} />
      </div>
    </Section>
  );
}


