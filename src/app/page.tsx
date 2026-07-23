import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="font-serif text-[27px] font-medium">Craft Your Money</h1>
      <Link
        href="/products"
        className="w-fit font-sans text-clay-deep underline underline-offset-2"
      >
        View products →
      </Link>
    </main>
  );
}
