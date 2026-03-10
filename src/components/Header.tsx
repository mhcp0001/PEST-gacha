interface HeaderProps {}

export default function Header(_props: HeaderProps) {
  return (
    <header className="text-center pt-12 pb-6">
      <p className="uppercase tracking-[0.3em] text-sm text-text-muted mb-2">
        FUTURE SIGNALS
      </p>
      <h1 className="text-5xl font-light text-text-primary mb-3">
        Trend Gacha
      </h1>
      <p className="text-sm text-text-muted">
        未来の兆しをランダムに引く
      </p>
    </header>
  );
}
