import React from 'react';

type SectionProps = {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
};

export function Section({ title, extra, children }: SectionProps): JSX.Element {
  return (
    <section className="card">
      <h3>
        {title} {extra}
      </h3>
      {children}
    </section>
  );
}

type ItemProps = { label: string; value: React.ReactNode };
export function Item({ label, value }: ItemProps): JSX.Element {
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}


