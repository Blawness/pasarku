export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-heading text-base font-semibold">Pasarku</span>
          <p className="text-sm text-muted-foreground max-w-md">
            Marketplace belanja kebutuhan dapur dan grocery segar di Indonesia.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            &copy; 2026 Pasarku. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
