import { runInstitutionalSweep } from '@/lib/agent';

const formatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const scoreFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await runInstitutionalSweep();

  return (
    <main>
      <section>
        <div className="badge">Autonomous Sweep • NSE Institutional Radar</div>
        <h1>Stealth Accumulation Heatmap</h1>
        <p>
          Autonomous agent ingesting the last five NSE equity bhav copies to surface instruments where
          sustained, high conviction delivery buying hints at stealth accumulation by large books. Scores blend
          deliverable value, persistence, momentum and volume expansion to spotlight the most aggressive tape.
        </p>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Scan Timestamp</h3>
            <strong>{new Date(data.generatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong>
          </div>
          <div className="metric-card">
            <h3>Trading Sessions</h3>
            <strong>{data.sessions.length} days</strong>
          </div>
          <div className="metric-card">
            <h3>Universe Coverage</h3>
            <strong>
              {data.sessions
                .map((session) => session.instruments)
                .reduce((acc, cur) => Math.max(acc, cur), 0)
                .toLocaleString('en-IN')}{' '}
              symbols
            </strong>
          </div>
          <div className="metric-card">
            <h3>Daily Deliveries</h3>
            <strong>
              {formatter.format(
                data.sessions
                  .map((session) => session.totalDeliverableQty / 1_000_000)
                  .reduce((acc, cur) => acc + cur, 0)
              )}
              M shares (5d)
            </strong>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Top 10 Institutional Accumulation Targets</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Symbol</th>
                <th>Score</th>
                <th>Avg Deliverable %</th>
                <th>Deliverable Value (₹ Cr)</th>
                <th>Price Momentum %</th>
                <th>Volume Trend ×</th>
                <th>Avg Turnover (₹ Cr)</th>
              </tr>
            </thead>
            <tbody>
              {data.top.map((entry) => (
                <tr key={entry.symbol}>
                  <td>#{entry.rank}</td>
                  <td style={{ fontWeight: 600 }}>{entry.symbol}</td>
                  <td>{scoreFormatter.format(entry.score)}</td>
                  <td>{formatter.format(entry.avgDeliverablePercent)}%</td>
                  <td>{formatter.format(entry.totalDeliverableValueCrore)}</td>
                  <td style={{ color: entry.priceMomentumPercent >= 0 ? '#4ade80' : '#f87171' }}>
                    {formatter.format(entry.priceMomentumPercent)}%
                  </td>
                  <td>{formatter.format(entry.volumeTrendRatio)}×</td>
                  <td>{formatter.format(entry.averageTurnoverCrore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={{ marginTop: 0, marginBottom: '1.25rem' }}>Orderflow Timeline Intelligence</h2>
        <div style={{ display: 'grid', gap: '18px' }}>
          {data.top.map((entry) => (
            <details key={`${entry.symbol}-timeline`} style={{
              borderRadius: '18px',
              padding: '16px 18px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>
                {entry.symbol} • {entry.daysTracked} sessions tracked • Score {scoreFormatter.format(entry.score)}
              </summary>
              <div style={{ marginTop: '1rem', display: 'grid', gap: '12px' }}>
                {entry.timeline.map((point) => (
                  <div
                    key={`${entry.symbol}-${point.dateISO}`}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background: 'rgba(2, 6, 23, 0.55)',
                      border: '1px solid rgba(59, 130, 246, 0.18)',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{point.dateLabel}</div>
                    <div>Close: ₹{formatter.format(point.close)}</div>
                    <div>Deliverable: {formatter.format(point.deliverablePercent)}%</div>
                    <div>Delivery Qty: {(point.deliverableQty / 1_000_000).toFixed(2)}M</div>
                    <div>Turnover: ₹{formatter.format(point.turnoverCrore)} Cr</div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer>Data source: NSE India bhav copy archives • Autonomous signal generator • For research use only</footer>
    </main>
  );
}
